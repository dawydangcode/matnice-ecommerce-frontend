import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const OrderSuccessPage: React.FC = () => {
  // Mock order data - in real app, this would come from props or state
  const orderNumber = 'ORD' + Date.now().toString().slice(-6);
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

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
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
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
