import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, User, ChevronRight, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link } from 'react-router-dom';
import VirtualTryOnImage from '../assets/Virtual-Eyewear-Try-On.jpg';

const HomePage: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

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
    }, 100); // 100ms delay
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
      {/* Header */}
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

        {/* Navigation Section */}
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
                {/* Glasses Dropdown Content */}
                {activeDropdown === 'glasses' && (
                  <div className="grid grid-cols-6 gap-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Category</h3>
                      <ul className="space-y-3">
                        {glassesCategories.map((category, index) => (
                          <li key={index}>
                            <Link
                              to={category.href}
                              className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Brands</h3>
                      <ul className="space-y-3">
                        <li><Link to="/brands/ray-ban" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Ray-Ban</Link></li>
                        <li><Link to="/brands/oakley" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Oakley</Link></li>
                        <li><Link to="/brands/prada" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Prada</Link></li>
                        <li><Link to="/brands/gucci" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Gucci</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Features</h3>
                      <ul className="space-y-3">
                        <li><Link to="/glasses/blue-light" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Blue Light Blocking</Link></li>
                        <li><Link to="/glasses/progressive" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Progressive Lenses</Link></li>
                        <li><Link to="/glasses/anti-glare" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Anti-Glare</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Shape</h3>
                      <ul className="space-y-3">
                        <li><Link to="/glasses/round" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Round</Link></li>
                        <li><Link to="/glasses/square" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Square</Link></li>
                        <li><Link to="/glasses/cat-eye" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Cat Eye</Link></li>
                        <li><Link to="/glasses/aviator" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Aviator</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Featured Products</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <img src="/api/placeholder/150/100" alt="Featured glasses" className="w-full h-20 object-contain mb-2" />
                          <p className="text-sm font-medium">Ray-Ban Classic</p>
                          <p className="text-sm text-gray-600">From 2,500,000₫</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <img src="/api/placeholder/150/100" alt="Featured glasses" className="w-full h-20 object-contain mb-2" />
                          <p className="text-sm font-medium">Oakley Sport</p>
                          <p className="text-sm text-gray-600">From 3,200,000₫</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sunglasses Dropdown Content */}
                {activeDropdown === 'sunglasses' && (
                  <div className="grid grid-cols-6 gap-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Category</h3>
                      <ul className="space-y-3">
                        {sunglassesCategories.map((category, index) => (
                          <li key={index}>
                            <Link
                              to={category.href}
                              className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Protection</h3>
                      <ul className="space-y-3">
                        <li><Link to="/sunglasses/uv400" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">UV400 Protection</Link></li>
                        <li><Link to="/sunglasses/polarized" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Polarized</Link></li>
                        <li><Link to="/sunglasses/mirrored" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Mirrored Lenses</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Style</h3>
                      <ul className="space-y-3">
                        <li><Link to="/sunglasses/aviator" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Aviator</Link></li>
                        <li><Link to="/sunglasses/wayfarer" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Wayfarer</Link></li>
                        <li><Link to="/sunglasses/oversized" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Oversized</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Brands</h3>
                      <ul className="space-y-3">
                        <li><Link to="/brands/ray-ban" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Ray-Ban</Link></li>
                        <li><Link to="/brands/oakley" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Oakley</Link></li>
                        <li><Link to="/brands/prada" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Prada</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Summer Collection</h3>
                      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">New Summer Styles</h4>
                        <p className="text-gray-700 mb-4">Discover our latest collection of premium sunglasses</p>
                        <Link to="/sunglasses/summer" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Brands Dropdown Content */}
                {activeDropdown === 'brands' && (
                  <div className="grid grid-cols-6 gap-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Premium Brands</h3>
                      <ul className="space-y-3">
                        {brandsCategories.map((brand, index) => (
                          <li key={index}>
                            <Link
                              to={brand.href}
                              className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300"
                            >
                              {brand.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Luxury</h3>
                      <ul className="space-y-3">
                        <li><Link to="/brands/cartier" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Cartier</Link></li>
                        <li><Link to="/brands/versace" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Versace</Link></li>
                        <li><Link to="/brands/dolce-gabbana" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Dolce & Gabbana</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Sports</h3>
                      <ul className="space-y-3">
                        <li><Link to="/brands/nike" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Nike</Link></li>
                        <li><Link to="/brands/adidas" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Adidas</Link></li>
                        <li><Link to="/brands/under-armour" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Under Armour</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Classic</h3>
                      <ul className="space-y-3">
                        <li><Link to="/brands/persol" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Persol</Link></li>
                        <li><Link to="/brands/maui-jim" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Maui Jim</Link></li>
                        <li><Link to="/brands/costa" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Costa Del Mar</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Brand Spotlight</h3>
                      <div className="bg-black text-white rounded-lg p-6">
                        <h4 className="text-xl font-bold mb-2">Ray-Ban</h4>
                        <p className="text-gray-300 mb-4">Iconic eyewear since 1937. Discover timeless classics and modern innovations.</p>
                        <Link to="/brands/ray-ban" className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                          Explore Collection
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutique Dropdown Content */}
                {activeDropdown === 'boutique' && (
                  <div className="grid grid-cols-6 gap-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Boutique Collection</h3>
                      <ul className="space-y-3">
                        {boutiqueCategories.map((category, index) => (
                          <li key={index}>
                            <Link
                              to={category.href}
                              className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Exclusive Brands</h3>
                      <ul className="space-y-3">
                        <li><Link to="/boutique/lindberg" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Lindberg</Link></li>
                        <li><Link to="/boutique/ic-berlin" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">IC! Berlin</Link></li>
                        <li><Link to="/boutique/anne-et-valentin" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Anne & Valentin</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Materials</h3>
                      <ul className="space-y-3">
                        <li><Link to="/boutique/titanium" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Titanium</Link></li>
                        <li><Link to="/boutique/carbon-fiber" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Carbon Fiber</Link></li>
                        <li><Link to="/boutique/horn" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Natural Horn</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Customization</h3>
                      <ul className="space-y-3">
                        <li><Link to="/boutique/bespoke" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Bespoke Frames</Link></li>
                        <li><Link to="/boutique/engraving" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Personal Engraving</Link></li>
                        <li><Link to="/boutique/color-matching" className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-gray-300">Color Matching</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Boutique Experience</h3>
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Premium Service</h4>
                        <p className="text-gray-700 mb-4">Experience personalized fitting, exclusive designs, and white-glove service.</p>
                        <Link to="/boutique/appointment" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                          Book Consultation
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Dropdown Content */}
                {activeDropdown === 'ai' && (
                  <div className="grid grid-cols-6 gap-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">AI Features</h3>
                      <ul className="space-y-3">
                        {aiCategories.map((feature, index) => (
                          <li key={index}>
                            <Link
                              to={feature.href}
                              className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300"
                            >
                              {feature.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Face Analysis</h3>
                      <ul className="space-y-3">
                        <li><Link to="/ai/face-shape" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">Face Shape Detection</Link></li>
                        <li><Link to="/ai/skin-tone" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">Skin Tone Matching</Link></li>
                        <li><Link to="/ai/features" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">Facial Features</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Smart Recommendations</h3>
                      <ul className="space-y-3">
                        <li><Link to="/ai/style-quiz" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">Style Quiz</Link></li>
                        <li><Link to="/ai/lifestyle" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">Lifestyle Match</Link></li>
                        <li><Link to="/ai/trending" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">Trending Styles</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Technology</h3>
                      <ul className="space-y-3">
                        <li><Link to="/ai/ar-technology" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">AR Technology</Link></li>
                        <li><Link to="/ai/machine-learning" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">Machine Learning</Link></li>
                        <li><Link to="/ai/3d-modeling" className="text-gray-600 hover:text-red-600 hover:font-semibold transition-all duration-200 block py-1 border-b border-transparent hover:border-red-300">3D Modeling</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Try AI Now</h3>
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-6">
                        <h4 className="text-xl font-bold mb-2">Virtual Try-On</h4>
                        <p className="text-red-100 mb-4">Experience the future of eyewear shopping with our AI-powered virtual fitting room.</p>
                        <Link to="/ai/virtual-try-on" className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-semibold">
                          Start Virtual Try-On
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[700px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex items-center h-full">
            <div className="w-1/2 space-y-8">
              <div>
                <h1 className="text-6xl font-bold text-gray-800 leading-tight">
                  Find Your
                  <span className="block text-blue-600">Perfect Glasses</span>
                </h1>
                <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                  Tỏa sáng với mắt kính thông minh! AI 'soi' khuôn mặt, AR cho bạn thử kính ảo siêu chất.
                  Chọn kính chuẩn gu, chuẩn dáng, chuẩn luôn tầm nhìn!
                </p>
                <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                  Chọn kính chuẩn gu, chuẩn dáng, chuẩn luôn tầm nhìn!
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Link 
                  to="/glasses"
                  className="bg-black text-white px-8 py-4 text-lg font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Shop Glasses
                </Link>
                <Link 
                  to="/ai/virtual-try-on"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 text-lg font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Try AI Fitting
                </Link>
              </div>

              <div className="flex items-center space-x-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">10K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">500+</div>
                  <div className="text-gray-600">Frame Styles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">50+</div>
                  <div className="text-gray-600">Premium Brands</div>
                </div>
              </div>
            </div>
            
            <div className="w-1/2 flex justify-center">
              <div className="relative">
                  <img 
                    src={VirtualTryOnImage}
                    alt="Premium Glasses"
                    className="w-130 h-100 object-contain rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
            </div>
          </div>
        </div>
        
        {/* Navigation arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition"
          aria-label="Previous slide"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">
              EUROPE'S LEADING ONLINE OPTICIAN
            </p>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Find your new favourite glasses
            </h2>
            <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition">
              Discover all glasses
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Women Category */}
            <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="/api/placeholder/500/400" 
                alt="Women glasses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-4xl font-bold mb-4">Women</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">Glasses</span>
                    <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">Sunglasses</span>
                    <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Men Category */}
            <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="/api/placeholder/500/400" 
                alt="Men glasses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-4xl font-bold mb-4">Men</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">Glasses</span>
                    <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">Sunglasses</span>
                    <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Bestsellers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
                  -25%
                </div>
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs rounded">
                  Boutique
                </div>
                <div className="absolute top-4 right-16">
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                </div>
                <img 
                  src="/api/placeholder/250/200" 
                  alt="Miu Miu glasses"
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Miu Miu</h3>
                <p className="text-gray-600 text-sm">MU 11WS 1AB5S0</p>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 line-through text-sm">10.798.500₫</span>
                  <span className="font-bold text-lg">8.098.500₫</span>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
                  -30%
                </div>
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs rounded">
                  Boutique
                </div>
                <div className="absolute top-4 right-16">
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                </div>
                <img 
                  src="/api/placeholder/250/200" 
                  alt="Saint Laurent glasses"
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Saint Laurent</h3>
                <p className="text-gray-600 text-sm">SL M115 004</p>
                <p className="text-sm text-gray-500">Prescription-ready</p>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 line-through text-sm">8.938.500₫</span>
                  <span className="font-bold text-lg">6.253.500₫</span>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
                  -25%
                </div>
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs rounded">
                  Boutique
                </div>
                <div className="absolute top-4 right-16">
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                </div>
                <img 
                  src="/api/placeholder/250/200" 
                  alt="Tom Ford sunglasses"
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Tom Ford</h3>
                <p className="text-gray-600 text-sm">Bronson FT 1044 01E</p>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 line-through text-sm">11.218.500₫</span>
                  <span className="font-bold text-lg">6.163.500₫</span>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="group cursor-pointer">
              <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                <div className="absolute top-4 right-4">
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                </div>
                <img 
                  src="/api/placeholder/250/200" 
                  alt="Boss glasses"
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Boss</h3>
                <p className="text-gray-600 text-sm">BV 1033 R80</p>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">5.698.500₫</span>
                </div>
              </div>
            </div>
          </div>

          {/* View more button */}
          <div className="text-center mt-12">
            <button 
              className="w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="View more products"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
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
                Your premier destination for stylish glasses and sunglasses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Glasses</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Sunglasses</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Contact Lenses</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Brands</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Size Guide</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Returns</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">FAQ</a></li>
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

export default HomePage;
