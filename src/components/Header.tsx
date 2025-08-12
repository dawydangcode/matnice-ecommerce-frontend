import React from 'react';
import { Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white shadow-sm border-b">
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
    </div>
  );
};

export default Header;
