import React, { useEffect } from 'react';
import { Save } from 'lucide-react';
import { useBrandStore } from '../../../stores/brand.store';
import { useCategoryStore } from '../../../stores/category.store';
import { EnhancedProductFormProps, Tab } from './types';
import { useEnhancedProductForm } from './useEnhancedProductForm';
import { useFormSubmission } from './useFormSubmission';
import { BasicInfoTab, TechnicalDetailsTab, ColorsTab } from './tabs';
import { 
  Info,
  Settings,
  Palette
} from 'lucide-react';

const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({
  product,
  onSuccess,
  onCancel
}) => {
  const { brands, fetchBrands } = useBrandStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { submitForm, isLoading } = useFormSubmission();

  const {
    activeTab,
    setActiveTab,
    productColors,
    productDetail,
    submitting,
    setSubmitting,
    form,
    updateProductDetail,
    handleCategoryChange,
    handleProductColorsChange,
    handleStockChange,
  } = useEnhancedProductForm(product);

  const { register, handleSubmit, formState: { errors }, getValues } = form;

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  const onFormSubmit = async (data: any) => {
    await submitForm(
      data,
      product,
      [],
      [],
      productDetail,
      setSubmitting,
      onSuccess
    );
  };

  const tabs: Tab[] = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: Info },
    { id: 'detail', label: 'Chi tiết kỹ thuật', icon: Settings },
    { id: 'colors', label: 'Màu sắc', icon: Palette }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicInfoTab
            register={register}
            errors={errors}
            brands={brands}
            categories={categories}
            getValues={getValues}
            handleCategoryChange={handleCategoryChange}
          />
        );
      case 'detail':
        return (
          <TechnicalDetailsTab
            productDetail={productDetail}
            updateProductDetail={updateProductDetail}
          />
        );
      case 'colors':
        return (
          <ColorsTab
            productColors={productColors}
            onProductColorsChange={handleProductColorsChange}
            onStockChange={handleStockChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'basic' | 'detail' | 'colors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
        {renderTabContent()}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              console.log('=== ENHANCED FORM DEBUG ===');
              console.log('Form errors:', errors);
              console.log('Form data:', getValues());
              console.log('Product detail:', productDetail);
              console.log('Form is valid:', Object.keys(errors).length === 0);
              console.log('Network status:', navigator.onLine ? 'Online' : 'Offline');
              console.log('Current URL:', window.location.href);
              console.log('Auth token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Debug
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading || submitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {(isLoading || submitting) ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{submitting ? 'Đang tạo sản phẩm...' : 'Đang xử lý...'}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{product ? 'Cập nhật' : 'Tạo mới'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export { EnhancedProductForm };
export default EnhancedProductForm;
