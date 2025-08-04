import React from 'react';
import { Search, ShoppingCart, Heart, User, Menu, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        {/* Top bar */}
        <div className="bg-gray-50 text-sm py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
                SERVICE
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="w-4 h-4 cursor-pointer hover:text-gray-600" />
              <Heart className="w-4 h-4 cursor-pointer hover:text-gray-600" />
              <ShoppingCart className="w-4 h-4 cursor-pointer hover:text-gray-600" />
              
              {/* Login/Logout Button */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.username}</span>
                    {user?.role?.name === 'admin' && (
                      <Link to="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
                        Admin
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <Link to="/login" className="text-sm hover:text-gray-600">
                    Login
                  </Link>
                  <span>/</span>
                  <Link to="/register" className="text-sm hover:text-gray-600">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-black text-white px-4 py-2 font-bold text-xl">
                MATNICE EYEWEAR
              </div>
            </div>

            <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="hover:text-gray-900">GLASSES</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="hover:text-gray-900">SUNGLASSES</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="hover:text-gray-900">CONTACT LENSES</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="hover:text-gray-900">BRANDS</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="hover:text-gray-900">BOUTIQUE</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="hover:text-gray-900 text-red-600">SALE</a>
            </nav>

            <div className="md:hidden">
              <Menu className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-yellow-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex items-center h-full">
            <div className="w-1/2 space-y-6">
              <h1 className="text-6xl font-bold text-gray-800">
                SALE: Save<br />
                up to 50%<br />
                <span className="text-4xl">now</span>
                <span className="text-2xl align-top">¹</span>
              </h1>
              <p className="text-gray-600 text-lg">
                On selected glasses and sunglasses
              </p>
              <button className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-900 transition">
                Shop now
              </button>
            </div>
            <div className="w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-3xl transform rotate-6"></div>
              <img 
                src="/api/placeholder/600/400" 
                alt="Sunglasses collection"
                className="relative z-10 w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
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
                  <span className="text-red-500 line-through text-sm">£359.95</span>
                  <span className="font-bold text-lg">£269.95</span>
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
                  <span className="text-red-500 line-through text-sm">£297.95</span>
                  <span className="font-bold text-lg">£208.45</span>
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
                  <span className="text-red-500 line-through text-sm">£373.95</span>
                  <span className="font-bold text-lg">£205.45</span>
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
                  <span className="font-bold text-lg">£189.95</span>
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
