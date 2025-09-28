import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const id = params.get('id');
    const cancel = params.get('cancel');
    const status = params.get('status');
    const orderCode = params.get('orderCode');

    setPaymentInfo({
      code,
      id,
      cancel: cancel === 'true',
      status,
      orderCode,
    });

    console.log('Payment return params:', {
      code,
      id,
      cancel,
      status,
      orderCode,
    });

    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [location.search, navigate]);

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
      return {
        icon: '✅',
        title: 'Thanh toán thành công!',
        message: 'Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và giao hàng trong thời gian sớm nhất.',
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
              <h3 className="font-semibold mb-3">Thông tin giao dịch:</h3>
              <div className="space-y-2 text-sm">
                {paymentInfo.orderCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">{paymentInfo.orderCode}</span>
                  </div>
                )}
                {paymentInfo.id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium">{paymentInfo.id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${statusDisplay.className}`}>
                    {paymentInfo.status || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
            >
              Về trang chủ
            </button>
            
            {paymentInfo?.cancel && (
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 font-medium"
              >
                Thử thanh toán lại
              </button>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Trang này sẽ tự động chuyển về trang chủ sau 10 giây
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold mb-4">Cần hỗ trợ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Hotline:</strong> 1900 xxxx
            </div>
            <div>
              <strong>Email:</strong> support@matnice.com
            </div>
            <div>
              <strong>Giờ hỗ trợ:</strong> 8:00 - 22:00 (T2-CN)
            </div>
            <div>
              <strong>Chat:</strong> Messenger Facebook
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
