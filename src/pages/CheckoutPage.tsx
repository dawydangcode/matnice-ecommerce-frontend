import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

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
  
  // Mock cart data - replace with actual cart store when available
  const [cartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Kính Râm Phân Cực Lily P22060',
      image: '/placeholder-image.jpg',
      color: 'Ghi',
      price: 350000,
      quantity: 1,
      totalPrice: 350000
    },
    {
      id: 2,
      name: 'Kính Nhựa Lily 0958',
      image: '/placeholder-image.jpg',
      color: 'Hồng trắng',
      price: 650000,
      quantity: 2,
      totalPrice: 1300000
    },
    {
      id: 3,
      name: 'Kính Nhựa Càng Titan LiLy 00352',
      image: '/placeholder-image.jpg',
      color: 'Hồng trắng',
      price: 690000,
      quantity: 1,
      totalPrice: 690000
    },
    {
      id: 4,
      name: 'Kính Acetate Lily JMM86RX',
      image: '/placeholder-image.jpg',
      color: 'Đen',
      price: 990000,
      quantity: 1,
      totalPrice: 990000
    }
  ]);
  
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

  const shippingCost = 30000; // 30k shipping cost
  
  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

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
      // Mock API call - replace with actual order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Create order with customer info and cart items
      // 2. Process payment
      // 3. Clear cart
      // 4. Redirect to success page
      
      toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
      navigate('/order-success');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
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
                {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
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
