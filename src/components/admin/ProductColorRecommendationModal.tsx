import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  Check, 
  Loader2,
  AlertCircle,
  Save
} from 'lucide-react';
import { Product } from '../../types/product.types';
import { SkinColorType } from '../../types/color-skin-recommendation.types';
import { colorSkinRecommendationService } from '../../services/color-skin-recommendation.service';
import { productColorService, ProductColor } from '../../services/product-color.service';
import './ColorSkinRecommendation.css';

interface ProductColorRecommendationModalProps {
  product: Product;
  onClose: () => void;
}

const SKIN_COLOR_OPTIONS = [
  { value: SkinColorType.LIGHT, label: 'Da sáng', color: '#F5D5B8' },
  { value: SkinColorType.MEDIUM, label: 'Da trung bình', color: '#D4A574' },
  { value: SkinColorType.DARK, label: 'Da tối', color: '#8B4513' },
];

const ProductColorRecommendationModal: React.FC<ProductColorRecommendationModalProps> = ({
  product,
  onClose,
}) => {
  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [recommendations, setRecommendations] = useState<Map<number, SkinColorType[]>>(new Map());
  const [originalRecommendations, setOriginalRecommendations] = useState<Map<number, SkinColorType[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load product colors and existing recommendations
  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load real product colors from API
      const realProductColors = await productColorService.getProductColors(product.productId);
      setProductColors(realProductColors);

      // Load existing recommendations for each product color
      const recommendationsMap = new Map<number, SkinColorType[]>();
      
      for (const color of realProductColors) {
        try {
          const existingRecommendations = await colorSkinRecommendationService.getRecommendationsByProductColor(color.id);
          const skinColorTypes = existingRecommendations.map(rec => rec.skinColorType);
          recommendationsMap.set(color.id, skinColorTypes);
        } catch (err) {
          console.error(`Error loading recommendations for color ${color.id}:`, err);
          recommendationsMap.set(color.id, []);
        }
      }
      
      setRecommendations(recommendationsMap);
      setOriginalRecommendations(new Map(recommendationsMap)); // Store original state for comparison
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Không thể tải dữ liệu sản phẩm và màu sắc');
    } finally {
      setLoading(false);
    }
  }, [product.productId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check if there are any changes compared to original recommendations
  const hasChanges = React.useMemo(() => {
    if (originalRecommendations.size === 0) return false;
    
    const recommendationEntries = Array.from(recommendations.entries());
    
    for (const [productColorId, currentTypes] of recommendationEntries) {
      const originalTypes = originalRecommendations.get(productColorId) || [];
      
      // Check if arrays are different
      if (currentTypes.length !== originalTypes.length) return true;
      
      const sortedCurrent = [...currentTypes].sort();
      const sortedOriginal = [...originalTypes].sort();
      
      for (let i = 0; i < sortedCurrent.length; i++) {
        if (sortedCurrent[i] !== sortedOriginal[i]) return true;
      }
    }
    
    return false;
  }, [recommendations, originalRecommendations]);

  const handleSkinColorToggle = (productColorId: number, skinColorType: SkinColorType) => {
    setRecommendations(prev => {
      const newMap = new Map(prev);
      const currentRecommendations = newMap.get(productColorId) || [];
      
      if (currentRecommendations.includes(skinColorType)) {
        // Remove recommendation
        newMap.set(
          productColorId, 
          currentRecommendations.filter(type => type !== skinColorType)
        );
      } else {
        // Add recommendation
        newMap.set(productColorId, [...currentRecommendations, skinColorType]);
      }
      
      return newMap;
    });
  };

  const handleSaveRecommendations = async () => {
    try {
      setSaving(true);
      setError(null);

      const recommendationEntries = Array.from(recommendations.entries());
      
      for (const [productColorId, skinColorTypes] of recommendationEntries) {
        if (skinColorTypes.length > 0) {
          try {
            await colorSkinRecommendationService.bulkCreateRecommendations(
              productColorId,
              { skinColorTypes }
            );
          } catch (err: any) {
            // If bulk create fails (might be due to existing recommendations), 
            // try creating individual recommendations
            for (const skinColorType of skinColorTypes) {
              try {
                await colorSkinRecommendationService.createColorSkinRecommendation({
                  productColorId,
                  skinColorType,
                });
              } catch (individualErr) {
                // Ignore errors for existing recommendations
                console.log(`Recommendation already exists for color ${productColorId} and skin type ${skinColorType}`);
              }
            }
          }
        }
      }

      // Update original recommendations after successful save
      setOriginalRecommendations(new Map(recommendations));
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error saving recommendations:', err);
      setError('Không thể lưu gợi ý màu da');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#43AC78]" />
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Palette className="w-6 h-6 mr-2 text-[#43AC78]" />
              Gợi ý màu sắc cho da
            </h2>
            <p className="text-gray-600 mt-1">
              {product.productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Guide Table */}
            <div className="xl:col-span-1">
              <div className="color-guide-section">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="w-4 h-4 mr-2 text-blue-600" />
                  Hướng dẫn chọn màu
                </h3>
                
                <div className="space-y-4 text-sm">
                  {/* Light Skin */}
                  <div className="color-guide-card">
                    <div className="flex items-center mb-2">
                      <div className="guide-skin-swatch light mr-2"></div>
                      <span className="font-medium text-gray-800">Da sáng</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="guide-label suitable">Phù hợp:</span>
                        <span className="text-gray-600 ml-1">Trắng, Xám, Xanh dương, Tím nhạt, Vàng nhạt, Đỏ nhạt</span>
                      </div>
                      <div>
                        <span className="guide-label reason">Lý do:</span>
                        <span className="text-gray-600 ml-1">Màu lạnh (xanh dương, tím) làm nổi bật da sáng, tạo cảm giác tươi mới</span>
                      </div>
                      <div>
                        <span className="guide-label avoid">Tránh:</span>
                        <span className="text-gray-600 ml-1">Màu quá đậm như đen, nâu đậm, xanh lá đậm</span>
                      </div>
                    </div>
                  </div>

                  {/* Medium Skin */}
                  <div className="color-guide-card">
                    <div className="flex items-center mb-2">
                      <div className="guide-skin-swatch medium mr-2"></div>
                      <span className="font-medium text-gray-800">Da trung bình</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="guide-label suitable">Phù hợp:</span>
                        <span className="text-gray-600 ml-1">Xám, Xanh dương, Xanh lá, Tím, Đen, Nâu, Vàng, Cam, Đỏ</span>
                      </div>
                      <div>
                        <span className="guide-label reason">Lý do:</span>
                        <span className="text-gray-600 ml-1">Da linh hoạt với cả màu lạnh (xanh dương, tím) và ấm (cam, vàng)</span>
                      </div>
                    </div>
                  </div>

                  {/* Dark Skin */}
                  <div className="color-guide-card">
                    <div className="flex items-center mb-2">
                      <div className="guide-skin-swatch dark mr-2"></div>
                      <span className="font-medium text-gray-800">Da tối</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="guide-label suitable">Phù hợp:</span>
                        <span className="text-gray-600 ml-1">Đen, Nâu, Vàng đậm, Cam, Đỏ, Tím đậm, Xanh dương đậm, Xanh lá đậm</span>
                      </div>
                      <div>
                        <span className="guide-label reason">Lý do:</span>
                        <span className="text-gray-600 ml-1">Màu đậm tạo tương phản mạnh, cả lạnh (xanh dương) và ấm (xanh lá) đều đẹp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Distinction Guide */}
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-3 text-sm">
                    🎨 Phân biệt Xanh dương vs Xanh lá
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-blue-900">Xanh dương (Blue):</span>
                        <span className="text-gray-700 ml-1">Màu lạnh, thanh lịch, phù hợp undertone lạnh (hồng)</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-green-900">Xanh lá (Green):</span>
                        <span className="text-gray-700 ml-1">Màu ấm, tươi tắn, phù hợp undertone ấm (vàng)</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-indigo-200 space-y-1">
                      <div>
                        <span className="font-medium text-indigo-900">💡 Ví dụ cụ thể:</span>
                      </div>
                      <div className="pl-4 space-y-1">
                        <div className="text-gray-700">• <strong>Xanh dương:</strong> Navy, Royal Blue, Sky Blue</div>
                        <div className="text-gray-700">• <strong>Xanh lá:</strong> Forest Green, Emerald, Olive</div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-indigo-900">🔍 Cách nhận biết:</span>
                        <span className="text-gray-700 ml-1">Quan sát mạch máu ở cổ tay - xanh là undertone lạnh, xanh lá là undertone ấm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="guide-note">
                  <p>
                    <strong>Lưu ý:</strong> Đây là gợi ý chung. Mỗi người có undertone khác nhau, 
                    nên thử nghiệm để tìm màu phù hợp nhất.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Product Colors */}
            <div className="xl:col-span-2">
              <div className="space-y-6">
            {productColors.map((color) => (
              <div key={color.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{color.colorName}</h3>
                      <p className="text-sm text-gray-500">Kho: {color.stock}</p>
                      <p className="text-xs text-gray-400">Mã: {color.productNumber}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Phù hợp với loại da:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SKIN_COLOR_OPTIONS.map((skinOption) => {
                      const isSelected = recommendations.get(color.id)?.includes(skinOption.value) || false;
                      
                      return (
                        <button
                          key={skinOption.value}
                          onClick={() => handleSkinColorToggle(color.id, skinOption.value)}
                          className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                            isSelected
                              ? 'border-[#43AC78] bg-[#43AC78]/10 text-[#43AC78]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className="skin-color-swatch"
                              data-color={skinOption.color}
                            />
                            <span className="text-sm font-medium">{skinOption.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 shadow-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveRecommendations}
            disabled={saving || !hasChanges}
            className="flex items-center px-4 py-2 bg-[#43AC78] text-white rounded-lg hover:bg-[#3a9268] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu gợi ý
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Thành công!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Đã lưu gợi ý màu da cho sản phẩm thành công.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2 bg-[#43AC78] text-white rounded-lg hover:bg-[#3a9268] transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductColorRecommendationModal;
