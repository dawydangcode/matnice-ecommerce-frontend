import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Package,
  Edit,
  Calendar,
  Tag,
  Palette,
  Settings,
  X
} from 'lucide-react';
import { Product, ProductType, ProductGenderType, ProductDetail as ProductDetailType } from '../../types/product.types';
import { ProductColor } from '../../services/product-color.service';
import { ProductImageModel } from '../../types/product-image.types';
import { LensThickness, lensThicknessService } from '../../services/lens-thickness.service';
import { productThicknessCompatibilityService } from '../../services/product-thickness-compatibility.service';
import { productColorService } from '../../services/product-color.service';
import { productColorImageService } from '../../services/product-color-image.service';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api.service';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onEdit
}) => {
  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetailType | null>(null);
  const [colorImages, setColorImages] = useState<{ [colorId: number]: ProductImageModel[] }>({});
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ProductImageModel[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedLensThickness, setSelectedLensThickness] = useState<LensThickness[]>([]);

  const loadColorImages = useCallback(async (colorId: number) => {
    try {
      // Validation productId
      if (!product?.productId || isNaN(Number(product.productId))) {
        console.error('Invalid productId in loadColorImages:', product?.productId);
        return;
      }
      
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
      // Validation productId
      if (!product?.productId || isNaN(Number(product.productId))) {
        console.error('Invalid productId in loadProductColors:', product?.productId);
        return;
      }
      
      setIsLoadingColors(true);
      const colors = await productColorService.getProductColors(product.productId);
      setProductColors(colors);
      
      // Load images for all colors
      for (const color of colors) {
        loadColorImages(color.id);
      }
    } catch (error) {
      console.error('Failed to load product colors:', error);
      toast.error('Không thể tải thông tin màu sắc');
    } finally {
      setIsLoadingColors(false);
    }
  }, [product.productId, loadColorImages]);

  const loadProductDetail = useCallback(async () => {
    try {
      setIsLoadingDetail(true);
      // If product already has detail, use it
      if (product.productDetail) {
        setProductDetail(product.productDetail as ProductDetailType);
      } else {
        // Otherwise, we might need to fetch it by productId
        // For now, we'll set it to null if not available
        setProductDetail(null);
      }
    } catch (error) {
      console.error('Failed to load product detail:', error);
      // Don't show error toast as detail might not exist
    } finally {
      setIsLoadingDetail(false);
    }
  }, [product.productDetail]);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      // Use product.categories if available (from new API), otherwise load separately
      if (product.categories && product.categories.length > 0) {
        setCategories(product.categories);
      } else {
        // Load categories from new endpoint
        try {
          const categoriesData = await apiService.get(`/api/v1/product-category/product/${product.productId}/categories/details`) as any;
          setCategories(categoriesData);
        } catch (error) {
          console.error('Failed to load categories:', error);
          setCategories([]);
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
      // Load compatible lens thickness IDs for this product
      const compatibleThicknessIds = await productThicknessCompatibilityService.getCompatibleThicknessIds(product.productId);
      
      if (compatibleThicknessIds.length > 0) {
        // Load all lens thickness
        const allLensThickness = await lensThicknessService.getLensThicknessList();
        
        // Filter selected lens thickness based on compatible IDs
        const selectedThickness = allLensThickness.filter(lt => 
          compatibleThicknessIds.includes(lt.id)
        );
        setSelectedLensThickness(selectedThickness);
      } else {
        setSelectedLensThickness([]);
      }
    } catch (error) {
      console.error('Failed to load lens thickness:', error);
      setSelectedLensThickness([]);
    }
  }, [product.productId]);

  useEffect(() => {
    loadProductColors();
    loadProductDetail();
    loadCategories();
    loadLensThickness();
  }, [loadProductColors, loadProductDetail, loadCategories, loadLensThickness]);

  useEffect(() => {
    if (productColors.length > 0 && !selectedColorId) {
      // Auto select first color or thumbnail color
      const thumbnailColor = productColors.find(color => color.isThumbnail);
      setSelectedColorId(thumbnailColor?.id || productColors[0].id);
    }
  }, [productColors, selectedColorId]);

  useEffect(() => {
    if (selectedColorId) {
      loadColorImages(selectedColorId);
    }
  }, [selectedColorId, loadColorImages]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getProductTypeLabel = (type: ProductType) => {
    const labels = {
      [ProductType.GLASSES]: 'Kính mắt',
      [ProductType.SUNGLASSES]: 'Kính râm',
    };
    return labels[type] || type;
  };

  const getGenderLabel = (gender: ProductGenderType) => {
    const labels = {
      [ProductGenderType.MALE]: 'Nam',
      [ProductGenderType.FEMALE]: 'Nữ',
      [ProductGenderType.UNISEX]: 'Unisex',
    };
    return labels[gender] || gender;
  };

  const handleImageClick = (images: ProductImageModel[], startIndex: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(startIndex);
    setShowImageModal(true);
  };

  const ImageModal = () => {
    if (!showImageModal || selectedImages.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="relative max-w-4xl max-h-full">
          {/* Close button */}
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation buttons */}
          {selectedImages.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev > 0 ? prev - 1 : selectedImages.length - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev < selectedImages.length - 1 ? prev + 1 : 0
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ArrowLeft className="w-8 h-8 transform rotate-180" />
              </button>
            </>
          )}

          {/* Main image */}
          <img
            src={selectedImages[selectedImageIndex]?.imageUrl}
            alt="Product"
            className="max-w-full max-h-full object-contain"
          />

          {/* Image counter */}
          {selectedImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} / {selectedImages.length}
            </div>
          )}
        </div>
      </div>
    );
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
                Chi tiết sản phẩm: {product.productName}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
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
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{product.productName}</h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">{formatPrice(product.price)}</p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'Có sẵn' : 'Hết hàng'}
                </span>
                {product.isSustainable && (
                  <span className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    🌱 Thân thiện môi trường
                  </span>
                )}
                {product.isNew && (
                  <span className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    ✨ Sản phẩm mới
                  </span>
                )}
                {product.isBoutique && (
                  <span className="inline-flex px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                    💎 Boutique
                  </span>
                )}
              </div>

              {/* Thông báo hết hạn sản phẩm mới */}
              {product.isNew && product.newUntil && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Thông báo:</strong> Sản phẩm sẽ tự động hết hạn "mới" vào ngày{' '}
                    <span className="font-medium">
                      {new Date(product.newUntil).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              )}

              {product.description && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Mô tả</h4>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
              <Tag className="w-5 h-5 mr-2" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">ID sản phẩm:</span>
                  <span className="ml-2 font-medium">{product.productId}</span>
                </div>
                <div>
                  <span className="text-gray-500">Loại:</span>
                  <span className="ml-2 font-medium">{getProductTypeLabel(product.productType)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Giới tính:</span>
                  <span className="ml-2 font-medium">{getGenderLabel(product.gender)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sản phẩm mới:</span>
                  <span className={`ml-2 font-medium ${product.isNew ? 'text-blue-600' : 'text-gray-600'}`}>
                    {product.isNew ? 'Có' : 'Không'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Thương hiệu:</span>
                  <span className="ml-2 font-medium">{product.brand?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Tổng tồn kho:</span>
                  <span className="ml-2 font-medium">{product.stock} sản phẩm</span>
                </div>
                <div>
                  <span className="text-gray-500">Tổng màu sắc:</span>
                  <span className="ml-2 font-medium">{productColors.length} màu</span>
                </div>
                <div>
                  <span className="text-gray-500">Sản phẩm boutique:</span>
                  <span className={`ml-2 font-medium ${product.isBoutique ? 'text-purple-600' : 'text-gray-600'}`}>
                    {product.isBoutique ? 'Có' : 'Không'}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin ngày hết hạn */}
            {product.isNew && product.newUntil && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-500">Ngày hết hạn "mới":</span>
                  <span className="ml-2 font-medium text-blue-600">
                    {new Date(product.newUntil).toLocaleDateString('vi-VN', {
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    (Tự động chuyển thành không mới)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Danh mục</h3>
            <div className="flex flex-wrap gap-2">
              {isLoadingCategories ? (
                <span className="text-gray-500 text-sm">Đang tải...</span>
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <span key={category.id} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {category.name}
                  </span>
                ))
              ) : product.category ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {product.category.name}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Chưa phân loại</span>
              )}
            </div>
          </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <Settings className="w-5 h-5 mr-2" />
                Thông số kỹ thuật
              </h3>

              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : productDetail ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500">Chất liệu gọng:</span>
                      <span className="ml-2 font-medium">{productDetail.frameMaterial}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Hình dạng gọng:</span>
                      <span className="ml-2 font-medium">{productDetail.frameShape}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Loại gọng:</span>
                      <span className="ml-2 font-medium">{productDetail.frameType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Thiết kế cầu mũi:</span>
                      <span className="ml-2 font-medium">{productDetail.bridgeDesign || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phong cách:</span>
                      <span className="ml-2 font-medium">{productDetail.style || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Trọng lượng:</span>
                      <span className="ml-2 font-medium">{productDetail.weight}g</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500">Chiều rộng gọng:</span>
                      <span className="ml-2 font-medium">{productDetail.frameWidth}mm</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Chiều rộng mắt kính:</span>
                      <span className="ml-2 font-medium">{productDetail.lensWidth}mm</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Chiều cao mắt kính:</span>
                      <span className="ml-2 font-medium">{productDetail.lensHeight}mm</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Chiều rộng cầu mũi:</span>
                      <span className="ml-2 font-medium">{productDetail.bridgeWidth}mm</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Chiều dài càng:</span>
                      <span className="ml-2 font-medium">{productDetail.templeLength}mm</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500">Lò xo càng:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs rounded-full ${
                          productDetail.springHinges 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {productDetail.springHinges ? 'Có' : 'Không'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Đa tụ:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs rounded-full ${
                          productDetail.multifocal 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {productDetail.multifocal ? 'Có' : 'Không'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có thông số kỹ thuật</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sản phẩm này chưa có thông số kỹ thuật chi tiết.
                  </p>
                </div>
              )}
            </div>

            {/* Lens Thickness Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <Settings className="w-5 h-5 mr-2" />
                Độ dày lens tương thích
              </h3>

              {selectedLensThickness.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedLensThickness.map((lensThickness) => (
                    <div key={lensThickness.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{lensThickness.name}</h4>
                        <span className="text-sm text-blue-600 font-medium">
                          Index {lensThickness.indexValue}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{lensThickness.description}</p>
                      <div className="text-lg font-semibold text-green-600">
                        {lensThickness.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có thông tin độ dày lens</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sản phẩm này chưa có thông tin độ dày lens tương thích.
                  </p>
                </div>
              )}
            </div>

            {/* Color Variants Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <Palette className="w-5 h-5 mr-2" />
                Màu sắc sản phẩm ({productColors.length} màu)
              </h3>

              {isLoadingColors ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : productColors.length > 0 ? (
                <div className="space-y-4">
                  {productColors.map((color) => (
                    <div
                      key={color.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedColorId === color.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedColorId(color.id)}
                    >
                      {/* Color Info Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{color.colorName}</h4>
                            {color.isThumbnail && (
                              <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Thumbnail
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">{color.productVariantName}</p>
                            <p className="text-sm text-gray-500">
                              Mã: <span className="font-medium">{color.productNumber}</span>
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Tồn kho:</span>
                              <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                                color.stock > 10 
                                  ? 'bg-green-100 text-green-800' 
                                  : color.stock > 0 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {color.stock} sản phẩm
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Color Images */}
                      <div className="grid grid-cols-5 gap-2">
                        {/* Show existing images */}
                        {Array.from({ length: 5 }, (_, index) => {
                          const image = colorImages[color.id]?.[index];
                          return (
                            <div
                              key={index}
                              className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group"
                            >
                              {image ? (
                                <div 
                                  className="w-full h-full cursor-pointer hover:opacity-80 transition"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(colorImages[color.id] || [], index);
                                  }}
                                >
                                  <img
                                    src={image.imageUrl}
                                    alt={`${color.colorName} ${String.fromCharCode(65 + index)}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition">
                                  <Package className="w-6 h-6 text-gray-400 mb-1" />
                                  <span className="text-xs font-medium text-gray-500">
                                    {String.fromCharCode(65 + index)}
                                  </span>
                                  <span className="text-xs text-gray-400 mt-1 text-center">
                                    Nhấp để tải lên
                                  </span>
                                  <span className="text-xs text-gray-400 text-center">
                                    PNG, JPG (5MB)
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Palette className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có màu sắc</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sản phẩm này chưa có biến thể màu sắc nào.
                  </p>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                Thông tin thời gian
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="ml-2 font-medium">
                    {new Date(product.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Cập nhật lần cuối:</span>
                  <span className="ml-2 font-medium">
                    {new Date(product.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal />
    </div>
  );
};

export default ProductDetailPage;
