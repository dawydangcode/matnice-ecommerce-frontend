import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBrandStore } from '../../stores/brand.store';
import { useCategoryStore } from '../../stores/category.store';
import { 
  Product, 
  ProductType,
  ProductGenderType,
  FrameType,
  FrameShapeType,
  FrameMaterialType,
  CreateProductDetailRequest
} from '../../types/product.types';
import { Lens } from '../../types/lens.types';
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Eye,
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
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  productType: z.nativeEnum(ProductType),
  gender: z.nativeEnum(ProductGenderType),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  stock: z.number().min(0, 'Số lượng phải lớn hơn 0'),
  isSustainable: z.boolean()
});

type ProductFormData = z.infer<typeof productSchema>;

interface EnhancedProductFormProps {
  product?: Product | null;
  onSuccess: (data: any) => void;
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
    color: string;
    name: string;
    images: File[];
  }[]>([]);
  const [productDetail, setProductDetail] = useState<Partial<CreateProductDetailRequest>>({
    productNumber: '',
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
  const [lensOptions, setLensOptions] = useState<Partial<Lens>[]>([]);

  const { brands, fetchBrands } = useBrandStore();
  const { categories, fetchCategories } = useCategoryStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: product?.productName || '',
      description: product?.description || '',
      brandId: product?.brandId?.toString() || '',
      categoryId: product?.categoryId?.toString() || '',
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
      setValue('categoryId', product.categoryId?.toString() || '');
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
    setProductColors(prev => [...prev, { color: '#000000', name: '', images: [] }]);
  };

  const updateColor = (index: number, field: 'color' | 'name', value: string) => {
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

  // Handle lens options
  const addLensOption = () => {
    setLensOptions(prev => [...prev, { 
      name: '', 
      id: 0
    }]);
  };

  const updateLensOption = (index: number, field: keyof Lens, value: any) => {
    setLensOptions(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeLensOption = (index: number) => {
    setLensOptions(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onFormSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    
    // Basic product data
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });

    // Thumbnail images
    thumbnailImages.forEach((file, index) => {
      formData.append(`thumbnail_${index}`, file);
    });

    // Product colors and their images
    productColors.forEach((color, colorIndex) => {
      formData.append(`colors[${colorIndex}][color]`, color.color);
      formData.append(`colors[${colorIndex}][name]`, color.name);
      color.images.forEach((file, imageIndex) => {
        formData.append(`colors[${colorIndex}][images][${imageIndex}]`, file);
      });
    });

    // Product detail
    if (productDetail) {
      Object.entries(productDetail).forEach(([key, value]) => {
        formData.append(`detail[${key}]`, value?.toString() || '');
      });
    }

    // Lens options
    lensOptions.forEach((lens, index) => {
      Object.entries(lens).forEach(([key, value]) => {
        formData.append(`lens[${index}][${key}]`, value?.toString() || '');
      });
    });

    onSuccess(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: Info },
    { id: 'detail', label: 'Chi tiết kỹ thuật', icon: Settings },
    { id: 'images', label: 'Hình ảnh thumbnail', icon: ImageIcon },
    { id: 'colors', label: 'Màu sắc', icon: Palette },
    { id: 'lens', label: 'Tùy chọn lens', icon: Eye }
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
                <select
                  {...register('categoryId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
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
                  Mã sản phẩm
                </label>
                <input
                  type="text"
                  value={productDetail.productNumber || ''}
                  onChange={(e) => updateProductDetail('productNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: RB2140"
                />
              </div>

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã màu
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={color.color}
                        onChange={(e) => updateColor(colorIndex, 'color', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-md"
                        title="Chọn mã màu"
                        aria-label="Chọn mã màu"
                      />
                      <input
                        type="text"
                        value={color.color}
                        onChange={(e) => updateColor(colorIndex, 'color', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
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

        {/* Lens Options Tab */}
        {activeTab === 'lens' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Tùy chọn lens</h3>
              <button
                type="button"
                onClick={addLensOption}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm lens</span>
              </button>
            </div>

            {lensOptions.map((lens, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên lens
                  </label>
                  <input
                    type="text"
                    value={lens.name || ''}
                    onChange={(e) => updateLensOption(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên lens"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Lens
                  </label>
                  <input
                    type="number"
                    value={lens.id || 0}
                    onChange={(e) => updateLensOption(index, 'id', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeLensOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    title="Xóa lens này"
                    aria-label="Xóa lens này"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {lensOptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có tùy chọn lens nào. Nhấn "Thêm lens" để bắt đầu.
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>{product ? 'Cập nhật' : 'Tạo mới'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedProductForm;
