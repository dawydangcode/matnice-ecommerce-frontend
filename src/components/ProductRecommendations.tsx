import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api.service';
import '../styles/ProductRecommendations.css';

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

interface ProductDetail {
  id: number;
  productId: number;
  bridgeWidth: number;
  frameWidth: number;
  lensHeight: number;
  lensWidth: number;
  templeLength: number;
  frameMaterial: string;
  frameShape: string;
  frameType: string;
  bridgeDesign: string;
  style: string;
  springHinges: boolean;
  weight: number;
  multifocal: boolean;
}

interface Product {
  id: number;
  productName: string;
  productType: string;
  brandId: number;
  gender: string;
  price: number;
  description: string;
  isSustainable: boolean;
  isNew: boolean;
  newUntil: string;
  isBoutique: boolean;
  productColors: ProductColor[];
  productDetail: ProductDetail;
}

interface ProductRecommendationsProps {
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

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  analysisResult,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position and update button states
  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Width of one card + gap
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Width of one card + gap
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  const fetchRecommendations = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        gender: analysisResult.gender.detected,
        skinColor: analysisResult.SkinColor.detected,
        faceShape: analysisResult.faceShape.detected,
        page: page.toString(),
        limit: '12', // Show more products in carousel
      };

      console.log('Fetching recommendations with params:', params);
      const response: any = await apiService.get('/product-recommendation/filter', params);
      console.log('API response:', response);
      
      if (response.success) {
        // If it's page 1, replace products; otherwise append
        if (page === 1) {
          setProducts(response.data.products);
        } else {
          setProducts(prev => [...prev, ...response.data.products]);
        }
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
        setCurrentPage(page);
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
    if (analysisResult) {
      fetchRecommendations(1);
    }
  }, [analysisResult, fetchRecommendations]);

  // Add scroll event listener and initial check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons);
      
      // Check on window resize
      const handleResize = () => checkScrollButtons();
      window.addEventListener('resize', handleResize);
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [checkScrollButtons, products]);

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
    
    // Fallback to first available image
    for (const color of product.productColors) {
      if (color.productImage.length > 0) {
        return color.productImage[0].imageUrl;
      }
    }
    
    return '/placeholder-product.jpg';
  };



  if (loading && products.length === 0) {
    return (
      <div className="product-recommendations">
        <div className="recommendations-header">
          <h3>Recommended Products</h3>
          <p>Finding products perfect for you...</p>
        </div>
        <div className="products-carousel-container">
          <div className="products-carousel">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="product-card-skeleton carousel-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                  <div className="skeleton-description"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-recommendations">
        <div className="recommendations-header">
          <h3>Recommended Products</h3>
        </div>
        <div className="error-state">
          <p>Unable to load product recommendations: {error}</p>
          <button onClick={() => fetchRecommendations(1)} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-recommendations">
        <div className="recommendations-header">
          <h3>Recommended Products</h3>
        </div>
        <div className="no-products">
          <p>No products found matching your analysis results.</p>
          <p>Try adjusting your preferences or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-recommendations">
      <div className="recommendations-header">
        <h3>Recommended Products</h3>
        <p>Based on your analysis: {analysisResult.gender.detected} • {analysisResult.SkinColor.detected} tone • {analysisResult.faceShape.detected} face</p>
        <span className="results-count">{total} products found</span>
      </div>

      <div className="products-carousel-container">
        {/* Navigation Arrows */}
        <button 
          className={`carousel-nav-button prev-button ${!canScrollLeft ? 'disabled' : ''}`}
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="products-carousel" ref={scrollContainerRef}>
          {products.map((product) => (
            <div key={product.id} className="product-card carousel-card">
            <div className="product-image-container">
              <img
                src={getMainImage(product)}
                alt={product.productName}
                className="product-image"
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
              <div className="product-actions">
                <button className="action-button view-button" title="Quick View">
                  <Eye size={18} />
                </button>
                <button className="action-button wishlist-button" title="Add to Wishlist">
                  <Heart size={18} />
                </button>
              </div>
            </div>

            <div className="product-info">
              <div className="product-header">
                <h4 className="product-name">{product.productName}</h4>
                <div className="product-price">
                  {formatPrice(product.price)}
                </div>
              </div>

              <p className="product-description">{product.description}</p>

              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Shape:</span>
                  <span className="detail-value">{product.productDetail.frameShape}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Material:</span>
                  <span className="detail-value">{product.productDetail.frameMaterial}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Colors:</span>
                  <span className="detail-value">{product.productColors.length} available</span>
                </div>
              </div>

              <div className="color-options">
                {product.productColors.slice(0, 3).map((color) => (
                  <div key={color.id} className="color-option" title={color.colorName}>
                    {color.productImage.length > 0 && (
                      <img
                        src={color.productImage[0].imageUrl}
                        alt={color.colorName}
                        className="color-preview"
                      />
                    )}
                  </div>
                ))}
                {product.productColors.length > 3 && (
                  <span className="more-colors">+{product.productColors.length - 3}</span>
                )}
              </div>

              <button className="add-to-cart-button">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
            </div>
          ))}
        </div>
        
        <button 
          className={`carousel-nav-button next-button ${!canScrollRight ? 'disabled' : ''}`}
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Load More Button for Carousel */}
      {totalPages > 1 && currentPage < totalPages && (
        <div className="load-more-section">
          <button
            onClick={() => fetchRecommendations(currentPage + 1)}
            disabled={loading}
            className="load-more-button"
          >
            {loading ? 'Loading...' : `Load More Products (${total - products.length} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;
