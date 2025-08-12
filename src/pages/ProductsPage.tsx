import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../types/product-card.types';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import GlassesHeroContent from '../components/category/GlassesHeroContent';
import ProductListHeader from '../components/ProductListHeader';
import FilterSection from '../components/FilterSection';
import productCardService from '../services/product-card.service';
import { formatVND } from '../utils/currency';
import '../styles/product-page.css';

const ProductsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  
  // Products state - using ProductCard instead of Product
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Create stable dependencies for useEffect
  const minPrice = useMemo(() => priceRange[0], [priceRange]);
  const maxPrice = useMemo(() => priceRange[1], [priceRange]);

  // Fetch products on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Map sort options to backend API format
        let backendSortBy: 'price' | 'name' | 'newest' = 'newest';
        let sortOrder: 'ASC' | 'DESC' = 'DESC';
        
        switch (sortBy) {
          case 'price-low':
            backendSortBy = 'price';
            sortOrder = 'ASC';
            break;
          case 'price-high':
            backendSortBy = 'price';
            sortOrder = 'DESC';
            break;
          case 'name':
            backendSortBy = 'name';
            sortOrder = 'ASC';
            break;
          case 'newest':
          default:
            backendSortBy = 'newest';
            sortOrder = 'DESC';
            break;
        }
        
        const response = await productCardService.getProductCards({
          page: currentPage,
          limit: pageSize,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 1000000 ? maxPrice : undefined,
          sortBy: backendSortBy,
          sortOrder: sortOrder
        });
        setProducts(response.data || []);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, minPrice, maxPrice, sortBy]);

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange([0, 1000000]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50">
        <Header />
        <Navigation />
      </header>

      {/* Hero Content */}
      <GlassesHeroContent />

      {/* Product List Header */}
      <ProductListHeader
        total={total}
        viewMode={viewMode}
        sortBy={sortBy}
        onViewModeChange={setViewMode}
        onSortChange={setSortBy}
        onClearAll={clearAllFilters}
      />

      {/* Main Content Area */}
      <section className="py-8">
        <div className="max-w-full mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Sidebar - Filters */}
            <div className="w-full lg:w-1/5">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-1">
                
                {/* Recommendations Section */}
                <FilterSection title="RECOMMENDATIONS FOR YOU">
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Your recommended glasses width</span>
                    </label>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-1 text-xs font-medium">
                          i
                        </div>
                        <div className="text-xs text-blue-700">
                          Do you already own a pair of our glasses? Log in now and filter glasses in your size.
                        </div>
                      </div>
                      <button className="w-full mt-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                        Log in now
                      </button>
                    </div>
                  </div>
                </FilterSection>

                {/* Glasses For */}
                <FilterSection title="GLASSES FOR">
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-3 text-sm text-gray-700">Women</span>
                    </label>
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-3 text-sm text-gray-700">Men</span>
                    </label>
                  </div>
                </FilterSection>

                {/* Glasses Width */}
                <FilterSection title="GLASSES WIDTH">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Small</span>
                      </label>
                      <div className="w-6 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Medium</span>
                      </label>
                      <div className="w-8 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Large</span>
                      </label>
                      <div className="w-10 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                    <button className="w-full py-3 mt-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <span className="text-base">📏</span>
                      <span>Determine glasses size</span>
                    </button>
                  </div>
                </FilterSection>

                {/* Glass Width Range */}
                <FilterSection title="GLASS WIDTH">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input 
                        type="number" 
                        placeholder="20 mm" 
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-gray-400">—</span>
                      <input 
                        type="number" 
                        placeholder="62 mm" 
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="px-1">
                      <input
                        type="range"
                        min="20"
                        max="62"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </FilterSection>

                {/* Shape */}
                <FilterSection title="SHAPE">
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: 'Round', icon: '◯' },
                      { name: 'Square', icon: '⬜' },
                      { name: 'Rectangle', icon: '▭' },
                      { name: 'Browline', icon: '👓' },
                      { name: 'Butterfly / Cat Eye', icon: '🦋' },
                      { name: 'Aviator', icon: '✈️' },
                      { name: 'Narrow', icon: '▬' },
                      { name: 'Oval', icon: '⭕' }
                    ].map((shape) => (
                      <label key={shape.name} className="flex items-center space-x-2 text-xs hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-xs text-blue-600 font-medium">{shape.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Brand */}
                <FilterSection title="BRAND">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search brands..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {['Ray-Ban', 'Gucci', 'Prada', 'Mister Spex Collection', 'Oakley', 'Tom Ford'].map((brand) => (
                        <label key={brand} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-3 text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </FilterSection>

                {/* Price */}
                <FilterSection title="PRICE">
                  <div className="space-y-1">
                    {[
                      '< 50 $',
                      '50 $ to 100 $', 
                      '100 $ to 150 $',
                      '150 $ to 200 $',
                      '> 200 $'
                    ].map((price) => (
                      <label key={price} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-blue-600 font-medium">{price}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

              </div>
            </div>

            {/* Right Content - Products Grid */}
            <div className="w-full lg:w-4/5">
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18v-6h6v6h-6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                  <button 
                    onClick={clearAllFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product) => (
                      <div key={product.id} className="group cursor-pointer bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                            </div>
                          </div>
                          
                          {/* Product Image - using thumbnail from backend */}
                          <img 
                            src={product.thumbnailUrl || "/api/placeholder/400/320"}
                            alt={`${product.brandName} ${product.displayName}`}
                            className="w-full h-full max-w-[350px] max-h-[350px] object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/api/placeholder/400/320";
                            }}
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="space-y-4 p-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 text-secondary">{product.brandName}</h3>
                            <p className="text-base font-light text-secondary">{product.displayName}</p>
                          </div>
                          
                          {product.totalVariants > 1 && (
                            <p className="text-sm text-gray-500">{product.totalVariants} variants available</p>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-light text-secondary">Frame price without lenses</p>
                              <span className="text-right text-base font-bold text-primary">
                                {formatVND(product.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {total > pageSize && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button 
                          onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                          disabled={currentPage >= Math.ceil(total / pageSize)}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* Footer - Same as HomePage */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MATNICE EYEWEAR</h3>
              <p className="text-gray-400">
                Your premier destination for stylish glasses and sunglasses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/glasses" className="hover:text-white">Glasses</Link></li>
                <li><Link to="/sunglasses" className="hover:text-white">Sunglasses</Link></li>
                <li><Link to="/contact-lenses" className="hover:text-white">Contact Lenses</Link></li>
                <li><Link to="/brands" className="hover:text-white">Brands</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/size-guide" className="hover:text-white">Size Guide</Link></li>
                <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MATNICE EYEWEAR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
