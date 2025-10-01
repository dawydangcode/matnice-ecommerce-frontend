import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

const OrderSuccessPage: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();
  
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  // Get order info from URL params
  const [paymentMethod, setPaymentMethod] = React.useState<string>('cod');
  const [orderNumber, setOrderNumber] = React.useState<string>('');
  
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const method = urlParams.get('payment') || 'cod';
    const order = urlParams.get('order') || 'ORD' + Date.now().toString().slice(-6);
    setPaymentMethod(method);
    setOrderNumber(order);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được tiếp nhận và đang xử lý.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-blue-600">#{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Đang xử lý
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Thanh toán:</span>
                  <span className="text-blue-600">
                    {paymentMethod === 'bank_transfer' ? '🏦 Chuyển khoản' : '💵 COD'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dự kiến giao hàng</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{estimatedDelivery.toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Giao hàng tiêu chuẩn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Các bước tiếp theo</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Xác nhận đơn hàng</p>
                <p className="text-sm text-gray-600">Chúng tôi sẽ gửi email xác nhận đơn hàng trong vòng 30 phút.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Chuẩn bị hàng</p>
                <p className="text-sm text-gray-600">Đơn hàng sẽ được đóng gói và chuẩn bị giao trong 1-2 ngày làm việc.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Giao hàng</p>
                <p className="text-sm text-gray-600">Hàng sẽ được giao đến địa chỉ của bạn trong 5-7 ngày làm việc.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info for Bank Transfer */}
        {paymentMethod === 'bank_transfer' && (
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1">🏦</div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Thông tin chuyển khoản</h3>
                <p className="text-orange-800 text-sm mb-3">
                  Vui lòng chuyển khoản theo thông tin dưới đây trong vòng 24h:
                </p>
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">Ngân hàng:</span>
                      <span>Vietcombank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Số tài khoản:</span>
                      <span className="font-mono">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Chủ tài khoản:</span>
                      <span>CÔNG TY MATNICE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Nội dung:</span>
                      <span className="font-mono text-blue-600">#{orderNumber}</span>
                    </div>
                  </div>
                </div>
                <p className="text-orange-700 text-xs mt-2">
                  * Đơn hàng sẽ được xử lý sau khi chúng tôi nhận được thanh toán
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Cần hỗ trợ?</h3>
              <p className="text-blue-800 text-sm mb-3">
                Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi:
              </p>
              <div className="space-y-1 text-sm text-blue-800">
                <p>📞 Hotline: 1900 1234</p>
                <p>✉️ Email: support@matnice.com</p>
                <p>💬 Chat: Góc phải dưới màn hình</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            to="/glasses"
            className="inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
