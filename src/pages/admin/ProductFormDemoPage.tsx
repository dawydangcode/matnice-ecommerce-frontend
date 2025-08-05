import React, { useState } from 'react';
import EnhancedProductForm from '../../components/admin/EnhancedProductForm';
import { useProductStore } from '../../stores/product.store';

const ProductFormDemoPage: React.FC = () => {
  const [showForm, setShowForm] = useState(true);
  const { currentProduct } = useProductStore();

  const handleFormSuccess = () => {
    setShowForm(false);
    setTimeout(() => {
      setShowForm(true);
    }, 1000);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setTimeout(() => {
      setShowForm(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showForm ? (
        <div className="container mx-auto py-8">
          <EnhancedProductForm
            product={currentProduct}
            onCancel={handleFormCancel}
            onSuccess={handleFormSuccess}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lại form...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFormDemoPage;
