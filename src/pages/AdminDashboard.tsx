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
  Tag,
  Layers
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import ProductListPage from './admin/ProductListPage';
import ProductFormPage from './admin/ProductFormPage';
import EnhancedProductForm from '../components/admin/EnhancedProductForm';
import BrandListPage from './admin/BrandListPage';
import CategoryListPage from './admin/CategoryListPage';
import { Product } from '../types/product.types';
// import { Brand } from '../types/brand.types';
// import { Category } from '../types/category.types';

type AdminView = 'dashboard' | 'products' | 'product-form' | 'enhanced-product-form' | 'brands' | 'brand-form' | 'categories' | 'category-form';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  // const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentView('product-form');
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setCurrentView('enhanced-product-form');
  };

  // const handleCreateEnhancedProduct = () => {
  //   setEditingProduct(null);
  //   setCurrentView('enhanced-product-form');
  // };

  const handleProductFormCancel = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleEnhancedProductFormCancel = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleProductFormSuccess = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleEnhancedProductFormSuccess = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  // Brand handlers - commented out for future use
  /*
  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setCurrentView('brand-form');
  };

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setCurrentView('brand-form');
  };

  const handleBrandFormCancel = () => {
    setEditingBrand(null);
    setCurrentView('brands');
  };

  const handleBrandFormSuccess = () => {
    setEditingBrand(null);
    setCurrentView('brands');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCurrentView('category-form');
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCurrentView('category-form');
  };

  const handleCategoryFormCancel = () => {
    setEditingCategory(null);
    setCurrentView('categories');
  };

  const handleCategoryFormSuccess = () => {
    setEditingCategory(null);
    setCurrentView('categories');
  };
  */

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
    { id: 'products', label: 'Quản lý sản phẩm', icon: Package },
    { id: 'brands', label: 'Thương hiệu', icon: Tag },
    { id: 'categories', label: 'Danh mục', icon: Layers },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                             (currentView === 'product-form' && item.id === 'products') ||
                             (currentView === 'enhanced-product-form' && item.id === 'products') ||
                             (currentView === 'brand-form' && item.id === 'brands') ||
                             (currentView === 'category-form' && item.id === 'categories');
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'products') {
                      setCurrentView('products');
                    } else if (item.id === 'dashboard') {
                      setCurrentView('dashboard');
                    } else if (item.id === 'brands') {
                      setCurrentView('brands');
                    } else if (item.id === 'categories') {
                      setCurrentView('categories');
                    }
                    // Handle other menu items later
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Logout */}
          <div className="mt-auto pt-6 px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {currentView === 'dashboard' && 'Tổng quan'}
                {currentView === 'enhanced-product-form' && 'Thêm sản phẩm mới'}
                {currentView === 'products' && 'Quản lý sản phẩm'}
                {currentView === 'product-form' && (editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm')}
                {currentView === 'brands' && 'Quản lý thương hiệu'}
                {currentView === 'brand-form' && 'Thêm/Sửa thương hiệu'}
                {currentView === 'categories' && 'Quản lý danh mục'}
                {currentView === 'category-form' && 'Thêm/Sửa danh mục'}
              </h1>
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
              
              <button 
                className="relative p-2 text-gray-400 hover:text-gray-600"
                title="Thông báo"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' && <DashboardContent />}
          {currentView === 'enhanced-product-form' && (
            <EnhancedProductForm
              product={editingProduct}
              onCancel={handleEnhancedProductFormCancel}
              onSuccess={handleEnhancedProductFormSuccess}
            />
          )}
          {currentView === 'products' && (
            <ProductListPage
              onEditProduct={handleEditProduct}
              onCreateProduct={handleCreateProduct}
            />
          )}
          {currentView === 'product-form' && (
            <ProductFormPage
              product={editingProduct}
              onCancel={handleProductFormCancel}
              onSuccess={handleProductFormSuccess}
            />
          )}
          {currentView === 'brands' && (
            <BrandListPage
              onEditBrand={() => {}}
              onCreateBrand={() => {}}
            />
          )}
          {currentView === 'categories' && (
            <CategoryListPage
              onEditCategory={() => {}}
              onCreateCategory={() => {}}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">₫1,234,567</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+12%</span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+8%</span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">567</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+23</span>
            <span className="text-sm text-gray-500 ml-1">sản phẩm mới</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">2,345</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+15%</span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Doanh thu theo tháng</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart3 className="w-16 h-16" />
            <span className="ml-2">Biểu đồ sẽ được hiển thị ở đây</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Đơn hàng gần đây</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Đơn hàng #{order}001</p>
                  <p className="text-xs text-gray-500">2 sản phẩm</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₫456,789</p>
                  <p className="text-xs text-green-600">Đã thanh toán</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
