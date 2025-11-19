import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/ProductRecommendations.css';
import '../styles/product-page.css';
import { formatVND } from '../utils/currency';

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
      const params = new URLSearchParams({
        gender: analysisResult.gender.detected,
        skinColor: analysisResult.SkinColor.detected,
        faceShape: analysisResult.faceShape.detected,
        page: page.toString(),
        limit: '12', // Show more products in carousel
      });

      console.log('Fetching recommendations with params:', params.toString());
      
      // Use direct fetch for product recommendations to avoid auth issues
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/product-recommendation/filter?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }
      
      const data: any = await response.json();
      console.log('API response:', data);
      
      if (data.success) {
        // If it's page 1, replace products; otherwise append
        if (page === 1) {
          setProducts(data.data.products);
        } else {
          setProducts(prev => [...prev, ...data.data.products]);
        }
        setTotalPages(data.data.totalPages);
        setTotal(data.data.total);
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
    return formatVND(price);
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
          {products.map((product) => {
            const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
            
            return (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group cursor-pointer bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow block carousel-card"
              >
                <div className="relative rounded-lg mb-6 overflow-hidden h-96 flex items-center justify-center">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-row space-x-2 z-10">
                    {!!product.isNew && (
                      <div className="bg-white text-green-700 px-3 py-1 text-xs font-medium">
                        New
                      </div>
                    )}
                    {!!product.isBoutique && (
                      <div className="bg-gray-800 text-white px-3 py-1 text-xs font-medium">
                        Boutique
                      </div>
                    )}
                    {!!product.isSustainable && (
                      <div className="sustainable-badge px-3 py-1 text-xs font-medium">
                        Sustainable
                      </div>
                    )}
                  </div>
                  
                  {/* Heart Icon */}
                  <div className="absolute top-2 right-4 z-10">
                    <button 
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Add wishlist functionality
                        console.log('Add to wishlist:', productId);
                      }}
                    >
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  
                  {/* Product Image */}
                  <img 
                    src={getMainImage(product)}
                    alt={product.productName}
                    className="w-full h-full max-w-[350px] max-h-[350px] object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                    }}
                  />
                </div>
                
                {/* Product Info */}
                <div className="space-y-4 p-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 text-secondary">Brand Name</h3>
                    <p className="text-base font-light text-secondary">{product.productName}</p>
                  </div>
                  
                  {product.productColors.length > 1 && (
                    <p className="text-sm text-gray-500">{product.productColors.length} variants available</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-light text-secondary">Frame price without lenses</p>
                      <span className="text-right text-base font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
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
