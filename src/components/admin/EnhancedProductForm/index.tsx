import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBrandStore } from '../../../stores/brand.store';
import { useCategoryStore } from '../../../stores/category.store';
import { EnhancedProductFormProps, Tab } from './types';
import { useEnhancedProductForm } from './useEnhancedProductForm';
import { useFormSubmission } from './useFormSubmission';
import { BasicInfoTab, TechnicalDetailsTab, ColorsTab } from './tabs';
import { 
  Info,
  Settings,
  Palette,
  ChevronLeft,
  ChevronRight
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
    handleLensThicknessChange,
    handleProductColorsChange,
    handleStockChange,
  } = useEnhancedProductForm(product);

  const { register, handleSubmit, formState: { errors }, getValues } = form;

  // Validation functions for each tab
  const isBasicTabValid = () => {
    const data = getValues();
    const categoryIds = data.categoryIds || [];
    const hasFormErrors = errors.productName || errors.price || errors.productType || errors.gender || errors.brandId;
    
    return (
      !hasFormErrors &&
      data.productName?.trim() &&
      data.brandId &&
      data.productType &&
      data.gender &&
      data.price > 0 &&
      categoryIds.length > 0
    );
  };

  const isTechnicalTabValid = () => {
    return (
      productDetail.frameMaterial &&
      productDetail.frameShape &&
      productDetail.frameType &&
      productDetail.bridgeWidth > 0 &&
      productDetail.frameWidth > 0 &&
      productDetail.lensHeight > 0 &&
      productDetail.lensWidth > 0 &&
      productDetail.templeLength > 0
    );
  };

  const isColorsTabValid = () => {
    const validColors = productColors.filter(color => 
      color.colorName?.trim() && 
      color.productNumber?.trim() &&
      color.stock >= 0
    );
    const hasThumbnail = productColors.some(color => color.isThumbnail);
    return validColors.length > 0 && hasThumbnail;
  };

  // Track validation errors state
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Watch for form errors and update validation state
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setShowValidationErrors(true);
    } else {
      // Only hide validation errors if all custom validations are also valid
      const data = getValues();
      const categoryIds = data.categoryIds || [];
      const basicValid = (
        data.productName?.trim() &&
        data.brandId &&
        data.productType &&
        data.gender &&
        data.price > 0 &&
        categoryIds.length > 0
      );
      
      const technicalValid = (
        productDetail.frameMaterial &&
        productDetail.frameShape &&
        productDetail.frameType &&
        productDetail.bridgeWidth > 0 &&
        productDetail.frameWidth > 0 &&
        productDetail.lensHeight > 0 &&
        productDetail.lensWidth > 0 &&
        productDetail.templeLength > 0
      );
      
      const validColors = productColors.filter(color => 
        color.colorName?.trim() && 
        color.productNumber?.trim() &&
        color.stock >= 0
      );
      const hasThumbnail = productColors.some(color => color.isThumbnail);
      const colorsValid = validColors.length > 0 && hasThumbnail;
      
      if (basicValid && technicalValid && colorsValid) {
        setShowValidationErrors(false);
      }
    }
  }, [errors, productDetail, productColors, getValues]);

  // Navigation functions
  const goToNextTab = () => {
    if (activeTab === 'basic') {
      setActiveTab('detail');
    } else if (activeTab === 'detail') {
      setActiveTab('colors');
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === 'colors') {
      setActiveTab('detail');
    } else if (activeTab === 'detail') {
      setActiveTab('basic');
    }
  };

  // Enhanced form submission with validation error display
  const handleFormSubmit = async (data: any) => {
    console.log('=== ENHANCED FORM SUBMIT ===');
    
    // Check all validations
    const basicValid = isBasicTabValid();
    const technicalValid = isTechnicalTabValid();
    const colorsValid = isColorsTabValid();
    
    console.log('Validation results:', { basicValid, technicalValid, colorsValid });
    
    if (!basicValid || !technicalValid || !colorsValid) {
      setShowValidationErrors(true);
      
      // Navigate to first invalid tab
      if (!basicValid) {
        setActiveTab('basic');
        toast.error('Vui lòng hoàn thành thông tin cơ bản');
      } else if (!technicalValid) {
        setActiveTab('detail');
        toast.error('Vui lòng hoàn thành chi tiết kỹ thuật');
      } else if (!colorsValid) {
        setActiveTab('colors');
        toast.error('Vui lòng hoàn thành thông tin màu sắc');
      }
      return;
    }

    // If all valid, proceed with submission
    setShowValidationErrors(false);
    await onFormSubmit(data);
  };

  // Handle form validation errors (called when React Hook Form validation fails)
  const handleFormError = (errors: any) => {
    console.log('=== FORM VALIDATION ERRORS ===', errors);
    setShowValidationErrors(true);
    
    // Navigate to first tab with errors
    if (errors.productName || errors.price || errors.productType || errors.gender || errors.brandId) {
      setActiveTab('basic');
      toast.error('Vui lòng hoàn thành thông tin cơ bản');
    } else {
      // Check custom validations
      const basicValid = isBasicTabValid();
      const technicalValid = isTechnicalTabValid();
      const colorsValid = isColorsTabValid();
      
      if (!basicValid) {
        setActiveTab('basic');
        toast.error('Vui lòng hoàn thành thông tin cơ bản');
      } else if (!technicalValid) {
        setActiveTab('detail');
        toast.error('Vui lòng hoàn thành chi tiết kỹ thuật');
      } else if (!colorsValid) {
        setActiveTab('colors');
        toast.error('Vui lòng hoàn thành thông tin màu sắc');
      }
    }
  };

  useEffect(() => {
    // Load all brands for dropdown (no pagination limit)
    fetchBrands({ limit: 1000 }); // Large limit to get all brands
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  const onFormSubmit = async (data: any) => {
    // Extract thumbnail images from product colors
    const thumbnailImages: File[] = productColors
      .filter(color => color.isThumbnail)
      .flatMap(color => [color.images.a, color.images.b])
      .filter((img): img is File => img !== null);
    
    console.log('=== ENHANCED FORM SUBMIT DEBUG ===');
    console.log('productColors:', productColors);
    console.log('thumbnailImages:', thumbnailImages);
    console.log('productDetail:', productDetail);
    
    await submitForm(
      data,
      product,
      thumbnailImages,
      productColors,
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
            setValue={form.setValue}
            watch={form.watch}
            handleCategoryChange={handleCategoryChange}
            handleLensThicknessChange={handleLensThicknessChange}
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
            
            // Determine tab status for visual feedback
            const getTabStatus = () => {
              if (!showValidationErrors) {
                return 'normal';
              }
              
              switch (tab.id) {
                case 'basic':
                  return isBasicTabValid() ? 'valid' : 'invalid';
                case 'detail':
                  return isTechnicalTabValid() ? 'valid' : 'invalid';
                case 'colors':
                  return isColorsTabValid() ? 'valid' : 'invalid';
                default:
                  return 'normal';
              }
            };
            
            const tabStatus = getTabStatus();
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'basic' | 'detail' | 'colors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? tabStatus === 'invalid'
                      ? 'border-red-500 text-red-600'
                      : 'border-blue-500 text-blue-600'
                    : tabStatus === 'invalid'
                    ? 'border-transparent text-red-500 hover:text-red-700 hover:border-red-300'
                    : tabStatus === 'valid'
                    ? 'border-transparent text-green-600 hover:text-green-700 hover:border-green-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {/* Status indicators */}
                  {showValidationErrors && tabStatus === 'invalid' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  {showValidationErrors && tabStatus === 'valid' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="p-6">
        {renderTabContent()}

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={goToPreviousTab}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Trở về
              </button>
            )}
          </div>
          
          <div className="flex space-x-4">
            {activeTab !== 'colors' ? (
              <button
                type="button"
                onClick={goToNextTab}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Tiếp theo
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <>
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
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
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
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export { EnhancedProductForm };
export default EnhancedProductForm;
