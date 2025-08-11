import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Save,
  Tag,
  Palette,
  Settings,
  Upload,
  Trash2,
  X,
  Plus
} from 'lucide-react';
import { Product, ProductType, ProductGenderType, ProductDetail as ProductDetailType } from '../../types/product.types';
import { ProductImageModel } from '../../types/product-image.types';
import { ProductColor } from '../../services/product-color.service';
import { productColorService } from '../../services/product-color.service';
import { productColorImageService } from '../../services/product-color-image.service';
import { productDetailService } from '../../services/product-detail.service';
import { apiService } from '../../services/api.service';
import { Category } from '../../types/category.types';
import { Category as ProductCategory } from '../../types/product.types';
import { LensThickness, lensThicknessService } from '../../services/lens-thickness.service';
import { productThicknessCompatibilityService } from '../../services/product-thickness-compatibility.service';
import { useProductStore } from '../../stores/product.store';
import AddColorModal from '../../components/admin/AddColorModal';
import toast from 'react-hot-toast';

interface ProductEditPageProps {
  product: Product;
  onBack: () => void;
  onSuccess: () => void;
}

interface EditFormData {
  productName: string;
  price: number;
  description: string;
  isSustainable: boolean;
  isNew: boolean;
  isBoutique: boolean;
  productType: ProductType;
  gender: ProductGenderType;
  brandId: number;
}

