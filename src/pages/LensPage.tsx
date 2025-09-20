import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import FilterSection from '../components/FilterSection';
import LensCard from '../components/LensCard';
import { lensCardService } from '../services/lensCard.service';
import { 
  LensCard as LensCardType, 
  LensType, 
  BrandLensData, 
  CategoryLensData 
} from '../types/lensCard.types';

const LensPage: React.FC = () => {
  const location = useLocation();
  const { category, brand } = useParams<{ category?: string; brand?: string }>();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  // Lenses state
  const [lenses, setLenses] = useState<LensCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Filter states
  const [brandLenses, setBrandLenses] = useState<BrandLensData[]>([]);
  const [categoryLenses, setCategoryLenses] = useState<CategoryLensData[]>([]);
  const [selectedBrandLenses, setSelectedBrandLenses] = useState<number[]>([]);
  const [selectedCategoryLenses, setSelectedCategoryLenses] = useState<number[]>([]);
  const [selectedLensTypes, setSelectedLensTypes] = useState<LensType[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');

  // Create stable dependencies for useEffect
  const minPrice = useMemo(() => priceRange[0], [priceRange]);
  const maxPrice = useMemo(() => priceRange[1], [priceRange]);

  // Fetch brands and categories for filter on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          lensCardService.getBrandLensForFilter(),
          lensCardService.getCategoryLensForFilter(),
        ]);
        setBrandLenses(brandsData);
        setCategoryLenses(categoriesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilters();
  }, []);

  // Auto-apply filters based on URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category')?.toLowerCase() || category?.toLowerCase();
    const brandParam = searchParams.get('brand')?.toLowerCase() || brand?.toLowerCase();

    // Auto-select category if from URL
    if (categoryParam && categoryLenses.length > 0) {
      const foundCategory = categoryLenses.find(cat => 
        cat.name.toLowerCase().includes(categoryParam) ||
        categoryParam.includes(cat.name.toLowerCase())
      );
      if (foundCategory && !selectedCategoryLenses.includes(foundCategory.id)) {
        setSelectedCategoryLenses([foundCategory.id]);
      }
    }

    // Auto-select brand if from URL  
    if (brandParam && brandLenses.length > 0) {
      const foundBrand = brandLenses.find(brand => 
        brand.name.toLowerCase().includes(brandParam) ||
        brandParam.includes(brand.name.toLowerCase())
      );
      if (foundBrand && !selectedBrandLenses.includes(foundBrand.id)) {
        setSelectedBrandLenses([foundBrand.id]);
      }
    }
  }, [searchParams, category, brand, categoryLenses, brandLenses, selectedCategoryLenses, selectedBrandLenses]);

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm) return brandLenses;
    return brandLenses.filter(brand => 
      brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
  }, [brandLenses, brandSearchTerm]);

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
          brandLensIds: selectedBrandLenses.length > 0 ? selectedBrandLenses : undefined,
          categoryLensIds: selectedCategoryLenses.length > 0 ? selectedCategoryLenses : undefined,
          lensTypes: selectedLensTypes.length > 0 ? selectedLensTypes : undefined,
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
  }, [currentPage, pageSize, minPrice, maxPrice, sortBy, selectedBrandLenses, selectedCategoryLenses, selectedLensTypes]);

  // Helper function to get selected filter labels
  const getSelectedFilters = () => {
    const filters: { type: string; value: any; label: string; remove: () => void }[] = [];
    
    // Lens type filters
    selectedLensTypes.forEach(type => {
      const typeLabels: Record<LensType, string> = {
        [LensType.SINGLE_VISION]: 'Single Vision',
        [LensType.DRIVE_SAFE]: 'Drive Safe',
        [LensType.PROGRESSIVE]: 'Progressive',
        [LensType.OFFICE]: 'Office',
        [LensType.NON_PRESCRIPTION]: 'Non-Prescription',
      };
      const label = `Type: ${typeLabels[type]}`;
      filters.push({ 
        type: 'lensType', 
        value: type, 
        label, 
        remove: () => setSelectedLensTypes(prev => prev.filter(t => t !== type)) 
      });
    });

    // Brand filters
    selectedBrandLenses.forEach(brandId => {
      const brand = brandLenses.find(b => b.id === brandId);
      if (brand) {
        filters.push({ 
          type: 'brand', 
          value: brandId, 
          label: brand.name, 
          remove: () => setSelectedBrandLenses(prev => prev.filter(id => id !== brandId)) 
        });
      }
    });

    // Category filters
    selectedCategoryLenses.forEach(categoryId => {
      const category = categoryLenses.find(c => c.id === categoryId);
      if (category) {
        filters.push({ 
          type: 'category', 
          value: categoryId, 
          label: `Category: ${category.name}`, 
          remove: () => setSelectedCategoryLenses(prev => prev.filter(id => id !== categoryId)) 
        });
      }
    });

    return filters;
  };

  const selectedFilters = getSelectedFilters();

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange([0, 10000000]);
    setCurrentPage(1);
    setSelectedBrandLenses([]);
    setSelectedCategoryLenses([]);
    setSelectedLensTypes([]);
    setBrandSearchTerm('');
  };

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [selectedBrandLenses, selectedCategoryLenses, selectedLensTypes, priceRange]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50">
        <Header />
        <Navigation />
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Lenses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our collection of high-quality lenses designed for your vision needs
            </p>
          </div>
        </div>
      </div>

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
                  <h2 className="filter-header text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="lg:hidden text-gray-600 hover:text-black text-xl"
                  >
                    ×
                  </button>
                </div>

                {/* Lens Type */}
                <FilterSection title="LENS TYPE">
                  <div className="space-y-2">
                    {Object.values(LensType).map((type) => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedLensTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLensTypes(prev => [...prev, type]);
                            } else {
                              setSelectedLensTypes(prev => prev.filter(t => t !== type));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">
                          {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1).toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Category */}
                <FilterSection title="CATEGORY">
                  <div className="space-y-4">
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {categoryLenses.map((category) => (
                        <label key={category.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedCategoryLenses.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategoryLenses(prev => [...prev, category.id]);
                              } else {
                                setSelectedCategoryLenses(prev => prev.filter(id => id !== category.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
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
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {filteredBrands.map((brand) => (
                        <label key={brand.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedBrandLenses.includes(brand.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBrandLenses(prev => [...prev, brand.id]);
                              } else {
                                setSelectedBrandLenses(prev => prev.filter(id => id !== brand.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{brand.name}</span>
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
                        { label: '< 500,000₫', min: 0, max: 500000 },
                        { label: '500,000₫ - 1,000,000₫', min: 500000, max: 1000000 },
                        { label: '1,000,000₫ - 2,000,000₫', min: 1000000, max: 2000000 },
                        { label: '2,000,000₫ - 5,000,000₫', min: 2000000, max: 5000000 },
                        { label: '> 5,000,000₫', min: 5000000, max: 10000000 }
                      ].map((range) => (
                        <label key={range.label} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={priceRange[0] === range.min && priceRange[1] === range.max}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPriceRange([range.min, range.max]);
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{range.label}</span>
                        </label>
                      ))}
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
                  <div className="product-total-count text-gray-600">
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Most Popular</option>
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
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {filter.label}
                        <button
                          onClick={filter.remove}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
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
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lenses.map((lens) => (
                      <LensCard key={lens.id} lens={lens} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {total > pageSize && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {[...Array(Math.ceil(total / pageSize))].map((_, index) => {
                          const page = index + 1;
                          const isCurrentPage = page === currentPage;
                          
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 border rounded-lg text-sm ${
                                isCurrentPage
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(total / pageSize)))}
                          disabled={currentPage === Math.ceil(total / pageSize)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MATNICE EYEWEAR</h3>
              <p className="text-gray-400">
                Your premier destination for premium lenses and optical solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/glasses" className="hover:text-white">Glasses</Link></li>
                <li><Link to="/sunglasses" className="hover:text-white">Sunglasses</Link></li>
                <li><Link to="/lenses" className="hover:text-white">Lenses</Link></li>
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
