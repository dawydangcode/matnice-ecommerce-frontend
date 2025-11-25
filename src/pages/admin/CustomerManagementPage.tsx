import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Mail,
  MapPin,
  Calendar,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  ShoppingCart,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { apiService } from '../../services/api.service';
import orderService, { OrderResponse } from '../../services/order.service';

interface UserDetail {
  id: number;
  userId: number;
  name: string;
  dob: string | null;
  gender: 'male' | 'female' | 'other' | null;
  createdAt: string;
  updatedAt: string;
}

interface UserAddress {
  id: number;
  userId: number;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserPrescription {
  id: number;
  userId: number;
  rightEyeSph: number;
  rightEyeCyl: number;
  rightEyeAxis: number;
  rightEyeAdd: number | null;
  leftEyeSph: number;
  leftEyeCyl: number;
  leftEyeAxis: number;
  leftEyeAdd: number | null;
  pdRight: number;
  pdLeft: number;
  isDefault: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: number;
  username: string;
  email: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  userDetail?: UserDetail;
  addresses?: UserAddress[];
  prescriptions?: UserPrescription[];
}

interface CustomerDetailViewProps {
  customer: Customer;
  onClose: () => void;
  onRefresh: () => void;
}

const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({
  customer,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'prescriptions' | 'orders'>('info');
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [prescriptions, setPrescriptions] = useState<UserPrescription[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCustomerDetails = async () => {
    setLoading(true);
    try {
      // Load user detail
      try {
        const detailResponse = await apiService.get(`/api/v1/user/${customer.id}/user-detail`) as UserDetail;
        setUserDetail(detailResponse);
      } catch (error) {
        console.log('No user detail found');
      }

      // Load addresses
      try {
        const addressResponse = await apiService.get(`/api/v1/user-address/${customer.id}/user`) as UserAddress[];
        setAddresses(addressResponse);
      } catch (error) {
        console.log('No addresses found');
      }

      // Load prescriptions
      try {
        const prescriptionResponse = await apiService.get(`/api/v1/user-prescription/list?userId=${customer.id}`) as { data: UserPrescription[] };
        setPrescriptions(prescriptionResponse.data || []);
      } catch (error) {
        console.log('No prescriptions found');
      }

      // Load orders
      try {
        const ordersResponse = await orderService.getOrders({ userId: customer.id });
        setOrders(ordersResponse.data || []);
      } catch (error) {
        console.log('No orders found');
      }
    } catch (error) {
      console.error('Error loading customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
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

  const formatGender = (gender: string | null) => {
    if (!gender) return 'Chưa cập nhật';
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#64C695] to-[#66D6A2] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Chi tiết khách hàng</h2>
              <p className="text-white/80 mt-1">{customer.email}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'info'
                  ? 'bg-white text-[#43AC78] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Thông tin
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'addresses'
                  ? 'bg-white text-[#43AC78] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Địa chỉ ({addresses.length})
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'prescriptions'
                  ? 'bg-white text-[#43AC78] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Prescription ({prescriptions.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'orders'
                  ? 'bg-white text-[#43AC78] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Đơn hàng ({orders.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#43AC78]"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
            </div>
          ) : (
            <>
              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {customer.username}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                        {customer.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {userDetail?.name || 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {formatGender(userDetail?.gender || null)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <Calendar className="w-4 h-4 inline mr-2 text-gray-500" />
                        {userDetail?.dob ? formatDate(userDetail.dob) : 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày đăng ký
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {formatDate(customer.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có địa chỉ nào</p>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 rounded-lg border-2 ${
                          address.isDefault
                            ? 'border-[#43AC78] bg-[#A8EDCB]/10'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="w-4 h-4 text-[#43AC78]" />
                              {address.isDefault && (
                                <span className="px-2 py-0.5 bg-[#43AC78] text-white text-xs rounded-full">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-medium">
                              {address.addressDetail}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.ward}, {address.district}, {address.province}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-4">
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có đơn kính nào</p>
                    </div>
                  ) : (
                    prescriptions.map((prescription) => (
                      <div
                        key={prescription.id}
                        className={`p-6 rounded-lg border-2 ${
                          prescription.isDefault
                            ? 'border-[#43AC78] bg-[#A8EDCB]/10'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">
                            Đơn kính #{prescription.id}
                          </h4>
                          {prescription.isDefault && (
                            <span className="px-3 py-1 bg-[#43AC78] text-white text-sm rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Right Eye */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-3">Mắt phải (OD)</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">SPH:</span>
                                <span className="font-medium">{prescription.rightEyeSph}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">CYL:</span>
                                <span className="font-medium">{prescription.rightEyeCyl}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">AXIS:</span>
                                <span className="font-medium">{prescription.rightEyeAxis}°</span>
                              </div>
                              {prescription.rightEyeAdd !== null && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">ADD:</span>
                                  <span className="font-medium">{prescription.rightEyeAdd}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Left Eye */}
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h5 className="font-medium text-green-900 mb-3">Mắt trái (OS)</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">SPH:</span>
                                <span className="font-medium">{prescription.leftEyeSph}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">CYL:</span>
                                <span className="font-medium">{prescription.leftEyeCyl}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">AXIS:</span>
                                <span className="font-medium">{prescription.leftEyeAxis}°</span>
                              </div>
                              {prescription.leftEyeAdd !== null && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">ADD:</span>
                                  <span className="font-medium">{prescription.leftEyeAdd}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* PD */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Khoảng cách đồng tử (PD):</span>
                            <span className="font-medium">
                              R: {prescription.pdRight}mm / L: {prescription.pdLeft}mm
                            </span>
                          </div>
                        </div>

                        {prescription.notes && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Ghi chú:</span> {prescription.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 text-xs text-gray-500">
                          Ngày tạo: {formatDate(prescription.createdAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Khách hàng chưa có đơn hàng nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Order Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg border">
                          <div className="font-medium text-gray-900">{orders.length}</div>
                          <div className="text-gray-600 text-sm">Tổng đơn</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="font-medium text-yellow-900">
                            {orders.filter(o => o.status === 'pending').length}
                          </div>
                          <div className="text-yellow-600 text-sm">Chờ xử lý</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="font-medium text-green-900">
                            {orders.filter(o => o.status === 'delivered').length}
                          </div>
                          <div className="text-green-600 text-sm">Đã giao</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="font-medium text-red-900">
                            {orders.filter(o => o.status === 'cancelled').length}
                          </div>
                          <div className="text-red-600 text-sm">Đã hủy</div>
                        </div>
                      </div>

                      {/* Order List */}
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">Đơn #{order.id}</span>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderService.getStatusColor(order.status)}`}
                                >
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1">{orderService.getStatusDisplayName(order.status)}</span>
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{formatDateTime(order.orderDate)}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Tổng tiền: </span>
                                <span className="font-medium text-gray-900">{formatCurrency(order.totalPrice)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Thanh toán: </span>
                                <span className={`font-medium px-2 py-1 rounded text-xs ${orderService.getPaymentStatusColor(order.paymentStatus)}`}>
                                  {orderService.getPaymentStatusDisplayName(order.paymentStatus)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Phương thức: </span>
                                <span className="font-medium text-gray-900">
                                  {orderService.getPaymentMethodDisplayName(order.paymentMethod)}
                                </span>
                              </div>
                            </div>

                            {order.trackingNumber && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <span className="text-sm text-gray-600">Mã vận đơn: </span>
                                <span className="text-sm font-medium text-gray-900">{order.trackingNumber}</span>
                              </div>
                            )}

                            {/* Shipping Address */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="text-sm">
                                <span className="text-gray-600">Địa chỉ giao hàng: </span>
                                <span className="text-gray-900">
                                  {order.addressDetail}, {order.ward}, {order.district}, {order.province}
                                </span>
                              </div>
                              <div className="mt-1 text-sm">
                                <span className="text-gray-600">Người nhận: </span>
                                <span className="text-gray-900">{order.fullName} - {order.phone}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const itemsPerPage = 10;

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/api/v1/user/list?page=${currentPage}&limit=${itemsPerPage}`) as { data: Customer[]; total: number };
      setCustomers(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailView(true);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin khách hàng, địa chỉ và đơn kính
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78] focus:border-[#43AC78]"
            />
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#43AC78]"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không tìm thấy khách hàng nào</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên đăng nhập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{customer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#43AC78] to-[#64C695] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {customer.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến{' '}
                  {Math.min(currentPage * itemsPerPage, customers.length)} trong tổng số{' '}
                  {customers.length} khách hàng
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail View Modal */}
      {showDetailView && selectedCustomer && (
        <CustomerDetailView
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailView(false);
            setSelectedCustomer(null);
          }}
          onRefresh={loadCustomers}
        />
      )}
    </div>
  );
};

export default CustomerManagementPage;
