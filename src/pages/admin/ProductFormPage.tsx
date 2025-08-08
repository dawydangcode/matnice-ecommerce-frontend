import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  X, 
  Upload, 
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { useProductStore } from '../../stores/product.store';
import { Product, ProductType, ProductGenderType, CreateProductRequest } from '../../types/product.types';
import { productCategoryService } from '../../services/product-category.service';
import { productColorService } from '../../services/product-color.service';
import { productDetailService } from '../../services/product-detail.service';
import toast from 'react-hot-toast';

interface ProductFormPageProps {
  product?: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}

type FormData = {
  productName: string;
  price: number;
  stock: number;
  productType: string;
  gender: string;
  categoryIds: number[];
  brandId: number;
  description?: string;
  isSustainable?: boolean;
};

type ProductColorForm = {
  id?: number;
  colorName: string;
  isNew?: boolean;
};

type ProductDetailForm = {
  bridgeWidth: number;
  frameWidth: number;
  lensHeight: number;
  lensWidth: number;
  templeLength: number;
  productNumber?: number;
  frameMaterial: string;
  frameShape: string;
  frameType: string;
  bridgeDesign: string;
  style: string;
  springHinges: boolean;
  weight: number;
  multifocal: boolean;
};

const ProductFormPage: React.FC<ProductFormPageProps> = ({ product, onCancel, onSuccess }) => {
  console.log('=== ProductFormPage MOUNTED ===');
  console.log('Props:', { product, onCancel: !!onCancel, onSuccess: !!onSuccess });
  
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

  console.log('Store state:', { 
    rawCategories, 
    rawBrands, 
    isLoading,
    createProduct: !!createProduct,
    updateProduct: !!updateProduct,
    uploadImages: !!uploadImages
  });

  // Ensure we always have arrays
  const categories = useMemo(() => Array.isArray(rawCategories) ? rawCategories : [], [rawCategories]);
  const brands = useMemo(() => Array.isArray(rawBrands) ? rawBrands : [], [rawBrands]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [productColors, setProductColors] = useState<ProductColorForm[]>([
    { colorName: '', isNew: true }
  ]);
  const [productDetails, setProductDetails] = useState<ProductDetailForm>({
    bridgeWidth: 0,
    frameWidth: 0,
    lensHeight: 0,
    lensWidth: 0,
    templeLength: 0,
    productNumber: 0,
    frameMaterial: '',
    frameShape: '',
    frameType: '',
    bridgeDesign: '',
    style: '',
    springHinges: false,
    weight: 0,
    multifocal: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    console.log('Categories:', categories);
    console.log('Brands:', brands);
    console.log('isLoading:', isLoading);
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
        categoryIds: categoryIds,
        brandId: product.brand?.id,
        description: product.description || '',
        isSustainable: product.isSustainable || false,
      });

      setSelectedCategoryIds(categoryIds);

      if (product.images) {
        setExistingImages(product.images.map(img => img.imageUrl));
      }

      // Load product colors and details when editing
      loadProductColorsAndDetails(product.productId);
    }
  }, [product, reset]);

  const loadProductColorsAndDetails = async (productId: number) => {
    try {
      const colors = await productColorService.getProductColors(productId);
      if (colors.length > 0) {
        setProductColors(colors.map(color => ({ 
          id: color.id, 
          colorName: color.colorName, 
          isNew: false 
        })));
        
        // Load details for the product
        if (colors[0]) {
          try {
            // Note: New API requires productDetailId, but we don't have it during product editing
            // This needs to be handled differently - maybe store productDetailId in product data
            // const detail = await productDetailService.getProductDetail(productDetailId);
            // if (detail) {
            //   setProductDetails({
            //     bridgeWidth: detail.bridgeWidth,
            //     frameWidth: detail.frameWidth,
            //     lensHeight: detail.lensHeight,
            //     lensWidth: detail.lensWidth,
            //     templeLength: detail.templeLength,
            //     productNumber: detail.productNumber,
            //     frameMaterial: detail.frameMaterial,
            //     frameShape: detail.frameShape,
            //     frameType: detail.frameType,
            //     bridgeDesign: detail.bridgeDesign || '',
            //     style: detail.style || '',
            //     springHinges: detail.springHinges,
            //     weight: detail.weight,
            //     multifocal: detail.multifocal,
            //   });
            // }
          } catch (error) {
            console.error('Error loading product details:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading product colors:', error);
    }
  };

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

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addProductColor = () => {
    setProductColors(prev => [...prev, { colorName: '', isNew: true }]);
  };

  const removeProductColor = (index: number) => {
    if (productColors.length > 1) {
      setProductColors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateProductColor = (index: number, colorName: string) => {
    setProductColors(prev => 
      prev.map((color, i) => 
        i === index ? { ...color, colorName } : color
      )
    );
  };

  const updateProductDetail = (field: keyof ProductDetailForm, value: any) => {
    setProductDetails(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (data: FormData) => {
    console.log('=== SUBMIT STARTED ===');
    console.log('Form data:', data);
    console.log('Form errors:', errors);
    console.log('Form validation state:', Object.keys(errors).length === 0 ? 'VALID' : 'INVALID');
    console.log('Selected category IDs:', selectedCategoryIds);
    console.log('Product colors:', productColors);
    console.log('Product details:', productDetails);
    console.log('Selected images:', selectedImages);
    console.log('Existing images:', existingImages);
    console.log('onSuccess callback exists:', !!onSuccess);

    // Check if form has basic validation errors first
    if (Object.keys(errors).length > 0) {
      console.error('=== FORM VALIDATION FAILED ===');
      console.error('Validation errors:', errors);
      toast.error('Vui lòng sửa các lỗi trong form trước khi submit');
      return;
    }

    // Validate categories
    if (selectedCategoryIds.length === 0) {
      console.error('Validation failed: No categories selected');
      toast.error('Vui lòng chọn ít nhất một danh mục');
      return;
    }

    // Validate colors
    const validColors = productColors.filter(color => color.colorName.trim() !== '');
    console.log('Valid colors:', validColors);
    if (validColors.length === 0) {
      console.error('Validation failed: No valid colors');
      toast.error('Vui lòng thêm ít nhất một màu sắc');
      return;
    }

    // Validate product details
    if (!productDetails.frameMaterial || !productDetails.frameShape || !productDetails.frameType) {
      console.error('Validation failed: Missing product details', {
        frameMaterial: productDetails.frameMaterial,
        frameShape: productDetails.frameShape,
        frameType: productDetails.frameType
      });
      toast.error('Vui lòng điền đầy đủ thông tin chi tiết sản phẩm');
      return;
    }

    try {
      setUploading(true);
      console.log('=== UPLOAD PHASE STARTED ===');

      let imageUrls: string[] = [...existingImages];
      console.log('Initial image URLs:', imageUrls);

      // Upload new images if any
      if (selectedImages.length > 0) {
        console.log('Uploading images:', selectedImages);
        try {
          const uploadedUrls = await uploadImages(selectedImages);
          console.log('Uploaded image URLs:', uploadedUrls);
          imageUrls = [...imageUrls, ...uploadedUrls];
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast.error('Lỗi khi upload hình ảnh');
          return;
        }
      }

      console.log('Final image URLs:', imageUrls);

      const productData: CreateProductRequest = {
        productName: data.productName,
        price: data.price,
        stock: data.stock,
        productType: data.productType as ProductType,
        gender: data.gender as ProductGenderType,
        categoryId: selectedCategoryIds[0], // Sử dụng category đầu tiên làm primary
        brandId: data.brandId,
        description: data.description || undefined,
        isSustainable: data.isSustainable || false,
        imageUrls,
      };

      console.log('=== PRODUCT CREATION PHASE ===');
      console.log('Product data to be created:', productData);

      let productId: number;

      if (product) {
        console.log('Updating existing product:', product.productId);
        await updateProduct(product.productId, productData);
        productId = product.productId;
        console.log('Product updated successfully');
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        console.log('Creating new product...');
        try {
          const createdProduct = await createProduct(productData);
          console.log('Created product response:', createdProduct);
          productId = createdProduct?.productId || 0;
          console.log('New product ID:', productId);
          
          if (!productId) {
            throw new Error('Product ID not returned from createProduct');
          }
          
          toast.success('Tạo sản phẩm thành công!');
        } catch (createError) {
          console.error('Product creation failed:', createError);
          throw createError;
        }
      }

      // Update product categories if we have multiple categories
      if (selectedCategoryIds.length > 1 && productId) {
        console.log('=== UPDATING CATEGORIES PHASE ===');
        console.log('Updating categories for product:', productId, 'Categories:', selectedCategoryIds);
        try {
          await productCategoryService.updateProductCategories(productId, selectedCategoryIds);
          console.log('Categories updated successfully');
          toast.success('Cập nhật danh mục sản phẩm thành công!');
        } catch (error) {
          console.error('Error updating product categories:', error);
          toast.error('Có lỗi khi cập nhật danh mục sản phẩm');
        }
      }

      // Create product colors and details
      if (productId && !product) { // Only for new products
        console.log('=== CREATING COLORS AND DETAILS PHASE ===');
        console.log('Creating colors and details for product:', productId);
        
        for (let index = 0; index < validColors.length; index++) {
          const colorData = validColors[index];
          console.log(`Creating color ${index + 1}/${validColors.length}:`, colorData.colorName);
          try {
            const color = await productColorService.createProductColor(productId, {
              productId: productId,
              productVariantName: colorData.colorName.trim(),
              productNumber: `${productId}-${colorData.colorName.trim().toUpperCase()}`,
              colorName: colorData.colorName.trim(),
              stock: 0,
              isThumbnail: index === 0 // First color as thumbnail
            });
            console.log('Color created:', color);
            
            // Create product detail for this color
            const detailData = {
              productId: productId,
              bridgeWidth: productDetails.bridgeWidth,
              frameWidth: productDetails.frameWidth,
              lensHeight: productDetails.lensHeight,
              lensWidth: productDetails.lensWidth,
              templeLength: productDetails.templeLength,
              productNumber: productDetails.productNumber || 0,
              frameMaterial: productDetails.frameMaterial,
              frameShape: productDetails.frameShape,
              frameType: productDetails.frameType,
              bridgeDesign: productDetails.bridgeDesign || '',
              style: productDetails.style || '',
              springHinges: productDetails.springHinges,
              weight: productDetails.weight,
              multifocal: productDetails.multifocal,
            };
            
            console.log('Creating detail for product:', productId, 'Detail data:', detailData);
            
            const detail = await productDetailService.createProductDetail(detailData);
            console.log('Detail created:', detail);
            
          } catch (error) {
            console.error(`Error creating color ${colorData.colorName}:`, error);
            toast.error(`Có lỗi khi tạo màu ${colorData.colorName}`);
          }
        }
        console.log('Colors and details creation completed');
        toast.success('Tạo màu sắc và chi tiết sản phẩm thành công!');
      }

      console.log('=== CALLING onSuccess() ===');
      console.log('onSuccess function:', onSuccess);
      
      // Add a small delay to see all toasts before navigation
      setTimeout(() => {
        console.log('Executing onSuccess callback...');
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
          console.log('onSuccess callback executed');
        } else {
          console.error('onSuccess is not a function:', onSuccess);
        }
      }, 1000);
      
      console.log('=== SUBMIT COMPLETED SUCCESSFULLY ===');
    } catch (error) {
      console.error('=== SUBMIT FAILED ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      toast.error(product ? 'Cập nhật sản phẩm thất bại!' : 'Tạo sản phẩm thất bại!');
    } finally {
      setUploading(false);
      console.log('=== SUBMIT FINISHED ===');
    }
  };

  // Show loading if data is still being fetched
  if (isLoading && (categories.length === 0 || brands.length === 0)) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
        >
          <X className="w-5 h-5" />
          <span>Đóng</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  {...register('productName', { required: 'Tên sản phẩm là bắt buộc' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.productName && (
                  <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá *
                </label>
                <input
                  type="number"
                  {...register('price', { 
                    required: 'Giá là bắt buộc',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Giá phải lớn hơn 0' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng kho *
                </label>
                <input
                  type="number"
                  {...register('stock', { 
                    required: 'Số lượng kho là bắt buộc',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Kho không được âm' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
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
                  aria-label="Chọn loại sản phẩm"
                >
                  <option value="">Chọn loại sản phẩm</option>
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
                <select
                  {...register('gender', { required: 'Giới tính là bắt buộc' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn giới tính"
                >
                  <option value="">Chọn giới tính</option>
                  <option value={ProductGenderType.MALE}>Nam</option>
                  <option value={ProductGenderType.FEMALE}>Nữ</option>
                  <option value={ProductGenderType.UNISEX}>Unisex</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
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

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu *
                </label>
                <select
                  {...register('brandId', { 
                    required: 'Thương hiệu là bắt buộc',
                    valueAsNumber: true
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn thương hiệu"
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <p className="mt-1 text-sm text-red-600">{errors.brandId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin chi tiết</h3>
            
            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            {/* Sustainable */}
            <div className="mt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isSustainable')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">Sản phẩm thân thiện với môi trường</span>
              </label>
            </div>
          </div>

          {/* Product Colors */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Màu sắc sản phẩm</h3>
            
            <div className="space-y-3">
              {productColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={color.colorName}
                    onChange={(e) => updateProductColor(index, e.target.value)}
                    placeholder="Nhập tên màu"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {productColors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProductColor(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Xóa màu"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                  {index === productColors.length - 1 && (
                    <button
                      type="button"
                      onClick={addProductColor}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Thêm màu"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết sản phẩm</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều rộng cầu mũi (mm) *
                </label>
                <input
                  type="number"
                  value={productDetails.bridgeWidth}
                  onChange={(e) => updateProductDetail('bridgeWidth', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều rộng gọng (mm) *
                </label>
                <input
                  type="number"
                  value={productDetails.frameWidth}
                  onChange={(e) => updateProductDetail('frameWidth', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều cao tròng (mm) *
                </label>
                <input
                  type="number"
                  value={productDetails.lensHeight}
                  onChange={(e) => updateProductDetail('lensHeight', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều rộng tròng (mm) *
                </label>
                <input
                  type="number"
                  value={productDetails.lensWidth}
                  onChange={(e) => updateProductDetail('lensWidth', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều dài càng (mm) *
                </label>
                <input
                  type="number"
                  value={productDetails.templeLength}
                  onChange={(e) => updateProductDetail('templeLength', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trọng lượng (g) *
                </label>
                <input
                  type="number"
                  value={productDetails.weight}
                  onChange={(e) => updateProductDetail('weight', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Materials and Design */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chất liệu gọng *
                </label>
                <select
                  value={productDetails.frameMaterial}
                  onChange={(e) => updateProductDetail('frameMaterial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn chất liệu gọng"
                >
                  <option value="">Chọn chất liệu</option>
                  <option value="plastic">Nhựa</option>
                  <option value="metal">Kim loại</option>
                  <option value="titan">Titan</option>
                  <option value="wood">Gỗ</option>
                  <option value="carbon">Carbon</option>
                  <option value="aluminium">Nhôm</option>
                  <option value="cellulose">Cellulose</option>
                  <option value="leather">Da</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình dạng gọng *
                </label>
                <select
                  value={productDetails.frameShape}
                  onChange={(e) => updateProductDetail('frameShape', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn hình dạng gọng"
                >
                  <option value="">Chọn hình dạng</option>
                  <option value="round">Tròn</option>
                  <option value="square">Vuông</option>
                  <option value="rectangular">Chữ nhật</option>
                  <option value="cat-eye">Mắt mèo</option>
                  <option value="butterfly">Bướm</option>
                  <option value="aviator">Phi công</option>
                  <option value="narrow">Hẹp</option>
                  <option value="oval">Oval</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại gọng *
                </label>
                <select
                  value={productDetails.frameType}
                  onChange={(e) => updateProductDetail('frameType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn loại gọng"
                >
                  <option value="">Chọn loại gọng</option>
                  <option value="full-rim">Gọng full</option>
                  <option value="half-rim">Gọng nửa</option>
                  <option value="rimless">Không gọng</option>
                  <option value="browline">Browline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thiết kế cầu mũi
                </label>
                <input
                  type="text"
                  value={productDetails.bridgeDesign}
                  onChange={(e) => updateProductDetail('bridgeDesign', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả thiết kế cầu mũi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phong cách
                </label>
                <input
                  type="text"
                  value={productDetails.style}
                  onChange={(e) => updateProductDetail('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phong cách thiết kế"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số sản phẩm
                </label>
                <input
                  type="number"
                  value={productDetails.productNumber || ''}
                  onChange={(e) => updateProductDetail('productNumber', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mã số sản phẩm"
                />
              </div>
            </div>

            {/* Feature Checkboxes */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={productDetails.springHinges}
                    onChange={(e) => updateProductDetail('springHinges', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Bản lề lò xo</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={productDetails.multifocal}
                    onChange={(e) => updateProductDetail('multifocal', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Đa tiêu cự</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh sản phẩm</h3>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG hoặc JPEG (tối đa 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>

            {/* Image Previews */}
            {(existingImages.length > 0 || imagePreviewUrls.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing Images */}
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={url}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Xóa hình ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* New Image Previews */}
                {imagePreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Xóa hình ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              console.log('=== FORM VALIDATION TEST ===');
              console.log('Form errors:', errors);
              console.log('Selected categories:', selectedCategoryIds);
              console.log('Product colors:', productColors);
              console.log('Product details:', productDetails);
              console.log('Form is valid:', Object.keys(errors).length === 0);
              console.log('Network status:', navigator.onLine ? 'Online' : 'Offline');
              console.log('Current URL:', window.location.href);
              console.log('Auth token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Debug
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading || uploading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {(isLoading || uploading) ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{uploading ? 'Đang tạo sản phẩm...' : 'Đang xử lý...'}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{product ? 'Cập nhật' : 'Tạo mới'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
