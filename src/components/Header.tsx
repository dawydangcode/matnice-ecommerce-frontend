import React from 'react';
import { Search, User, Menu } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Link, useLocation } from 'react-router-dom';
import smallEyeLogo from '../assets/small_eye_logo.png';
import CartDropdown from './CartDropdown';
import WishlistDropdown from './WishlistDropdown';

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

  return (
    <div className="block md:hidden bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Menu Button + Search */}
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
