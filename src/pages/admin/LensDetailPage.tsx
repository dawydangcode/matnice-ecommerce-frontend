import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Eye, Package, Palette, Image, DollarSign, Users, Calendar, Tag } from 'lucide-react';
import { apiService } from '../../services/api.service';

interface LensDetailPageProps {
  lensId: number;
  onBack: () => void;
}

interface LensFullDetails {
  lens: {
    id: string;
    name: string;
    origin: string;
    lensType: string;
    status: string;
    description: string;
    createdAt: string;
    brandLens: {
      id: string;
      name: string;
      description: string;
    };
  };
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  variants: Array<{
    id: string;
    lensThicknessId: string;
    design: string;
    material: string;
    price: string;
    stock: number;
    refractionRanges: Array<{
      id: string;
      refractionType: string;
      minValue: string;
      maximumValue: string;
      stepValue: string;
    }>;
    tintColors: Array<{
      id: string;
      name: string;
      imageUrl: string;
      colorCode: string;
    }>;
    lensThickness: {
      id: string;
      name: string;
      indexValue: number;
      price: string;
      description: string;
    };
  }>;
  coatings: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
  }>;
  images: Array<{
    id: string;
    imageUrl: string;
    imageOrder: string;
    isThumbnail: boolean;
  }>;
  summary: {
    totalVariants: number;
    totalCoatings: number;
    totalImages: number;
    priceRange: {
      min: number;
      max: number;
    };
    availableStock: number;
  };
}

const LensDetailPage: React.FC<LensDetailPageProps> = ({ lensId, onBack }) => {
  const [lensDetails, setLensDetails] = useState<LensFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLensDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get(`/api/v1/lens/${lensId}/full-details`);
      setLensDetails(response as LensFullDetails);
    } catch (error) {
      console.error('Error fetching lens details:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [lensId]);

  useEffect(() => {
    if (lensId) {
      fetchLensDetails();
    }
  }, [lensId, fetchLensDetails]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'IN_STOCK': { color: 'bg-green-100 text-green-800', text: 'Còn hàng' },
      'OUT_OF_STOCK': { color: 'bg-red-100 text-red-800', text: 'Hết hàng' },
      'PRE_ORDER': { color: 'bg-yellow-100 text-yellow-800', text: 'Đặt trước' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getLensTypeBadge = (lensType: string) => {
    const typeConfig = {
      'SINGLE_VISION': { color: 'bg-blue-100 text-blue-800', text: 'Đơn tròng' },
      'PROGRESSIVE': { color: 'bg-purple-100 text-purple-800', text: 'Đa tròng' },
      'DRIVE_SAFE': { color: 'bg-orange-100 text-orange-800', text: 'Lái xe an toàn' },
      'OFFICE': { color: 'bg-indigo-100 text-indigo-800', text: 'Văn phòng' },
      'NON_PRESCRIPTION': { color: 'bg-gray-100 text-gray-800', text: 'Không độ' },
    };
    
    const config = typeConfig[lensType as keyof typeof typeConfig] || 
                  { color: 'bg-gray-100 text-gray-800', text: lensType };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin chi tiết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lensDetails) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết tròng kính</h1>
          </div>
          
          <div className="text-center py-8">
            <div className="text-red-600 text-lg mb-2">⚠️ Có lỗi xảy ra</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchLensDetails}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{lensDetails.lens.name}</h1>
            <p className="text-gray-600">Chi tiết thông tin tròng kính</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(lensDetails.lens.status)}
            {getLensTypeBadge(lensDetails.lens.lensType)}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Thương hiệu</span>
            </div>
            <p className="text-gray-900">{lensDetails.lens.brandLens.name}</p>
            <p className="text-sm text-gray-600">{lensDetails.lens.brandLens.description}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-medium">Xuất xứ</span>
            </div>
            <p className="text-gray-900">{lensDetails.lens.origin}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Ngày tạo</span>
            </div>
            <p className="text-gray-900">{formatDate(lensDetails.lens.createdAt)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span className="font-medium">Tổng kho</span>
            </div>
            <p className="text-gray-900">{lensDetails.summary.availableStock} sản phẩm</p>
          </div>
        </div>

        {/* Description */}
        {lensDetails.lens.description && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mô tả</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {lensDetails.lens.description}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {lensDetails.summary.totalVariants}
          </div>
          <div className="text-gray-600">Biến thể</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {lensDetails.summary.totalCoatings}
          </div>
          <div className="text-gray-600">Lớp phủ</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {lensDetails.summary.totalImages}
          </div>
          <div className="text-gray-600">Hình ảnh</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {formatPrice(lensDetails.summary.priceRange.min)} - {formatPrice(lensDetails.summary.priceRange.max)}
          </div>
          <div className="text-gray-600">Khoảng giá</div>
        </div>
      </div>

      {/* Categories */}
      {lensDetails.categories && lensDetails.categories.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Danh mục</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {lensDetails.categories.map(category => (
              <div key={category.id} className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <div className="font-medium text-blue-900">{category.name}</div>
                {category.description && (
                  <div className="text-sm text-blue-700 mt-1">{category.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images */}
      {lensDetails.images && lensDetails.images.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2 mb-4">
            <Image className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Hình ảnh sản phẩm</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {lensDetails.images.map(image => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.imageUrl} 
                  alt={`Lens ${lensDetails.lens.name} - ${image.imageOrder}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                />
                <div className="absolute top-2 left-2 flex space-x-1">
                  <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                    {image.imageOrder.toUpperCase()}
                  </span>
                  {image.isThumbnail && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Thumbnail
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants */}
      {lensDetails.variants && lensDetails.variants.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Biến thể sản phẩm</h2>
          </div>
          
          <div className="space-y-4">
            {lensDetails.variants.map(variant => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Thiết kế:</span>
                    <div className="text-gray-900">{variant.design}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Vật liệu:</span>
                    <div className="text-gray-900">{variant.material}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Giá:</span>
                    <div className="text-gray-900 font-medium">{formatPrice(variant.price)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Tồn kho:</span>
                    <div className="text-gray-900">{variant.stock} sản phẩm</div>
                  </div>
                </div>

                {/* Lens Thickness */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Độ dày tròng kính:</span>
                  <div className="bg-gray-50 p-3 rounded-lg mt-1">
                    <div className="font-medium">{variant.lensThickness.name}</div>
                    <div className="text-sm text-gray-600">
                      Chỉ số khúc xạ: {variant.lensThickness.indexValue} | 
                      Giá: {formatPrice(variant.lensThickness.price)}
                    </div>
                    <div className="text-sm text-gray-500">{variant.lensThickness.description}</div>
                  </div>
                </div>

                {/* Refraction Ranges */}
                {variant.refractionRanges.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-600">Khoảng khúc xạ:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                      {variant.refractionRanges.map(range => (
                        <div key={range.id} className="bg-blue-50 p-2 rounded text-sm">
                          <span className="font-medium">{range.refractionType}:</span>{' '}
                          {range.minValue} đến {range.maximumValue} (bước nhảy: {range.stepValue})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tint Colors */}
                {variant.tintColors.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Màu tint:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {variant.tintColors.map(color => (
                        <div key={color.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.colorCode }}
                          />
                          <span className="text-sm">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coatings */}
      {lensDetails.coatings && lensDetails.coatings.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Lớp phủ bề mặt</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lensDetails.coatings.map(coating => (
              <div key={coating.id} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">{coating.name}</div>
                <div className="text-lg font-bold text-orange-600 mb-2">
                  {formatPrice(coating.price)}
                </div>
                <div className="text-sm text-gray-600">{coating.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LensDetailPage;
