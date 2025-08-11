import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, User, ChevronRight, ChevronDown, Grid, List } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import productService from '../services/product.service';
import { Product } from '../types/product.types';

const ProductsPage: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Fetch products on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: currentPage,
          limit: pageSize,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy: sortBy,
        });
        
        setProducts(response.products || response.data || []);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortBy, priceRange, pageSize]);

  const handleLogout = () => {
    logout();
  };

  const handleMouseEnter = (menu: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
    setTimeoutId(id);
  };

  // Dropdown data
  const glassesCategories = [
    { name: 'All Glasses', href: '/glasses' },
    { name: "Women's Glasses", href: '/glasses/women' },
    { name: "Men's Glasses", href: '/glasses/men' },
    { name: 'Varifocals', href: '/glasses/varifocals' },
    { name: 'Reading Glasses', href: '/glasses/reading' },
    { name: 'Glasses Accessories', href: '/glasses/accessories' },
  ];

  const sunglassesCategories = [
    { name: 'All Sunglasses', href: '/sunglasses' },
    { name: "Women's Sunglasses", href: '/sunglasses/women' },
    { name: "Men's Sunglasses", href: '/sunglasses/men' },
    { name: 'Prescription Sunglasses', href: '/sunglasses/prescription' },
    { name: 'Sunglasses Accessories', href: '/sunglasses/accessories' },
  ];

  const brandsCategories = [
    { name: 'Ray-Ban', href: '/brands/ray-ban' },
    { name: 'Oakley', href: '/brands/oakley' },
    { name: 'Tom Ford', href: '/brands/tom-ford' },
    { name: 'Prada', href: '/brands/prada' },
    { name: 'Gucci', href: '/brands/gucci' },
    { name: 'All Brands', href: '/brands' },
  ];

  const boutiqueCategories = [
    { name: 'Boutique Special', href: '/boutique/special' },
    { name: 'Designer Glasses', href: '/boutique/designer-glasses' },
    { name: 'Designer Sunglasses', href: '/boutique/designer-sunglasses' },
    { name: 'Limited Edition', href: '/boutique/limited' },
  ];

  const aiCategories = [
    { name: 'Virtual Try-On', href: '/ai/virtual-try-on' },
    { name: 'Face Analysis', href: '/ai/face-analysis' },
    { name: 'Style Recommendation', href: '/ai/style-recommendation' },
    { name: 'Frame Finder', href: '/ai/frame-finder' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as HomePage */}
      <header className="bg-white shadow-sm border-b relative z-50">
        {/* Main header with logo centered */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left spacer */}
            <div className="flex-1"></div>
            
            {/* Center Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="bg-black text-white px-6 py-3 font-bold text-2xl">
                MATNICE EYEWEAR
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex-1 flex justify-end items-center space-x-4">
              <Search className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
              <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
              <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
              
              {/* User Menu */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-6 h-6" />
                    <span className="text-sm font-medium">{user?.username}</span>
                    {(user?.role?.name === 'admin' || user?.role?.type === 'admin') && (
                      <Link to="/admin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Admin
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6" />
                  <Link to="/login" className="text-sm hover:text-gray-600 font-medium">
                    Login
                  </Link>
                  <span>/</span>
                  <Link to="/register" className="text-sm hover:text-gray-600 font-medium">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section - Same as HomePage */}
        <nav className="bg-gray-50 border-t relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center space-x-8 py-3">
              
              {/* Glasses Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('glasses')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/glasses"
                  className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                    activeDropdown === 'glasses' 
                      ? 'text-gray-900 border-black font-bold' 
                      : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
                  }`}
                >
                  <span>GLASSES</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>

              {/* Sunglasses Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('sunglasses')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/sunglasses"
                  className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                    activeDropdown === 'sunglasses' 
                      ? 'text-gray-900 border-black font-bold' 
                      : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
                  }`}
                >
                  <span>SUNGLASSES</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>

              {/* Brands Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('brands')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/brands"
                  className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                    activeDropdown === 'brands' 
                      ? 'text-gray-900 border-black font-bold' 
                      : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
                  }`}
                >
                  <span>BRANDS</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>

              {/* Boutique Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('boutique')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/boutique"
                  className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                    activeDropdown === 'boutique' 
                      ? 'text-gray-900 border-black font-bold' 
                      : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
                  }`}
                >
                  <span>BOUTIQUE</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>

              {/* AI Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('ai')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/ai"
                  className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                    activeDropdown === 'ai' 
                      ? 'text-red-700 border-red-600 font-bold' 
                      : 'text-red-600 hover:text-red-700 hover:font-bold border-transparent hover:border-red-400'
                  }`}
                >
                  <span>AI</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

          {/* Full Width Dropdown Menus */}
          {activeDropdown && (
            <div 
              className="absolute top-full left-0 w-full bg-white shadow-lg border-t z-50"
              onMouseEnter={() => {
                if (timeoutId) {
                  clearTimeout(timeoutId);
                  setTimeoutId(null);
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-4 py-8">
                {activeDropdown === 'glasses' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {glassesCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                to={`/glasses/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeDropdown === 'sunglasses' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {sunglassesCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                to={`/sunglasses/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeDropdown === 'brands' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {brandsCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                to={`/brands/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeDropdown === 'boutique' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {boutiqueCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                to={`/boutique/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeDropdown === 'ai' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {aiCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                to={`/ai/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Breadcrumb & Hero Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
              <li><ChevronRight className="w-4 h-4 text-gray-400" /></li>
              <li className="text-gray-900 font-medium">Glasses</li>
            </ol>
          </nav>

          {/* Page Title & Controls */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Glasses</h1>
              <p className="text-gray-600">{total} Results</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            
            {/* Left Sidebar - Filters */}
            <div className="w-1/4 space-y-6">
              
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">Clear all</button>
              </div>

              {/* Gender Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Women</span>
                    <span className="ml-auto text-xs text-gray-500">(587)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Men</span>
                    <span className="ml-auto text-xs text-gray-500">(498)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Unisex</span>
                    <span className="ml-auto text-xs text-gray-500">(311)</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-sm"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                      type="number" 
                      placeholder="Max"
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-sm"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Frame Shape */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Frame Shape</h4>
                <div className="space-y-2">
                  {['Rectangle', 'Round', 'Square', 'Cat-eye', 'Aviator', 'Browline'].map((shape) => (
                    <label key={shape} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">{shape}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frame Material */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Frame Material</h4>
                <div className="space-y-2">
                  {['Plastic/Acetate', 'Metal', 'Mixed Materials', 'Titanium'].map((material) => (
                    <label key={material} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
                <div className="space-y-2">
                  {['Ray-Ban', 'Tom Ford', 'Saint Laurent', 'Prada', 'Gucci', 'Oakley'].map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Content - Products Grid */}
            <div className="w-3/4">
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                      <div key={product.id || product.productId} className="group cursor-pointer">
                        <div className="relative bg-gray-100 rounded-2xl p-6 mb-4 overflow-hidden">
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col space-y-2">
                            {product.isNew && (
                              <div className="bg-green-500 text-white px-3 py-1 text-xs rounded">
                                New
                              </div>
                            )}
                            {product.isBoutique && (
                              <div className="bg-gray-800 text-white px-3 py-1 text-xs rounded">
                                Boutique
                              </div>
                            )}
                          </div>
                          
                          {/* Heart Icon */}
                          <div className="absolute top-4 right-4">
                            <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                          </div>
                          
                          {/* Product Image */}
                          <img 
                            src={product.image || "/api/placeholder/250/200"}
                            alt={`${product.brand?.brandName || product.brandName || 'Product'} ${product.productName || product.name || ''}`}
                            className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-800">{product.brand?.brandName || product.brandName || 'Unknown Brand'}</h3>
                          <p className="text-gray-600 text-sm">{product.productName || product.name || 'Product Name'}</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">
                              {product.price?.toLocaleString() || '0'}₫
                            </span>
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
