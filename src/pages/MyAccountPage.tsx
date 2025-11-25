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
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import orderService, { OrderResponse } from '../services/order.service';
import userAddressService, { UserAddress, CreateUserAddressRequest } from '../services/user-address.service';
import userDetailService, { UserDetail, GenderType, UpdateUserDetailRequest } from '../services/user-detail.service';
import vietnamAddressService, { Province, District, Ward } from '../services/vietnam-address.service';
import { useWishlistStore } from '../stores/wishlist.store';
import { formatVND } from '../utils/currency';
import toast from 'react-hot-toast';
import MyPrescriptions from '../components/MyPrescriptions';

const MyAccountPage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const { items: wishlistItems, totalItems: wishlistTotalItems, fetchWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlistStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [removingWishlistItemId, setRemovingWishlistItemId] = useState<number | null>(null);
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
  
  // Vietnam address data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);
  const [detailFormData, setDetailFormData] = useState<{
    name?: string;
    dob?: string;
    gender?: GenderType;
  }>({
    name: '',
    dob: undefined,
    gender: undefined
  });

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provincesData = await vietnamAddressService.getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    };
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvinceCode) {
        try {
          const districtsData = await vietnamAddressService.getDistrictsByProvinceCode(selectedProvinceCode);
          setDistricts(districtsData);
          setWards([]); // Clear wards when province changes
          setSelectedDistrictCode(null);
          setAddressFormData(prev => ({ ...prev, district: '', ward: '' }));
        } catch (error) {
          console.error('Error loading districts:', error);
        }
      } else {
        setDistricts([]);
        setWards([]);
        setSelectedDistrictCode(null);
      }
    };
    loadDistricts();
  }, [selectedProvinceCode]);

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (selectedDistrictCode) {
        try {
          const wardsData = await vietnamAddressService.getWardsByDistrictCode(selectedDistrictCode);
          setWards(wardsData);
          setAddressFormData(prev => ({ ...prev, ward: '' }));
        } catch (error) {
          console.error('Error loading wards:', error);
        }
      } else {
        setWards([]);
      }
    };
    loadWards();
  }, [selectedDistrictCode]);

  // Handle address field changes
  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = parseInt(event.target.value);
    const selectedProvince = provinces.find(p => p.code === provinceCode);
    
    if (selectedProvince) {
      setSelectedProvinceCode(provinceCode);
      setAddressFormData(prev => ({ 
        ...prev, 
        province: selectedProvince.name,
        district: '',
        ward: ''
      }));
    }
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = parseInt(event.target.value);
    const selectedDistrict = districts.find(d => d.code === districtCode);
    
    if (selectedDistrict) {
      setSelectedDistrictCode(districtCode);
      setAddressFormData(prev => ({ 
        ...prev, 
        district: selectedDistrict.name,
        ward: ''
      }));
    }
  };

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = parseInt(event.target.value);
    const selectedWard = wards.find(w => w.code === wardCode);
    
    if (selectedWard) {
      setAddressFormData(prev => ({ 
        ...prev, 
        ward: selectedWard.name
      }));
    }
  };

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

  // Load wishlist when switching to wishlist tab
  useEffect(() => {
    if (activeTab === 'wishlist' && user?.id) {
      fetchWishlist();
    }
  }, [activeTab, user?.id, fetchWishlist]);

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

  // Handle wishlist item removal
  const handleRemoveWishlistItem = async (wishlistItemId: number, itemName: string) => {
    try {
      setRemovingWishlistItemId(wishlistItemId);
      await removeFromWishlist(wishlistItemId);
      toast.success(`${itemName} removed from wishlist`);
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setRemovingWishlistItemId(null);
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
        setSelectedProvinceCode(null);
        setSelectedDistrictCode(null);
        setDistricts([]);
        setWards([]);
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
      setSelectedProvinceCode(null);
      setSelectedDistrictCode(null);
      setDistricts([]);
      setWards([]);
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
        console.log('Starting update user detail...', {
          userId: user.id,
          formData: detailFormData,
          userDetail: userDetail
        });

        // Build API data - only include fields that have values
        const apiData: UpdateUserDetailRequest = {};
        
        if (detailFormData.name && detailFormData.name.trim() !== '') {
          apiData.name = detailFormData.name;
        }
        
        if (detailFormData.dob && detailFormData.dob !== '') {
          apiData.dob = new Date(detailFormData.dob);
        }
        
        if (detailFormData.gender) {
          apiData.gender = detailFormData.gender;
        }

        console.log('API Data to send:', apiData);

        // Check if there's anything to update
        if (Object.keys(apiData).length === 0) {
          toast('Không có thông tin nào để cập nhật');
          setIsEditingProfile(false);
          return;
        }

        if (userDetail && userDetail.id) {
          // Update existing user detail - use userDetail.id, not user.id
          console.log('Updating existing user detail with ID:', userDetail.id);
          await userDetailService.updateUserDetail(userDetail.id, apiData);
        } else {
          // Create new user detail - userId is required for create
          console.log('Creating new user detail...');
          await userDetailService.createUserDetail({
            userId: user.id,
            ...apiData
          });
        }
        
        console.log('Reloading user detail...');
        await reloadUserDetail();
        setIsEditingProfile(false);
        console.log('Update completed successfully!');
      }
    } catch (error: any) {
      console.error('Failed to update user detail:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);
      throw error; // Re-throw để handleSaveProfile có thể catch
    }
  };

  const handleEditAddress = async (address: UserAddress) => {
    setAddressFormData({
      province: address.province,
      district: address.district,
      ward: address.ward,
      addressDetail: address.addressDetail,
      isDefault: address.isDefault,
      notes: address.notes || ''
    });
    
    // Find and set the corresponding codes for dropdowns
    const selectedProvince = provinces.find(p => p.name === address.province);
    if (selectedProvince) {
      setSelectedProvinceCode(selectedProvince.code);
      
      try {
        // Load districts for the selected province
        const districtsData = await vietnamAddressService.getDistrictsByProvinceCode(selectedProvince.code);
        setDistricts(districtsData);
        
        const selectedDistrict = districtsData.find(d => d.name === address.district);
        if (selectedDistrict) {
          setSelectedDistrictCode(selectedDistrict.code);
          
          // Load wards for the selected district
          const wardsData = await vietnamAddressService.getWardsByDistrictCode(selectedDistrict.code);
          setWards(wardsData);
        }
      } catch (error) {
        console.error('Error loading address data for edit:', error);
      }
    }
    
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
    { id: 'wishlist', label: 'My Favorites', icon: Heart },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'security', label: 'Change Password', icon: Key },
  ];

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account Overview</h3>
          <span className="text-xs sm:text-sm text-gray-500">Customer No. {user?.id || 'N/A'}</span>
        </div>
        
        {/* Account Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Account Information</h4>
          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
            <p className="font-medium text-gray-900 break-all">{user?.username || 'Not provided'}</p>
            <p className="break-all">{user?.email || 'No email provided'}</p>
            <p className="text-xs text-gray-500">Member since: {new Date(user?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Order Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Overview</h3>
        {orders.length === 0 ? (
          <>
            <p className="text-sm sm:text-base text-gray-600 mb-4">You have not placed an order with MATNICE EYEWEAR yet.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              View All Products
            </Link>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-gray-600">You have placed {orders.length} order{orders.length > 1 ? 's' : ''} with us.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{orders.filter(o => o.status === 'pending').length}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Pending</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">{orders.filter(o => o.status === 'processing').length}</div>
                <div className="text-blue-600 text-xs sm:text-sm">Processing</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">{orders.filter(o => o.status === 'delivered').length}</div>
                <div className="text-green-600 text-xs sm:text-sm">Delivered</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                <div className="font-medium text-red-900">{orders.filter(o => o.status === 'cancelled').length}</div>
                <div className="text-red-600 text-xs sm:text-sm">Cancelled</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              View All Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Profile Settings</h3>
        {!isEditingProfile ? (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center justify-center sm:justify-start space-x-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 text-green-600 hover:text-green-800 text-sm sm:text-base"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Account Information */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Username
          </label>
          <p className="text-sm sm:text-base text-gray-900 break-all">{user?.username || 'Not provided'}</p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Email
          </label>
          <p className="text-sm sm:text-base text-gray-900 break-all">{user?.email || 'Not provided'}</p>
        </div>

        {/* Personal Information */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          {isEditingProfile ? (
            <input
              type="text"
              value={detailFormData.name || ''}
              onChange={(e) => setDetailFormData({ ...detailFormData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-sm sm:text-base text-gray-900">{userDetail?.name || 'Not provided'}</p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          {isEditingProfile ? (
            <input
              type="date"
              value={detailFormData.dob || ''}
              onChange={(e) => setDetailFormData({ ...detailFormData, dob: e.target.value })}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-sm sm:text-base text-gray-900">
              {userDetail?.dob ? new Date(userDetail.dob).toLocaleDateString('vi-VN') : 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          {isEditingProfile ? (
            <select
              value={detailFormData.gender || ''}
              onChange={(e) => setDetailFormData({ 
                ...detailFormData, 
                gender: e.target.value ? e.target.value as GenderType : undefined
              })}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value={GenderType.MALE}>Male</option>
              <option value={GenderType.FEMALE}>Female</option>
              <option value={GenderType.UNISEX}>Other</option>
            </select>
          ) : (
            <p className="text-sm sm:text-base text-gray-900">
              {userDetail?.gender ? userDetailService.getGenderDisplayName(userDetail.gender) : 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <p className="text-sm sm:text-base text-gray-900">
            {userDetail?.dob ? userDetailService.calculateAge(userDetail.dob) + ' years old' : 'Not provided'}
          </p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Member Since
          </label>
          <p className="text-sm sm:text-base text-gray-900">{new Date(user?.createdAt || '').toLocaleDateString()}</p>
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
                      Tỉnh/Thành phố
                    </label>
                    <select
                      value={selectedProvinceCode || ''}
                      onChange={handleProvinceChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <select
                      value={selectedDistrictCode || ''}
                      onChange={handleDistrictChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      disabled={!selectedProvinceCode}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <select
                      value={wards.find(w => w.name === addressFormData.ward)?.code || ''}
                      onChange={handleWardChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      disabled={!selectedDistrictCode}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
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
                      setSelectedProvinceCode(null);
                      setSelectedDistrictCode(null);
                      setDistricts([]);
                      setWards([]);
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
                      Tỉnh/Thành phố
                    </label>
                    <select
                      value={selectedProvinceCode || ''}
                      onChange={handleProvinceChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <select
                      value={selectedDistrictCode || ''}
                      onChange={handleDistrictChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      disabled={!selectedProvinceCode}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <select
                      value={wards.find(w => w.name === addressFormData.ward)?.code || ''}
                      onChange={handleWardChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      disabled={!selectedDistrictCode}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
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
                      setSelectedProvinceCode(null);
                      setSelectedDistrictCode(null);
                      setDistricts([]);
                      setWards([]);
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
          <div>
            <MyPrescriptions />
          </div>
        );
      case 'wishlist':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Favourites ({wishlistTotalItems} item{wishlistTotalItems !== 1 ? 's' : ''})
              </h3>
            </div>

            {wishlistLoading && wishlistItems.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-sm text-gray-500">Loading wishlist...</span>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => {
                  const displayName = item.displayName || item.productName || item.lensName || 'Item';
                  const imageUrl = item.thumbnailUrl || item.imageUrl || '/api/placeholder/400/400';
                  const itemUrl = item.itemType === 'product' 
                    ? `/product/${item.productId}` 
                    : `/lens/${item.lensId}`;
                  const isRemoving = removingWishlistItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col h-full hover:shadow-md transition-shadow"
                    >
                      <Link to={itemUrl} className="block">
                        <div className="w-full h-44 bg-gray-100 rounded overflow-hidden mb-3">
                          <img
                            src={imageUrl}
                            alt={displayName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/400/400';
                            }}
                          />
                        </div>
                      </Link>

                      <div className="flex-1">
                        {item.brandName && (
                          <p className="text-xs text-gray-500 mb-1">{item.brandName}</p>
                        )}
                        <Link to={itemUrl} className="hover:underline">
                          <h3 className="text-sm font-medium text-gray-800 mb-2">
                            {displayName}
                          </h3>
                        </Link>
                        {item.productPrice && (
                          <p className="text-lg font-bold text-gray-900 mb-1">
                            {formatVND(item.productPrice)}
                          </p>
                        )}
                        {item.colorName && (
                          <p className="text-xs text-gray-500">Color: {item.colorName}</p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          to={itemUrl}
                          className="flex-1 text-center bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleRemoveWishlistItem(item.id, displayName)}
                          disabled={isRemoving}
                          className="text-red-600 text-sm px-3 py-2 border border-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {isRemoving ? '...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between bg-white rounded-lg shadow-sm border p-4"
            >
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5" />
                <span className="font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Menu'}
                </span>
              </div>
              <Settings className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar */}
            <div className={`lg:col-span-1 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Your account</h2>
                
                <nav className="space-y-1 sm:space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors text-sm sm:text-base ${
                          activeTab === item.id
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-6 sm:mt-8 pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-800 font-medium text-sm sm:text-base"
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
