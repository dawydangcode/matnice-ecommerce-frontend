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
  Layers,
  Eye,
  Palette,
  ChevronDown,
  ChevronRight,
  Archive
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { useProductStore } from '../stores/product.store';
import { useBrandStore } from '../stores/brand.store';
import { useCategoryStore } from '../stores/category.store';
import { useLensStore } from '../stores/lens.store';
import { useLensBrandStore } from '../stores/lensBrand.store';
import { useLensCategoryStore } from '../stores/lensCategory.store';
import ProductListPage from './admin/ProductListPage';
import ProductEditPage from './admin/ProductEditPage';
import EnhancedProductForm from '../components/admin/EnhancedProductForm';
import ColorSkinRecommendationPage from '../components/admin/ColorSkinRecommendationPage';
import BrandListPage from './admin/BrandListPage';
import CategoryListPage from './admin/CategoryListPage';
import LensListPage from './admin/LensListPage';
import LensBrandListPage from './admin/LensBrandListPage';
import LensCategoryListPage from './admin/LensCategoryListPage';
import LensManagementDashboard from './admin/LensManagementDashboard';
import LensThicknessPage from './admin/LensThicknessPage';
import BrandForm from '../components/admin/BrandForm';
import CategoryForm from '../components/admin/CategoryForm';
import LensForm from '../components/admin/LensForm';
import CreateLensPage from './admin/CreateLensPage';
import LensDetailPage from './admin/LensDetailPage';
import LensBrandForm from '../components/admin/LensBrandForm';
import LensCategoryForm from '../components/admin/LensCategoryForm';
import Product3DModelManagement from '../components/admin/Product3DModelManagement';
import OrderManagement from '../components/OrderManagement';
import StockManagementPage from './StockManagementPage';
import BestsellerManagement from './admin/BestsellerManagement';
import CustomerManagementPage from './admin/CustomerManagementPage';
import RechartsLineChart from '../components/charts/RechartsLineChart';
import TimeFilter, { TimeRange } from '../components/dashboard/TimeFilter';
import { useDashboardData } from '../hooks/useDashboardData';
import { Product } from '../types/product.types';
import { Brand } from '../types/brand.types';
import { Category } from '../types/category.types';
import { Lens } from '../types/lens.types';
import { LensBrand } from '../types/lensBrand.types';
import { LensCategory } from '../types/lensCategory.types';

