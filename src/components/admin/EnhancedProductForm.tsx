import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  X, 
  Upload, 
  Trash2,
  Package,
  Settings,
  Info
} from 'lucide-react';
import { useProductStore } from '../../stores/product.store';
import { 
  Product, 
  ProductType, 
  ProductGenderType, 
  CreateProductRequest,
  FrameType,
  FrameShapeType,
  FrameMaterialType,
  CreateProductDetailRequest
} from '../../types/product.types';
import { productCategoryService } from '../../services/product-category.service';
import toast from 'react-hot-toast';

interface EnhancedProductFormProps {
  product?: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}

type FormData = {
  // Basic Product Info
  productName: string;
  productType: ProductType;
  gender: ProductGenderType;
  brandId: number;
  price: number;
  stock: number;
  description?: string;
  isSustainable: boolean;
  
  // Product Detail
  bridgeWidth: number;
  frameWidth: number;
  lensHeight: number;
  lensWidth: number;
  templeLength: number;
  frameColor: string;
  frameMaterial: FrameMaterialType;
  frameShape: FrameShapeType;
  frameType: FrameType;
  springHinge: boolean;
};

const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({ 
  product, 
  onCancel, 
  onSuccess 
}) => {
  const {
    categories: rawCategories,
    brands: rawBrands,
    isLoading,
    createProduct,
    updateProduct,
    uploadImages,
    fetchCategories,
    fetchBrands,
  } = useProductStore();

  // Ensure we always have arrays
  const categories = useMemo(() => Array.isArray(rawCategories) ? rawCategories : [], [rawCategories]);
  const brands = useMemo(() => Array.isArray(rawBrands) ? rawBrands : [], [rawBrands]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'detail' | 'images'>('basic');
  
  // Brand search states
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      isSustainable: false,
      springHinge: false,
      productType: ProductType.GLASSES,
      gender: ProductGenderType.MALE,
      frameMaterial: FrameMaterialType.PLASTIC,
      frameShape: FrameShapeType.ROUND,
      frameType: FrameType.FULL_RIM
    }
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    console.log('EnhancedProductForm - Categories:', categories);
    console.log('EnhancedProductForm - Brands:', brands);
    console.log('EnhancedProductForm - isLoading:', isLoading);
  }, [categories, brands, isLoading]);

  useEffect(() => {
    if (product) {
      const categoryIds = product.categories?.map(cat => cat.id) || (product.category ? [product.category.id] : []);
      
      reset({
        productName: product.productName,
        price: product.price,
        stock: product.stock,
        productType: product.productType,
        gender: product.gender,
        brandId: product.brand?.id,
        description: product.description || '',
        isSustainable: product.isSustainable || false,
        // Add default values for product detail if editing
        bridgeWidth: 18,
        frameWidth: 135,
        lensHeight: 35,
        lensWidth: 50,
        templeLength: 140,
        frameColor: '',
        frameMaterial: FrameMaterialType.PLASTIC,
        frameShape: FrameShapeType.ROUND,
        frameType: FrameType.FULL_RIM,
        springHinge: false,
      });

      setSelectedCategoryIds(categoryIds);

      // Set brand search term when editing
      if (product.brand) {
        setSelectedBrandId(product.brand.id);
        setBrandSearchTerm(product.brand.name);
      }

      if (product.images) {
        setExistingImages(product.images.map(img => img.imageUrl));
      }
    } else {
      // Reset brand search when creating new product
      setBrandSearchTerm('');
      setSelectedBrandId(undefined);
      setShowBrandDropdown(false);
    }
  }, [product, reset]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} không phải là file hình ảnh`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`${file.name} quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Brand search logic
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm) return brands;
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
  }, [brands, brandSearchTerm]);

  const handleBrandSelect = (brand: { id: number; name: string }) => {
    setSelectedBrandId(brand.id);
    setBrandSearchTerm(brand.name);
    setShowBrandDropdown(false);
    
    // Update form value using react-hook-form setValue
    setValue('brandId', brand.id);
  };

  const handleBrandInputChange = (value: string) => {
    setBrandSearchTerm(value);
    setShowBrandDropdown(true);
    
    // If input is empty, clear the selected brand
    if (!value) {
      setSelectedBrandId(undefined);
      setValue('brandId', '' as any); // Clear form value
      return;
    }
    
    // Reset selected brand if the input doesn't match exactly
    const exactMatch = brands.find(brand => brand.name.toLowerCase() === value.toLowerCase());
    if (exactMatch) {
      setSelectedBrandId(exactMatch.id);
      setValue('brandId', exactMatch.id);
    } else {
      setSelectedBrandId(undefined);
      setValue('brandId', '' as any); // Clear form value if no match
    }
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviewUrls(prev => {
        // Clean up object URL
        if (prev[index]) {
          URL.revokeObjectURL(prev[index]);
        }
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    // Validate categories
    if (selectedCategoryIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một danh mục');
      return;
    }

    try {
      setUploading(true);

      let imageUrls: string[] = [...existingImages];

      // Upload new images if any
      if (selectedImages.length > 0) {
        const uploadedUrls = await uploadImages(selectedImages);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      // Prepare product detail data
      const productDetail: CreateProductDetailRequest = {
        productNumber: data.productName.toUpperCase().replace(/\s+/g, '-'), // Auto-generate from product name
        bridgeWidth: data.bridgeWidth,
        frameWidth: data.frameWidth,
        lensHeight: data.lensHeight,
        lensWidth: data.lensWidth,
        templeLength: data.templeLength,
        frameColor: data.frameColor,
        frameMaterial: data.frameMaterial,
        frameShape: data.frameShape,
        frameType: data.frameType,
        springHinge: data.springHinge,
      };

      const productData: CreateProductRequest = {
        productName: data.productName,
        price: data.price,
        stock: data.stock,
        productType: data.productType,
        gender: data.gender,
        categoryId: selectedCategoryIds[0], // Primary category
        brandId: data.brandId,
        description: data.description || undefined,
        isSustainable: data.isSustainable,
        imageUrls,
        productDetail,
      };

      let productId: number;

      if (product) {
        await updateProduct(product.productId, productData);
        productId = product.productId;
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        const createdProduct = await createProduct(productData);
        productId = createdProduct?.productId || 0;
        toast.success('Tạo sản phẩm thành công!');
      }

      // Update product categories if we have multiple categories
      if (selectedCategoryIds.length > 1 && productId) {
        try {
          await productCategoryService.updateProductCategories(productId, selectedCategoryIds);
          toast.success('Cập nhật danh mục sản phẩm thành công!');
        } catch (error) {
          console.error('Error updating product categories:', error);
          toast.error('Có lỗi khi cập nhật danh mục sản phẩm');
        }
      }

      // Reset form states
      setBrandSearchTerm('');
      setSelectedBrandId(undefined);
      setShowBrandDropdown(false);
      setSelectedCategoryIds([]);
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setExistingImages([]);

      onSuccess();
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error(product ? 'Cập nhật sản phẩm thất bại!' : 'Tạo sản phẩm thất bại!');
    } finally {
      setUploading(false);
    }
  };

  // Show loading if data is still being fetched
  if (isLoading && (categories.length === 0 || brands.length === 0)) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const priceValue = watch('price');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-gray-600 mt-1">
            Nhập thông tin chi tiết của gọng kính/sunglasses
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
        >
          <X className="w-5 h-5" />
          <span>Đóng</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>Thông tin cơ bản</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('detail')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'detail'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Chi tiết kỹ thuật</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'images'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Hình ảnh</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    {...register('productName', {
                      required: 'Tên sản phẩm là bắt buộc',
                      minLength: {
                        value: 3,
                        message: 'Tên sản phẩm phải có ít nhất 3 ký tự'
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.productName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tên sản phẩm..."
                  />
                  {errors.productName && (
                    <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
                  )}
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại sản phẩm *
                  </label>
                  <select
                    {...register('productType', { required: 'Loại sản phẩm là bắt buộc' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={ProductType.GLASSES}>Kính mắt</option>
                    <option value={ProductType.SUNGLASSES}>Kính râm</option>
                  </select>
                  {errors.productType && (
                    <p className="mt-1 text-sm text-red-600">{errors.productType.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value={ProductGenderType.MALE}
                        {...register('gender', { required: 'Giới tính là bắt buộc' })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Nam</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value={ProductGenderType.FEMALE}
                        {...register('gender', { required: 'Giới tính là bắt buộc' })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Nữ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value={ProductGenderType.UNISEX}
                        {...register('gender', { required: 'Giới tính là bắt buộc' })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Unisex</span>
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                {/* Brand */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thương hiệu *
                  </label>
                  
                  {/* Hidden input for react-hook-form */}
                  <input
                    type="hidden"
                    id="brandId"
                    {...register('brandId', { 
                      required: 'Thương hiệu là bắt buộc',
                      valueAsNumber: true
                    })}
                  />
                  
                  {/* Search input */}
                  <input
                    type="text"
                    value={brandSearchTerm}
                    onChange={(e) => handleBrandInputChange(e.target.value)}
                    onFocus={() => setShowBrandDropdown(true)}
                    onBlur={() => {
                      // Delay hiding dropdown to allow click on options
                      setTimeout(() => setShowBrandDropdown(false), 200);
                    }}
                    placeholder="Tìm kiếm thương hiệu..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {/* Dropdown */}
                  {showBrandDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand) => (
                          <button
                            key={brand.id}
                            type="button"
                            onClick={() => handleBrandSelect(brand)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {brand.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          Không tìm thấy thương hiệu nào
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Show selected brand */}
                  {selectedBrandId && !brandSearchTerm && (
                    <div className="mt-1 text-sm text-green-600">
                      Đã chọn: {brands.find(b => b.id === selectedBrandId)?.name}
                    </div>
                  )}
                  
                  {errors.brandId && (
                    <p className="mt-1 text-sm text-red-600">{errors.brandId.message}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    {...register('price', {
                      required: 'Giá là bắt buộc',
                      min: {
                        value: 1000,
                        message: 'Giá phải lớn hơn 1.000 VNĐ'
                      },
                      valueAsNumber: true
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {priceValue && (
                    <p className="mt-1 text-sm text-gray-500">
                      Hiển thị: {formatCurrency(priceValue)}
                    </p>
                  )}
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho *
                  </label>
                  <input
                    type="number"
                    {...register('stock', {
                      required: 'Số lượng tồn kho là bắt buộc',
                      min: {
                        value: 0,
                        message: 'Số lượng tồn kho không được âm'
                      },
                      valueAsNumber: true
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.stock ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                  )}
                </div>

                {/* Categories */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục * (Chọn một hoặc nhiều)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="text-gray-500 text-sm">Không có danh mục nào</p>
                    ) : (
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedCategoryIds.includes(category.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategoryIds(prev => [...prev, category.id]);
                                } else {
                                  setSelectedCategoryIds(prev => prev.filter(id => id !== category.id));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedCategoryIds.length === 0 && (
                    <p className="mt-1 text-sm text-red-600">Ít nhất một danh mục là bắt buộc</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả sản phẩm..."
                  />
                </div>

                {/* Sustainable */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bền vững
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="true"
                        {...register('isSustainable', { 
                          setValueAs: (value) => value === 'true' 
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Có</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="false"
                        {...register('isSustainable', { 
                          setValueAs: (value) => value === 'true' 
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Không</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Basic Info Tab Navigation */}
          {activeTab === 'basic' && (
            <div className="flex justify-between items-center pt-6 border-t">
              <div></div> {/* Empty div for spacing */}
              <button
                type="button"
                onClick={() => setActiveTab('detail')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Tiếp theo</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Product Detail Tab */}
          {activeTab === 'detail' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết kỹ thuật</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bridge Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều rộng cầu mũi (mm) *
                  </label>
                  <input
                    type="number"
                    {...register('bridgeWidth', {
                      required: 'Chiều rộng cầu mũi là bắt buộc',
                      min: { value: 10, message: 'Tối thiểu 10mm' },
                      max: { value: 30, message: 'Tối đa 30mm' },
                      valueAsNumber: true
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.bridgeWidth ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="18"
                  />
                  {errors.bridgeWidth && (
                    <p className="mt-1 text-sm text-red-600">{errors.bridgeWidth.message}</p>
                  )}
                </div>

                {/* Frame Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều rộng khung (mm) *
                  </label>
                  <input
                    type="number"
                    {...register('frameWidth', {
                      required: 'Chiều rộng khung là bắt buộc',
                      min: { value: 100, message: 'Tối thiểu 100mm' },
                      max: { value: 150, message: 'Tối đa 150mm' },
                      valueAsNumber: true
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.frameWidth ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="135"
                  />
                  {errors.frameWidth && (
                    <p className="mt-1 text-sm text-red-600">{errors.frameWidth.message}</p>
                  )}
                </div>

                {/* Lens Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều cao thấu kính (mm) *
                  </label>
                  <input
                    type="number"
                    {...register('lensHeight', {
                      required: 'Chiều cao thấu kính là bắt buộc',
                      min: { value: 20, message: 'Tối thiểu 20mm' },
                      max: { value: 50, message: 'Tối đa 50mm' },
                      valueAsNumber: true
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lensHeight ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="35"
                  />
                  {errors.lensHeight && (
                    <p className="mt-1 text-sm text-red-600">{errors.lensHeight.message}</p>
                  )}
                </div>

                {/* Lens Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều rộng thấu kính (mm) *
                  </label>
                  <input
                    type="number"
                    {...register('lensWidth', {
                      required: 'Chiều rộng thấu kính là bắt buộc',
                      min: { value: 40, message: 'Tối thiểu 40mm' },
                      max: { value: 70, message: 'Tối đa 70mm' },
                      valueAsNumber: true
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lensWidth ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="50"
                  />
                  {errors.lensWidth && (
                    <p className="mt-1 text-sm text-red-600">{errors.lensWidth.message}</p>
                  )}
                </div>

                {/* Temple Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều dài càng kính (mm) *
                  </label>
                  <input
                    type="number"
                    {...register('templeLength', {
                      required: 'Chiều dài càng kính là bắt buộc',
                      min: { value: 120, message: 'Tối thiểu 120mm' },
                      max: { value: 150, message: 'Tối đa 150mm' },
                      valueAsNumber: true
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.templeLength ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="140"
                  />
                  {errors.templeLength && (
                    <p className="mt-1 text-sm text-red-600">{errors.templeLength.message}</p>
                  )}
                </div>

                {/* Frame Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc *
                  </label>
                  <input
                    type="text"
                    {...register('frameColor', {
                      required: 'Màu sắc là bắt buộc'
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.frameColor ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ví dụ: Đen, Nâu, Bạc"
                  />
                  {errors.frameColor && (
                    <p className="mt-1 text-sm text-red-600">{errors.frameColor.message}</p>
                  )}
                </div>

                {/* Frame Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chất liệu khung *
                  </label>
                  <select
                    {...register('frameMaterial', { required: 'Chất liệu khung là bắt buộc' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={FrameMaterialType.PLASTIC}>Nhựa</option>
                    <option value={FrameMaterialType.METAL}>Kim loại</option>
                    <option value={FrameMaterialType.TITAN}>Titan</option>
                    <option value={FrameMaterialType.WOOD}>Gỗ</option>
                    <option value={FrameMaterialType.CARBON}>Carbon</option>
                    <option value={FrameMaterialType.ALUMINIUM}>Nhôm</option>
                    <option value={FrameMaterialType.CELLULOSE}>Cellulose</option>
                    <option value={FrameMaterialType.LEATHER}>Da</option>
                  </select>
                  {errors.frameMaterial && (
                    <p className="mt-1 text-sm text-red-600">{errors.frameMaterial.message}</p>
                  )}
                </div>

                {/* Frame Shape */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình dáng khung *
                  </label>
                  <select
                    {...register('frameShape', { required: 'Hình dáng khung là bắt buộc' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={FrameShapeType.ROUND}>Tròn</option>
                    <option value={FrameShapeType.SQUARE}>Vuông</option>
                    <option value={FrameShapeType.RECTANGLE}>Chữ nhật</option>
                    <option value={FrameShapeType.BROWLINE}>Browline</option>
                    <option value={FrameShapeType.BUTTERFLY}>Butterfly/Mắt mèo</option>
                    <option value={FrameShapeType.AVIATOR}>Phi công</option>
                    <option value={FrameShapeType.NARROW}>Hẹp</option>
                    <option value={FrameShapeType.OVAL}>Oval</option>
                  </select>
                  {errors.frameShape && (
                    <p className="mt-1 text-sm text-red-600">{errors.frameShape.message}</p>
                  )}
                </div>

                {/* Frame Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại khung *
                  </label>
                  <select
                    {...register('frameType', { required: 'Loại khung là bắt buộc' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={FrameType.FULL_RIM}>Gọng đầy</option>
                    <option value={FrameType.HALF_RIM}>Gọng nửa</option>
                    <option value={FrameType.NO_RIM}>Không gọng</option>
                    <option value={FrameType.RIMLESS}>Rimless</option>
                  </select>
                  {errors.frameType && (
                    <p className="mt-1 text-sm text-red-600">{errors.frameType.message}</p>
                  )}
                </div>

                {/* Spring Hinge */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Càng lò xo
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('springHinge')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Có càng lò xo</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detail Tab Navigation */}
          {activeTab === 'detail' && (
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>←</span>
                <span>Trở lại</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Tiếp theo</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh sản phẩm</h3>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thêm hình ảnh
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Chọn files để upload
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Hình ảnh hiện tại</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa hình ảnh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Hình ảnh mới</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa hình ảnh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Tab Navigation */}
          {activeTab === 'images' && (
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                type="button"
                onClick={() => setActiveTab('detail')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>←</span>
                <span>Trở lại</span>
              </button>
              <div></div> {/* Empty div for spacing */}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-500">
            * Trường bắt buộc
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={uploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading || selectedCategoryIds.length === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{product ? 'Cập nhật' : 'Tạo mới'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EnhancedProductForm;
