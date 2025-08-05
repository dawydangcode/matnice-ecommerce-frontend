import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  X, 
  Upload, 
  Trash2
} from 'lucide-react';
import { useProductStore } from '../../stores/product.store';
import { Product, ProductType, ProductGenderType, CreateProductRequest } from '../../types/product.types';
import { productCategoryService } from '../../services/product-category.service';
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

const ProductFormPage: React.FC<ProductFormPageProps> = ({ product, onCancel, onSuccess }) => {
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

      onSuccess();
    } catch (error) {
      toast.error(product ? 'Cập nhật sản phẩm thất bại!' : 'Tạo sản phẩm thất bại!');
    } finally {
      setUploading(false);
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{product ? 'Cập nhật' : 'Tạo mới'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
