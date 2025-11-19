import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, X, ShoppingBag, Home } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useWishlistStore } from '../stores/wishlist.store';
import { useAuthStore } from '../stores/auth.store';
import { formatVND } from '../utils/currency';
import toast from 'react-hot-toast';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, totalItems, fetchWishlist, removeFromWishlist, loading } = useWishlistStore();
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user?.id, fetchWishlist, navigate]);

  const handleRemoveItem = async (wishlistItemId: number, itemName: string) => {
    try {
      setRemovingItemId(wishlistItemId);
      await removeFromWishlist(wishlistItemId);
      toast.success(`${itemName} removed from wishlist`);
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setRemovingItemId(null);
    }
  };

  if (!user?.id) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Favourites ({totalItems} item{totalItems !== 1 ? 's' : ''})
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Link to="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                  <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                  Home
                </Link>
                <span>/</span>
                <span className="text-gray-900">Favourites</span>
              </div>
            </div>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <Heart className="w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Save your favorite items here to keep track of them and purchase later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Items Grid */}
            <div className="space-y-4">
              {items.map((item) => {
                const displayName = item.displayName || item.productName || item.lensName || 'Item';
                const imageUrl = item.thumbnailUrl || item.imageUrl || '/api/placeholder/400/400';
                const itemUrl = item.itemType === 'product' 
                  ? `/product/${item.productId}` 
                  : `/lens/${item.lensId}`;
                const isRemoving = removingItemId === item.id;

                return (
                  <div 
                    key={item.id} 
                    className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link to={itemUrl} className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="w-40 h-40 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={imageUrl}
                            alt={displayName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/400/400';
                            }}
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            {item.brandName && (
                              <p className="text-xs sm:text-sm text-gray-600 mb-1">{item.brandName}</p>
                            )}
                            <Link to={itemUrl} className="hover:underline">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                {displayName}
                              </h3>
                            </Link>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id, displayName)}
                            disabled={isRemoving}
                            className="flex-shrink-0 ml-4 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Remove from wishlist"
                          >
                            <X className={`w-5 h-5 ${isRemoving ? 'animate-spin' : ''}`} />
                          </button>
                        </div>

                        {/* Product Details Table */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                            {item.colorName && (
                              <>
                                <div>
                                  <span className="text-gray-600 font-medium">Colour</span>
                                  <span className="text-gray-500"> (front / side)</span>
                                </div>
                                <div className="sm:col-span-2 text-gray-900">
                                  {item.colorName}
                                </div>
                              </>
                            )}
                            {item.itemType === 'product' && (
                              <>
                                <div className="text-gray-600 font-medium">Frame width</div>
                                <div className="sm:col-span-2 text-gray-900">-</div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          <div>
                            {item.productPrice && (
                              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                {formatVND(item.productPrice)}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">VAT included</p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Link
                              to={itemUrl}
                              className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                              Xem chi tiết
                            </Link>
                            <Link
                              to={item.itemType === 'product' ? `/lens-selection?productId=${item.productId}` : itemUrl}
                              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Choose your lenses
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