type AdminView = 'dashboard' | 'products' | 'product-list' | 'product-detail' | 'product-edit' | 'product-3d-models' | 'color-skin-recommendation' | 'enhanced-product-form' | 'brands' | 'brand-form' | 'categories' | 'category-form' | 'lenses' | 'lens-management' | 'lens-form' | 'create-lens' | 'lens-detail' | 'lens-thickness' | 'lens-tints' | 'lens-brands' | 'lens-brand-form' | 'lens-categories' | 'lens-category-form' | 'orders' | 'stock' | 'stock-management' | 'homepage' | 'homepage-bestsellers' | 'customers';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { fetchProducts } = useProductStore();
  const { createBrand, updateBrand } = useBrandStore();
  const { createCategory, updateCategory } = useCategoryStore();
  const { createLens, updateLens } = useLensStore();
  const { createLensBrand, updateLensBrand } = useLensBrandStore();
  const { createLensCategory, updateLensCategory } = useLensCategoryStore();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['lenses', 'products']));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingLens, setEditingLens] = useState<Lens | null>(null);
  const [viewingLensId, setViewingLensId] = useState<number | null>(null);
  const [editingLensBrand, setEditingLensBrand] = useState<LensBrand | null>(null);
  const [editingLensCategory, setEditingLensCategory] = useState<LensCategory | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentView('product-edit');
  };

  const handleViewProductDetail = (product: Product) => {
    setViewingProduct(product);
    setCurrentView('product-detail');
  };

  const handleBackFromProductDetail = () => {
    setViewingProduct(null);
    setCurrentView('products');
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setCurrentView('enhanced-product-form');
  };

  // const handleCreateEnhancedProduct = () => {
  //   setEditingProduct(null);
  //   setCurrentView('enhanced-product-form');
  // };

  const handleProductEditCancel = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleProductEditSuccess = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleEnhancedProductFormCancel = () => {
    setEditingProduct(null);
    setCurrentView('products');
  };

  const handleEnhancedProductFormSuccess = async () => {
    console.log('=== handleEnhancedProductFormSuccess called ===');
    console.log('Product created successfully by EnhancedProductForm');
    
    setEditingProduct(null);
    setCurrentView('products');
    
    // Refresh products list to show the new product
    try {
      console.log('Refreshing products list...');
      await fetchProducts();
      console.log('Products list refreshed successfully');
    } catch (error) {
      console.error('Error refreshing products list:', error);
    }
  };

  // Brand handlers
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

  const handleBrandFormSubmit = async (data: any) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, data);
      } else {
        await createBrand(data);
      }
      setEditingBrand(null);
      setCurrentView('brands');
    } catch (error) {
      console.error('Error submitting brand form:', error);
      throw error;
    }
  };

  // Category handlers
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

  const handleCategoryFormSubmit = async (data: any) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
      setEditingCategory(null);
      setCurrentView('categories');
    } catch (error) {
      console.error('Error submitting category form:', error);
      throw error;
    }
  };

  // Lens handlers
  const handleEditLens = (lens: Lens) => {
    setEditingLens(lens);
    setCurrentView('lens-form');
  };

  const handleCreateLens = () => {
    setEditingLens(null);
    setCurrentView('create-lens');
  };

  const handleViewLensDetail = (lensId: number) => {
    setViewingLensId(lensId);
    setCurrentView('lens-detail');
  };

  const handleLensFormCancel = () => {
    setEditingLens(null);
    setCurrentView('lens-management');
  };

  const handleLensDetailBack = () => {
    setViewingLensId(null);
    setCurrentView('lens-management');
  };

  const handleLensFormSubmit = async (data: any) => {
    try {
      if (editingLens) {
        await updateLens(editingLens.id, data);
      } else {
        await createLens(data);
      }
      setEditingLens(null);
      setCurrentView('lens-management');
    } catch (error) {
      console.error('Error submitting lens form:', error);
      throw error;
    }
  };

  // Lens Brand handlers
  const handleEditLensBrand = (lensBrand: LensBrand) => {
    setEditingLensBrand(lensBrand);
    setCurrentView('lens-brand-form');
  };

  const handleCreateLensBrand = () => {
    setEditingLensBrand(null);
    setCurrentView('lens-brand-form');
  };

  const handleLensBrandFormCancel = () => {
    setEditingLensBrand(null);
    setCurrentView('lens-brands');
  };

  const handleLensBrandFormSubmit = async (data: any) => {
    try {
      if (editingLensBrand) {
        await updateLensBrand(editingLensBrand.id, data);
      } else {
        await createLensBrand(data);
      }
      setEditingLensBrand(null);
      setCurrentView('lens-brands');
    } catch (error) {
      console.error('Error submitting lens brand form:', error);
      throw error;
    }
  };

  // Lens Category handlers
  const handleEditLensCategory = (lensCategory: LensCategory) => {
    setEditingLensCategory(lensCategory);
    setCurrentView('lens-category-form');
  };

  const handleCreateLensCategory = () => {
    setEditingLensCategory(null);
    setCurrentView('lens-category-form');
  };

  const handleLensCategoryFormCancel = () => {
    setEditingLensCategory(null);
    setCurrentView('lens-categories');
  };

  const handleLensCategoryFormSubmit = async (data: any) => {
    try {
      if (editingLensCategory) {
        await updateLensCategory(editingLensCategory.id, data);
      } else {
        await createLensCategory(data);
      }
      setEditingLensCategory(null);
      setCurrentView('lens-categories');
    } catch (error) {
      console.error('Error submitting lens category form:', error);
      throw error;
    }
  };

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
    { 
      id: 'products', 
      label: 'Quản lý sản phẩm', 
      icon: Package,
      children: [
        { id: 'product-list', label: 'Danh sách sản phẩm', icon: Package },
        { id: 'product-3d-models', label: '3D Models', icon: Eye },
        { id: 'color-skin-recommendation', label: 'Color Skin Recommendation', icon: Palette },
      ]
    },
    { 
      id: 'homepage', 
      label: 'Quản lý Homepage', 
      icon: BarChart3,
      children: [
        { id: 'homepage-bestsellers', label: 'Bestseller Products', icon: TrendingUp },
      ]
    },
    { id: 'brands', label: 'Thương hiệu', icon: Tag },
    { id: 'categories', label: 'Danh mục', icon: Layers },
    // Lens Management (simplified)
    { 
      id: 'lenses', 
      label: 'Quản lý Lens', 
      icon: Eye,
      children: [
        { id: 'lens-management', label: 'Quản lý Loại Lens', icon: Eye },
        { id: 'lens-thickness', label: 'Lens Thickness', icon: Layers },
        { id: 'lens-tints', label: 'Tints', icon: Palette },
        { id: 'lens-brands', label: 'Lens Brand', icon: Tag },
        { id: 'lens-categories', label: 'Lens Category', icon: Layers },
      ]
    },
    // Other items
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    { id: 'stock', label: 'Quản lý tồn kho', icon: Archive },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#43AC78] to-[#64C695] shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus.has(item.id);
              
              // Check if current view matches this item or its children
              const isActive = currentView === item.id || 
                             (currentView === 'product-edit' && item.id === 'products') ||
                             (currentView === 'enhanced-product-form' && item.id === 'products') ||
                             (currentView === 'product-list' && item.id === 'products') ||
                             (currentView === 'product-3d-models' && item.id === 'products') ||
                             (currentView === 'color-skin-recommendation' && item.id === 'products') ||
                             (currentView === 'brand-form' && item.id === 'brands') ||
                             (currentView === 'category-form' && item.id === 'categories') ||
                             (currentView === 'lens-form' && item.id === 'lenses') ||
                             (currentView === 'create-lens' && item.id === 'lenses') ||
                             (currentView === 'lens-brand-form' && item.id === 'lenses') ||
                             (currentView === 'lens-category-form' && item.id === 'lenses');
              
              const isChildActive = hasChildren && item.children?.some(child => 
                currentView === child.id || 
                (currentView === 'product-edit' && child.id === 'product-list') ||
                (currentView === 'enhanced-product-form' && child.id === 'product-list') ||
                (currentView === 'homepage-bestsellers' && child.id === 'homepage-bestsellers')
              );
              
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleMenu(item.id);
                      } else {
                        if (item.id === 'dashboard') {
                          setCurrentView('dashboard');
                        } else if (item.id === 'brands') {
                          setCurrentView('brands');
                        } else if (item.id === 'categories') {
                          setCurrentView('categories');
                        } else if (item.id === 'orders') {
                          setCurrentView('orders');
                        } else if (item.id === 'stock') {
                          setCurrentView('stock-management');
                        } else if (item.id === 'customers') {
                          setCurrentView('customers');
                        }
                        // Handle other menu items later
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      isActive || isChildActive
                        ? 'text-white bg-[#66D6A2] shadow-md'
                        : 'text-white hover:bg-[#93E9BE] hover:bg-opacity-30'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </div>
                    {hasChildren && (
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </button>
                  
                  {/* Children menu items */}
                  {hasChildren && isExpanded && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildItemActive = currentView === child.id ||
                                                (currentView === 'product-edit' && child.id === 'product-list') ||
                                                (currentView === 'enhanced-product-form' && child.id === 'product-list') ||
                                                (currentView === 'lens-brand-form' && child.id === 'lens-brands') ||
                                                (currentView === 'lens-category-form' && child.id === 'lens-categories');
                        
                        return (
                          <button
                            key={child.id}
                            onClick={() => {
                              if (child.id === 'product-list') {
                                setCurrentView('product-list');
                              } else if (child.id === 'product-3d-models') {
                                setCurrentView('product-3d-models');
                              } else if (child.id === 'color-skin-recommendation') {
                                setCurrentView('color-skin-recommendation');
                              } else if (child.id === 'homepage-bestsellers') {
                                setCurrentView('homepage-bestsellers');
                              } else if (child.id === 'lens-management') {
                                setCurrentView('lens-management');
                              } else if (child.id === 'lens-brands') {
                                setCurrentView('lens-brands');
                              } else if (child.id === 'lens-categories') {
                                setCurrentView('lens-categories');
                              } else if (child.id === 'lens-thickness') {
                                setCurrentView('lens-thickness');
                              } else if (child.id === 'lens-tints') {
                                setCurrentView('lens-tints');
                              } else if (child.id === 'stock-management') {
                                setCurrentView('stock-management');
                              }
                            }}
                            className={`w-full flex items-center px-4 py-2 rounded-lg transition text-sm ${
                              isChildItemActive
                                ? 'text-white bg-[#A8EDCB] shadow-md border border-[#93E9BE]'
                                : 'text-white hover:bg-[#93E9BE] hover:bg-opacity-40'
                            }`}
                          >
                            <ChildIcon className="w-4 h-4 mr-3" />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Logout */}
          <div className="mt-auto pt-6 px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-300 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-200 rounded-lg transition"
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
        <header className="bg-gradient-to-r from-[#64C695] to-[#66D6A2] shadow-sm border-b border-[#93E9BE]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                {currentView === 'dashboard' && 'Tổng quan'}
                {currentView === 'enhanced-product-form' && 'Thêm sản phẩm mới'}
                {currentView === 'products' && 'Quản lý sản phẩm'}
                {currentView === 'product-list' && 'Danh sách sản phẩm'}
                {currentView === 'product-3d-models' && 'Quản lý 3D Models'}
                {currentView === 'color-skin-recommendation' && 'Color Skin Recommendation'}
                {currentView === 'product-edit' && 'Chỉnh sửa sản phẩm'}
                {currentView === 'homepage-bestsellers' && 'Quản lý Bestseller Products'}
                {currentView === 'brands' && 'Quản lý thương hiệu'}
                {currentView === 'brand-form' && 'Thêm/Sửa thương hiệu'}
                {currentView === 'categories' && 'Quản lý danh mục'}
                {currentView === 'category-form' && 'Thêm/Sửa danh mục'}
                {currentView === 'lenses' && 'Quản lý Lens'}
                {currentView === 'lens-management' && 'Quản lý Lens'}
                {currentView === 'lens-form' && 'Thêm/Sửa Lens'}
                {currentView === 'create-lens' && 'Tạo Lens Mới'}
                {currentView === 'lens-thickness' && 'Lens Thickness Management'}
                {currentView === 'lens-tints' && 'Lens Tints & Colors Management'}
                {currentView === 'orders' && 'Quản lý đơn hàng'}
                {currentView === 'stock-management' && 'Quản lý tồn kho'}
                {currentView === 'customers' && 'Quản lý khách hàng'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#43AC78] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-[#93E9BE] rounded-lg focus:ring-2 focus:ring-[#66D6A2] focus:border-[#43AC78] bg-white/90 backdrop-blur-sm"
                />
              </div>
              
              <button 
                className="relative p-2 text-white hover:text-[#A8EDCB] transition-colors"
                title="Thông báo"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white drop-shadow-sm">{user?.username}</p>
                  <p className="text-xs text-white/80">Administrator</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-[#43AC78] to-[#A8EDCB] rounded-full flex items-center justify-center ring-2 ring-white/30 shadow-md">
                  <span className="text-sm font-medium text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-50 to-[#A8EDCB]/10">
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
              onViewProductDetail={handleViewProductDetail}
            />
          )}
          {currentView === 'product-list' && (
            <ProductListPage
              onEditProduct={handleEditProduct}
              onCreateProduct={handleCreateProduct}
              onViewProductDetail={handleViewProductDetail}
            />
          )}
          {currentView === 'product-detail' && viewingProduct && (
            <div className="p-4 bg-yellow-100 rounded">
              <h3>Product Detail - Coming Soon</h3>
              <p>Product ID: {viewingProduct.productId}</p>
              <button onClick={handleBackFromProductDetail} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Back
              </button>
            </div>
          )}
          {currentView === 'product-3d-models' && <Product3DModelManagement />}
          {currentView === 'color-skin-recommendation' && <ColorSkinRecommendationPage />}
          {currentView === 'product-edit' && editingProduct && (
            <ProductEditPage
              product={editingProduct}
              onBack={handleProductEditCancel}
              onSuccess={handleProductEditSuccess}
            />
          )}
          {currentView === 'brands' && (
            <BrandListPage
              onEditBrand={handleEditBrand}
              onCreateBrand={handleCreateBrand}
            />
          )}
          {currentView === 'brand-form' && (
            <BrandForm
              brand={editingBrand}
              onSubmit={handleBrandFormSubmit}
              onCancel={handleBrandFormCancel}
            />
          )}
          {currentView === 'categories' && (
            <CategoryListPage
              onEditCategory={handleEditCategory}
              onCreateCategory={handleCreateCategory}
            />
          )}
          {currentView === 'category-form' && (
            <CategoryForm
              category={editingCategory}
              onSubmit={handleCategoryFormSubmit}
              onCancel={handleCategoryFormCancel}
            />
          )}
          {currentView === 'lens-management' && (
            <LensManagementDashboard 
              onCreateLens={handleCreateLens} 
              onViewLensDetail={handleViewLensDetail}
            />
          )}
          {currentView === 'lens-brands' && (
            <LensBrandListPage 
              onEditLensBrand={handleEditLensBrand}
              onCreateLensBrand={handleCreateLensBrand}
            />
          )}
          {currentView === 'lens-brand-form' && (
            <LensBrandForm
              lensBrand={editingLensBrand}
              onSubmit={handleLensBrandFormSubmit}
              onCancel={handleLensBrandFormCancel}
            />
          )}
          {currentView === 'lens-categories' && (
            <LensCategoryListPage 
              onEditLensCategory={handleEditLensCategory}
              onCreateLensCategory={handleCreateLensCategory}
            />
          )}
          {currentView === 'lens-category-form' && (
            <LensCategoryForm
              lensCategory={editingLensCategory}
              onSubmit={handleLensCategoryFormSubmit}
              onCancel={handleLensCategoryFormCancel}
            />
          )}
          {currentView === 'lenses' && (
            <LensListPage
              onEditLens={handleEditLens}
              onCreateLens={handleCreateLens}
            />
          )}
          {currentView === 'lens-form' && (
            <LensForm
              lens={editingLens}
              onSubmit={handleLensFormSubmit}
              onCancel={handleLensFormCancel}
            />
          )}
          {currentView === 'create-lens' && (
            <CreateLensPage onCancel={() => setCurrentView('lens-management')} />
          )}
          {currentView === 'lens-detail' && viewingLensId && (
            <LensDetailPage 
              lensId={viewingLensId} 
              onBack={handleLensDetailBack}
            />
          )}
          {currentView === 'lens-thickness' && <LensThicknessPage />}
          {currentView === 'lens-tints' && <div className="p-4 bg-yellow-100 rounded">Lens Tints Page - Coming Soon</div>}
          {currentView === 'homepage-bestsellers' && <BestsellerManagement />}
          {currentView === 'orders' && <OrderManagement />}
          {currentView === 'stock-management' && <StockManagementPage />}
          {currentView === 'customers' && <CustomerManagementPage />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('monthly');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders'>('orders');
  const { stats, recentOrders, monthlyRevenue, topProducts, loading, error, refetch } = useDashboardData(selectedTimeRange);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-[#93E9BE]/20 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => setSelectedMetric('revenue')}
          className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-all text-left ${
            selectedMetric === 'revenue' 
              ? 'border-[#43AC78] shadow-lg ring-2 ring-[#43AC78]/20' 
              : 'border-[#93E9BE]/20 hover:shadow-md hover:border-[#43AC78]/50'
          }`}
        >
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-[#43AC78] to-[#64C695] rounded-lg shadow-sm">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.revenue ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue.total) : '₫0'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className={`w-4 h-4 ${(stats?.revenue?.growth ?? 0) >= 0 ? 'text-[#43AC78]' : 'text-red-500'}`} />
            <span className={`text-sm ml-1 font-medium ${(stats?.revenue?.growth ?? 0) >= 0 ? 'text-[#43AC78]' : 'text-red-500'}`}>
              {(stats?.revenue?.growth ?? 0) >= 0 ? '+' : ''}{stats?.revenue?.growth ?? 0}%
            </span>
            <span className="text-sm text-gray-500 ml-1">{stats?.revenue?.period || 'so với tháng trước'}</span>
          </div>
        </button>

        <button 
          onClick={() => setSelectedMetric('orders')}
          className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-all text-left ${
            selectedMetric === 'orders' 
              ? 'border-[#43AC78] shadow-lg ring-2 ring-[#43AC78]/20' 
              : 'border-[#93E9BE]/20 hover:shadow-md hover:border-[#43AC78]/50'
          }`}
        >
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-[#64C695] to-[#66D6A2] rounded-lg shadow-sm">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.orders ? new Intl.NumberFormat('vi-VN').format(stats.orders.total) : '0'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className={`w-4 h-4 ${(stats?.orders?.growth ?? 0) >= 0 ? 'text-[#43AC78]' : 'text-red-500'}`} />
            <span className={`text-sm ml-1 font-medium ${(stats?.orders?.growth ?? 0) >= 0 ? 'text-[#43AC78]' : 'text-red-500'}`}>
              {(stats?.orders?.growth ?? 0) >= 0 ? '+' : ''}{stats?.orders?.growth ?? 0}%
            </span>
            <span className="text-sm text-gray-500 ml-1">{stats?.orders?.period || 'so với tháng trước'}</span>
          </div>
        </button>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#93E9BE]/20 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-[#66D6A2] to-[#93E9BE] rounded-lg shadow-sm">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.products ? new Intl.NumberFormat('vi-VN').format(stats.products.total) : '0'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-[#43AC78]" />
            <span className="text-sm text-[#43AC78] ml-1 font-medium">+{stats?.products?.newProducts || 0}</span>
            <span className="text-sm text-gray-500 ml-1">{stats?.products?.period || 'sản phẩm mới'}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#93E9BE]/20 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-[#93E9BE] to-[#A8EDCB] rounded-lg shadow-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.customers ? new Intl.NumberFormat('vi-VN').format(stats.customers.total) : '0'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className={`w-4 h-4 ${(stats?.customers?.growth ?? 0) >= 0 ? 'text-[#43AC78]' : 'text-red-500'}`} />
            <span className={`text-sm ml-1 font-medium ${(stats?.customers?.growth ?? 0) >= 0 ? 'text-[#43AC78]' : 'text-red-500'}`}>
              {(stats?.customers?.growth ?? 0) >= 0 ? '+' : ''}{stats?.customers?.growth ?? 0}%
            </span>
            <span className="text-sm text-gray-500 ml-1">{stats?.customers?.period || 'so với tháng trước'}</span>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="space-y-6">
        {/* Revenue Chart and Top Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Revenue Chart - 3/4 width */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border border-[#93E9BE]/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedMetric === 'orders' ? 'Số đơn hàng' : 'Doanh thu'} theo {selectedTimeRange === 'monthly' ? 'ngày' : selectedTimeRange === 'weekly' ? 'tuần' : 'tháng'}
              </h3>
              <TimeFilter 
                selectedTimeRange={selectedTimeRange}
                onTimeRangeChange={setSelectedTimeRange}
              />
            </div>
            <RechartsLineChart data={monthlyRevenue} loading={loading} metric={selectedMetric} />
          </div>

          {/* Top Sellers - 1/4 width */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-[#93E9BE]/20 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Seller Products</h3>
            <div className="space-y-3 h-80 overflow-y-auto">
              {topProducts?.length > 0 ? (
                <>
                  {/* Actual products */}
                  {topProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-[#A8EDCB]/20 to-[#93E9BE]/20 rounded-lg border border-[#93E9BE]/30 hover:shadow-sm transition-all">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#43AC78] to-[#64C695] rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-900">{product.soldQuantity}</p>
                        <p className="text-xs text-[#43AC78] font-medium">
                          {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND',
                            maximumFractionDigits: 0
                          }).format(product.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Fill remaining slots with placeholders */}
                  {Array.from({ length: Math.max(0, 8 - topProducts.length) }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200/50">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs mr-2">
                          {topProducts.length + index + 1}
                        </div>
                        <div>
                          <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                          <div className="h-2 bg-gray-100 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-3 bg-gray-200 rounded w-8 mb-1"></div>
                        <div className="h-2 bg-gray-100 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {/* No data state with placeholders */}
                  <div className="text-center py-4 text-gray-500">
                    <Package className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">Chưa có dữ liệu</p>
                  </div>
                  {/* Fill with empty placeholders */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`empty-placeholder-${index}`} className="flex items-center justify-between p-3 bg-gray-50/30 rounded-lg border border-gray-200/30">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 font-bold text-xs mr-2">
                          {index + 1}
                        </div>
                        <div>
                          <div className="h-3 bg-gray-100 rounded w-16 mb-1"></div>
                          <div className="h-2 bg-gray-50 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-3 bg-gray-100 rounded w-8 mb-1"></div>
                        <div className="h-2 bg-gray-50 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders - Full Width */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#93E9BE]/20 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Đơn hàng gần đây</h3>
          {recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{order.itemCount} sản phẩm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.customerName || 'Khách vãng lai'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'delivered' ? 'Đã giao hàng' :
                           order.status === 'shipped' ? 'Đã gửi hàng' :
                           order.status === 'processing' ? 'Đang xử lý' :
                           order.status === 'pending' ? 'Chờ xử lý' :
                           order.status === 'cancelled' ? 'Đã hủy' :
                           order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          order.paymentStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          order.paymentStatus === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                          order.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.paymentStatus === 'completed' ? 'Đã thanh toán' :
                           order.paymentStatus === 'processing' ? 'Đang xử lý' :
                           order.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                           order.paymentStatus === 'failed' ? 'Thất bại' :
                           order.paymentStatus === 'cancelled' ? 'Đã hủy' :
                           order.paymentStatus === 'refunded' ? 'Đã hoàn tiền' :
                           order.paymentStatus || 'Chưa xác định'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
