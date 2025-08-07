import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useBrandStore } from '../../stores/brand.store';
import { useCategoryStore } from '../../stores/category.store';
import { useProductStore } from '../../stores/product.store';
import { productCategoryService } from '../../services/product-category.service';
import { productColorService } from '../../services/product-color.service';
import { productDetailService } from '../../services/product-detail.service';
import { 
  Product, 
  ProductType,
  ProductGenderType,
  FrameType,
  FrameShapeType,
  FrameMaterialType,
  CreateProductDetailRequest
} from '../../types/product.types';
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Info,
  Settings,
  Trash2,
  Plus
} from 'lucide-react';

// Schema validation
const productSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  brandId: z.string().min(1, 'Thương hiệu là bắt buộc'),
  categoryIds: z.array(z.string()).min(1, 'Phải chọn ít nhất một danh mục'),
  productType: z.nativeEnum(ProductType),
  gender: z.nativeEnum(ProductGenderType),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  stock: z.number().min(0, 'Số lượng phải lớn hơn 0'),
  isSustainable: z.boolean()
});

type ProductFormData = z.infer<typeof productSchema>;

interface EnhancedProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({
  product,
  onSuccess,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [thumbnailImages, setThumbnailImages] = useState<File[]>([]);
  const [productColors, setProductColors] = useState<{
    name: string;
    images: File[];
  }[]>([]);
  const [productDetail, setProductDetail] = useState<Partial<CreateProductDetailRequest>>({
    bridgeWidth: 0,
    frameWidth: 0,
    lensHeight: 0,
    lensWidth: 0,
    templeLength: 0,
    frameColor: '',
    frameMaterial: FrameMaterialType.PLASTIC,
    frameShape: FrameShapeType.ROUND,
    frameType: FrameType.FULL_RIM,
    springHinge: false
  });
  const [submitting, setSubmitting] = useState(false);

  const { brands, fetchBrands } = useBrandStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { 
    createProduct, 
    updateProduct, 
    uploadImages, 
    isLoading 
  } = useProductStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: product?.productName || '',
      description: product?.description || '',
      brandId: product?.brandId?.toString() || '',
      categoryIds: product?.categoryId ? [product.categoryId.toString()] : [],
      productType: product?.productType || ProductType.GLASSES,
      gender: product?.gender || ProductGenderType.UNISEX,
      price: product?.price || 0,
      stock: product?.stock || 0,
      isSustainable: product?.isSustainable || false
    }
  });

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  // Initialize form data when editing
  useEffect(() => {
    if (product) {
      setValue('productName', product.productName);
      setValue('description', product.description || '');
      setValue('brandId', product.brandId?.toString() || '');
      setValue('categoryIds', product.categoryId ? [product.categoryId.toString()] : []);
      setValue('productType', product.productType);
      setValue('gender', product.gender);
      setValue('price', product.price);
      setValue('stock', product.stock);
      setValue('isSustainable', product.isSustainable);

      // Initialize other data would be loaded separately from API
      // Since the Product interface doesn't include colors, details, lens_options
      // These would need to be fetched separately in a real implementation
    }
  }, [product, setValue]);

  // Handle thumbnail image upload
  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setThumbnailImages(prev => [...prev, ...files]);
  };

  const removeThumbnailImage = (index: number) => {
    setThumbnailImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle color management
  const addColor = () => {
    setProductColors(prev => [...prev, { name: '', images: [] }]);
  };

  const updateColor = (index: number, field: 'name', value: string) => {
    setProductColors(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeColor = (index: number) => {
    setProductColors(prev => prev.filter((_, i) => i !== index));
  };

  const handleColorImageUpload = (colorIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProductColors(prev => prev.map((item, i) => 
      i === colorIndex ? { ...item, images: [...item.images, ...files] } : item
    ));
  };

  const removeColorImage = (colorIndex: number, imageIndex: number) => {
    setProductColors(prev => prev.map((item, i) => 
      i === colorIndex ? { 
        ...item, 
        images: item.images.filter((_, j) => j !== imageIndex) 
      } : item
    ));
  };

  // Handle product details
  const updateProductDetail = (field: keyof CreateProductDetailRequest, value: any) => {
    setProductDetail(prev => ({ ...prev, [field]: value }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentValues = getValues('categoryIds') || [];
    let newValues: string[];
    
    if (checked) {
      newValues = [...currentValues, categoryId];
    } else {
      newValues = currentValues.filter(id => id !== categoryId);
    }
    
    setValue('categoryIds', newValues, { shouldValidate: true });
  };

  // Form submission
  const onFormSubmit = async (data: ProductFormData) => {
    console.log('=== ENHANCED FORM SUBMIT STARTED ===');
    console.log('Form data:', data);
    console.log('Form errors:', errors);
    console.log('Form validation state:', Object.keys(errors).length === 0 ? 'VALID' : 'INVALID');
    console.log('Thumbnail images:', thumbnailImages);
    console.log('Product colors:', productColors);
    console.log('Product detail:', productDetail);
    console.log('onSuccess callback exists:', !!onSuccess);

    // Check if form has basic validation errors first
    if (Object.keys(errors).length > 0) {
      console.error('=== ENHANCED FORM VALIDATION FAILED ===');
      console.error('Validation errors:', errors);
      toast.error('Vui lòng sửa các lỗi trong form trước khi submit');
      return;
    }

    // Validate categories
    const categoryIds = data.categoryIds.map(id => parseInt(id));
    if (categoryIds.length === 0) {
      console.error('Validation failed: No categories selected');
      toast.error('Vui lòng chọn ít nhất một danh mục');
      return;
    }

    // Validate colors (at least one with name)
    const validColors = productColors.filter(color => color.name.trim() !== '');
    console.log('Valid colors:', validColors);
    if (validColors.length === 0) {
      console.error('Validation failed: No valid colors');
      toast.error('Vui lòng thêm ít nhất một màu sắc');
      return;
    }

    // Validate product details
    if (!productDetail.frameMaterial || !productDetail.frameShape || !productDetail.frameType) {
      console.error('Validation failed: Missing product details', {
        frameMaterial: productDetail.frameMaterial,
        frameShape: productDetail.frameShape,
        frameType: productDetail.frameType
      });
      toast.error('Vui lòng điền đầy đủ thông tin chi tiết sản phẩm');
      return;
    }

    try {
      setSubmitting(true);
      console.log('=== UPLOAD PHASE STARTED ===');

      let imageUrls: string[] = [];
      console.log('Initial image URLs:', imageUrls);

      // Upload thumbnail images if any
      if (thumbnailImages.length > 0) {
        console.log('Uploading thumbnail images:', thumbnailImages);
        try {
          const uploadedUrls = await uploadImages(thumbnailImages);
          console.log('Uploaded thumbnail URLs:', uploadedUrls);
          imageUrls = [...imageUrls, ...uploadedUrls];
        } catch (uploadError) {
          console.error('Thumbnail upload failed:', uploadError);
          toast.error('Lỗi khi upload hình ảnh thumbnail');
          return;
        }
      }

      console.log('Final image URLs:', imageUrls);

      // Create product data
      const productData = {
        productName: data.productName,
        price: data.price,
        stock: data.stock,
        productType: data.productType,
        gender: data.gender,
        categoryId: categoryIds[0], // Use first category as primary
        brandId: parseInt(data.brandId),
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
      if (categoryIds.length > 1 && productId) {
        console.log('=== UPDATING CATEGORIES PHASE ===');
        console.log('Updating categories for product:', productId, 'Categories:', categoryIds);
        try {
          await productCategoryService.updateProductCategories(productId, categoryIds);
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
          console.log(`Creating color ${index + 1}/${validColors.length}:`, colorData.name);
          try {
            const color = await productColorService.createProductColor(productId, {
              colorName: colorData.name.trim()
            });
            console.log('Color created:', color);
            
            // Create product detail for this color
            const detailData = {
              productId: productId,
              bridgeWidth: productDetail.bridgeWidth || 0,
              frameWidth: productDetail.frameWidth || 0,
              lensHeight: productDetail.lensHeight || 0,
              lensWidth: productDetail.lensWidth || 0,
              templeLength: productDetail.templeLength || 0,
              productNumber: 0, // EnhancedForm doesn't have productNumber field
              frameMaterial: productDetail.frameMaterial || '',
              frameShape: productDetail.frameShape || '',
              frameType: productDetail.frameType || '',
              bridgeDesign: '', // EnhancedForm doesn't have bridgeDesign field  
              style: '', // EnhancedForm doesn't have style field
              springHinges: productDetail.springHinge || false,
              weight: 0, // EnhancedForm doesn't have weight field
              multifocal: false, // EnhancedForm doesn't have multifocal field
            };
            
            console.log('Creating detail for product:', productId, 'Detail data:', detailData);
            
            const detail = await productDetailService.createProductDetail(detailData);
            console.log('Detail created:', detail);
            
          } catch (error) {
            console.error(`Error creating color ${colorData.name}:`, error);
            toast.error(`Có lỗi khi tạo màu ${colorData.name}`);
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
      
      console.log('=== ENHANCED FORM SUBMIT COMPLETED SUCCESSFULLY ===');
    } catch (error) {
      console.error('=== ENHANCED FORM SUBMIT FAILED ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      toast.error(product ? 'Cập nhật sản phẩm thất bại!' : 'Tạo sản phẩm thất bại!');
    } finally {
      setSubmitting(false);
      console.log('=== ENHANCED FORM SUBMIT FINISHED ===');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: Info },
    { id: 'detail', label: 'Chi tiết kỹ thuật', icon: Settings },
    { id: 'images', label: 'Hình ảnh thumbnail', icon: ImageIcon },
    { id: 'colors', label: 'Màu sắc', icon: Palette }
  ];

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
                onClick={() => setActiveTab(tab.id)}
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
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  {...register('productName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.productName && (
                  <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại sản phẩm *
                </label>
                <select
                  {...register('productType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProductType.GLASSES}>Kính mắt</option>
                  <option value={ProductType.SUNGLASSES}>Kính râm</option>
                </select>
                {errors.productType && (
                  <p className="mt-1 text-sm text-red-600">{errors.productType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính *
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProductGenderType.MALE}>Nam</option>
                  <option value={ProductGenderType.FEMALE}>Nữ</option>
                  <option value={ProductGenderType.UNISEX}>Unisex</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu *
                </label>
                <select
                  {...register('brandId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <p className="mt-1 text-sm text-red-600">{errors.brandId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục *
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                  {categories.map((category) => {
                    const selectedCategories = getValues('categoryIds') || [];
                    const isChecked = selectedCategories.includes(category.id.toString());
                    
                    return (
                      <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleCategoryChange(category.id.toString(), e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.categoryIds && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryIds.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng *
                </label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('isSustainable')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Sản phẩm bền vững
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả sản phẩm
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>
          </div>
        )}

        {/* Technical Details Tab */}
        {activeTab === 'detail' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Chi tiết kỹ thuật (không bao gồm màu sắc)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều rộng cầu mũi (mm)
                </label>
                <input
                  type="number"
                  value={productDetail.bridgeWidth || 0}
                  onChange={(e) => updateProductDetail('bridgeWidth', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="18"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều rộng gọng (mm)
                </label>
                <input
                  type="number"
                  value={productDetail.frameWidth || 0}
                  onChange={(e) => updateProductDetail('frameWidth', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều cao tròng (mm)
                </label>
                <input
                  type="number"
                  value={productDetail.lensHeight || 0}
                  onChange={(e) => updateProductDetail('lensHeight', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều rộng tròng (mm)
                </label>
                <input
                  type="number"
                  value={productDetail.lensWidth || 0}
                  onChange={(e) => updateProductDetail('lensWidth', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều dài càng (mm)
                </label>
                <input
                  type="number"
                  value={productDetail.templeLength || 0}
                  onChange={(e) => updateProductDetail('templeLength', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="140"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Màu gọng chính
                </label>
                <input
                  type="text"
                  value={productDetail.frameColor || ''}
                  onChange={(e) => updateProductDetail('frameColor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Đen, Nâu, Bạc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chất liệu gọng
                </label>
                <select
                  value={productDetail.frameMaterial || FrameMaterialType.PLASTIC}
                  onChange={(e) => updateProductDetail('frameMaterial', e.target.value as FrameMaterialType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Chọn chất liệu gọng"
                >
                  <option value={FrameMaterialType.PLASTIC}>Nhựa</option>
                  <option value={FrameMaterialType.METAL}>Kim loại</option>
                  <option value={FrameMaterialType.TITAN}>Titan</option>
                  <option value={FrameMaterialType.WOOD}>Gỗ</option>
                  <option value={FrameMaterialType.CARBON}>Carbon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình dáng gọng
                </label>
                <select
                  value={productDetail.frameShape || FrameShapeType.ROUND}
                  onChange={(e) => updateProductDetail('frameShape', e.target.value as FrameShapeType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Chọn hình dáng gọng"
                >
                  <option value={FrameShapeType.ROUND}>Tròn</option>
                  <option value={FrameShapeType.SQUARE}>Vuông</option>
                  <option value={FrameShapeType.RECTANGLE}>Chữ nhật</option>
                  <option value={FrameShapeType.OVAL}>Oval</option>
                  <option value={FrameShapeType.AVIATOR}>Phi công</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại gọng
                </label>
                <select
                  value={productDetail.frameType || FrameType.FULL_RIM}
                  onChange={(e) => updateProductDetail('frameType', e.target.value as FrameType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Chọn loại gọng"
                >
                  <option value={FrameType.FULL_RIM}>Gọng đầy</option>
                  <option value={FrameType.HALF_RIM}>Gọng nửa</option>
                  <option value={FrameType.NO_RIM}>Không gọng</option>
                  <option value={FrameType.RIMLESS}>Rimless</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={productDetail.springHinge || false}
                onChange={(e) => updateProductDetail('springHinge', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                title="Có bản lề lò xo"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Có bản lề lò xo
              </label>
            </div>
          </div>
        )}

        {/* Thumbnail Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Hình ảnh thumbnail</h3>
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Tải lên hình ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {thumbnailImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeThumbnailImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa hình ảnh này"
                    aria-label="Xóa hình ảnh này"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {thumbnailImages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có hình ảnh thumbnail nào. Nhấn "Tải lên hình ảnh" để bắt đầu.
              </div>
            )}
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Màu sắc sản phẩm</h3>
              <button
                type="button"
                onClick={addColor}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm màu</span>
              </button>
            </div>

            {productColors.map((color, colorIndex) => (
              <div key={colorIndex} className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên màu
                    </label>
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColor(colorIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên màu"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeColor(colorIndex)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      title="Xóa màu này"
                      aria-label="Xóa màu này"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Hình ảnh cho màu này
                    </label>
                    <label className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer text-sm">
                      <Upload className="h-3 w-3" />
                      <span>Tải lên</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleColorImageUpload(colorIndex, e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {color.images.map((file, imageIndex) => (
                      <div key={imageIndex} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`${color.name} ${imageIndex + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeColorImage(colorIndex, imageIndex)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa hình ảnh này"
                          aria-label="Xóa hình ảnh này"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {productColors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có màu sắc nào. Nhấn "Thêm màu" để bắt đầu.
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              console.log('=== ENHANCED FORM DEBUG ===');
              console.log('Form errors:', errors);
              console.log('Form data:', getValues());
              console.log('Thumbnail images:', thumbnailImages);
              console.log('Product colors:', productColors);
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

export default EnhancedProductForm;
