import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LensCard, BrandLensData, LensCategoryData } from '../types/lensCard.types';
import { lensCardService } from '../services/lensCard.service';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import HeroContent from '../components/HeroContent';
import FilterSection from '../components/FilterSection';
import { formatVND } from '../utils/currency';
import '../styles/product-page.css';
import '../styles/filter-section.css';

const LensPage: React.FC = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  
  // Lenses state
  const [lenses, setLenses] = useState<LensCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Filter states
  const [brands, setBrands] = useState<BrandLensData[]>([]);
  const [categories, setCategories] = useState<LensCategoryData[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');

  // Create stable dependencies for useEffect
  const minPrice = useMemo(() => priceRange[0], [priceRange]);
  const maxPrice = useMemo(() => priceRange[1], [priceRange]);
  
  // Get dynamic hero content for lenses
  const heroContent = {
    title: 'Contact Lenses',
    description: 'Discover our premium collection of contact lenses for clear vision and comfort.',
    heroImage: '/assets/hero-lens.jpg',
    backgroundColor: 'bg-blue-50'
  };

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm) return brands;
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
  }, [brands, brandSearchTerm]);

  // Fetch brands and categories for filter on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          lensCardService.getBrandLensForFilter(),
          lensCardService.getCategoryLensForFilter(),
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch lenses on component mount and when filters change
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

        const response = await lensCardService.getLensCards({
          page: currentPage,
          limit: pageSize,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 10000000 ? maxPrice : undefined,
          sortBy: backendSortBy,
          sortOrder: sortOrder,
          brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
          categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
          types: selectedTypes.length > 0 ? selectedTypes : undefined,
        });
        setLenses(response.data || []);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Error fetching lenses:', error);
        setLenses([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, minPrice, maxPrice, sortBy, selectedBrands, selectedCategories, selectedTypes]);

  // Helper function to get selected filter labels
  const getSelectedFilters = (): Array<{type: string, value: any, label: string, remove: () => void}> => {
    const filters: Array<{type: string, value: any, label: string, remove: () => void}> = [];
    
    // Type filters
    selectedTypes.forEach(type => {
      filters.push({ type: 'type', value: type, label: `Type: ${type}`, remove: () => setSelectedTypes(prev => prev.filter(t => t !== type)) });
    });

    // Category filters
    selectedCategories.forEach(categoryId => {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        filters.push({ type: 'category', value: categoryId, label: `Category: ${category.name}`, remove: () => setSelectedCategories(prev => prev.filter(id => id !== categoryId)) });
      }
    });

    // Brand filters
    selectedBrands.forEach(brandId => {
      const brand = brands.find(b => b.id === brandId);
      if (brand) {
        filters.push({ type: 'brand', value: brandId, label: brand.name, remove: () => setSelectedBrands(prev => prev.filter(id => id !== brandId)) });
      }
    });

    return filters;
  };

  const selectedFilters = getSelectedFilters();

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange([0, 10000000]);
    setCurrentPage(1);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedTypes([]);
    setBrandSearchTerm('');
  };

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [selectedBrands, selectedCategories, selectedTypes, priceRange]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50">
        <Header />
        <Navigation />
      </header>

      {/* Hero Content */}
      <HeroContent
        title={heroContent.title}
        description={heroContent.description}
        heroImage={heroContent.heroImage}
        backgroundColor={heroContent.backgroundColor}
      />

      {/* Main Content Area */}
      <section className="py-8">
        <div className="max-w-full mx-auto px-6">
          {/* Desktop Grid Layout (≥1024px) */}
          <div className="product-listing-grid lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            
            {/* Left Sidebar - Filters */}
            <div className={`filter-area ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
                
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-5 pl-2">
                  <h2 className="filter-header">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="lg:hidden text-gray-600 hover:text-black text-xl"
                  >
                    ×
                  </button>
                </div>
                
                {/* Recommendations Section */}
                <FilterSection title="RECOMMENDATIONS FOR YOU">
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1 filter-checkbox" />
                      <span className="text-sm text-gray-700">Your recommended lens size</span>
                    </label>
                    <div className="bg-gray-200 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-100 text-black-600 flex items-center justify-center mt-1 text-xs font-medium">
                          i
                        </div>
                        <div className="text-[14px] text-black-700">
                          Do you already own a pair of our lenses? Log in now and filter lenses in your size.
                        </div>
                      </div>
                      <button className="w-full mt-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black-600 hover:bg-gray-50 transition-colors">
                        Log in now
                      </button>
                    </div>
                  </div>
                </FilterSection>

                {/* Type */}
                <FilterSection title="TYPE">
                  <div className="space-y-2">
                    {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((type) => (
                      <label key={type} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTypes([...selectedTypes, type]);
                            } else {
                              setSelectedTypes(selectedTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Category */}
                <FilterSection title="CATEGORY">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                            }
                          }}
                        />
                        <span className="ml-3 mt-3 text-sm text-gray-700">{category.name}</span>
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
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input 
                        type="number" 
                        placeholder="Min (₫)"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-24 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input 
                        type="number" 
                        placeholder="Max (₫)"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-24 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      {[
                        'Dưới 100,000₫',
                        '100,000₫ - 500,000₫', 
                        '500,000₫ - 1,000,000₫',
                        '1,000,000₫ - 2,000,000₫',
                        'Trên 2,000,000₫'
                      ].map((price, index) => {
                        const ranges = [
                          [0, 100000],
                          [100000, 500000],
                          [500000, 1000000],
                          [1000000, 2000000],
                          [2000000, 10000000]
                        ];
                        const [min, max] = ranges[index];
                        const isSelected = priceRange[0] === min && priceRange[1] === max;
                        
                        return (
                          <label key={price} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="filter-checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPriceRange([min, max]);
                                } else {
                                  setPriceRange([0, 10000000]);
                                }
                              }}
                            />
                            <span className="ml-3 text-sm text-gray-600 font-medium">{price}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </FilterSection>

              </div>
            </div>

            {/* Right Content - Lenses List Area */}
            <div className="product-list-area lg:col-start-2 lg:col-end-3">
              
              {/* Results Count and Sort Options */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="product-total-count">
                    {total} Results
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Filters
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="newest">Most popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Selected Filters */}
              {selectedFilters.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedFilters.map((filter, index) => (
                      <div
                        key={`${filter.type}-${filter.value}-${index}`}
                        className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{filter.label}</span>
                        <button
                          onClick={filter.remove}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          aria-label={`Remove ${filter.label} filter`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black-600"></div>
                </div>
              ) : lenses.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18v-6h6v6h-6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No lenses found</h3>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lenses.map((lens) => (
                      <Link 
                        key={lens.id} 
                        to={`/lens/${lens.id}`}
                        className="group cursor-pointer bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow block"
                      >
                        <div className="relative rounded-lg mb-6 overflow-hidden h-96 flex items-center justify-center">
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-row space-x-2 z-10">
                            {lens.isNew && (
                              <div className="bg-white text-green-700 px-3 py-1 text-xs font-medium">
                                New
                              </div>
                            )}
                            {lens.isFeatured && (
                              <div className="bg-gray-800 text-white px-3 py-1 text-xs font-medium">
                                Featured
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
                                // Handle favorite logic here
                              }}
                            >
                              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                            </button>
                          </div>
                          
                          {/* Lens Image */}
                          <img 
                            src={lens.images && lens.images.length > 0 
                              ? lens.images.find(img => img.isThumbnail === 1)?.imageUrl || lens.images[0]?.imageUrl 
                              : "/api/placeholder/400/320"}
                            alt={`${lens.brandLens?.name || 'Lens'} ${lens.name}`}
                            className="w-full h-full max-w-[350px] max-h-[350px] object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/api/placeholder/400/320";
                            }}
                          />
                        </div>
                        
                        {/* Lens Info */}
                        <div className="space-y-4 p-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 text-secondary">{lens.brandLens?.name || 'Unknown Brand'}</h3>
                            <p className="text-base font-light text-secondary">{lens.name}</p>
                          </div>
                          
                          {lens.categoryLens?.name && (
                            <p className="text-sm text-gray-500">{lens.categoryLens.name}</p>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-light text-secondary">Base price</p>
                              <span className="text-right text-base font-bold text-primary">
                                {formatVND(typeof lens.basePrice === 'string' ? parseInt(lens.basePrice) : lens.basePrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
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

      {/* Footer - Same as ProductsPage */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MATNICE EYEWEAR</h3>
              <p className="text-gray-400">
                Your premier destination for stylish glasses and contact lenses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/glasses" className="hover:text-white">Glasses</Link></li>
                <li><Link to="/sunglasses" className="hover:text-white">Sunglasses</Link></li>
                <li><Link to="/lenses" className="hover:text-white">Contact Lenses</Link></li>
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

export default LensPage;
