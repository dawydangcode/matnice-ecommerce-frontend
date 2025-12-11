import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PayOSPayment from '../components/PayOSPayment';
import cartService, { CartSummary } from '../services/cart.service';
import orderService from '../services/order.service';
import stockService, { StockReservationItem } from '../services/stock.service';
import vietnamAddressService, { Province, District, Ward } from '../services/vietnam-address.service';
import userAddressService, { UserAddress } from '../services/user-address.service';
import { useAuthStore } from '../stores/auth.store';
import { CreditCard, HandCoins } from 'lucide-react';

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  notes: string;
}

enum PaymentMethod {
  CASH = 'cash',
  PAYOS = 'payos'
}

interface PromoCode {
  code: string;
  discount: number;
  isValid: boolean;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  
  // Load cart data from backend API using the same CartSummary as CartPage
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        // Use the same cart summary API as CartPage
        const summary = await cartService.getMyCartSummary();
        setCartSummary(summary);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        toast.error('Unable to load cart');
        setCartSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    notes: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [showPayOSPayment, setShowPayOSPayment] = useState(false);

  // Vietnam address data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);

  // User addresses
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provincesData = await vietnamAddressService.getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error loading provinces:', error);
        toast.error('Unable to load provinces data');
      }
    };
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvinceCode) {
        try {
          const districtsData = await vietnamAddressService.getDistrictsByProvinceCode(selectedProvinceCode);
          setDistricts(districtsData);
          setWards([]); // Clear wards when province changes
          setSelectedDistrictCode(null);
          setCustomerInfo(prev => ({ ...prev, district: '', ward: '' }));
        } catch (error) {
          console.error('Error loading districts:', error);
          toast.error('Unable to load districts data');
        }
      } else {
        setDistricts([]);
        setWards([]);
        setSelectedDistrictCode(null);
      }
    };
    loadDistricts();
  }, [selectedProvinceCode]);

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (selectedDistrictCode) {
        try {
          const wardsData = await vietnamAddressService.getWardsByDistrictCode(selectedDistrictCode);
          setWards(wardsData);
          setCustomerInfo(prev => ({ ...prev, ward: '' }));
        } catch (error) {
          console.error('Error loading wards:', error);
          toast.error('Unable to load wards data');
        }
      } else {
        setWards([]);
      }
    };
    loadWards();
  }, [selectedDistrictCode]);

  // Load user addresses if logged in
  useEffect(() => {
    const loadUserAddresses = async () => {
      if (isLoggedIn && user?.id) {
        try {
          const addresses = await userAddressService.getUserAddresses(user.id);
          setUserAddresses(addresses);
          
          // Find default address
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            // Pre-fill customer info with default address
            setCustomerInfo(prev => ({
              ...prev,
              province: defaultAddress.province,
              district: defaultAddress.district,
              ward: defaultAddress.ward,
              address: defaultAddress.addressDetail,
              notes: defaultAddress.notes || ''
            }));
          }
        } catch (error) {
          console.error('Error loading user addresses:', error);
        }
      }
    };
    loadUserAddresses();
  }, [isLoggedIn, user?.id]);

  // Calculate shipping cost based on whether there are lenses
  const hasLenses = cartSummary?.items?.some(item => item.lensDetail) || false;
  const shippingCost = hasLenses ? 0 : 30000; // Free shipping if has lenses, 30k if frame only
  
  // Calculate subtotal from cart summary
  const subtotal = Number(cartSummary?.grandTotal || 0);

  // Redirect if cart is empty (only after loading is complete)
  useEffect(() => {
    if (!loading && (!cartSummary || cartSummary.items.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cartSummary, navigate, loading]);

  // Auto switch to PayOS if COD is selected but cart has lenses
  useEffect(() => {
    if (hasLenses && selectedPaymentMethod === PaymentMethod.CASH) {
      setSelectedPaymentMethod(PaymentMethod.PAYOS);
    }
  }, [hasLenses, selectedPaymentMethod]);

  const calculateTotal = () => {
    const discount = appliedPromo?.discount || 0;
    return subtotal - discount + shippingCost;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())) {
      newErrors.email = 'Invalid email';
    }

    if (!customerInfo.province) {
      newErrors.province = 'Please select Province/City';
    }

    if (!customerInfo.district) {
      newErrors.district = 'Please select District';
    }

    if (!customerInfo.ward) {
      newErrors.ward = 'Please select Ward';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle address field changes
  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = parseInt(event.target.value);
    const selectedProvince = provinces.find(p => p.code === provinceCode);
    
    if (selectedProvince) {
      setSelectedProvinceCode(provinceCode);
      setCustomerInfo(prev => ({ 
        ...prev, 
        province: selectedProvince.name,
        district: '',
        ward: ''
      }));
      // Clear province error
      if (errors.province) {
        setErrors(prev => ({ ...prev, province: undefined }));
      }
    }
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = parseInt(event.target.value);
    const selectedDistrict = districts.find(d => d.code === districtCode);
    
    if (selectedDistrict) {
      setSelectedDistrictCode(districtCode);
      setCustomerInfo(prev => ({ 
        ...prev, 
        district: selectedDistrict.name,
        ward: ''
      }));
      // Clear district error
      if (errors.district) {
        setErrors(prev => ({ ...prev, district: undefined }));
      }
    }
  };

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = parseInt(event.target.value);
    const selectedWard = wards.find(w => w.code === wardCode);
    
    if (selectedWard) {
      setCustomerInfo(prev => ({ 
        ...prev, 
        ward: selectedWard.name
      }));
      // Clear ward error
      if (errors.ward) {
        setErrors(prev => ({ ...prev, ward: undefined }));
      }
    }
  };

  // Handle address selection
  const handleAddressSelection = (addressId: number) => {
    const selectedAddress = userAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setSelectedAddressId(addressId);
      setUseNewAddress(false);
      setCustomerInfo(prev => ({
        ...prev,
        province: selectedAddress.province,
        district: selectedAddress.district,
        ward: selectedAddress.ward,
        address: selectedAddress.addressDetail,
        notes: selectedAddress.notes || ''
      }));
      
      // Reset address form states
      setSelectedProvinceCode(null);
      setSelectedDistrictCode(null);
      setDistricts([]);
      setWards([]);
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId(null);
    setCustomerInfo(prev => ({
      ...prev,
      province: '',
      district: '',
      ward: '',
      address: '',
      notes: ''
    }));
  };

  const handleApplyPromo = () => {
    // Mock promo code validation
    const validPromoCodes: { [key: string]: number } = {
      'DISCOUNT10': 100000,
      'SAVE20': 200000,
      'WELCOME': 50000
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      const discount = validPromoCodes[promoCode.toUpperCase()];
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount,
        isValid: true
      });
      toast.success(`Promo code applied successfully! Save ${formatPrice(discount)}`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required information');
      return;
    }

    // If PayOS is selected, show PayOS payment interface
    if (selectedPaymentMethod === PaymentMethod.PAYOS) {
      // Save customer info for order creation after successful payment
      localStorage.setItem('checkoutCustomerInfo', JSON.stringify({
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        province: customerInfo.province,
        district: customerInfo.district,
        ward: customerInfo.ward,
        addressDetail: customerInfo.address,
        notes: customerInfo.notes,
      }));
      
      setShowPayOSPayment(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please log in to place an order');
        return;
      }

      // Validate stock availability before creating order
      console.log('Validating stock for cart items...');
      if (cartSummary && cartSummary.items.length > 0) {
        const stockItems: StockReservationItem[] = cartSummary.items.map(item => ({
          productColorId: item.selectedColor?.id || 0,
          quantity: item.quantity
        }));

        try {
          const stockValidation = await stockService.validateStockForCart(stockItems);
          if (!stockValidation.isValid) {
            const errorMessages = stockValidation.errors.map(error => error.message).join('\n');
            toast.error(`Insufficient stock:\n${errorMessages}`);
            setIsSubmitting(false);
            return;
          }
          console.log('Stock validation passed');
        } catch (stockError) {
          console.warn('Stock validation failed, proceeding with order creation:', stockError);
          // Don't block order creation if stock validation fails
          // Backend will handle final stock check
        }
      }

      // Prepare order data according to backend DTO (userId will be extracted from token)
      const orderData = {
        subtotal,
        shippingCost,
        totalPrice: calculateTotal(),
        paymentMethod: selectedPaymentMethod,
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        province: customerInfo.province,
        district: customerInfo.district,
        ward: customerInfo.ward,
        addressDetail: customerInfo.address,
        notes: customerInfo.notes || undefined,
      };

      console.log('Creating order with data:', orderData);

      // Call actual backend API
      const createdOrder = await orderService.createOrder(orderData);
      
      console.log('Order created successfully:', createdOrder);
      
      // Clear cart from both localStorage and database after successful order
      try {
        // Get current cart ID before clearing
        const cartData = await cartService.getOrCreateCart();
        await cartService.clearCart(cartData.cartId);
        console.log('Cart cleared from database successfully');
      } catch (cartError) {
        console.error('Error clearing cart from database:', cartError);
        // Don't block the flow if cart clearing fails
      }
      
      // Clear cart from localStorage
      localStorage.removeItem('cart');
      
      toast.success('Order placed successfully! Your order will be delivered in 3-5 business days.');
      
      navigate(`/order-success?payment=${selectedPaymentMethod}&order=${createdOrder.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayOSSuccess = async (orderCode: number) => {
    // Handle successful PayOS payment
    try {
      // Clear cart from database
      const cartData = await cartService.getOrCreateCart();
      await cartService.clearCart(cartData.cartId);
      console.log('Cart cleared from database after PayOS payment');
    } catch (cartError) {
      console.error('Error clearing cart from database after PayOS payment:', cartError);
      // Don't block the flow if cart clearing fails
    }
    
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    toast.success('Payment successful! Your order will be processed soon.');
    navigate(`/order-success?payment=payos&order=${orderCode}`);
  };

  const handlePayOSCancel = () => {
    // Handle PayOS payment cancellation
    setShowPayOSPayment(false);
    toast('Payment cancelled');
  };

  // Memoize customer info to prevent unnecessary re-renders
  const memoizedCustomerInfo = useMemo(() => ({
    fullName: customerInfo.fullName,
    phone: customerInfo.phone,
    email: customerInfo.email,
    address: `${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`,
  }), [customerInfo.fullName, customerInfo.phone, customerInfo.email, customerInfo.address, customerInfo.ward, customerInfo.district, customerInfo.province]);

  if (!cartSummary || cartSummary.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  // Show loading indicator while fetching cart data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cart information...</p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Please fill in the information to complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="space-y-8">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
              
              {/* Address Selection for Logged in Users */}
              {isLoggedIn && userAddresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Select saved address</h3>
                  <div className="space-y-3">
                    {userAddresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3">
                        <input
                          id={`address-${address.id}`}
                          name="selected-address"
                          type="radio"
                          checked={selectedAddressId === address.id}
                          onChange={() => handleAddressSelection(address.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                        />
                        <label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {userAddressService.formatFullAddress(address)}
                              {address.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Default
                                </span>
                              )}
                            </div>
                            {address.notes && (
                              <div className="text-gray-500 mt-1">Note: {address.notes}</div>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                    
                    {/* Option to use new address */}
                    <div className="flex items-start space-x-3">
                      <input
                        id="new-address"
                        name="selected-address"
                        type="radio"
                        checked={useNewAddress}
                        onChange={handleUseNewAddress}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                      />
                      <label htmlFor="new-address" className="flex-1 cursor-pointer">
                        <div className="text-sm font-medium text-gray-900">
                          Use new address
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <hr className="my-6" />
                </div>
              )}
              
              {/* Only show address form if user is not logged in OR is using new address */}
              {(!isLoggedIn || useNewAddress || userAddresses.length === 0) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province / City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedProvinceCode || ''}
                      onChange={handleProvinceChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.province ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select province/city...</option>
                      {provinces.map(province => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDistrictCode || ''}
                      onChange={handleDistrictChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={!selectedProvinceCode}
                    >
                      <option value="">Select district...</option>
                      {districts.map(district => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ward <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={wards.find(w => w.name === customerInfo.ward)?.code || ''}
                      onChange={handleWardChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ward ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={!selectedDistrictCode}
                    >
                      <option value="">Select ward...</option>
                      {wards.map(ward => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    {errors.ward && (
                      <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter street address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes (optional)"
                  />
                </div>
              </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="cash"
                    name="payment-method"
                    type="radio"
                    value={PaymentMethod.CASH}
                    checked={selectedPaymentMethod === PaymentMethod.CASH}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                    disabled={hasLenses}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${hasLenses ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <label htmlFor="cash" className={`ml-3 block text-sm font-medium ${hasLenses ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}>
                    <div className="flex items-center">
                      <span className="mr-3"><HandCoins /></span>
                      <div>
                        <div className="font-semibold">Cash on Delivery (COD)</div>
                        <div className="text-gray-500 text-sm">Pay with cash upon delivery</div>
                        {hasLenses && (
                          <div className="text-red-500 text-xs mt-1">
                            Not available for orders with lenses
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="payos"
                    name="payment-method"
                    type="radio"
                    value={PaymentMethod.PAYOS}
                    checked={selectedPaymentMethod === PaymentMethod.PAYOS}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="payos" className="ml-3 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <span className="mr-3"><CreditCard /></span>
                      <div>
                        <div className="font-semibold">Online Payment (PayOS)</div>
                        <div className="text-gray-500 text-sm">Pay via ATM card, Internet Banking, QR Code</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Notice for lens orders */}
              {hasLenses && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-blue-500 text-lg">💎</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-900">
                        Special Notice
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        For orders with lenses, please pay in advance to ensure the quality and accuracy of the product.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-6">
                {cartSummary?.items?.map((item) => (
                  <div key={item.cartFrameId} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex gap-6">
                      <img
                        src={item.productImage || '/api/placeholder/120/120'}
                        alt={item.productName || 'Product'}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {item.productName}
                        </h3>
                        
                        {/* Basic product info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Color:</span>
                              {item.selectedColor && (
                                <>
                                  <span className="text-gray-900">{item.selectedColor.colorName}</span>
                                </>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Quantity:</span>
                              <span className="ml-2 text-gray-900">{item.quantity}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Frame Price:</span>
                              <span className="ml-2 text-gray-900">{formatPrice(Number(item.framePrice))}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {item.lensDetail && (
                              <>
                                <div>
                                  <span className="font-medium text-gray-700">Lens Price:</span>
                                  <span className="ml-2 text-gray-900">{formatPrice(Number(item.lensDetail.lensPrice))}</span>
                                </div>
                                {item.lensDetail.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                  <div>
                                    {item.lensDetail.selectedCoatings.map((coating, index) => (
                                      <div key={index}>
                                        <span className="font-medium text-gray-700">Coating ({coating.name}):</span>
                                        <span className="ml-2 text-gray-900">+{formatPrice(coating.price)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {item.lensDetail.selectedTintColor && (
                                  <div>
                                    <span className="font-medium text-gray-700">Tint ({item.lensDetail.selectedTintColor.name}):</span>
                                    <span className="ml-2 text-gray-900">+{formatPrice(item.lensDetail.selectedTintColor.price || 0)}</span>
                                  </div>
                                )}
                              </>
                            )}
                            <div className="border-t pt-2 mt-2">
                              <span className="text-lg font-bold text-black">
                                Total: {formatPrice(Number(item.totalPrice))}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Lens Information */}
                        {item.lensDetail && (
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Lens Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium text-gray-700">Type:</span>
                                  <span className="ml-2 text-gray-900">{item.lensDetail.lensType}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Price:</span>
                                  <span className="ml-2 text-gray-900">{formatPrice(Number(item.lensDetail.lensPrice))}</span>
                                </div>
                              </div>
                              
                              {/* Coating details */}
                              {item.lensDetail.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-700 mb-2">Coating</h5>
                                  {item.lensDetail.selectedCoatings.map((coating, index) => (
                                    <div key={index} className="bg-gray-50 p-2 rounded mb-2">
                                      <div className="font-medium text-blue-900">{coating.name}</div>
                                      {coating.description && (
                                        <div className="text-sm text-blue-700">{coating.description}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Prescription Information */}
                        {item.lensDetail?.prescription && (
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Prescription Information</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse border border-gray-300">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-3 py-2 text-left">Eye</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">SPH</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">CYL</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">AXIS</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">ADD</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">PD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="border border-gray-300 px-3 py-2 font-medium">Right</td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.rightEye.sphere || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.rightEye.cylinder || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.rightEye.axis || 0}°
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.addRight || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.pdRight || 0}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border border-gray-300 px-3 py-2 font-medium">Left</td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.leftEye.sphere || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.leftEye.cylinder || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.leftEye.axis || 0}°
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.addLeft || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.lensDetail.prescription.pdLeft || 0}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Promo Code</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter promo code"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-2 text-sm text-green-600">
                  Code "{appliedPromo.code}" applied
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-600">-{formatPrice(appliedPromo.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping
                    {hasLenses && (
                      <span className="text-green-600 text-xs ml-1">(Free)</span>
                    )}
                    {!hasLenses && (
                      <span className="text-orange-600 text-xs ml-1">(Frame only)</span>
                    )}
                  </span>
                  <span className={hasLenses ? "text-green-600" : ""}>
                    {hasLenses ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-blue-600">
                    {selectedPaymentMethod === PaymentMethod.CASH ? 'Cash on Delivery' : 'PayOS'}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-black">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full mt-6 bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 
                 selectedPaymentMethod === PaymentMethod.CASH ? 'Place Order (COD)' : 'Pay Online'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PayOS Payment Modal */}
      {showPayOSPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Online Payment</h2>
                <button
                  onClick={() => setShowPayOSPayment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <PayOSPayment
                isVisible={showPayOSPayment}
                onSuccess={handlePayOSSuccess}
                onCancel={handlePayOSCancel}
                customerInfo={memoizedCustomerInfo}
              />
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
