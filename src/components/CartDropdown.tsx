import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cart.store';
import { useAuthStore } from '../stores/auth.store';

const CartDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { items, totalItems, totalPrice, isLoading, error, fetchCartItems, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load cart data when user is available
  useEffect(() => {
    if (user?.id) {
      fetchCartItems(user.id);
    }
  }, [user?.id, fetchCartItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      {/* Cart Icon with Badge */}
      <div className="relative">
        {isMobile ? (
          <div onClick={handleCartClick} className="relative cursor-pointer">
            <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
        ) : (
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Invisible bridge to prevent dropdown from closing */}
      {isOpen && !isMobile && (
        <div className="absolute right-0 top-6 w-16 h-4 bg-transparent z-40"></div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-8 w-96 max-w-[calc(100vw-2rem)] bg-white shadow-xl border rounded-lg z-50">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-4">Giỏ hàng trống</p>
              <Link 
                to="/" 
                className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Giỏ hàng ({totalItems} sản phẩm)</h3>
                </div>
              </div>

              {/* Items */}
              <div className="max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="p-4 border-b hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          Frame: {formatVND(item.framePrice)}
                        </p>
                        {item.lensPrice > 0 && (
                          <p className="text-xs text-gray-500">
                            Lens: {formatVND(item.lensPrice)}
                          </p>
                        )}
                        {item.lensQuality && (
                          <p className="text-xs text-gray-500">
                            Quality: {item.lensQuality}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                updateQuantity(parseInt(item.id), item.quantity - 1);
                              }}
                              className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                updateQuantity(parseInt(item.id), item.quantity + 1);
                              }}
                              className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-green-600">
                              {formatVND(item.totalPrice)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeItem(parseInt(item.id));
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatVND(totalPrice)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Giao hàng (7 - 15 ngày): Miễn phí
                </div>
                <Link
                  to="/cart"
                  className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Đi đến giỏ hàng
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
