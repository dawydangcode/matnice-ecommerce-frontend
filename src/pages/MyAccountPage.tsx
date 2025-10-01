import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  Heart, 
  CreditCard, 
  Key,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import orderService, { OrderResponse } from '../services/order.service';
import userAddressService, { UserAddress, CreateUserAddressRequest } from '../services/user-address.service';
import userDetailService, { UserDetail, GenderType, UpdateUserDetailRequest } from '../services/user-detail.service';
import toast from 'react-hot-toast';

const MyAccountPage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState<CreateUserAddressRequest>({
    province: '',
    district: '',
    ward: '',
    addressDetail: '',
    isDefault: false,
    notes: ''
  });
  const [detailFormData, setDetailFormData] = useState<{
    name?: string;
    dob?: string;
    gender?: GenderType;
  }>({
    name: '',
    dob: undefined,
    gender: undefined
  });

    // Load data
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    const loadOrders = async () => {
      try {
        const orderData = await orderService.getUserOrders();
        setOrders(orderData);
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    };

    const loadAddresses = async () => {
      try {
        if (user?.id) {
          const addressData = await userAddressService.getUserAddresses(user.id);
          setAddresses(addressData);
        }
      } catch (error) {
        console.error('Failed to load addresses:', error);
      }
    };

    const loadUserDetail = async () => {
      try {
        if (user?.id) {
          const detailData = await userDetailService.getUserDetailByUserId(user.id);
          setUserDetail(detailData);
          if (detailData) {
            setDetailFormData({
              name: detailData.name || '',
              dob: detailData.dob ? detailData.dob.toISOString().split('T')[0] : undefined,
              gender: detailData.gender || undefined
            });
          }
        }
      } catch (error) {
        console.error('Failed to load user detail:', error);
      }
    };

    const loadInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadOrders(),
          loadAddresses(),
          loadUserDetail()
        ]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isLoggedIn, navigate, user?.id]);

  // Standalone reload functions for individual use
  const reloadOrders = async () => {
    try {
      const orderData = await orderService.getUserOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const reloadAddresses = async () => {
    try {
      if (user?.id) {
        const addressData = await userAddressService.getUserAddresses(user.id);
        setAddresses(addressData);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const reloadUserDetail = async () => {
    try {
      if (user?.id) {
        const detailData = await userDetailService.getUserDetailByUserId(user.id);
        setUserDetail(detailData);
        if (detailData) {
          setDetailFormData({
            name: detailData.name || '',
            dob: detailData.dob ? detailData.dob.toISOString().split('T')[0] : undefined,
            gender: detailData.gender || undefined
          });
        }
      }
    } catch (error) {
      console.error('Failed to load user detail:', error);
    }
  };

  const handleCreateAddress = async () => {
    try {
      if (user?.id) {
        await userAddressService.createUserAddress(user.id, addressFormData);
        await reloadAddresses();
        setIsCreatingAddress(false);
        setAddressFormData({
          province: '',
          district: '',
          ward: '',
          addressDetail: '',
          isDefault: false,
          notes: ''
        });
      }
    } catch (error) {
      console.error('Failed to create address:', error);
    }
  };

  const handleUpdateAddress = async (addressId: number) => {
    try {
      await userAddressService.updateUserAddress(addressId, addressFormData);
      await reloadAddresses();
      setIsEditingAddress(false);
      setEditingAddressId(null);
      setAddressFormData({
        province: '',
        district: '',
        ward: '',
        addressDetail: '',
        isDefault: false,
        notes: ''
      });
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await userAddressService.deleteUserAddress(addressId);
      await reloadAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      await userAddressService.setDefaultAddress(addressId);
      await reloadAddresses();
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const handleUpdateUserDetail = async () => {
    try {
      if (user?.id) {
        // Convert string date to Date object for API
        const apiData: UpdateUserDetailRequest = {
          name: detailFormData.name,
          dob: detailFormData.dob ? new Date(detailFormData.dob) : undefined,
          gender: detailFormData.gender
        };

        if (userDetail) {
          await userDetailService.updateUserDetail(user.id, apiData);
        } else {
          await userDetailService.createUserDetail({
            userId: user.id,
            ...apiData
          });
        }
        await reloadUserDetail();
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Failed to update user detail:', error);
    }
  };

  const handleEditAddress = (address: UserAddress) => {
    setAddressFormData({
      province: address.province,
      district: address.district,
      ward: address.ward,
      addressDetail: address.addressDetail,
      isDefault: address.isDefault,
      notes: address.notes || ''
    });
    setEditingAddressId(address.id);
    setIsEditingAddress(true);
  };

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      await handleUpdateUserDetail();
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (error) {
      toast.error('Không thể cập nhật hồ sơ');
      console.error('Error updating profile:', error);
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

  const menuItems = [
    { id: 'overview', label: 'Account Overview', icon: User },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
    { id: 'prescriptions', label: 'My Prescription Values', icon: Settings },
    { id: 'favorites', label: 'My Favorites', icon: Heart },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'security', label: 'Change Password', icon: Key },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Account Overview</h3>
          <span className="text-sm text-gray-500">Customer No. {user?.id || 'N/A'}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{user?.username || 'Not provided'}</p>
              <p>{user?.email || 'No email provided'}</p>
              <p className="text-xs text-gray-500">Member since: {new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Account Settings</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Role: <span className="font-medium text-gray-900">{user?.role?.name || 'User'}</span></p>
              <p>Status: <span className="font-medium text-green-600">Active</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Overview</h3>
        {orders.length === 0 ? (
          <>
            <p className="text-gray-600 mb-4">You have not placed an order with MATNICE EYEWEAR yet.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              View All Products
            </Link>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">You have placed {orders.length} order{orders.length > 1 ? 's' : ''} with us.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{orders.filter(o => o.status === 'pending').length}</div>
                <div className="text-gray-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">{orders.filter(o => o.status === 'processing').length}</div>
                <div className="text-blue-600">Processing</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">{orders.filter(o => o.status === 'delivered').length}</div>
                <div className="text-green-600">Delivered</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="font-medium text-red-900">{orders.filter(o => o.status === 'cancelled').length}</div>
                <div className="text-red-600">Cancelled</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              View All Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
        {!isEditingProfile ? (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 text-green-600 hover:text-green-800"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Username
          </label>
          <p className="text-gray-900">{user?.username || 'Not provided'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <p className="text-gray-900">{user?.email || 'Not provided'}</p>
        </div>

        {/* Personal Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          {isEditingProfile ? (
            <input
              type="text"
              value={detailFormData.name || ''}
              onChange={(e) => setDetailFormData({ ...detailFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-gray-900">{userDetail?.name || 'Not provided'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          {isEditingProfile ? (
            <input
              type="date"
              value={detailFormData.dob || ''}
              onChange={(e) => setDetailFormData({ ...detailFormData, dob: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">
              {userDetail?.dob ? new Date(userDetail.dob).toLocaleDateString('vi-VN') : 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          {isEditingProfile ? (
            <select
              value={detailFormData.gender || ''}
              onChange={(e) => setDetailFormData({ 
                ...detailFormData, 
                gender: e.target.value ? e.target.value as GenderType : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value={GenderType.MALE}>Male</option>
              <option value={GenderType.FEMALE}>Female</option>
              <option value={GenderType.OTHER}>Other</option>
            </select>
          ) : (
            <p className="text-gray-900">
              {userDetail?.gender ? userDetailService.getGenderDisplayName(userDetail.gender) : 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <p className="text-gray-900">
            {userDetail?.dob ? userDetailService.calculateAge(userDetail.dob) + ' years old' : 'Not provided'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Member Since
          </label>
          <p className="text-gray-900">{new Date(user?.createdAt || '').toLocaleDateString()}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Settings className="w-4 h-4 inline mr-2" />
            Role
          </label>
          <p className="text-gray-900">{user?.role?.name || 'User'}</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'profile':
        return renderProfile();
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">Order #{order.id}</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderService.getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{orderService.getStatusDisplayName(order.status)}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{formatDate(order.orderDate)}</span>
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total: </span>
                        <span className="font-medium text-gray-900">{formatCurrency(order.totalPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment: </span>
                        <span className={`font-medium px-2 py-1 rounded text-xs ${orderService.getPaymentStatusColor(order.paymentStatus)}`}>
                          {orderService.getPaymentStatusDisplayName(order.paymentStatus)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Method: </span>
                        <span className="font-medium text-gray-900">{orderService.getPaymentMethodDisplayName(order.paymentMethod)}</span>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Tracking: </span>
                        <span className="text-sm font-medium text-gray-900">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'addresses':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Addresses</h3>
              <button
                onClick={() => setIsCreatingAddress(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <MapPin size={16} />
                Add Address
              </button>
            </div>

            {/* Create Address Form */}
            {isCreatingAddress && (
              <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-4">Add New Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province
                    </label>
                    <input
                      type="text"
                      value={addressFormData.province}
                      onChange={(e) => setAddressFormData({...addressFormData, province: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter province"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      value={addressFormData.district}
                      onChange={(e) => setAddressFormData({...addressFormData, district: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ward
                    </label>
                    <input
                      type="text"
                      value={addressFormData.ward}
                      onChange={(e) => setAddressFormData({...addressFormData, ward: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter ward"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Detail
                    </label>
                    <input
                      type="text"
                      value={addressFormData.addressDetail}
                      onChange={(e) => setAddressFormData({...addressFormData, addressDetail: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter detailed address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressFormData.notes}
                      onChange={(e) => setAddressFormData({...addressFormData, notes: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter notes"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={addressFormData.isDefault}
                        onChange={(e) => setAddressFormData({...addressFormData, isDefault: e.target.checked})}
                        className="mr-2"
                      />
                      Set as default address
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleCreateAddress}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingAddress(false);
                      setAddressFormData({
                        province: '',
                        district: '',
                        ward: '',
                        addressDetail: '',
                        isDefault: false,
                        notes: ''
                      });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
              <p className="text-gray-600">No addresses saved.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span className="font-medium">
                            {userAddressService.formatFullAddress(address)}
                          </span>
                          {address.isDefault && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        {address.notes && (
                          <p className="text-gray-600 text-sm">Notes: {address.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit Address Form */}
            {isEditingAddress && editingAddressId && (
              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-4">Edit Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province
                    </label>
                    <input
                      type="text"
                      value={addressFormData.province}
                      onChange={(e) => setAddressFormData({...addressFormData, province: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter province"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      value={addressFormData.district}
                      onChange={(e) => setAddressFormData({...addressFormData, district: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ward
                    </label>
                    <input
                      type="text"
                      value={addressFormData.ward}
                      onChange={(e) => setAddressFormData({...addressFormData, ward: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter ward"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Detail
                    </label>
                    <input
                      type="text"
                      value={addressFormData.addressDetail}
                      onChange={(e) => setAddressFormData({...addressFormData, addressDetail: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter detailed address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressFormData.notes}
                      onChange={(e) => setAddressFormData({...addressFormData, notes: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter notes"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={addressFormData.isDefault}
                        onChange={(e) => setAddressFormData({...addressFormData, isDefault: e.target.checked})}
                        className="mr-2"
                      />
                      Set as default address
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUpdateAddress(editingAddressId)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Update Address
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingAddress(false);
                      setEditingAddressId(null);
                      setAddressFormData({
                        province: '',
                        district: '',
                        ward: '',
                        addressDetail: '',
                        isDefault: false,
                        notes: ''
                      });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'prescriptions':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Prescription Values</h3>
            <p className="text-gray-600">No prescription values saved.</p>
          </div>
        );
      case 'favorites':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Favorites</h3>
            <p className="text-gray-600">No favorite items yet.</p>
          </div>
        );
      case 'payment':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <p className="text-gray-600">No payment methods saved.</p>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50">
        <Header />
        <Navigation />
      </header>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your account</h2>
                
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                          activeTab === item.id
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-800 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyAccountPage;
