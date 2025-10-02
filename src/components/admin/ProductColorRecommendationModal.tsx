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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get color code based on color name (fallback for display)
  const getColorCode = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'đen': '#000000',
      'black': '#000000',
      'đỏ': '#FF0000',
      'red': '#FF0000',
      'xanh': '#0000FF',
      'blue': '#0000FF',
      'vàng': '#FFFF00',
      'yellow': '#FFFF00',
      'hồng': '#FFC0CB',
      'pink': '#FFC0CB',
      'nâu': '#8B4513',
      'brown': '#8B4513',
      'xám': '#808080',
      'gray': '#808080',
      'grey': '#808080',
      'trắng': '#FFFFFF',
      'white': '#FFFFFF',
      'cam': '#FFA500',
      'orange': '#FFA500',
      'tím': '#800080',
      'purple': '#800080',
      'xanh lá': '#008000',
      'green': '#008000',
      'xanh navy': '#000080',
      'navy': '#000080',
    };
    
    const key = colorName.toLowerCase();
    return colorMap[key] || '#CCCCCC'; // Default gray if color not found
  };

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

      // Show success message
      alert('Lưu gợi ý màu da thành công!');
      
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {productColors.map((color) => (
              <div key={color.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className="color-swatch"
                      data-color={getColorCode(color.colorName)}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{color.colorName}</h3>
                      <p className="text-sm text-gray-500">Kho: {color.stock}</p>
                      <p className="text-xs text-gray-400">Mã: {color.productNumber}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {getColorCode(color.colorName)}
                  </span>
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

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveRecommendations}
            disabled={saving}
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
    </div>
  );
};

export default ProductColorRecommendationModal;
