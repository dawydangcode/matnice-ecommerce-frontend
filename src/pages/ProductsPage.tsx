import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../types/product-card.types';
import { 
  FrameType, 
  FrameShapeType, 
  FrameMaterialType, 
  FrameBridgeDesignType, 
  FrameStyleType,
  ProductGenderType 
} from '../types/product.types';
import { BrandData, brandService } from '../services/brand.service';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import GlassesHeroContent from '../components/category/GlassesHeroContent';
import ProductListHeader from '../components/ProductListHeader';
import FilterSection from '../components/FilterSection';
import GlassWidthSmall from '../components/icons/filter-section/GlassWidthSmall';
import GlassWidthMedium from '../components/icons/filter-section/GlassWidthMedium';
import GlassWidthLarge from '../components/icons/filter-section/GlassWidthLarge';
import NoseBridgeSmall from '../components/icons/filter-section/NoseBridgeSmall';
import NoseBridgeMedium from '../components/icons/filter-section/NoseBridgeMedium';
import NoseBridgeLarge from '../components/icons/filter-section/NoseBridgeLarge';
import productCardService from '../services/product-card.service';
import { formatVND } from '../utils/currency';
import '../styles/product-page.css';
import '../styles/filter-section.css';

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

  // Filter states
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<ProductGenderType[]>([]);
  const [selectedFrameTypes, setSelectedFrameTypes] = useState<FrameType[]>([]);
  const [selectedFrameShapes, setSelectedFrameShapes] = useState<FrameShapeType[]>([]);
  const [selectedFrameMaterials, setSelectedFrameMaterials] = useState<FrameMaterialType[]>([]);
  const [selectedBridgeDesigns, setSelectedBridgeDesigns] = useState<FrameBridgeDesignType[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<FrameStyleType[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');

  // Create stable dependencies for useEffect
  const minPrice = useMemo(() => priceRange[0], [priceRange]);
  const maxPrice = useMemo(() => priceRange[1], [priceRange]);

  // Fetch brands for filter on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await brandService.getBrandsForFilter();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm) return brands;
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
  }, [brands, brandSearchTerm]);

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
    setSelectedBrands([]);
    setSelectedGenders([]);
    setSelectedFrameTypes([]);
    setSelectedFrameShapes([]);
    setSelectedFrameMaterials([]);
    setSelectedBridgeDesigns([]);
    setSelectedStyles([]);
    setBrandSearchTerm('');
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
              <div className="bg-white rounded-lg shadow-sm p-2 space-y-1">
                
                {/* Recommendations Section */}
                <FilterSection title="RECOMMENDATIONS FOR YOU">
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1 filter-checkbox" />
                      <span className="text-sm text-gray-700">Your recommended glasses width</span>
                    </label>
                    <div className="bg-gray-200 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-100 text-black-600 flex items-center justify-center mt-1 text-xs font-medium">
                          i
                        </div>
                        <div className="text-[14px] text-black-700">
                          Do you already own a pair of our glasses? Log in now and filter glasses in your size.
                        </div>
                      </div>
                      <button className="w-full mt-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black-600 hover:bg-gray-50 transition-colors">
                        Log in now
                      </button>
                    </div>
                  </div>
                </FilterSection>

                {/* Glasses For */}
                <FilterSection title="GLASSES FOR">
                  <div className="space-y-3">
                    {Object.values(ProductGenderType).map((gender) => (
                      <label key={gender} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedGenders.includes(gender)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGenders([...selectedGenders, gender]);
                            } else {
                              setSelectedGenders(selectedGenders.filter(g => g !== gender));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                          {gender === ProductGenderType.MALE ? 'Men' : 
                           gender === ProductGenderType.FEMALE ? 'Women' : 
                           'Unisex'}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Glasses Width */}
                <FilterSection title="GLASSES WIDTH">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Small</span>
                      </label>
                      <GlassWidthSmall className="text-black-400" size={40} />
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Medium</span>
                      </label>
                      <GlassWidthMedium className="text-black-400" size={40} />
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Large</span>
                      </label>
                      <GlassWidthLarge className="text-black-400" size={40} />
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
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      />
                      <span className="text-gray-400">—</span>
                      <input 
                        type="number" 
                        placeholder="62 mm" 
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                    {Object.values(FrameShapeType).map((shape) => (
                      <label key={shape} className="flex items-center space-x-2 text-xs hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedFrameShapes.includes(shape)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFrameShapes([...selectedFrameShapes, shape]);
                            } else {
                              setSelectedFrameShapes(selectedFrameShapes.filter(s => s !== shape));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                          {shape.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Nose Bridge */}
                <FilterSection title="NOSE BRIDGE">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Rather narrow</span>
                      </label>
                      <NoseBridgeSmall className="text-black-400 ml-3 mt-3" size={40} />
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Rather medium</span>
                      </label>
                      <NoseBridgeMedium className="text-black-400 ml-3 mt-3" size={40} />
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Rather wide</span>
                      </label>
                      <NoseBridgeLarge className="text-black-400 ml-3 mt-3" size={40} />
                    </div>
                  </div>
                </FilterSection>

                {/* Frame Type */}
                <FilterSection title="FRAME TYPE">
                  <div className="space-y-2">
                    {Object.values(FrameType).map((frameType) => (
                      <label key={frameType} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox "
                          checked={selectedFrameTypes.includes(frameType)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFrameTypes([...selectedFrameTypes, frameType]);
                            } else {
                              setSelectedFrameTypes(selectedFrameTypes.filter(ft => ft !== frameType));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                          {frameType.replace(/_/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Frame Material */}
                <FilterSection title="FRAME MATERIAL">
                  <div className="space-y-2">
                    {Object.values(FrameMaterialType).map((material) => (
                      <label key={material} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedFrameMaterials.includes(material)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFrameMaterials([...selectedFrameMaterials, material]);
                            } else {
                              setSelectedFrameMaterials(selectedFrameMaterials.filter(m => m !== material));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                          {material}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Bridge Design */}
                <FilterSection title="BRIDGE DESIGN">
                  <div className="space-y-2">
                    {Object.values(FrameBridgeDesignType).map((bridgeDesign) => (
                      <label key={bridgeDesign} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedBridgeDesigns.includes(bridgeDesign)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBridgeDesigns([...selectedBridgeDesigns, bridgeDesign]);
                            } else {
                              setSelectedBridgeDesigns(selectedBridgeDesigns.filter(bd => bd !== bridgeDesign));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                          {bridgeDesign.replace(/_/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Style */}
                <FilterSection title="STYLE">
                  <div className="space-y-2">
                    {Object.values(FrameStyleType).map((style) => (
                      <label key={style} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedStyles.includes(style)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStyles([...selectedStyles, style]);
                            } else {
                              setSelectedStyles(selectedStyles.filter(s => s !== style));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                          {style}
                        </span>
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
                        value={brandSearchTerm}
                        onChange={(e) => setBrandSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {filteredBrands.map((brand) => (
                        <label key={brand.id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="filter-checkbox"
                            checked={selectedBrands.includes(brand.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBrands([...selectedBrands, brand.id]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(id => id !== brand.id));
                              }
                            }}
                          />
                          <span className="ml-3 mt-3 text-sm text-gray-700">{brand.name}</span>
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
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 text-sm text-gray-600 font-medium">{price}</span>
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
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black-600"></div>
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
                    className="bg-black-600 text-white px-4 py-2 rounded-md hover:bg-black-700 transition-colors"
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
                                  ? 'bg-black-600 text-white'
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
