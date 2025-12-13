import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Printer,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Package,
  CreditCard,
  Truck,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import orderService, { OrderResponse } from '../services/order.service';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) {
        toast.error('Invalid order ID');
        navigate('/account');
        return;
      }

      try {
        setLoading(true);
        const orderData = await orderService.getOrderDetails(parseInt(orderId));
        setOrder(orderData);
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        if (error.response?.status === 404) {
          toast.error('Order not found');
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to view this order');
        } else {
          toast.error('Failed to load order details');
        }
        navigate('/account');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    toast('Tính năng tải PDF đang được phát triển', { icon: 'ℹ️' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="relative z-50">
          <Header />
          <Navigation />
        </header>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <header className="relative z-50">
          <Header />
          <Navigation />
        </header>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
            <button
              onClick={() => navigate('/account')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to My Account
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hide when printing */}
      <header className="relative z-50 print:hidden">
        <Header />
        <Navigation />
      </header>

      {/* Page Header with Back Button */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/account?tab=orders')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Orders</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Order #{order.id}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0 print:px-0">
        <div className="bg-white rounded-lg shadow-lg print:shadow-none print:rounded-none">
          {/* Invoice Header */}
          <div className="border-b border-gray-200 p-8 print:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">SALES INVOICE</h1>
                <p className="text-gray-600">Mat Nice Eyewear Store</p>
                <p className="text-sm text-gray-500 mt-1">
                  Address: 123 ABC Street, District 1, Ho Chi Minh City
                </p>
                <p className="text-sm text-gray-500">
                  Phone: 0123-456-789 | Email: info@matnice.com
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  Order ID: #{order.id}
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Order Date: {formatDate(order.orderDate)}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {orderService.getStatusDisplayName(order.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-b border-gray-200 p-8 print:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{order.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-700">{order.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-700">{order.email}</p>
                </div>
              </div>
              <div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Delivery Address:</p>
                    <p className="text-gray-700 mt-1">{order.addressDetail}</p>
                    <p className="text-gray-600 text-sm">
                      {order.ward}, {order.district}, {order.province}
                    </p>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-b border-gray-200 p-8 print:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-center py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.orderItems?.map((item) => (
                    <React.Fragment key={item.id}>
                      {/* Frame Row */}
                      <tr>
                        <td className="py-4">
                          <div className="flex items-start space-x-3">
                            <Package className="w-5 h-5 text-blue-500 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.productInfo?.productName || 'Product'}
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1 mt-1">
                                <p>Brand: <span className="font-medium">{item.productInfo?.brandName || 'N/A'}</span></p>
                                {item.productInfo?.colorInfo && (
                                  <p>
                                    Color: <span className="font-medium">{item.productInfo.colorInfo.colorName}</span>
                                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                                      #{item.productInfo.colorInfo.productNumber}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="font-medium">{item.quantity}</span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium">{formatCurrency(item.framePrice)}</span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium">{formatCurrency(item.framePrice * item.quantity)}</span>
                        </td>
                      </tr>

                      {/* Lens Details */}
                      {item.lensDetails?.map((lensDetail, lensIndex) => (
                        <tr key={`lens-${lensDetail.id || lensIndex}`} className="bg-blue-50">
                          <td className="py-4 pl-8">
                            <div className="space-y-2">
                              <div className="font-medium text-blue-900">
                                + Lens: {lensDetail.lensInfo?.lensName || 'Lens'}
                              </div>
                              
                              {/* Lens Specifications */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-800">
                                {/* Lens Info */}
                                {lensDetail.lensInfo && (
                                  <div className="space-y-1">
                                    <p><strong>Type:</strong> {lensDetail.lensInfo.lensType}</p>
                                    <p><strong>Brand:</strong> {lensDetail.lensInfo.brandLens}</p>
                                    {lensDetail.lensInfo.lensVariant && (
                                      <p><strong>Material:</strong> {lensDetail.lensInfo.lensVariant.material}</p>
                                    )}
                                    {lensDetail.lensInfo.lensThickness && (
                                      <p>
                                        <strong>Thickness:</strong> {lensDetail.lensInfo.lensThickness.name} 
                                        (Index: {lensDetail.lensInfo.lensThickness.indexValue})
                                      </p>
                                    )}
                                    {lensDetail.lensInfo.lensCoatings && lensDetail.lensInfo.lensCoatings.length > 0 && (
                                      <p>
                                        <strong>Coating:</strong> {lensDetail.lensInfo.lensCoatings.map((c: any) => c.name).join(', ')}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* Prescription */}
                                <div className="space-y-1">
                                  <p><strong>Prescription:</strong></p>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-2 rounded border">
                                      <p className="font-medium">Right Eye (OD)</p>
                                      <p>SPH: {lensDetail.rightEyeSphere || 0}</p>
                                      <p>CYL: {lensDetail.rightEyeCylinder || 0}</p>
                                      <p>Axis: {lensDetail.rightEyeAxis || 0}°</p>
                                      <p>PD: {lensDetail.pdRight || 0}</p>
                                      {lensDetail.addRight && <p>ADD: {lensDetail.addRight}</p>}
                                    </div>
                                    <div className="bg-white p-2 rounded border">
                                      <p className="font-medium">Left Eye (OS)</p>
                                      <p>SPH: {lensDetail.leftEyeSphere || 0}</p>
                                      <p>CYL: {lensDetail.leftEyeCylinder || 0}</p>
                                      <p>Axis: {lensDetail.leftEyeAxis || 0}°</p>
                                      <p>PD: {lensDetail.pdLeft || 0}</p>
                                      {lensDetail.addLeft && <p>ADD: {lensDetail.addLeft}</p>}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {(lensDetail.prescriptionNotes || lensDetail.lensNotes) && (
                                <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                  {lensDetail.prescriptionNotes && (
                                    <p><strong>Prescription Note:</strong> {lensDetail.prescriptionNotes}</p>
                                  )}
                                  {lensDetail.lensNotes && (
                                    <p><strong>Lens Note:</strong> {lensDetail.lensNotes}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className="text-sm text-blue-700">1</span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-sm font-medium text-blue-700">
                              {formatCurrency(lensDetail.lensPrice || 0)}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-sm font-medium text-blue-700">
                              {formatCurrency(lensDetail.lensPrice || 0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-b border-gray-200 p-8 print:p-6">
            <div className="flex justify-between items-start">
              <div className="w-1/2">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">{orderService.getPaymentMethodDisplayName(order.paymentMethod)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${order.paymentStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {orderService.getPaymentStatusDisplayName(order.paymentStatus)}
                    </span>
                  </div>
                </div>

                {/* Tracking Info */}
                {(order.trackingNumber || order.deliveryDate) && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Information</h3>
                    <div className="space-y-2 text-sm">
                      {order.trackingNumber && (
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Tracking Number:</span>
                          <span className="font-medium">{order.trackingNumber}</span>
                        </div>
                      )}
                      {order.deliveryDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Expected Delivery:</span>
                          <span className="font-medium">{formatDate(order.deliveryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="w-1/2 pl-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Fee:</span>
                      <span className="font-medium">{formatCurrency(order.shippingCost)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">{formatCurrency(order.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Footer */}
          <div className="p-8 print:p-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">Thank you for shopping at Mat Nice!</p>
              <p>For any questions, please contact: 0123-456-789 or email: support@matnice.com</p>
              <p className="mt-4 text-xs">
                Invoice generated automatically on {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 print:hidden">
          <Link
            to="/products"
            className="flex-1 bg-black text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            to="/contact"
            className="flex-1 bg-white text-gray-900 text-center py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Need Help?
          </Link>
        </div>
      </div>

      {/* Footer - Hide when printing */}
      <div className="print:hidden mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default OrderDetailPage;
