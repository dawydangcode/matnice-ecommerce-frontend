import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  AlertCircle,
  Download,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import orderService, { 
  OrderResponse, 
  OrderStatus, 
  PaymentStatus, 
  GetOrdersParams,
  OrdersResponse,
  UpdateTrackingRequest
} from '../services/order.service';

interface OrderManagementProps {}

const OrderManagement: React.FC<OrderManagementProps> = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderResponse | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  
  // Advanced filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'orderDate' | 'totalPrice' | 'status' | 'id'>('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Tracking info
  const [trackingNumber, setTrackingNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const itemsPerPage = 10;

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetOrdersParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy,
        sortOrder,
      };

      // Use the new API endpoint with detailed information
      const response: OrdersResponse = await orderService.getOrdersWithDetails(params);
      setOrders(response.data);
      setTotalOrders(response.total);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, paymentStatusFilter, startDate, endDate, minPrice, maxPrice, sortBy, sortOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleStatusFilter = (status: OrderStatus | '') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePaymentStatusFilter = (status: PaymentStatus | '') => {
    setPaymentStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle view order detail
  const handleViewOrder = async (order: OrderResponse) => {
    try {
      // For now, use basic order info since /details endpoint may not be fully implemented
      // You can uncomment the line below once backend endpoint is ready
      // const detailedOrder = await orderService.getOrderDetails(order.id);
      setSelectedOrder(order);
      setShowOrderDetail(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
      // Fallback to basic order info
      setSelectedOrder(order);
      setShowOrderDetail(true);
    }
  };

  // Handle update order status
  const handleUpdateStatus = (order: OrderResponse) => {
    setEditingOrder(order);
    setNewStatus(order.status as OrderStatus);
    setShowStatusModal(true);
  };

  // Handle update payment status
  const handleUpdatePaymentStatus = (order: OrderResponse) => {
    setEditingOrder(order);
    setNewPaymentStatus(order.paymentStatus as PaymentStatus);
    setShowPaymentStatusModal(true);
  };

  // Submit status update
  const submitStatusUpdate = async () => {
    if (!editingOrder) return;

    try {
      await orderService.updateOrderStatus(editingOrder.id, newStatus);
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      setShowStatusModal(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  // Submit payment status update
  const submitPaymentStatusUpdate = async () => {
    if (!editingOrder) return;

    try {
      await orderService.updatePaymentStatus(editingOrder.id, newPaymentStatus);
      toast.success('Cập nhật trạng thái thanh toán thành công');
      setShowPaymentStatusModal(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Không thể cập nhật trạng thái thanh toán');
    }
  };

  // Handle update tracking info
  const handleUpdateTracking = (order: OrderResponse) => {
    setEditingOrder(order);
    setTrackingNumber(order.trackingNumber || '');
    setDeliveryDate(order.deliveryDate || '');
    setShowTrackingModal(true);
  };

  // Submit tracking update
  const submitTrackingUpdate = async () => {
    if (!editingOrder) return;

    try {
      const trackingInfo: UpdateTrackingRequest = {
        trackingNumber: trackingNumber || undefined,
        deliveryDate: deliveryDate || undefined,
      };
      
      await orderService.updateTrackingInfo(editingOrder.id, trackingInfo);
      toast.success('Cập nhật thông tin vận chuyển thành công');
      setShowTrackingModal(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error updating tracking info:', error);
      toast.error('Không thể cập nhật thông tin vận chuyển');
    }
  };

  // Handle export functions
  const handleExportPDF = async () => {
    try {
      const params: GetOrdersParams = {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      
      const blob = await orderService.exportOrdersPDF(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Xuất PDF thành công');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Không thể xuất PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      const params: GetOrdersParams = {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      
      const blob = await orderService.exportOrdersExcel(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Xuất Excel thành công');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Không thể xuất Excel');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentStatusFilter('');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('orderDate');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Handle delete order
  const handleDeleteOrder = async (order: OrderResponse) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${order.id}?`)) {
      return;
    }

    try {
      await orderService.deleteOrder(order.id);
      toast.success('Xóa đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Không thể xóa đơn hàng');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600">Quản lý tất cả đơn hàng trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value as OrderStatus | '')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đã gửi hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <CreditCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={paymentStatusFilter}
              onChange={(e) => handlePaymentStatusFilter(e.target.value as PaymentStatus | '')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Tất cả thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã hủy</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Xuất PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá từ (₫)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá đến (₫)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="orderDate">Ngày đặt</option>
                  <option value="totalPrice">Tổng giá</option>
                  <option value="status">Trạng thái</option>
                  <option value="id">Mã đơn hàng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    <div className="text-sm text-gray-500">Cart: {order.cartId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.fullName}</div>
                    <div className="text-sm text-gray-500">{order.phone}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="space-y-1">
                          {order.orderItems.slice(0, 2).map((item, index) => (
                            <div key={item.id || index} className="text-xs">
                              <div className="font-medium">
                                {item.productInfo?.productName || `Sản phẩm #${item.productId}`}
                              </div>
                              <div className="text-gray-500">
                                {item.productInfo?.brandName && `${item.productInfo.brandName} • `}
                                {item.productInfo?.colorInfo?.colorName && `${item.productInfo.colorInfo.colorName} • `}
                                SL: {item.quantity}
                                {item.lensDetails && item.lensDetails.length > 0 && (
                                  <span className="ml-1 text-blue-600">+ Tròng</span>
                                )}
                              </div>
                            </div>
                          ))}
                          {order.orderItems.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{order.orderItems.length - 2} sản phẩm khác
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Chưa có sản phẩm</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {orderService.getPaymentMethodDisplayName(order.paymentMethod)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderService.getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{orderService.getStatusDisplayName(order.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderService.getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {orderService.getPaymentStatusDisplayName(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order)}
                        className="text-green-600 hover:text-green-900"
                        title="Cập nhật trạng thái"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdatePaymentStatus(order)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Cập nhật thanh toán"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateTracking(order)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Cập nhật vận chuyển"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa đơn hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalOrders)}
                  </span>{' '}
                  trong <span className="font-medium">{totalOrders}</span> đơn hàng
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span>{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${orderService.getStatusColor(selectedOrder.status)}`}>
                        {orderService.getStatusDisplayName(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thanh toán:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${orderService.getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {orderService.getPaymentStatusDisplayName(selectedOrder.paymentStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span>{orderService.getPaymentMethodDisplayName(selectedOrder.paymentMethod)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedOrder.fullName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedOrder.email}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div>{selectedOrder.addressDetail}</div>
                        <div className="text-gray-600">
                          {selectedOrder.ward}, {selectedOrder.district}, {selectedOrder.province}
                        </div>
                      </div>
                    </div>
                    {selectedOrder.notes && (
                      <div className="mt-2">
                        <span className="text-gray-600">Ghi chú: </span>
                        <span>{selectedOrder.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Sản phẩm đã đặt</h4>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            {/* Product Information */}
                            <div className="mb-3">
                              <h5 className="font-medium text-gray-900 text-lg">
                                {item.productInfo?.productName || 'Sản phẩm không xác định'}
                              </h5>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>Thương hiệu: <span className="font-medium">{item.productInfo?.brandName || 'N/A'}</span></div>
                                <div>Số lượng: <span className="font-medium">{item.quantity}</span></div>
                                <div>Giá khung: <span className="font-medium">{formatCurrency(item.framePrice)}</span></div>
                                {item.productInfo?.colorInfo && (
                                  <div>
                                    Màu sắc: <span className="font-medium">{item.productInfo.colorInfo.colorName}</span>
                                    {item.productInfo.colorInfo.productNumber && (
                                      <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                                        #{item.productInfo.colorInfo.productNumber}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div>Tổng giá: <span className="font-semibold text-green-600">{formatCurrency(item.totalPrice)}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Lens Details */}
                        {item.lensDetails && item.lensDetails.length > 0 && (
                          <div className="mt-4 bg-blue-50 rounded-lg p-4">
                            <h6 className="font-medium text-blue-900 mb-3">Chi tiết tròng kính:</h6>
                            {item.lensDetails.map((lensDetail, index) => (
                              <div key={lensDetail.id || index} className="mb-4 last:mb-0">
                                {/* Lens Basic Info */}
                                {lensDetail.lensInfo && (
                                  <div className="mb-3 p-3 bg-white rounded border">
                                    <div className="font-medium text-blue-800 text-base">
                                      {lensDetail.lensInfo.lensName || 'Tròng kính'}
                                    </div>
                                    <div className="text-sm text-blue-700 mt-1 space-y-1">
                                      <div>Loại: <span className="font-medium">{lensDetail.lensInfo.lensType || 'N/A'}</span></div>
                                      <div>Thương hiệu: <span className="font-medium">{lensDetail.lensInfo.brandLens || 'N/A'}</span></div>
                                      {lensDetail.lensInfo.lensVariant && (
                                        <div>
                                          Chất liệu: <span className="font-medium">{lensDetail.lensInfo.lensVariant.material || 'N/A'}</span>
                                          {lensDetail.lensInfo.lensVariant.price > 0 && (
                                            <span className="ml-2">- Giá: {formatCurrency(lensDetail.lensInfo.lensVariant.price)}</span>
                                          )}
                                        </div>
                                      )}
                                      {lensDetail.lensInfo.lensThickness && (
                                        <div>
                                          Độ dày: <span className="font-medium">{lensDetail.lensInfo.lensThickness.name}</span>
                                          <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">
                                            Chỉ số: {lensDetail.lensInfo.lensThickness.indexValue}
                                          </span>
                                          {lensDetail.lensInfo.lensThickness.price > 0 && (
                                            <span className="ml-2">+ {formatCurrency(lensDetail.lensInfo.lensThickness.price)}</span>
                                          )}
                                        </div>
                                      )}
                                      {lensDetail.lensInfo.lensCoatings && lensDetail.lensInfo.lensCoatings.length > 0 && (
                                        <div>
                                          Lớp phủ: 
                                          {lensDetail.lensInfo.lensCoatings.map((coating: any, idx: number) => (
                                            <span key={idx} className="ml-2 text-xs bg-green-100 px-2 py-1 rounded">
                                              {coating.name}
                                              {coating.price > 0 && ` (+${formatCurrency(coating.price)})`}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      {lensDetail.lensInfo.tintColor && (
                                        <div>
                                          Màu tint: <span className="font-medium">{lensDetail.lensInfo.tintColor.name}</span>
                                          <span 
                                            className="ml-2 inline-block w-4 h-4 rounded-full border border-gray-300"
                                            title={`Màu: ${lensDetail.lensInfo.tintColor.colorCode}`}
                                          ></span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Prescription Details */}
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div className="bg-white p-3 rounded border">
                                    <div className="font-medium text-gray-800 text-sm">Mắt phải (OD)</div>
                                    <div className="text-xs text-gray-600 mt-1 space-y-1">
                                      <div>SPH: <span className="font-medium">{lensDetail.rightEyeSphere || 0}</span></div>
                                      <div>CYL: <span className="font-medium">{lensDetail.rightEyeCylinder || 0}</span></div>
                                      <div>Axis: <span className="font-medium">{lensDetail.rightEyeAxis || 0}°</span></div>
                                      <div>PD: <span className="font-medium">{lensDetail.pdRight || 0}</span></div>
                                      {lensDetail.addRight && <div>ADD: <span className="font-medium">{lensDetail.addRight}</span></div>}
                                    </div>
                                  </div>
                                  <div className="bg-white p-3 rounded border">
                                    <div className="font-medium text-gray-800 text-sm">Mắt trái (OS)</div>
                                    <div className="text-xs text-gray-600 mt-1 space-y-1">
                                      <div>SPH: <span className="font-medium">{lensDetail.leftEyeSphere || 0}</span></div>
                                      <div>CYL: <span className="font-medium">{lensDetail.leftEyeCylinder || 0}</span></div>
                                      <div>Axis: <span className="font-medium">{lensDetail.leftEyeAxis || 0}°</span></div>
                                      <div>PD: <span className="font-medium">{lensDetail.pdLeft || 0}</span></div>
                                      {lensDetail.addLeft && <div>ADD: <span className="font-medium">{lensDetail.addLeft}</span></div>}
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Notes */}
                                {(lensDetail.prescriptionNotes || lensDetail.lensNotes || lensDetail.manufacturingNotes) && (
                                  <div className="bg-yellow-50 p-3 rounded border">
                                    <div className="font-medium text-yellow-800 text-sm">Ghi chú:</div>
                                    <div className="text-xs text-yellow-700 mt-1 space-y-1">
                                      {lensDetail.prescriptionNotes && (
                                        <div><strong>Đơn thuốc:</strong> {lensDetail.prescriptionNotes}</div>
                                      )}
                                      {lensDetail.lensNotes && (
                                        <div><strong>Tròng kính:</strong> {lensDetail.lensNotes}</div>
                                      )}
                                      {lensDetail.manufacturingNotes && (
                                        <div><strong>Sản xuất:</strong> {lensDetail.manufacturingNotes}</div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="mt-2 text-right">
                                  <span className="text-sm font-medium text-blue-800">
                                    Giá tròng: {formatCurrency(lensDetail.lensPrice || 0)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracking Info */}
              {(selectedOrder.trackingNumber || selectedOrder.deliveryDate) && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Thông tin vận chuyển</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span>Số theo dõi:</span>
                        <span className="font-medium">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                    {selectedOrder.deliveryDate && (
                      <div className="flex justify-between">
                        <span>Ngày giao dự kiến:</span>
                        <span className="font-medium">{formatDate(selectedOrder.deliveryDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Thông tin giá</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cập nhật trạng thái đơn hàng #{editingOrder.id}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={OrderStatus.PENDING}>Chờ xử lý</option>
                  <option value={OrderStatus.PROCESSING}>Đang xử lý</option>
                  <option value={OrderStatus.SHIPPED}>Đã gửi hàng</option>
                  <option value={OrderStatus.DELIVERED}>Đã giao hàng</option>
                  <option value={OrderStatus.CANCELLED}>Đã hủy</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={submitStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Update Modal */}
      {showPaymentStatusModal && editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cập nhật trạng thái thanh toán #{editingOrder.id}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái thanh toán mới
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={PaymentStatus.PENDING}>Chờ thanh toán</option>
                  <option value={PaymentStatus.PROCESSING}>Đang xử lý</option>
                  <option value={PaymentStatus.COMPLETED}>Đã thanh toán</option>
                  <option value={PaymentStatus.FAILED}>Thất bại</option>
                  <option value={PaymentStatus.CANCELLED}>Đã hủy</option>
                  <option value={PaymentStatus.REFUNDED}>Đã hoàn tiền</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowPaymentStatusModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={submitPaymentStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Cập nhật thông tin vận chuyển
                </h3>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số theo dõi
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Nhập số theo dõi vận chuyển"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày giao dự kiến
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={submitTrackingUpdate}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
