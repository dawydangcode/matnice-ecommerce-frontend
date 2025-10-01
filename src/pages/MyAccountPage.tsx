import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const MyAccountPage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    // TODO: Implement API call to update profile
    console.log('Saving profile:', profileData);
    setIsEditingProfile(false);
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
        <p className="text-gray-600 mb-4">You have not placed an order with MATNICE EYEWEAR yet.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          View All Products
        </Link>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Username
          </label>
          {isEditingProfile ? (
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{user?.username || 'Not provided'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          {isEditingProfile ? (
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{user?.email || 'Not provided'}</p>
          )}
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
            <p className="text-gray-600">No orders found.</p>
          </div>
        );
      case 'addresses':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Addresses</h3>
            <p className="text-gray-600">No addresses saved.</p>
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
