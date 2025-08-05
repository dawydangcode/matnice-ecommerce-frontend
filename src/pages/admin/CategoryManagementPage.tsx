import React, { useState } from 'react';
import CategoryListPage from './CategoryListPage';
import CategoryForm from '../../components/admin/CategoryForm';
import { Category, CreateCategoryDto } from '../../types/category.types';
import { useCategoryStore } from '../../stores/category.store';

const CategoryManagementPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const { createCategory, updateCategory, isLoading } = useCategoryStore();

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSubmitForm = async (data: CreateCategoryDto) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error submitting category form:', error);
      throw error; // Re-throw để CategoryForm có thể handle
    }
  };

  return (
    <>
      <CategoryListPage 
        onCreateCategory={handleCreateCategory}
        onEditCategory={handleEditCategory}
      />
      
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default CategoryManagementPage;
