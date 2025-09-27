import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { apiService } from '../services/api.service';

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
  COD = 'cod',
  BANK_TRANSFER = 'bank_transfer'
}

interface PromoCode {
  code: string;
  discount: number;
  isValid: boolean;
}

interface CartItem {
  id: number;
  name: string;
  image: string;
  color: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Load cart data from backend API
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        // Fetch cart data from backend API using apiService
        const cartData = await apiService.get<any[]>('/api/v1/cart/1/items-with-details');
        
        // Convert backend cart data to our CartItem format
        const formattedItems: CartItem[] = cartData.map((item: any) => ({
          id: item.frame.id,
          name: item.frame.productName || 'Sản phẩm không xác định',
          image: item.frame.productImage || '/placeholder-image.jpg',
          color: 'Đen', // Default color - you can get this from product details later
          price: item.frame.framePrice + (item.lensDetail?.lensPrice || 0),
          quantity: item.frame.quantity,
          totalPrice: item.frame.totalPrice + (item.lensDetail?.lensPrice || 0)
        }));
        
        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        
        // Try to load cart from localStorage as fallback
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const formattedItems: CartItem[] = parsedCart.map((item: any) => ({
              id: item.id || Math.random(),
              name: item.productName || item.name || 'Sản phẩm không xác định',
              image: item.productImage || item.image || '/placeholder-image.jpg',
              color: item.selectedColor?.name || item.color || 'Không xác định',
              price: item.price || 0,
              quantity: item.quantity || 1,
              totalPrice: item.totalPrice || (item.price * item.quantity) || 0
            }));
            setCartItems(formattedItems);
          } catch (parseError) {
            console.error('Error parsing cart from localStorage:', parseError);
            // Show empty cart
            setCartItems([]);
          }
        } else {
          // No cart data available
          setCartItems([]);
        }
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);

  const shippingCost = 30000; // 30k shipping cost
  
  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Redirect if cart is empty (only after loading is complete)
  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống');
      navigate('/cart');
    }
  }, [cartItems, navigate, loading]);

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

    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        customerInfo,
        cartItems,
        paymentMethod: selectedPaymentMethod,
        subtotal,
        discount: appliedPromo?.discount || 0,
        shippingCost,
        totalAmount: calculateTotal(),
        promoCode: appliedPromo?.code
      };

      console.log('Order data:', orderData);

      // Mock API call - replace with actual order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Send orderData to backend API
      // 2. Process payment (if bank transfer, show instructions)
      // 3. Clear cart from localStorage
      // 4. Redirect to success page
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      
      // Generate order number
      const orderNumber = 'ORD' + Date.now().toString().slice(-6);
      
      if (selectedPaymentMethod === PaymentMethod.BANK_TRANSFER) {
        toast.success('Đặt hàng thành công! Vui lòng chuyển khoản theo thông tin đã cung cấp.');
      } else {
        toast.success('Đặt hàng thành công! Đơn hàng sẽ được giao trong 3-5 ngày làm việc.');
      }
      
      navigate(`/order-success?payment=${selectedPaymentMethod}&order=${orderNumber}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
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

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Hình thức thanh toán</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="cod"
                    name="payment-method"
                    type="radio"
                    value={PaymentMethod.COD}
                    checked={selectedPaymentMethod === PaymentMethod.COD}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <span className="mr-3">💵</span>
                      <div>
                        <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-gray-500 text-sm">Thanh toán bằng tiền mặt khi nhận hàng</div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="bank-transfer"
                    name="payment-method"
                    type="radio"
                    value={PaymentMethod.BANK_TRANSFER}
                    checked={selectedPaymentMethod === PaymentMethod.BANK_TRANSFER}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <span className="mr-3">🏦</span>
                      <div>
                        <div className="font-semibold">Chuyển khoản ngân hàng</div>
                        <div className="text-gray-500 text-sm">Chuyển khoản trước khi nhận hàng</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {selectedPaymentMethod === PaymentMethod.BANK_TRANSFER && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Thông tin chuyển khoản:</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Ngân hàng:</strong> Vietcombank</p>
                    <p><strong>Số tài khoản:</strong> 1234567890</p>
                    <p><strong>Chủ tài khoản:</strong> CÔNG TY MATNICE</p>
                    <p><strong>Nội dung:</strong> [Họ tên] - [Số điện thoại] - Thanh toán đơn hàng</p>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    * Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng
                  </div>
                </div>
              )}
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
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Đơn hàng</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Màu: {item.color}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  <span className="text-gray-600">Ship</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hình thức thanh toán</span>
                  <span className="text-blue-600">
                    {selectedPaymentMethod === PaymentMethod.COD ? '💵 COD' : '🏦 Chuyển khoản'}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng đơn</span>
                  <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang xử lý...' : 
                 selectedPaymentMethod === PaymentMethod.COD ? 'Đặt hàng (COD)' : 'Đặt hàng & Chuyển khoản'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
