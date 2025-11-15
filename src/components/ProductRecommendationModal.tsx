import React, { useState, useEffect, useCallback } from 'react';
import { X, Eye, Sparkles } from 'lucide-react';
import VirtualTryOnModal from './VirtualTryOnModal';
import { 
  product3DModelService,
  Product3DModel,
  Model3DConfig 
} from '../services/product3dModel.service';
import '../styles/ProductRecommendationModal.css';

interface ProductColor {
  id: number;
  productId: number;
  productVariantName: string;
  productNumber: number;
  colorName: string;
  stock: number;
  isThumbnail: boolean;
  productImage: Array<{
    id: number;
    productId: number;
    productColorId: number;
    imageUrl: string;
    imageOrder: string;
  }>;
}

interface Product {
  id: number;
  productName: string;
  productType: string;
  brandId: number;
  brand?: {
    name: string;
  };
  gender: string;
  price: number;
  description: string;
  isSustainable: boolean;
  isNew: boolean;
  newUntil: string;
  isBoutique: boolean;
  productColors: ProductColor[];
}

interface ProductRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: {
    gender: {
      detected: string;
      confidence: number;
    };
    SkinColor: {
      detected: string;
      confidence: number;
    };
    faceShape: {
      detected: string;
      confidence: number;
    };
  };
}

