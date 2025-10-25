import React, { useState, useEffect, useRef } from 'react';
import { Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../stores/wishlist.store';
import { useAuthStore } from '../stores/auth.store';
import { useWishlistCount } from '../hooks/useWishlistCount';
import { formatVND } from '../utils/currency';

const WishlistDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { items, totalItems, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const wishlistCount = useWishlistCount();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load wishlist when user is available
  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id, fetchWishlist]);

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

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleRemoveItem = async (wishlistItemId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFromWishlist(wishlistItemId);
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      {/* Wishlist Icon with Badge */}
      <div className="relative">
        {isMobile ? (
          <div onClick={handleWishlistClick} className="relative cursor-pointer">
            <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </div>
        ) : (
          <Link to="/wishlist" className="relative">
            <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {wishlistCount > 99 ? '99+' : wishlistCount}
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
          {!user?.id ? (
            <div className="p-6 text-center">
              <Heart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-4">Please login to view your wishlist</p>
              <Link 
                to="/login" 
                className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center">
              <Heart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-4">Your wishlist is empty</p>
              <Link 
                to="/" 
                className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    Wishlist ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </h3>
                </div>
              </div>

              {/* Items */}
              <div className="max-h-96 overflow-y-auto">
                {items.map((item) => {
                  // Debug: Log item data
                  console.log('[WishlistDropdown] ==== ITEM DEBUG ====');
                  console.log('[WishlistDropdown] Full item:', JSON.stringify(item, null, 2));
                  console.log('[WishlistDropdown] thumbnailUrl:', item.thumbnailUrl);
                  console.log('[WishlistDropdown] imageUrl:', item.imageUrl);
                  console.log('[WishlistDropdown] ==== END ====');
                  
                  // Determine the display name
                  const displayName = item.displayName || item.productName || item.lensName || 'Item';
                  const imageUrl = item.thumbnailUrl || item.imageUrl || '/api/placeholder/64/64';
                  const itemUrl = item.itemType === 'product' 
                    ? `/product/${item.productId}` 
                    : `/lens/${item.lensId}`;
                  
                  return (
                    <Link 
                      key={item.id} 
                      to={itemUrl}
                      className="block p-4 border-b hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={imageUrl}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/64/64';
                              }}
                            />
                          </div>
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          {item.brandName && (
                            <p className="text-xs text-gray-500 mb-1">{item.brandName}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                              {displayName}
                            </h4>
                            {item.productPrice && (
                              <p className="text-sm font-semibold text-gray-900 ml-2 flex-shrink-0">
                                {formatVND(item.productPrice)}
                              </p>
                            )}
                          </div>
                          {item.colorName && (
                            <p className="text-xs text-gray-500 mt-1">Color: {item.colorName}</p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => handleRemoveItem(item.id, e)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove from wishlist"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50">
                <Link
                  to="/wishlist"
                  className="block w-full bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  View Full Wishlist
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistDropdown;
