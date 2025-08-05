import React, { useState } from 'react';
import BrandListPage from './BrandListPage';
import BrandForm from '../../components/admin/BrandForm';
import { Brand, CreateBrandDto } from '../../types/brand.types';
import { useBrandStore } from '../../stores/brand.store';

const BrandManagementPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  const { createBrand, updateBrand, isLoading } = useBrandStore();

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  const handleSubmitForm = async (data: CreateBrandDto) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, data);
      } else {
        await createBrand(data);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error submitting brand form:', error);
      throw error; // Re-throw để BrandForm có thể handle
    }
  };

  return (
    <>
      <BrandListPage 
        onCreateBrand={handleCreateBrand}
        onEditBrand={handleEditBrand}
      />
      
      {showForm && (
        <BrandForm
          brand={editingBrand}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default BrandManagementPage;
