import React, { useState } from 'react';
import { Search, User, Menu, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link, useLocation } from 'react-router-dom';
import smallEyeLogo from '../assets/small_eye_logo.png';
import CartDropdown from './CartDropdown';
import WishlistDropdown from './WishlistDropdown';
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

  return (
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
            <Search className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
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
  );
};

// Mobile Header Component
const MobileHeader: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogout }) => {
  const location = useLocation();
  const isAccountPage = location.pathname === '/account';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuLevel, setMenuLevel] = useState<'main' | 'subcategory'>('main');

  // Disable/enable body scroll when menu opens/closes
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
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
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Menu Button + Search */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-6 h-6" />
              </button>
            </div>
            
            {/* Center - Logo */}
            <div className="flex justify-center">
              <Link to="/">
                <img 
                  src={smallEyeLogo} 
                  alt="MATNICE EYEWEAR" 
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-3">
              <WishlistDropdown />
              <CartDropdown />
              
              {/* User Icon Only */}
              {isLoggedIn ? (
                <Link to="/account">
                  <User className={`w-6 h-6 cursor-pointer ${isAccountPage ? 'text-black font-bold' : 'hover:text-gray-600'} transition-colors`} />
                </Link>
              ) : (
                <Link to="/login">
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
                <div className="p-4 border-b bg-gray-50">
                  {isLoggedIn ? (
                    <div>
                      <h3 className="text-xl font-bold mb-2">Hello!</h3>
                      <Link 
                        to="/account" 
                        onClick={toggleMobileMenu}
                        className="text-blue-600 hover:underline"
                      >
                        {user?.username}
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
                  <h3 className="px-4 py-2 text-sm font-bold text-gray-500 uppercase">Categories</h3>
                  
                  {/* Glasses */}
                  <div className="border-b">
                    <button
                      onClick={() => handleCategoryClick('glasses')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">Glasses</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sunglasses */}
                  <div className="border-b">
                    <button
                      onClick={() => handleCategoryClick('sunglasses')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">Sunglasses</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contact Lenses */}
                  <div className="border-b">
                    <button
                      onClick={() => handleCategoryClick('lens')}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">Contact lenses</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Brands */}
                  <div className="border-b">
                    <Link
                      to="/brands"
                      onClick={toggleMobileMenu}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">Brands</span>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Boutique */}
                  <div className="border-b">
                    <Link
                      to="/boutique"
                      onClick={toggleMobileMenu}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">Boutique</span>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Help & Advice */}
                <div className="py-2 border-t">
                  <h3 className="px-4 py-2 text-sm font-bold text-gray-500 uppercase">Help & Advice</h3>
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
                      {activeCategory === 'lens' && 'Contact lenses'}
                    </span>
                  </button>
                </div>

                {/* Glasses Subcategories */}
                {activeCategory === 'glasses' && (
                  <div className="py-2">
                    <h3 className="px-4 py-3 text-sm font-bold text-gray-500 uppercase">Category</h3>
                    <Link 
                      to="/glasses?category=all-glasses"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      All Glasses
                    </Link>
                    <Link 
                      to="/glasses?category=women-s-glasses"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Women's Glasses
                    </Link>
                    <Link 
                      to="/glasses?category=men-s-glasses"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Men's Glasses
                    </Link>
                    <Link 
                      to="/glasses?category=varifocals"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Varifocals
                    </Link>
                    <Link 
                      to="/glasses?category=reading"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Reading Glasses
                    </Link>
                    <Link 
                      to="/glasses?category=reading-glasses"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Outlet Glasses
                    </Link>
                    <Link 
                      to="/glasses?category=accessories"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Glasses accessories
                    </Link>
                    <Link 
                      to="/glasses?category=brands"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Our exclusive Brands
                    </Link>
                    <Link 
                      to="/glasses"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      More glasses categories
                    </Link>
                  </div>
                )}

                {/* Sunglasses Subcategories */}
                {activeCategory === 'sunglasses' && (
                  <div className="py-2">
                    <h3 className="px-4 py-3 text-sm font-bold text-gray-500 uppercase">Category</h3>
                    <Link 
                      to="/sunglasses?category=all"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      All Sunglasses
                    </Link>
                    <Link 
                      to="/sunglasses?category=women"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Women's Sunglasses
                    </Link>
                    <Link 
                      to="/sunglasses?category=men"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Men's Sunglasses
                    </Link>
                    <Link 
                      to="/sunglasses?category=prescription"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Prescription Sunglasses
                    </Link>
                    <Link 
                      to="/sunglasses?category=sport"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Sport Sunglasses
                    </Link>
                  </div>
                )}

                {/* Lens Subcategories */}
                {activeCategory === 'lens' && (
                  <div className="py-2">
                    <h3 className="px-4 py-3 text-sm font-bold text-gray-500 uppercase">Category</h3>
                    <Link 
                      to="/lenses?type=single-vision"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Single Vision
                    </Link>
                    <Link 
                      to="/lenses?type=progressive"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Progressive
                    </Link>
                    <Link 
                      to="/lenses?type=drive-safe"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                    >
                      Drive Safe
                    </Link>
                    <Link 
                      to="/lenses?type=office"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
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
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

// Main Header Component
const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
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
