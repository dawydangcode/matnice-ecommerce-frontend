import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import payosService from '../services/payos.service';
import cartService from '../services/cart.service';
import toast from 'react-hot-toast';

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderCreating, setOrderCreating] = useState(false);
  const [orderCreationAttempted, setOrderCreationAttempted] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const createOrderFromPayment = useCallback(async (orderCode: string) => {
    if (orderCreationAttempted) {
      console.log('Order creation already attempted, skipping...');
      return;
    }

    try {
      setOrderCreating(true);
      setOrderCreationAttempted(true);

      // Get customer info from localStorage (saved from checkout page)
      const customerInfoStr = localStorage.getItem('checkoutCustomerInfo');
      if (!customerInfoStr) {
        console.error('No customer info found in localStorage');
        toast.error('Thông tin khách hàng không được tìm thấy');
        return;
      }

      const customerInfo = JSON.parse(customerInfoStr);

      const orderResponse = await payosService.createOrderFromPayment(orderCode, customerInfo);
      
      console.log('📦 Order response structure:', JSON.stringify(orderResponse, null, 2));
      
      // Save the real order ID from database
      // Response might be nested in data object
      const orderId = orderResponse?.data?.orderId || orderResponse?.orderId;
      
      if (orderId) {
        setCreatedOrderId(orderId);
        console.log('✅ Order created with ID:', orderId);
      } else {
        console.warn('⚠️ No orderId found in response:', orderResponse);
      }
      
      setOrderCreated(true);
      toast.success('Đơn hàng đã được tạo thành công!');

      // Clear cart from database after successful order creation
      try {
        const cartData = await cartService.getOrCreateCart();
        await cartService.clearCart(cartData.cartId);
        console.log('Cart cleared from database after PayOS order creation');
        
        // After clearing cart from database, update all UI components
        // 1. Clear localStorage
        localStorage.removeItem('checkoutCustomerInfo');
        localStorage.removeItem('cart');
        localStorage.setItem('matnice_cart_count', '0');
        
        // 2. Dispatch cartUpdated event with count = 0
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { count: 0 } 
        }));
        
        // 3. Dispatch storage event for cross-tab sync
        const storageEvent = new StorageEvent('storage', {
          key: 'matnice_cart_count',
          newValue: '0',
          oldValue: null,
          storageArea: localStorage,
          url: window.location.href
        });
        window.dispatchEvent(storageEvent);
        
        // 4. Dispatch custom event to reload cart in CartDropdown
        window.dispatchEvent(new CustomEvent('cartCleared'));
        
        console.log('✅ All cart update events dispatched');
      } catch (cartError) {
        console.error('Error clearing cart from database after PayOS order:', cartError);
        // Don't block the flow if cart clearing fails
      }
    } catch (error) {
      console.error('Error creating order from payment:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng liên hệ hỗ trợ.');
      setOrderCreationAttempted(false); // Allow retry on error
    } finally {
      setOrderCreating(false);
    }
  }, [orderCreationAttempted]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const id = params.get('id');
    const cancel = params.get('cancel');
    const status = params.get('status');
    const orderCode = params.get('orderCode');

    const paymentData = {
      code,
      id,
      cancel: cancel === 'true',
      status,
      orderCode,
    };

    setPaymentInfo(paymentData);

    console.log('=== PayOS Return URL Info ===');
    console.log('Full URL:', window.location.href);
    console.log('Search params:', location.search);
    console.log('Parsed payment data:', paymentData);
    console.log('============================');

    // Removed auto redirect - user will use button instead
  }, [location.search, navigate]);

  // Separate useEffect for creating order to avoid infinite loop
  useEffect(() => {
    if (
      paymentInfo?.code === '00' && 
      paymentInfo?.status === 'PAID' && 
      paymentInfo?.orderCode && 
      !orderCreated && 
      !orderCreating &&
      !orderCreationAttempted
    ) {
      createOrderFromPayment(paymentInfo.orderCode);
    }
  }, [paymentInfo, orderCreated, orderCreating, orderCreationAttempted, createOrderFromPayment]);

  const getStatusDisplay = () => {
    if (!paymentInfo) {
      return {
        icon: '⏳',
        title: 'Đang xử lý...',
        message: 'Đang kiểm tra trạng thái thanh toán',
        className: 'text-blue-600',
      };
    }

    if (paymentInfo.cancel) {
      return {
        icon: '❌',
        title: 'Thanh toán đã bị hủy',
        message: 'Bạn đã hủy giao dịch thanh toán. Bạn có thể thử lại bất cứ lúc nào.',
        className: 'text-red-600',
      };
    }

    if (paymentInfo.code === '00' && paymentInfo.status === 'PAID') {
      if (orderCreating) {
        return {
          icon: '⏳',
          title: 'Đang tạo đơn hàng...',
          message: 'Thanh toán thành công! Hệ thống đang tạo đơn hàng cho bạn.',
          className: 'text-blue-600',
        };
      }

      if (orderCreated) {
        return {
          title: 'Payment and Order Successful!',
          message: 'Thank you for your order. We will process and deliver your order as soon as possible.',
          className: 'text-green-600',
        };
      }

      return {
        title: 'Thanh toán thành công!',
        message: 'Thanh toán đã được xử lý thành công. Đang tiến hành tạo đơn hàng...',
        className: 'text-green-600',
      };
    }

    if (paymentInfo.status === 'PENDING') {
      return {
        icon: '⏳',
        title: 'Đang chờ thanh toán',
        message: 'Giao dịch đang được xử lý. Vui lòng chờ trong giây lát.',
        className: 'text-yellow-600',
      };
    }

    return {
      icon: '⚠️',
      title: 'Thanh toán không thành công',
      message: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
      className: 'text-red-600',
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-6xl mb-4">{statusDisplay.icon}</div>
          
          <h1 className={`text-2xl font-bold mb-4 ${statusDisplay.className}`}>
            {statusDisplay.title}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {statusDisplay.message}
          </p>

          {paymentInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-3">Transaction Information:</h3>
              <div className="space-y-2 text-sm">
                {/* Show real order ID from database if available */}
                {createdOrderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium text-green-600">#{createdOrderId}</span>
                  </div>
                )}
                {/* Show PayOS orderCode (not the transaction hash) */}
                {paymentInfo.orderCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">PayOS Payment Code:</span>
                    <span className="font-medium">{paymentInfo.orderCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${statusDisplay.className}`}>
                    {paymentInfo.status || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">       
            {paymentInfo?.cancel && (
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 font-medium"
              >
                Thử thanh toán lại
              </button>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-700 font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold mb-4">Need Support?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Hotline:</strong> 1900 xxxx
            </div>
            <div>
              <strong>Email:</strong> support@matnice.com
            </div>
            <div>
              <strong>Support Hours:</strong> 8:00 - 22:00 (Mon-Sun)
            </div>
            <div>
              <strong>Chat:</strong> Facebook Messenger
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
