import React, { useState } from 'react';
import { Search, User, Menu, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import smallEyeLogo from '../assets/small_eye_logo.png';
import CartDropdown from './CartDropdown';
import WishlistDropdown from './WishlistDropdown';
import SearchModal from './SearchModal';
import {
  glassesCategories,
  sunglassesCategories,
  brandsCategories,
  boutiqueCategories,
  aiCategories
} from '../data/categories';

// Shared props interface
interface HeaderProps {
  isLoggedIn: boolean;
  user: any;
  onLogout: () => void;
}

// Desktop Header Component
const DesktopHeader: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogout }) => {
  const location = useLocation();
  const isAccountPage = location.pathname === '/account';
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block bg-white shadow-sm border-b">
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
              <Search 
                className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" 
                onClick={() => setIsSearchOpen(true)}
              />
              <WishlistDropdown />
              <CartDropdown />
              
              {/* User Menu */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Link to="/account" className="flex items-center space-x-2">
                    <User className={`w-6 h-6 ${isAccountPage ? 'text-black font-bold' : 'hover:text-gray-600'} transition-colors`} />
                    <span className="text-sm font-medium">{user?.username}</span>
                  </Link>
                  {(user?.role?.name === 'admin' || user?.role?.type === 'admin') && (
                    <Link to="/admin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
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
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

// Mobile Header Component
const MobileHeader: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogout }) => {
  const location = useLocation();
  const isAccountPage = location.pathname === '/account';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuLevel, setMenuLevel] = useState<'main' | 'subcategory'>('main');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Disable/enable body scroll when menu opens/closes
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent scrolling on mobile
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveCategory(null);
    setMenuLevel('main');
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setMenuLevel('subcategory');
  };

  const handleBackToMain = () => {
    setMenuLevel('main');
    setActiveCategory(null);
  };

  return (
    <>
      <div className="block md:hidden bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="relative flex items-center justify-between">
            {/* Left - Menu Button + Search */}
            <div className="flex items-center space-x-2 flex-1">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
            
            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/">
                <img 
                  src={smallEyeLogo} 
                  alt="MATNICE EYEWEAR" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <WishlistDropdown />
              <CartDropdown />
              
              {/* User Icon Only */}
              {isLoggedIn ? (
                <Link to="/account" className="p-2">
                  <User className={`w-6 h-6 cursor-pointer ${isAccountPage ? 'text-black font-bold' : 'hover:text-gray-600'} transition-colors`} />
                </Link>
              ) : (
                <Link to="/login" className="p-2">
                  <User className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
            style={{ top: '64px' }}
          />
          
          {/* Menu Drawer */}
          <div className="fixed left-0 w-full bg-white z-50 overflow-y-auto md:hidden shadow-lg" style={{ top: '64px', height: 'calc(100vh - 64px)' }}>
            {/* Main Menu */}
            {menuLevel === 'main' && (
              <>
                {/* User Section */}
                <div className="p-4">
                  {isLoggedIn ? (
                    <div>
                      <h3 className="text-xl font-bold mb-2">Hello, {user?.username}!</h3>
                      <Link 
                        to="/account" 
                        onClick={toggleMobileMenu}
                        className="text-gray-900 hover:text-gray-800 text-sm underline"
                      >
                        Open your account
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold mb-2">Hello!</h3>
                      <Link 
                        to="/login" 
                        onClick={toggleMobileMenu}
                        className="text-blue-600 hover:underline"
                      >
                        Log in
                      </Link>
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div className="py-2">
                  <h3 className="px-4 py-2 text-sm font-bold text-gray-900 uppercase">Categories</h3>
                  
                  {/* Glasses */}
                  <div>
                    <button
                      onClick={() => handleCategoryClick('glasses')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-normal text-gray-600">Glasses</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Sunglasses */}
                  <div>
                    <button
                      onClick={() => handleCategoryClick('sunglasses')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-normal text-gray-600">Sunglasses</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Lens */}
                  <div>
                    <button
                      onClick={() => handleCategoryClick('lens')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-normal text-gray-600">Lens</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Boutique */}
                  <div>
                    <button
                      onClick={() => handleCategoryClick('boutique')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-normal text-gray-600">Boutique</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* AI */}
                  <div>
                    <button
                      onClick={() => handleCategoryClick('ai')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-normal text-red-600">AI</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Help & Advice */}
                <div className="py-2 border-t">
                  <h3 className="px-4 py-2 text-sm font-bold text-gray-900 uppercase">Help & Advice</h3>
                  <Link 
                    to="/try-on-at-home"
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    Try on at home
                  </Link>
                  <Link 
                    to="/virtual-try-on"
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    Virtual try on
                  </Link>
                  <Link 
                    to="/video-consultation"
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    Video consultation
                  </Link>
                  <Link 
                    to="/more-topics"
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    More Topics
                  </Link>
                </div>

                {/* Any Other Questions */}
                <div className="py-4 px-4 border-t bg-gray-50">
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Any other questions?</h3>
                  <p className="text-xs text-gray-600 mb-3">Our optician team will be pleased to advise you</p>
                  <Link 
                    to="/faq"
                    onClick={toggleMobileMenu}
                    className="block py-2 text-sm text-gray-700 hover:text-black"
                  >
                    Frequently asked questions
                  </Link>
                  <a href="tel:0800472547" className="block py-2 text-sm text-gray-700 hover:text-black">
                    0800 472 54 57
                  </a>
                  <Link 
                    to="/service-chat"
                    onClick={toggleMobileMenu}
                    className="block py-2 text-sm text-gray-700 hover:text-black"
                  >
                    Service Chat
                  </Link>
                </div>
              </>
            )}

            {/* Subcategory Menu */}
            {menuLevel === 'subcategory' && (
              <>
                {/* Back Button Header */}
                <div className="flex items-center p-4 border-b bg-gray-50">
                  <button 
                    onClick={handleBackToMain}
                    className="flex items-center text-gray-700 hover:text-black"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                    <span className="font-medium">
                      {activeCategory === 'glasses' && 'Glasses'}
                      {activeCategory === 'sunglasses' && 'Sunglasses'}
                      {activeCategory === 'lens' && 'Lens'}
                      {activeCategory === 'brands' && 'Brands'}
                      {activeCategory === 'boutique' && 'Boutique'}
                      {activeCategory === 'ai' && 'AI'}
                    </span>
                  </button>
                </div>

                {/* Glasses Subcategories */}
                {activeCategory === 'glasses' && (
                  <div className="py-2">
                    {glassesCategories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="px-4 py-2 text-sm font-bold text-gray-900">{category.title}</h3>
                        {category.items.map((item, itemIndex) => (
                          <Link 
                            key={itemIndex}
                            to={`/glasses?category=${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={toggleMobileMenu}
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Sunglasses Subcategories */}
                {activeCategory === 'sunglasses' && (
                  <div className="py-2">
                    {sunglassesCategories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="px-4 py-2 text-sm font-bold text-gray-900">{category.title}</h3>
                        {category.items.map((item, itemIndex) => (
                          <Link 
                            key={itemIndex}
                            to="/sunglasses"
                            onClick={toggleMobileMenu}
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Lens Subcategories */}
                {activeCategory === 'lens' && (
                  <div className="py-2">
                    <div className="mb-4">
                      <h3 className="px-4 py-2 text-sm font-bold text-gray-900">Danh mục</h3>
                      <Link 
                        to="/lenses?type=single-vision"
                        onClick={toggleMobileMenu}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        Single Vision
                      </Link>
                      <Link 
                        to="/lenses?type=drive-safe"
                        onClick={toggleMobileMenu}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        Drive Safe
                      </Link>
                      <Link 
                        to="/lenses?type=progressive"
                        onClick={toggleMobileMenu}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        Progressive
                      </Link>
                      <Link 
                        to="/lenses?type=office"
                        onClick={toggleMobileMenu}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        Office
                      </Link>
                      <Link 
                        to="/lenses?type=non-prescription"
                        onClick={toggleMobileMenu}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        Non-Prescription
                      </Link>
                    </div>
                    <div className="mb-4">
                      <h3 className="px-4 py-2 text-sm font-bold text-gray-900">Chức năng</h3>
                      <p className="px-4 py-2 text-xs text-gray-500">
                        Vui lòng truy cập trang Lens để xem đầy đủ danh mục
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="px-4 py-2 text-sm font-bold text-gray-900">Thương hiệu tròng kính</h3>
                      <p className="px-4 py-2 text-xs text-gray-500">
                        Vui lòng truy cập trang Lens để xem đầy đủ thương hiệu
                      </p>
                    </div>
                  </div>
                )}

                {/* Brands Subcategories */}
                {activeCategory === 'brands' && (
                  <div className="py-2">
                    {brandsCategories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="px-4 py-2 text-sm font-bold text-gray-900">{category.title}</h3>
                        {category.items.map((item, itemIndex) => (
                          <Link 
                            key={itemIndex}
                            to="/brands"
                            onClick={toggleMobileMenu}
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Boutique Subcategories */}
                {activeCategory === 'boutique' && (
                  <div className="py-2">
                    {boutiqueCategories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="px-4 py-2 text-sm font-bold text-gray-900">{category.title}</h3>
                        {category.items.map((item, itemIndex) => (
                          <Link 
                            key={itemIndex}
                            to="/boutique"
                            onClick={toggleMobileMenu}
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Subcategories */}
                {activeCategory === 'ai' && (
                  <div className="py-2">
                    {aiCategories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="px-4 py-2 text-sm font-bold text-gray-900">{category.title}</h3>
                        {category.items.map((item, itemIndex) => (
                          <Link 
                            key={itemIndex}
                            to="/ai"
                            onClick={toggleMobileMenu}
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

// Main Header Component
const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  const sharedProps = {
    isLoggedIn,
    user,
    onLogout: handleLogout
  };

  return (
    <>
      <DesktopHeader {...sharedProps} />
      <MobileHeader {...sharedProps} />
    </>
  );
};

export default Header;
