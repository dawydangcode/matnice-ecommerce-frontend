import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PayOSPayment from '../components/PayOSPayment';
import cartService, { CartSummary } from '../services/cart.service';
import orderService from '../services/order.service';
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
        toast.error('Không thể tải giỏ hàng');
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

  // Calculate shipping cost based on whether there are lenses
  const hasLenses = cartSummary?.items?.some(item => item.lensDetail) || false;
  const shippingCost = hasLenses ? 0 : 30000; // Free shipping if has lenses, 30k if frame only
  
  // Calculate subtotal from cart summary
  const subtotal = Number(cartSummary?.grandTotal || 0);

  // Redirect if cart is empty (only after loading is complete)
  useEffect(() => {
    if (!loading && (!cartSummary || cartSummary.items.length === 0)) {
      toast.error('Giỏ hàng của bạn đang trống');
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
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!customerInfo.province) {
      newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
    }

    if (!customerInfo.district) {
      newErrors.district = 'Vui lòng chọn Quận/Huyện';
    }

    if (!customerInfo.ward) {
      newErrors.ward = 'Vui lòng chọn Phường/Xã';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
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
      toast.success(`Áp dụng mã khuyến mãi thành công! Giảm ${formatPrice(discount)}`);
    } else {
      toast.error('Mã khuyến mãi không hợp lệ');
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
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
        toast.error('Vui lòng đăng nhập để đặt hàng');
        return;
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
      
      toast.success('Đặt hàng thành công! Đơn hàng sẽ được giao trong 3-5 ngày làm việc.');
      
      navigate(`/order-success?payment=${selectedPaymentMethod}&order=${createdOrder.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
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
    toast.success('Thanh toán thành công! Đơn hàng sẽ được xử lý sớm nhất.');
    navigate(`/order-success?payment=payos&order=${orderCode}`);
  };

  const handlePayOSCancel = () => {
    // Handle PayOS payment cancellation
    setShowPayOSPayment(false);
    toast('Thanh toán đã bị hủy');
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
              <p className="mt-4 text-gray-600">Đang tải thông tin giỏ hàng...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">Vui lòng điền thông tin để hoàn tất đơn hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="space-y-8">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin khách hàng</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số điện thoại"
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
                    placeholder="Nhập email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Địa chỉ giao hàng</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh / Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={customerInfo.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.province ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select...</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/ Huyện <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={customerInfo.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={!customerInfo.province}
                    >
                      <option value="">Select...</option>
                      {customerInfo.province === 'TP. Hồ Chí Minh' && (
                        <>
                          <option value="Quận 1">Quận 1</option>
                          <option value="Quận 3">Quận 3</option>
                          <option value="Quận 5">Quận 5</option>
                          <option value="Quận 7">Quận 7</option>
                          <option value="Quận 10">Quận 10</option>
                        </>
                      )}
                    </select>
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/ Xã <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={customerInfo.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ward ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={!customerInfo.district}
                    >
                      <option value="">Select...</option>
                      {customerInfo.district === 'Quận 1' && (
                        <>
                          <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                          <option value="Phường Bến Thành">Phường Bến Thành</option>
                          <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                        </>
                      )}
                    </select>
                    {errors.ward && (
                      <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập địa chỉ cụ thể"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú thêm (không bắt buộc)"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Hình thức thanh toán</h2>
              
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
                        <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-gray-500 text-sm">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        {hasLenses && (
                          <div className="text-red-500 text-xs mt-1">
                            Không khả dụng cho đơn hàng có tròng kính
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
                        <div className="font-semibold">Thanh toán trực tuyến (PayOS)</div>
                        <div className="text-gray-500 text-sm">Thanh toán qua thẻ ATM, Internet Banking, QR Code</div>
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
                        Thông báo đặc biệt
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Với đơn hàng có tròng kính đi kèm vui lòng thanh toán trước để đảm bảo chất lượng và độ chính xác của sản phẩm.
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Đơn hàng</h2>
              
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
                              <span className="font-medium text-gray-700">Màu:</span>
                              {item.selectedColor && (
                                <>
                                  <span className="text-gray-900">{item.selectedColor.colorName}</span>
                                </>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Số lượng:</span>
                              <span className="ml-2 text-gray-900">{item.quantity}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Giá gọng:</span>
                              <span className="ml-2 text-gray-900">{formatPrice(Number(item.framePrice))}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {item.lensDetail && (
                              <>
                                <div>
                                  <span className="font-medium text-gray-700">Giá tròng:</span>
                                  <span className="ml-2 text-gray-900">{formatPrice(Number(item.lensDetail.lensPrice))}</span>
                                </div>
                                {item.lensDetail.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                  <div>
                                    {item.lensDetail.selectedCoatings.map((coating, index) => (
                                      <div key={index}>
                                        <span className="font-medium text-gray-700">Lớp phủ ({coating.name}):</span>
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
                                Tổng tiền: {formatPrice(Number(item.totalPrice))}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Lens Information */}
                        {item.lensDetail && (
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin tròng kính</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium text-gray-700">Loại:</span>
                                  <span className="ml-2 text-gray-900">{item.lensDetail.lensType}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Giá:</span>
                                  <span className="ml-2 text-gray-900">{formatPrice(Number(item.lensDetail.lensPrice))}</span>
                                </div>
                              </div>
                              
                              {/* Coating details */}
                              {item.lensDetail.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-700 mb-2">Lớp phủ</h5>
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
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin đơn thuốc</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse border border-gray-300">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-3 py-2 text-left">Mắt</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">SPH</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">CYL</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">AXIS</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">ADD</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">PD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="border border-gray-300 px-3 py-2 font-medium">Phải</td>
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
                                    <td className="border border-gray-300 px-3 py-2 font-medium">Trái</td>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhập mã khuyến mãi</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mã khuyến mãi"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Sử dụng
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-2 text-sm text-green-600">
                  Mã "{appliedPromo.code}" đã được áp dụng
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng đơn hàng</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đơn hàng</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Khuyến mãi</span>
                    <span className="text-red-600">-{formatPrice(appliedPromo.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Ship
                    {hasLenses && (
                      <span className="text-green-600 text-xs ml-1">(Miễn phí)</span>
                    )}
                    {!hasLenses && (
                      <span className="text-orange-600 text-xs ml-1">(Chỉ có gọng)</span>
                    )}
                  </span>
                  <span className={hasLenses ? "text-green-600" : ""}>
                    {hasLenses ? "Miễn phí" : formatPrice(shippingCost)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hình thức thanh toán</span>
                  <span className="text-blue-600">
                    {selectedPaymentMethod === PaymentMethod.CASH ? 'Thanh toán khi nhận hàng' : '💳 PayOS'}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng đơn</span>
                  <span className="text-black">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full mt-6 bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang xử lý...' : 
                 selectedPaymentMethod === PaymentMethod.CASH ? 'Đặt hàng (COD)' : 'Thanh toán trực tuyến'}
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
                <h2 className="text-xl font-semibold">Thanh toán trực tuyến</h2>
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
