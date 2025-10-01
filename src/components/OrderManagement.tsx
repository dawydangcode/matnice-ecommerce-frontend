import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
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
      // Fetch detailed order information
      const detailedOrder = await orderService.getOrderDetails(order.id);
      console.log('Detailed Order Data:', detailedOrder); // Debug log
      setSelectedOrder(detailedOrder);
      setShowOrderDetail(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Có lỗi khi tải chi tiết đơn hàng');
    }
  };

  // Handle update order status
  const handleUpdateStatus = (order: OrderResponse) => {
    setEditingOrder(order);
    setNewStatus(order.status as OrderStatus);
    setShowStatusModal(true);
  };

  // Handle update payment status
  const handleOpenPaymentStatusModal = (order: OrderResponse) => {
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

  // Format address
  const formatAddress = (order: OrderResponse) => {
    if (order.address) return order.address;
    
    const addressParts = [
      order.addressDetail,
      order.ward,
      order.district,
      order.province
    ].filter(part => part && part.trim());
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Chưa có địa chỉ';
  };

  // Format prescription value
  const formatPrescriptionValue = (value: any, suffix: string = '') => {
    if (value === null || value === undefined || value === 0) return '-';
    return `${value}${suffix}`;
  };

  // Check if prescription has ADD values
  const hasAddValues = (lensDetail: any) => {
    return lensDetail && (lensDetail.addRight || lensDetail.addLeft);
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

  // Handle update order status
  const handleUpdateOrderStatus = async (newStatus: OrderStatus) => {
    if (selectedOrder) {
      try {
        await orderService.updateOrderStatus(selectedOrder.id, newStatus);
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        toast.success('Cập nhật trạng thái thành công!');
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Có lỗi khi cập nhật trạng thái');
      }
    }
  };

  // Handle update payment status
  const handleUpdatePaymentStatus = async (newPaymentStatus: PaymentStatus) => {
    if (selectedOrder) {
      try {
        await orderService.updatePaymentStatus(selectedOrder.id, newPaymentStatus);
        setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
        toast.success('Cập nhật trạng thái thanh toán thành công!');
      } catch (error) {
        console.error('Error updating payment status:', error);
        toast.error('Có lỗi khi cập nhật trạng thái thanh toán');
      }
    }
  };

  // Handle update notes
  const handleUpdateNotes = (newNotes: string) => {
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, notes: newNotes });
    }
  };

  // Handle submit changes
  const handleSubmitChanges = () => {
    toast.success('Thay đổi đã được lưu!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Conditional rendering based on view state
  if (showOrderDetail && selectedOrder) {
    return (
      <div className="p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowOrderDetail(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Quay lại danh sách</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn hàng #{selectedOrder.id}
            </h1>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            <span>In hóa đơn</span>
          </button>
        </div>

        {/* Order Detail Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          {/* Order Header */}
          <div className="border-b pb-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Created</h3>
                <p className="text-gray-900">{formatDate(selectedOrder.orderDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Name</h3>
                <p className="text-gray-900">{selectedOrder.fullName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                <p className="text-gray-900">{selectedOrder.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                <p className="text-gray-900">{selectedOrder.phone}</p>
              </div>
            </div>
          </div>

          {/* 3 Info Cards - Delivery Address, Customer Info, Invoice Detail */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Delivery Address */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Full Address:</span>
                  <span className="font-semibold text-gray-900 text-right max-w-48">
                    {formatAddress(selectedOrder)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Phone:</span>
                  <span className="font-semibold text-gray-900">{selectedOrder.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Info</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="font-semibold text-gray-900">{selectedOrder.fullName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="font-semibold text-gray-900 text-right max-w-48 break-words">{selectedOrder.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Contact:</span>
                  <span className="font-semibold text-gray-900">{selectedOrder.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Payment:</span>
                  <span className={`font-semibold px-2 py-1 rounded text-xs ${orderService.getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {orderService.getPaymentStatusDisplayName(selectedOrder.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Detail */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Detail</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Order ID:</span>
                  <span className="font-semibold text-gray-900">#{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Cart ID:</span>
                  <span className="font-semibold text-gray-900">#{selectedOrder.cartId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Payment Method:</span>
                  <span className="font-semibold text-gray-900">{orderService.getPaymentMethodDisplayName(selectedOrder.paymentMethod)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Amount:</span>
                  <span className="font-semibold text-gray-900 text-green-600">{formatCurrency(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Order Summary (spans 2 columns) */}
            <div className="md:col-span-2">
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lens Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.orderItems && selectedOrder.orderItems.map((item: any, index: number) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-full flex items-center justify-center">
                              {/* Product Information - Vertically Centered */}
                              <div className="bg-gray-50 rounded-lg p-3 w-full">
                                <div className="space-y-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.productInfo?.productName || 'Sản phẩm không xác định'}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Brand: {item.productInfo?.brandName || 'N/A'}
                                  </div>
                                  {item.productInfo?.colorInfo && (
                                    <div className="text-xs text-gray-600">
                                      Color: {item.productInfo.colorInfo.colorName}
                                      {item.productInfo.colorInfo.productNumber && (
                                        <span className="ml-2 bg-gray-200 px-2 py-1 rounded text-xs">
                                          #{item.productInfo.colorInfo.productNumber}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {/* Lens Details */}
                            <div className="space-y-4">
                              {item.lensDetails && item.lensDetails.length > 0 ? (
                                <div className="space-y-2">
                                  {item.lensDetails.map((lensDetail: any, lensIndex: number) => (
                                    <div key={lensDetail.id || lensIndex} className="bg-blue-50 rounded-lg p-3">
                                      {lensDetail.lensInfo && (
                                        <div className="space-y-1">
                                          <div className="text-sm font-medium text-blue-800">
                                            {lensDetail.lensInfo.lensName || 'Lens'}
                                          </div>
                                          <div className="text-xs text-gray-600 space-y-0.5">
                                            {/* Show lens coatings if available */}
                                            {lensDetail.lensInfo.lensCoatings && lensDetail.lensInfo.lensCoatings.length > 0 && (
                                              <div className="text-xs">
                                                <div className="font-medium text-gray-700">Coatings:</div>
                                                {lensDetail.lensInfo.lensCoatings.map((coating: any, coatingIndex: number) => (
                                                  <div key={coatingIndex} className="text-purple-600">
                                                    • {coating.name} (+{formatCurrency(coating.price || 0)})
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                            {/* Show tint color if available */}
                                            {lensDetail.lensInfo.tintColor && (
                                              <div className="text-xs">
                                                <span className="font-medium text-gray-700">Tint: </span>
                                                <span className="text-orange-600">{lensDetail.lensInfo.tintColor.name}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">No lens details</div>
                              )}

                              {/* Prescription Values - Moved to Lens Details Column */}
                              {item.lensDetails && item.lensDetails.length > 0 && (
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                  <h6 className="text-sm font-medium text-gray-800 mb-3">Thông tin đơn thuốc</h6>
                                  {item.lensDetails.map((lensDetail: any, lensIndex: number) => (
                                    <div key={lensDetail.id || lensIndex} className="overflow-x-auto bg-gray-50 p-4 rounded-lg mb-3">
                                      <table className="min-w-full text-sm">
                                        <thead>
                                          <tr className="border-b border-gray-300">
                                            <th className="text-left py-3 px-3 font-medium text-gray-700">Mắt</th>
                                            <th className="text-center py-3 px-3 font-medium text-gray-700">SPH</th>
                                            <th className="text-center py-3 px-3 font-medium text-gray-700">CYL</th>
                                            <th className="text-center py-3 px-3 font-medium text-gray-700">AXIS</th>
                                            <th className="text-center py-3 px-3 font-medium text-gray-700">PD</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr className="border-b border-gray-200">
                                            <td className="py-3 px-3 font-medium text-gray-700">Phải</td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.rightEyeSphere)}
                                            </td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.rightEyeCylinder)}
                                            </td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.rightEyeAxis, '°')}
                                            </td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.pdRight)}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="py-3 px-3 font-medium text-gray-700">Trái</td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.leftEyeSphere)}
                                            </td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.leftEyeCylinder)}
                                            </td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.leftEyeAxis, '°')}
                                            </td>
                                            <td className="text-center py-3 px-3 text-gray-600">
                                              {formatPrescriptionValue(lensDetail.pdLeft)}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <span className="inline-block px-3 py-1 border border-gray-300 rounded-md font-medium">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(Number(item.framePrice) || 0)}
                            </div>
                            {/* Show lens price breakdown if exists */}
                            {item.lensDetails && item.lensDetails.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                {item.lensDetails.map((lensDetail: any, idx: number) => {
                                  const lensPrice = Number(lensDetail.lensInfo?.lensVariant?.price) || 0;
                                  const coatingPrice = lensDetail.lensInfo?.lensCoatings?.reduce((coatingSum: number, coating: any) => {
                                    return coatingSum + (Number(coating.price) || 0);
                                  }, 0) || 0;
                                  
                                  return (
                                    <div key={idx}>
                                      <div className="flex justify-between">
                                        <span>+ Lens:</span>
                                        <span>{formatCurrency(lensPrice)}</span>
                                      </div>
                                      {coatingPrice > 0 && (
                                        <div className="flex justify-between">
                                          <span>+ Coatings:</span>
                                          <span>{formatCurrency(coatingPrice)}</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                <div className="border-t pt-1 font-medium text-gray-900">
                                  Total: {formatCurrency(
                                    ((Number(item.framePrice) || 0) + 
                                    (item.lensDetails?.reduce((sum: number, lensDetail: any) => {
                                      const lensPrice = Number(lensDetail.lensInfo?.lensVariant?.price) || 0;
                                      const coatingPrice = lensDetail.lensInfo?.lensCoatings?.reduce((coatingSum: number, coating: any) => {
                                        return coatingSum + (Number(coating.price) || 0);
                                      }, 0) || 0;
                                      return sum + lensPrice + coatingPrice;
                                    }, 0) || 0)) * item.quantity
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Order Totals */}
                <div className="border-t p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal Price:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Cost (+):</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount (-):</span>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span className="text-gray-900">Total Payable:</span>
                    <span className="text-gray-900">{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Status Orders (positioned below Invoice Detail) */}
            <div className="md:col-span-1">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Orders</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                    <input
                      type="text"
                      value={selectedOrder.id}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateOrderStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="text"
                      value={selectedOrder.orderItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Transaction</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={selectedOrder.notes || ''}
                      onChange={(e) => handleUpdateNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add your comment..."
                    />
                  </div>
                  
                  <button 
                    onClick={handleSubmitChanges}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                        onClick={() => handleOpenPaymentStatusModal(order)}
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
