import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Bell,
  Search,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import ProductListPage from './admin/ProductListPage';
import ProductFormPage from './admin/ProductFormPage';
import { Product } from '../types/product.types';

type AdminView = 'dashboard' | 'products' | 'product-form';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentView('product-form');
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setCurrentView('product-form');
  };

  const handleFormCancel = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleFormSuccess = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 rounded-lg"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Dashboard
              </a>
              
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Package className="w-5 h-5 mr-3" />
                Products
              </a>
              
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Orders
              </a>
              
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Users className="w-5 h-5 mr-3" />
                Customers
              </a>
              
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Analytics
              </a>
              
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </a>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$12,426</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-3xl font-bold text-gray-900">1,247</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8.2%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-3xl font-bold text-gray-900">547</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +3.1%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-3xl font-bold text-gray-900">12,467</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5.7%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart placeholder - Integrate with your preferred chart library</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">#</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order #{1000 + item}</p>
                        <p className="text-sm text-gray-500">Customer {item}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(Math.random() * 500 + 50).toFixed(2)}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Management */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Product Management</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Add Product
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ray-Ban Aviator', category: 'Sunglasses', price: '$150', stock: 25, status: 'Active' },
                    { name: 'Oakley Holbrook', category: 'Sunglasses', price: '$120', stock: 18, status: 'Active' },
                    { name: 'Tom Ford TF5401', category: 'Glasses', price: '$280', stock: 12, status: 'Active' },
                    { name: 'Prada PR 17WS', category: 'Sunglasses', price: '$320', stock: 8, status: 'Low Stock' },
                  ].map((product, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.category}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">{product.price}</td>
                      <td className="py-3 px-4 text-gray-600">{product.stock}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          product.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                          <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