const ProductRecommendationModal: React.FC<ProductRecommendationModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // AR Try-On states
  const [selectedProductForAR, setSelectedProductForAR] = useState<Product | null>(null);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [product3DModels, setProduct3DModels] = useState<Map<number, Product3DModel>>(new Map());
  const [model3DConfigs, setModel3DConfigs] = useState<Map<number, Model3DConfig>>(new Map());

  // Helper function to create backend proxy URL for 3D model
  const getModelProxyUrl = (productId: number): string => {
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    return `${backendUrl}/api/v1/product-3d-model/serve/${productId}`;
  };

  // Load 3D model data for a product
  const load3DModelData = async (productId: number) => {
    try {
      // Get active 3D model for this product
      const activeModels = await product3DModelService.getActiveByProductId(productId);
      
      if (activeModels && activeModels.length > 0) {
        const model = activeModels[0];
        setProduct3DModels(prev => new Map(prev).set(productId, model));
        
        // Load config for this model
        const config = await product3DModelService.getConfigByModelId(model.id);
        if (config) {
          setModel3DConfigs(prev => new Map(prev).set(productId, config));
        }
      }
    } catch (error) {
      console.error('Error loading 3D model data for product', productId, error);
    }
  };

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        gender: analysisResult.gender.detected,
        skinColor: analysisResult.SkinColor.detected,
        faceShape: analysisResult.faceShape.detected,
        page: '1',
        limit: '6', // Show top 6 products
      });

      console.log('Fetching recommendations with params:', params.toString());
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/product-recommendation/filter?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }
      
      const data: any = await response.json();
      console.log('API response:', data);
      
      if (data.success) {
        setProducts(data.data.products);
        
        // Load 3D models for all products
        data.data.products.forEach((product: Product) => {
          load3DModelData(product.id);
        });
      } else {
        setError('Failed to fetch product recommendations');
      }
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, [analysisResult]);

  useEffect(() => {
    if (isOpen && analysisResult) {
      fetchRecommendations();
    }
  }, [isOpen, analysisResult, fetchRecommendations]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getMainImage = (product: Product) => {
    const thumbnailColor = product.productColors.find(color => color.isThumbnail);
    if (thumbnailColor && thumbnailColor.productImage.length > 0) {
      return thumbnailColor.productImage[0].imageUrl;
    }
    
    for (const color of product.productColors) {
      if (color.productImage.length > 0) {
        return color.productImage[0].imageUrl;
      }
    }
    
    return '/placeholder-product.jpg';
  };

  const handleTryAR = (product: Product) => {
    setSelectedProductForAR(product);
    setIsARModalOpen(true);
  };

  const handleViewProduct = (productId: number) => {
    window.open(`/product/${productId}`, '_blank');
  };

  const handleViewAllProducts = () => {
    // Scroll to ProductRecommendations section
    onClose();
    setTimeout(() => {
      const recommendationsSection = document.querySelector('.product-recommendations');
      if (recommendationsSection) {
        recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="recommendation-modal-overlay" onClick={onClose}>
        <div className="recommendation-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="recommendation-modal-header">
            <div>
              <h2 className="recommendation-modal-title">Sản phẩm phù hợp</h2>
              <p className="recommendation-modal-subtitle">
                Dựa trên kết quả phân tích: {analysisResult.gender.detected.toLowerCase() === 'male' ? 'Nam' : 'Nữ'} • 
                {' '}{analysisResult.SkinColor.detected} • {analysisResult.faceShape.detected}
              </p>
            </div>
            <button 
              className="recommendation-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="recommendation-modal-body">
            {loading ? (
              <div className="recommendation-modal-loading">
                <div className="spinner"></div>
                <p>Đang tìm kính phù hợp nhất cho bạn...</p>
              </div>
            ) : error ? (
              <div className="recommendation-modal-error">
                <p>{error}</p>
                <button onClick={fetchRecommendations} className="retry-button">
                  Thử lại
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="recommendation-modal-empty">
                <p>Không tìm thấy sản phẩm phù hợp</p>
              </div>
            ) : (
              <div className="recommendation-products-grid">
                {products.map((product) => {
                  const has3DModel = product3DModels.has(product.id);
                  
                  return (
                    <div key={product.id} className="recommendation-product-card">
                      {/* Image */}
                      <div className="recommendation-product-image-wrapper">
                        <img
                          src={getMainImage(product)}
                          alt={product.productName}
                          className="recommendation-product-image"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                          }}
                        />
                        {product.isNew && (
                          <span className="product-badge new-badge">New</span>
                        )}
                        {product.isSustainable && (
                          <span className="product-badge eco-badge">Eco</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="recommendation-product-info">
                        <h3 className="recommendation-product-name">
                          {product.brand?.name} {product.productName}
                        </h3>
                        <p className="recommendation-product-price">
                          {formatPrice(product.price)}
                        </p>

                        {/* Action Buttons */}
                        <div className="recommendation-product-actions">
                          {has3DModel ? (
                            <button
                              className="recommendation-ar-button primary"
                              onClick={() => handleTryAR(product)}
                            >
                              <Sparkles size={18} />
                              Thử ngay với AR
                            </button>
                          ) : (
                            <button
                              className="recommendation-view-button primary"
                              onClick={() => handleViewProduct(product.id)}
                            >
                              <Eye size={18} />
                              Xem chi tiết
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && !error && products.length > 0 && (
            <div className="recommendation-modal-footer">
              <button 
                className="recommendation-view-all-button"
                onClick={handleViewAllProducts}
              >
                Xem thêm sản phẩm khác
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AR Try-On Modal */}
      {selectedProductForAR && (
        <VirtualTryOnModal
          isOpen={isARModalOpen}
          onClose={() => {
            setIsARModalOpen(false);
            setSelectedProductForAR(null);
          }}
          productName={`${selectedProductForAR.brand?.name || ''} ${selectedProductForAR.productName}`}
          model3dUrl={getModelProxyUrl(selectedProductForAR.id)}
          glassesConfig={model3DConfigs.get(selectedProductForAR.id) ? {
            offsetX: model3DConfigs.get(selectedProductForAR.id)!.offsetX,
            offsetY: model3DConfigs.get(selectedProductForAR.id)!.offsetY,
            positionOffsetX: model3DConfigs.get(selectedProductForAR.id)!.positionOffsetX,
            positionOffsetY: model3DConfigs.get(selectedProductForAR.id)!.positionOffsetY,
            positionOffsetZ: model3DConfigs.get(selectedProductForAR.id)!.positionOffsetZ,
            initialScale: model3DConfigs.get(selectedProductForAR.id)!.initialScale
          } : undefined}
        />
      )}
    </>
  );
};

export default ProductRecommendationModal;
