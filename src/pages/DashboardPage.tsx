import React from 'react';
import { useAuthStore } from '../stores/auth.store';
import { LogOut, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Matnice</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">{user?.username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Matnice Dashboard
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Hello <span className="font-semibold text-primary-600">{user?.username}</span>! 
            Welcome to your dashboard.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-800 mb-3">User Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Username:</span>
                  <span className="ml-2 font-medium">{user?.username}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{user?.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>
                  <span className="ml-2 font-medium capitalize">{user?.role?.type || 'User'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-secondary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-secondary-800 mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                  Browse Products
                </button>
                <button className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                  View Cart
                </button>
                <button className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                  Order History
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Your Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart Items:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wishlist:</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-500 text-center">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
