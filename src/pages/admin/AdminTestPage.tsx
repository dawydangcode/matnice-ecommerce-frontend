import React, { useState } from 'react';
import BrandManagementPage from './BrandManagementPage';
import CategoryManagementPage from './CategoryManagementPage';
import EnhancedProductForm from '../../components/admin/EnhancedProductForm';
import { useProductStore } from '../../stores/product.store';

const AdminTestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brands' | 'categories' | 'products'>('brands');
  const [showProductForm, setShowProductForm] = useState(false);
  
  const { currentProduct } = useProductStore();

  const handleProductFormSuccess = () => {
    setShowProductForm(false);
  };

  const renderContent = () => {
    if (showProductForm) {
      return (
        <EnhancedProductForm
          product={currentProduct}
          onCancel={() => setShowProductForm(false)}
          onSuccess={handleProductFormSuccess}
        />
      );
    }

    switch (activeTab) {
      case 'brands':
        return <BrandManagementPage />;
      case 'categories':
        return <CategoryManagementPage />;
      case 'products':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm sản phẩm
              </button>
            </div>
            <p className="text-gray-600">Product list would go here...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản trị hệ thống</h1>
          <p className="text-gray-600 mt-2">Test các form quản lý</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('brands');
                  setShowProductForm(false);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'brands' && !showProductForm
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Thương hiệu
              </button>
              <button
                onClick={() => {
                  setActiveTab('categories');
                  setShowProductForm(false);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories' && !showProductForm
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Danh mục
              </button>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setShowProductForm(false);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  (activeTab === 'products' && !showProductForm) || showProductForm
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sản phẩm
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminTestPage;