const ProductEditPage: React.FC<ProductEditPageProps> = ({
  product,
  onBack,
  onSuccess
}) => {
  const {
    brands: rawBrands,
    updateProduct,
    fetchBrands,
  } = useProductStore();

  const [formData, setFormData] = useState<EditFormData>({
    productName: product.productName,
    price: product.price,
    description: product.description || '',
    isSustainable: product.isSustainable || false,
    isNew: product.isNew || false,
    isBoutique: product.isBoutique || false,
    productType: product.productType,
    gender: product.gender,
    brandId: product.brand?.id || 0,
  });

  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetailType | null>(null);
  const [editableProductDetail, setEditableProductDetail] = useState<ProductDetailType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [lensThicknessList, setLensThicknessList] = useState<LensThickness[]>([]);
  const [selectedLensThicknessIds, setSelectedLensThicknessIds] = useState<number[]>([]);
  const [colorImages, setColorImages] = useState<{ [colorId: number]: ProductImageModel[] }>({});
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingLensThickness, setIsLoadingLensThickness] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [isLoadingAllCategories, setIsLoadingAllCategories] = useState(false);
  const [addingCategoryId, setAddingCategoryId] = useState<number | null>(null);

  // New images to upload
  const [newImages, setNewImages] = useState<{ [colorId: number]: File[] }>({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState<{ [colorId: number]: string[] }>({});

  const brands = Array.isArray(rawBrands) ? rawBrands : [];

  const loadColorImages = useCallback(async (colorId: number) => {
    try {
      const images = await productColorImageService.getProductColorImages(product.productId, colorId);
      setColorImages(prev => ({
        ...prev,
        [colorId]: images
      }));
    } catch (error) {
      console.error(`Failed to load images for color ${colorId}:`, error);
    }
  }, [product.productId]);

  const loadProductColors = useCallback(async () => {
    try {
      setIsLoadingColors(true);
      const colors = await productColorService.getProductColors(product.productId);
      setProductColors(colors);
      
      // Load images for all colors
      for (const color of colors) {
        loadColorImages(color.id);
      }
      
      // Auto select first color
      if (colors.length > 0 && !selectedColorId) {
        const thumbnailColor = colors.find(color => color.isThumbnail);
        setSelectedColorId(thumbnailColor?.id || colors[0].id);
      }
    } catch (error) {
      console.error('Failed to load product colors:', error);
      toast.error('Không thể tải thông tin màu sắc');
    } finally {
      setIsLoadingColors(false);
    }
  }, [product.productId, loadColorImages, selectedColorId]);

  const loadProductDetail = useCallback(async () => {
    try {
      setIsLoadingDetail(true);
      if (product.productDetail) {
        const detail = product.productDetail as ProductDetailType;
        setProductDetail(detail);
        setEditableProductDetail(detail);
      } else {
        setProductDetail(null);
        setEditableProductDetail(null);
      }
    } catch (error) {
      console.error('Failed to load product detail:', error);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [product.productDetail]);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      
      // Load product categories (categories assigned to this product)
      if (product.categories && product.categories.length > 0) {
        // Convert ProductCategory to Category format
        const convertedCategories: Category[] = product.categories.map((cat: ProductCategory) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
          createdBy: 0, // Default value since ProductCategory doesn't have this
          updatedBy: 0, // Default value since ProductCategory doesn't have this
        }));
        setCategories(convertedCategories);
        setSelectedCategoryIds(product.categories.map(cat => cat.id));
      } else {
        try {
          const categoriesData = await apiService.get<Category[]>(`/api/v1/product-category/product/${product.productId}/categories/details`);
          setCategories(categoriesData);
          setSelectedCategoryIds(categoriesData.map((cat: Category) => cat.id));
        } catch (error) {
          console.error('Failed to load product categories:', error);
          setCategories([]);
          setSelectedCategoryIds([]);
        }
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [product.productId, product.categories]);

  const loadLensThickness = useCallback(async () => {
    try {
      setIsLoadingLensThickness(true);
      
      // Load all lens thickness
      const lensThickness = await lensThicknessService.getLensThicknessList();
      setLensThicknessList(lensThickness);
      
      // Load compatible lens thickness IDs for this product
      try {
        const compatibleThicknessIds = await productThicknessCompatibilityService.getCompatibleThicknessIds(product.productId);
        setSelectedLensThicknessIds(compatibleThicknessIds);
      } catch (error) {
        console.log('No existing lens thickness compatibility found, starting with empty selection');
        setSelectedLensThicknessIds([]);
      }
    } catch (error) {
      console.error('Failed to load lens thickness:', error);
      toast.error('Không thể tải danh sách độ dày lens');
    } finally {
      setIsLoadingLensThickness(false);
    }
  }, [product.productId]);

  const loadAllCategories = useCallback(async () => {
    try {
      setIsLoadingAllCategories(true);
      console.log('Loading all categories...');
      
      // Try different API endpoints that might work
      let data;
      try {
        // First try the category list endpoint
        data = await apiService.get<{ items?: Category[] } | Category[]>(
          '/api/v1/category/list',
          { page: 1, limit: 100 }
        );
        console.log('Categories API response:', data);
      } catch (error) {
        console.log('Category list failed, trying alternative endpoint');
        // If that fails, try without pagination
        data = await apiService.get<Category[]>('/api/v1/category/list');
        console.log('Categories alternative API response:', data);
      }
      
      // Handle different response formats
      let list: Category[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && typeof data === 'object') {
        // Check for common pagination formats
        if ('items' in data && Array.isArray(data.items)) {
          list = data.items;
        } else if ('data' in data && Array.isArray((data as any).data)) {
          list = (data as any).data;
        } else if ('categories' in data && Array.isArray((data as any).categories)) {
          list = (data as any).categories;
        }
      }
      
      console.log('Processed categories list:', list);
      setAllCategories(list);
    } catch (error) {
      console.error('Failed to load all categories:', error);
      toast.error('Không thể tải danh mục');
      setAllCategories([]);
    } finally {
      setIsLoadingAllCategories(false);
    }
  }, []);

  const handleAddCategory = useCallback(async (categoryId: number) => {
    try {
      setAddingCategoryId(categoryId);
      await apiService.post(`/api/v1/product-category/create`, { 
        productId: product.productId,
        categoryId: categoryId 
      });
      toast.success('Thêm danh mục thành công');
      await loadCategories();
      setShowCategoryModal(false);
    } catch (error: any) {
      console.error('Add category failed:', error);
      toast.error(error?.message || 'Thêm danh mục thất bại');
    } finally {
      setAddingCategoryId(null);
    }
  }, [product.productId, loadCategories]);

  const handleRemoveCategory = useCallback(async (categoryId: number) => {
    try {
      await apiService.delete(`/api/v1/product-category/product/${product.productId}/category/${categoryId}`);
      toast.success('Xóa danh mục thành công');
      await loadCategories();
    } catch (error: any) {
      console.error('Remove category failed:', error);
      toast.error(error?.message || 'Xóa danh mục thất bại');
    }
  }, [product.productId, loadCategories]);

  useEffect(() => {
    fetchBrands();
    loadProductColors();
    loadProductDetail();
    loadCategories();
    loadLensThickness();
  }, [fetchBrands, loadProductColors, loadProductDetail, loadCategories, loadLensThickness]);

  const handleFormChange = (field: keyof EditFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductDetailChange = (field: keyof ProductDetailType, value: any) => {
    setEditableProductDetail(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleImageSelect = (colorId: number, event: React.ChangeEvent<HTMLInputElement>) => {
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

    setNewImages(prev => ({
      ...prev,
      [colorId]: [...(prev[colorId] || []), ...validFiles]
    }));

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => ({
          ...prev,
          [colorId]: [...(prev[colorId] || []), e.target?.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (colorId: number, index: number) => {
    setNewImages(prev => ({
      ...prev,
      [colorId]: (prev[colorId] || []).filter((_, i) => i !== index)
    }));
    setImagePreviewUrls(prev => ({
      ...prev,
      [colorId]: (prev[colorId] || []).filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = async (colorId: number, image: ProductImageModel) => {
    try {
      // Call API to delete image - needs productId, colorId, and imageOrder
      if (image.imageOrder) {
        await productColorImageService.deleteProductColorImage(
          product.productId,
          colorId,
          image.imageOrder
        );
        
        // Reload images for this color
        await loadColorImages(colorId);
        toast.success('Xóa hình ảnh thành công');
      } else {
        toast.error('Không thể xóa hình ảnh: thiếu thông tin thứ tự');
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Không thể xóa hình ảnh');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Update basic product info
      await updateProduct(product.productId, {
        productName: formData.productName,
        price: formData.price,
        description: formData.description,
        isSustainable: formData.isSustainable,
        isNew: formData.isNew,
        isBoutique: formData.isBoutique,
        productType: formData.productType,
        gender: formData.gender,
        brandId: formData.brandId,
        categoryId: selectedCategoryIds[0] || 0,
        stock: product.stock,
        imageUrls: []
      });

      // Update categories if changed
      if (selectedCategoryIds.length > 0) {
        try {
          await apiService.put(`/api/v1/product-category/product/${product.productId}/categories`, {
            categoryIds: selectedCategoryIds
          });
          toast.success('Cập nhật danh mục thành công');
        } catch (error) {
          console.error('Failed to update categories:', error);
          toast.error('Có lỗi khi cập nhật danh mục');
        }
      }

      // Update product detail if changed
      if (editableProductDetail && product.productDetail?.id) {
        try {
          const updateData = {
            productId: editableProductDetail.productId,
            bridgeWidth: editableProductDetail.bridgeWidth,
            frameWidth: editableProductDetail.frameWidth,
            lensHeight: editableProductDetail.lensHeight,
            lensWidth: editableProductDetail.lensWidth,
            templeLength: editableProductDetail.templeLength,
            productNumber: typeof editableProductDetail.productNumber === 'string' 
              ? parseInt(editableProductDetail.productNumber) || 0 
              : editableProductDetail.productNumber || 0,
            frameMaterial: editableProductDetail.frameMaterial,
            frameShape: editableProductDetail.frameShape,
            frameType: editableProductDetail.frameType,
            bridgeDesign: editableProductDetail.bridgeDesign,
            style: editableProductDetail.style,
            springHinges: editableProductDetail.springHinges,
            weight: editableProductDetail.weight,
            multifocal: editableProductDetail.multifocal,
          };
          
          await productDetailService.updateProductDetail(product.productDetail.id, updateData);
          toast.success('Cập nhật thông số kỹ thuật thành công');
        } catch (error) {
          console.error('Failed to update product detail:', error);
          toast.error('Có lỗi khi cập nhật thông số kỹ thuật');
        }
      }

      // Update lens thickness compatibility
      if (selectedLensThicknessIds.length >= 0) {
        try {
          await productThicknessCompatibilityService.updateProductCompatibilities(
            product.productId,
            selectedLensThicknessIds
          );
          toast.success('Cập nhật độ dày lens thành công');
        } catch (error) {
          console.error('Failed to update lens thickness compatibility:', error);
          toast.error('Có lỗi khi cập nhật độ dày lens');
        }
      }

      // Upload new images for each color
      for (const [colorIdStr, files] of Object.entries(newImages)) {
        const colorId = parseInt(colorIdStr);
        if (files.length > 0) {
          try {
            // Upload images using productColorImageService
            for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
              const file = files[fileIndex];
              const imageOrder = ["a", "b", "c", "d", "e"][fileIndex] as "a" | "b" | "c" | "d" | "e";
              
              await productColorImageService.uploadProductColorImage({
                productId: product.productId,
                colorId: colorId,
                productNumber: `${product.productId}-${colorId}`,
                imageOrder: imageOrder,
                file: file
              });
            }
            toast.success(`Tải lên ${files.length} hình ảnh thành công`);
          } catch (error) {
            console.error(`Failed to upload images for color ${colorId}:`, error);
            toast.error(`Có lỗi khi tải lên hình ảnh cho màu ${colorId}`);
          }
        }
      }

      toast.success('Cập nhật sản phẩm thành công!');
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Có lỗi khi cập nhật sản phẩm');
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getProductTypeLabel = (type: ProductType) => {
    switch (type) {
      case ProductType.GLASSES: return 'Kính mắt';
      case ProductType.SUNGLASSES: return 'Kính râm';
      default: return type;
    }
  };

  const getGenderLabel = (gender: ProductGenderType) => {
    switch (gender) {
      case ProductGenderType.MALE: return 'Nam';
      case ProductGenderType.FEMALE: return 'Nữ';
      case ProductGenderType.UNISEX: return 'Unisex';
      default: return gender;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                Chỉnh sửa sản phẩm: {product.productName}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Basic Product Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
              <Tag className="w-5 h-5 mr-2" />
              Thông tin cơ bản
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleFormChange('productName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleFormChange('price', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại sản phẩm *
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => handleFormChange('productType', e.target.value as ProductType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProductType.GLASSES}>Kính mắt</option>
                  <option value={ProductType.SUNGLASSES}>Kính râm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleFormChange('gender', e.target.value as ProductGenderType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProductGenderType.MALE}>Nam</option>
                  <option value={ProductGenderType.FEMALE}>Nữ</option>
                  <option value={ProductGenderType.UNISEX}>Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu *
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => handleFormChange('brandId', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tổng tồn kho
                </label>
                <div className="text-sm text-gray-600 py-2">
                  {product.stock} sản phẩm
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả sản phẩm
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isSustainable}
                  onChange={(e) => handleFormChange('isSustainable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Sản phẩm bền vững</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => handleFormChange('isNew', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Sản phẩm mới</span>
              </label>

              {formData.isNew && product.newUntil && (
                <div className="ml-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Thông báo:</strong> Sản phẩm sẽ tự động hết hạn "mới" sau 30 ngày
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Ngày hết hạn: {new Date(product.newUntil).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isBoutique}
                  onChange={(e) => handleFormChange('isBoutique', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Sản phẩm boutique</span>
              </label>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Danh mục</h3>
              <button
                onClick={() => { 
                  console.log('Opening category modal...');
                  setShowCategoryModal(true); 
                  loadAllCategories(); 
                }}
                className="flex items-center space-x-2 text-sm px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm danh mục</span>
              </button>
            </div>
            
            {isLoadingCategories ? (
              <span className="text-gray-500 text-sm">Đang tải...</span>
            ) : (
              <div className="space-y-3">
                {/* Display current product categories */}
                <div className="flex flex-wrap gap-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div 
                        key={category.id} 
                        className="group relative px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <span>{category.name}</span>
                        <button
                          onClick={() => handleRemoveCategory(category.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
                          title="Xóa danh mục"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Chưa có danh mục nào</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  Tổng: {categories.length} danh mục
                </div>
              </div>
            )}
          </div>

          {/* Product Colors and Images */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center text-lg font-medium text-gray-900">
                <Palette className="w-5 h-5 mr-2" />
                Màu sắc và hình ảnh
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddColorModal(true);
                }}
                className="flex items-center space-x-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm màu</span>
              </button>
            </div>

            {isLoadingColors ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <span className="mt-2 text-gray-600">Đang tải màu sắc...</span>
              </div>
            ) : (
              <div className="space-y-6">
                    {/* Color Selection */}
                    <div className="flex flex-wrap gap-2">
                      {productColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColorId(color.id)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            selectedColorId === color.id
                              ? 'bg-blue-100 border-blue-500 text-blue-700'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium">{color.colorName}</div>
                            <div className="text-xs text-gray-500">
                              Mã: {color.productNumber} | {color.stock} sản phẩm
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>                {/* Images for Selected Color */}
                {selectedColorId && (
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Hình ảnh cho màu: {productColors.find(c => c.id === selectedColorId)?.colorName}
                    </h4>

                    {/* Upload New Images */}
                    <div className="mb-6">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Nhấp để tải lên</span> hình ảnh mới
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG hoặc JPEG (tối đa 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageSelect(selectedColorId, e)}
                        />
                      </label>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Existing Images */}
                      {(colorImages[selectedColorId] || []).map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.imageUrl}
                            alt="Product"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeExistingImage(selectedColorId, image)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            title="Xóa hình ảnh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* New Image Previews */}
                      {(imagePreviewUrls[selectedColorId] || []).map((url, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img
                            src={url}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-blue-300"
                          />
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Mới
                          </div>
                          <button
                            onClick={() => removeNewImage(selectedColorId, index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            title="Xóa hình ảnh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Upload Summary */}
                    {Object.values(newImages).some(files => files.length > 0) && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-800">
                          Tổng số hình ảnh mới sẽ tải lên: {Object.values(newImages).reduce((total, files) => total + files.length, 0)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          {editableProductDetail && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <Settings className="w-5 h-5 mr-2" />
                Thông số kỹ thuật
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Materials and Design */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chất liệu gọng *
                  </label>
                  <select
                    value={editableProductDetail.frameMaterial}
                    onChange={(e) => handleProductDetailChange('frameMaterial', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={editableProductDetail.frameShape}
                    onChange={(e) => handleProductDetailChange('frameShape', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={editableProductDetail.frameType}
                    onChange={(e) => handleProductDetailChange('frameType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={editableProductDetail.bridgeDesign || ''}
                    onChange={(e) => handleProductDetailChange('bridgeDesign', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả thiết kế cầu mũi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phong cách
                  </label>
                  <input
                    type="text"
                    value={editableProductDetail.style || ''}
                    onChange={(e) => handleProductDetailChange('style', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phong cách thiết kế"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trọng lượng (g) *
                  </label>
                  <input
                    type="number"
                    value={editableProductDetail.weight}
                    onChange={(e) => handleProductDetailChange('weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều rộng gọng (mm) *
                  </label>
                  <input
                    type="number"
                    value={editableProductDetail.frameWidth}
                    onChange={(e) => handleProductDetailChange('frameWidth', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều rộng mắt kính (mm) *
                  </label>
                  <input
                    type="number"
                    value={editableProductDetail.lensWidth}
                    onChange={(e) => handleProductDetailChange('lensWidth', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều cao mắt kính (mm) *
                  </label>
                  <input
                    type="number"
                    value={editableProductDetail.lensHeight}
                    onChange={(e) => handleProductDetailChange('lensHeight', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chiều rộng cầu mũi (mm) *
                  </label>
                  <input
                    type="number"
                    value={editableProductDetail.bridgeWidth}
                    onChange={(e) => handleProductDetailChange('bridgeWidth', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={editableProductDetail.templeLength}
                    onChange={(e) => handleProductDetailChange('templeLength', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Lens Thickness Section */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Độ dày lens</h4>
                {isLoadingLensThickness ? (
                  <div className="text-sm text-gray-500">Đang tải...</div>
                ) : (
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                    {lensThicknessList.length === 0 ? (
                      <div className="text-sm text-gray-500">Không có độ dày lens nào</div>
                    ) : (
                      lensThicknessList.map((lensThickness) => {
                        const isChecked = selectedLensThicknessIds.includes(lensThickness.id);
                        
                        return (
                          <label key={lensThickness.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLensThicknessIds(prev => [...prev, lensThickness.id]);
                                } else {
                                  setSelectedLensThicknessIds(prev => prev.filter(id => id !== lensThickness.id));
                                }
                              }}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {lensThickness.name} - Index {lensThickness.indexValue} - {lensThickness.price.toLocaleString('vi-VN')}đ
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Feature Checkboxes */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editableProductDetail.springHinges}
                      onChange={(e) => handleProductDetailChange('springHinges', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Bản lề lò xo</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editableProductDetail.multifocal}
                      onChange={(e) => handleProductDetailChange('multifocal', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Đa tiêu cự</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h4 className="font-semibold">Thêm danh mục cho sản phẩm</h4>
              <button 
                onClick={() => setShowCategoryModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {isLoadingAllCategories ? (
                <div className="text-sm text-gray-500">Đang tải danh mục...</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 mb-2">
                    Debug: Tổng danh mục: {allCategories.length}, Danh mục hiện tại: {categories.length}
                  </div>
                  {allCategories.length === 0 ? (
                    <div className="text-sm text-red-500">
                      Không tải được danh mục từ API. Kiểm tra console để xem lỗi.
                    </div>
                  ) : (
                    <>
                      {allCategories
                        .filter((c) => !categories.some(pc => pc.id === c.id))
                        .map((cat: Category) => (
                          <div key={cat.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium text-sm">{cat.name}</p>
                              {cat.description && <p className="text-xs text-gray-500">{cat.description}</p>}
                            </div>
                            <button
                              disabled={addingCategoryId === cat.id}
                              onClick={() => handleAddCategory(cat.id)}
                              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {addingCategoryId === cat.id ? 'Đang thêm...' : 'Thêm'}
                            </button>
                          </div>
                        ))}
                      {allCategories.filter((c) => !categories.some(pc => pc.id === c.id)).length === 0 && (
                        <div className="text-xs text-gray-500">Không còn danh mục nào để thêm.</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Color Modal */}
      <AddColorModal
        isOpen={showAddColorModal}
        onClose={() => setShowAddColorModal(false)}
        productId={product.productId}
        onSuccess={() => {
          loadProductColors();
        }}
      />
    </div>
  );
};

export default ProductEditPage;
