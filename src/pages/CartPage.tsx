import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/auth.store';
import cartService, { CartSummary } from '../services/cart.service';
import { localCartService, LocalCartItem } from '../services/localCart.service';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/modal-animations.css';

// Simple icon components
const TrashIcon = () => <span className="text-lg">X</span>;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [localCartItems, setLocalCartItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadCartData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (isLoggedIn) {
        // Load backend cart for authenticated users
        const summary = await cartService.getMyCartSummary();
        console.log('Cart summary data:', summary);
        setCartSummary(summary);
        setLocalCartItems([]);
      } else {
        // Load local cart for guest users
        const localCart = localCartService.getLocalCart();
        console.log('Local cart data:', localCart);
        setLocalCartItems(localCart.items);
        setCartSummary(null);
      }
    } catch (error: any) {
      console.error('Error loading cart data:', error);
      if (isLoggedIn) {
        toast.error('Unable to load cart');
      } else {
        // Fallback to empty local cart
        setLocalCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadCartData();
  }, [loadCartData]);

  // Cleanup: restore body scroll on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numPrice);
  };

  const formatPrescriptionValue = (value: number | undefined | string, suffix = ''): string => {
    if (value === undefined || value === null || value === '') return '-';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '-' : `${numValue}${suffix}`;
  };

  // Helper function to check if ADD values should be displayed
  const hasAddValues = (prescription: any) => {
    if (!prescription) return false;
    return (prescription.addLeft !== undefined && prescription.addLeft !== null) ||
           (prescription.addRight !== undefined && prescription.addRight !== null);
  };

  // Translation helpers
  const translateLensType = (lensType: string) => {
    const translations: { [key: string]: string } = {
      'PROGRESSIVE': 'Progressive',
      'SINGLE_VISION': 'Single Vision',
      'BIFOCAL': 'Bifocal'
    };
    return translations[lensType] || lensType;
  };

  const translateDesign = (design: string) => {
    const translations: { [key: string]: string } = {
      'NONE': 'None',
      'STANDARD': 'Standard',
      'PREMIUM': 'Premium'
    };
    return translations[design] || design;
  };

  const safeParseNumber = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };



  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      await cartService.deleteCartItem(parseInt(itemToDelete));
      toast.success('Product removed from cart');
      await loadCartData();
      setShowDeleteModal(false);
      setItemToDelete(null);
      // Restore body scroll
      document.body.style.overflow = 'unset';
    } catch (error: any) {
      console.error('Error deleting cart item:', error);
      toast.error('Unable to delete product');
    }
  };

  const handleDeleteClick = (cartFrameId: number) => {
    setItemToDelete(cartFrameId.toString());
    setShowDeleteModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Remove the authentication check - allow both authenticated and guest users

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-xl">Loading cart...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if cart is empty (both backend and local)
  const isCartEmpty = isLoggedIn 
    ? (!cartSummary || cartSummary.items.length === 0)
    : (localCartItems.length === 0);

  if (isCartEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navigation />
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Basket</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🛒</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
              Explore our collection of eyewear and lenses to find products that suit you.
            </p>
            {!isLoggedIn && (
              <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-200">
                <p className="text-blue-800 text-xs sm:text-sm">
                  💡 <strong>Tip:</strong> Log in to save your cart and sync across all devices
                </p>
                <Link
                  to="/login"
                  className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                >
                  Log in now →
                </Link>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/glasses"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Shop Glasses
              </Link>
              <Link
                to="/lenses"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Shop Lenses
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navigation />
      
      <div className="flex-1">
        {/* Cart Header */}
        <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Basket</h1>
            <div className="mt-2 inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-800">
              ✓ Lenses added to cart
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="space-y-3 sm:space-y-4">
              {/* Cart items - unified layout for both authenticated and guest users */}
              {isLoggedIn && cartSummary && cartSummary.items.map((item) => {
                return (
                  <div key={item.cartFrameId} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-10">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                      {/* Product Image */}
                      <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.productImage ? (
                          <img 
                            src={item.productImage} 
                            alt={item.productName || `Product ${item.productId}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          {/* Left side - Product Info */}
                          <div className="flex-1 pr-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                              {(() => {
                                let displayName = item.productName || `Product #${item.productId}`;
                                if (item.selectedColor?.productVariantName) {
                                  displayName += ` ${item.selectedColor.productVariantName}`;
                                }
                                return displayName;
                              })()}
                            </h3>
                            
                            {/* Display selected color if available */}
                            {item.selectedColor && (
                              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                                <strong>Color:</strong> {item.selectedColor.colorName}
                              </p>
                            )}
                            
                            <p className="text-xs sm:text-sm text-gray-600">
                              <strong>Quantity:</strong> {item.quantity}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            onClick={() => handleDeleteClick(item.cartFrameId)}
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        {/* Price Information - Mobile optimized */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span><strong>Frame Price:</strong></span>
                              <span>{formatPrice(item.framePrice)}</span>
                            </div>
                            {item.lensDetail && (
                              <div className="flex justify-between">
                                <span><strong>Lens Price:</strong></span>
                                <span>{formatPrice(item.lensDetail.lensPrice)}</span>
                              </div>
                            )}
                            
                            {/* Coating prices */}
                            {item.lensDetail?.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                              <div>
                                {item.lensDetail.selectedCoatings.map((coating, index) => (
                                  <div key={index} className="flex justify-between">
                                    <span><strong>Coating ({coating.name}):</strong></span>
                                    <span>+{formatPrice(coating.price)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Tint color price */}
                            {item.lensDetail?.selectedTintColor?.price && (
                              <div className="flex justify-between">
                                <span><strong>Tint Color ({item.lensDetail.selectedTintColor.name}):</strong></span>
                                <span>+{formatPrice(item.lensDetail.selectedTintColor.price)}</span>
                              </div>
                            )}
                            
                            {safeParseNumber(item.discount) > 0 && (
                              <div className="flex justify-between">
                                <span><strong>Discount:</strong></span>
                                <span>-{formatPrice(item.discount)}</span>
                              </div>
                            )}
                            
                            {/* Total Price */}
                            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                              <span className="text-sm sm:text-lg font-bold text-black"><strong>Total:</strong></span>
                              <span className="text-sm sm:text-lg font-bold text-black">
                                {formatPrice((() => {
                                  let total = safeParseNumber(item.totalPrice) + safeParseNumber(item.lensDetail?.lensPrice);
                                  
                                  // Add coating prices
                                  if (item.lensDetail?.selectedCoatings) {
                                    const coatingTotal = item.lensDetail.selectedCoatings.reduce((sum: number, coating: any) => 
                                      sum + safeParseNumber(coating.price), 0);
                                    total += coatingTotal;
                                  }
                                  
                                  // Add tint color price
                                  if (item.lensDetail?.selectedTintColor) {
                                    total += safeParseNumber(item.lensDetail.selectedTintColor.price);
                                  }
                                  
                                  return total;
                                })())}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Lens Information */}
                        {(item.lensInfo || item.lensVariantInfo) && (
                          <div className="mt-3 sm:mt-4">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Lens Information</h4>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                              {item.lensInfo && (
                                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
                                  {/* Lens Image */}
                                  {item.lensInfo.image && (
                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                                      <img
                                        src={item.lensInfo.image}
                                        alt={item.lensInfo.name}
                                        className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200"
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Lens Details */}
                                  <div className="flex-1 w-full">
                                    <h5 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{item.lensInfo.name}</h5>
                                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                      <p><span className="font-medium">Type:</span> {translateLensType(item.lensInfo.lensType)}</p>
                                      {item.lensInfo.origin && (
                                        <p><span className="font-medium">Origin:</span> {item.lensInfo.origin}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Lens Variant Info */}
                              {item.lensVariantInfo && (
                                <div className="border-t border-gray-200 pt-3">
                                  <h6 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Options</h6>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700">Design:</span>
                                      <span className="ml-2 text-gray-600">{translateDesign(item.lensVariantInfo.design)}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Material:</span>
                                      <span className="ml-2 text-gray-600">{item.lensVariantInfo.material}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Price:</span>
                                      <span className="ml-2 text-gray-600">{formatPrice(item.lensVariantInfo.price)}</span>
                                    </div>
                                    {item.lensVariantInfo.lensThickness && (
                                      <div className="sm:col-span-2">
                                        <span className="font-medium text-gray-700">Thickness:</span>
                                        <span className="ml-2 text-gray-600">{item.lensVariantInfo.lensThickness.name} (Index: {item.lensVariantInfo.lensThickness.indexValue})</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Lens Coating Info */}
                              {item.lensDetail?.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <h6 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Coating</h6>
                                  <div className="space-y-2">
                                    {item.lensDetail.selectedCoatings.map((coating, index) => (
                                      <div key={index} className="text-xs sm:text-sm">
                                        <div>
                                          <span className="font-medium text-gray-700">{coating.name}</span>
                                          {coating.description && (
                                            <p className="text-xs text-gray-500">{coating.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Lens Tint Color Info */}
                              {item.lensDetail?.selectedTintColor && (
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <h6 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Màu tông</h6>
                                  <div className="text-xs sm:text-sm">
                                    <div className="flex items-center">
                                      {item.lensDetail.selectedTintColor.colorCode && (
                                        <div 
                                          className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                          title={`Màu: ${item.lensDetail.selectedTintColor.colorCode}`}
                                        ></div>
                                      )}
                                      <span className="font-medium text-gray-700">{item.lensDetail.selectedTintColor.name}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Prescription Information */}
                        {item.lensDetail?.prescription && (
                          <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                            <h6 className="text-xs sm:text-sm font-medium text-gray-800 mb-2 sm:mb-3">Thông tin đơn thuốc</h6>
                            <div className="overflow-x-auto bg-gray-50 p-2 sm:p-4 rounded-lg">
                              <table className="min-w-full text-xs sm:text-sm">
                                <thead>
                                  <tr className="border-b border-gray-300">
                                    <th className="text-left py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">Mắt</th>
                                    <th className="text-center py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">SPH</th>
                                    <th className="text-center py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">CYL</th>
                                    <th className="text-center py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">AXIS</th>
                                    {hasAddValues(item.lensDetail.prescription) && (
                                      <th className="text-center py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">ADD</th>
                                    )}
                                    <th className="text-center py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">PD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-gray-200">
                                    <td className="py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">Phải</td>
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.rightEye.sphere)}
                                    </td>
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.rightEye.cylinder)}
                                    </td>
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.rightEye.axis, '°')}
                                    </td>
                                    {hasAddValues(item.lensDetail.prescription) && (
                                      <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                        {formatPrescriptionValue(item.lensDetail.prescription.addRight)}
                                      </td>
                                    )}
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.pdRight)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 sm:py-3 px-1 sm:px-3 font-medium text-gray-700">Trái</td>
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.leftEye.sphere)}
                                    </td>
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.leftEye.cylinder)}
                                    </td>
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.leftEye.axis, '°')}
                                    </td>
                                    {hasAddValues(item.lensDetail.prescription) && (
                                      <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                        {formatPrescriptionValue(item.lensDetail.prescription.addLeft)}
                                      </td>
                                    )}
                                    <td className="text-center py-2 sm:py-3 px-1 sm:px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.pdLeft)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Local cart items for guest users - EXACT SAME layout as backend */}
              {!isLoggedIn && localCartItems.map((item) => {
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border p-10">
                    <div className="flex items-start gap-8">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        {item.productImage ? (
                          <img 
                            src={item.productImage} 
                            alt={item.productName || `Product ${item.productId}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          {/* Left side - Product Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {(() => {
                                let displayName = item.productName || `Product #${item.productId}`;
                                if (item.selectedColor?.productVariantName) {
                                  displayName += ` ${item.selectedColor.productVariantName}`;
                                }
                                return displayName;
                              })()}
                            </h3>
                            
                            {/* Display selected color if available and not 'Unknown' */}
                            {item.selectedColor && item.selectedColor.colorName !== 'Unknown' && (
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Color:</strong> {item.selectedColor.colorName}
                              </p>
                            )}
                            
                            <p className="text-sm text-gray-600">
                              <strong>Quantity:</strong> {item.quantity}
                            </p>
                          </div>

                          {/* Right side - Price Information */}
                          <div className="text-right space-y-1">
                            <div className="text-sm text-gray-600">
                              <p><strong>Frame Price:</strong> {formatPrice(item.framePrice)}</p>
                              {item.lensDetail && (
                                <p><strong>Lens Price:</strong> {formatPrice(item.lensDetail.lensPrice)}</p>
                              )}
                              
                              {/* Coating prices */}
                              {item.lensDetail?.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                <div>
                                  {item.lensDetail.selectedCoatings.map((coating, index) => (
                                    <p key={index}><strong>Coating ({coating.name}):</strong> +{formatPrice(coating.price)}</p>
                                  ))}
                                </div>
                              )}
                              
                              {/* Tint color price */}
                              {item.lensDetail?.selectedTintColor?.price && (
                                <p><strong>Tint Color ({item.lensDetail.selectedTintColor.name}):</strong> +{formatPrice(item.lensDetail.selectedTintColor.price)}</p>
                              )}
                              
                              {safeParseNumber(item.discount) > 0 && (
                                <p><strong>Discount:</strong> -{formatPrice(item.discount)}</p>
                              )}
                            </div>
                            
                            {/* Total Price */}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <p className="text-lg font-bold text-black">
                                <strong>Total:</strong> 
                                {formatPrice((() => {
                                  let total = safeParseNumber(item.framePrice) + safeParseNumber(item.lensDetail?.lensPrice);
                                  
                                  // Add coating prices
                                  if (item.lensDetail?.selectedCoatings) {
                                    const coatingTotal = item.lensDetail.selectedCoatings.reduce((sum: number, coating: any) => 
                                      sum + safeParseNumber(coating.price), 0);
                                    total += coatingTotal;
                                  }
                                  
                                  // Add tint color price
                                  if (item.lensDetail?.selectedTintColor) {
                                    total += safeParseNumber(item.lensDetail.selectedTintColor.price);
                                  }
                                  
                                  return total;
                                })())}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Lens Information */}
                        {(item.lensInfo || item.lensVariantInfo) && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Lens Information</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              {item.lensInfo && (
                                <div className="flex items-start space-x-4 mb-4">
                                  {/* Lens Image */}
                                  {item.lensInfo.image && (
                                    <div className="flex-shrink-0">
                                      <img
                                        src={item.lensInfo.image}
                                        alt={item.lensInfo.name}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Lens Details */}
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 mb-1">{item.lensInfo.name}</h5>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p><span className="font-medium">Type:</span> {translateLensType(item.lensInfo.lensType)}</p>
                                      {item.lensInfo.origin && (
                                        <p><span className="font-medium">Origin:</span> {item.lensInfo.origin}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Lens Variant Info */}
                              {item.lensVariantInfo && (
                                <div className="border-t border-gray-200 pt-3">
                                  <h6 className="text-sm font-medium text-gray-800 mb-2">Options</h6>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700">Design:</span>
                                      <span className="ml-2 text-gray-600">{translateDesign(item.lensVariantInfo.design)}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Material:</span>
                                      <span className="ml-2 text-gray-600">{item.lensVariantInfo.material}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Price:</span>
                                      <span className="ml-2 text-gray-600">{formatPrice(item.lensVariantInfo.price)}</span>
                                    </div>
                                    {item.lensVariantInfo.lensThickness && (
                                      <div>
                                        <span className="font-medium text-gray-700">Thickness:</span>
                                        <span className="ml-2 text-gray-600">{item.lensVariantInfo.lensThickness.name} (Index: {item.lensVariantInfo.lensThickness.indexValue})</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Lens Coating Info */}
                              {item.lensDetail?.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <h6 className="text-sm font-medium text-gray-800 mb-2">Coating</h6>
                                  <div className="space-y-2">
                                    {item.lensDetail.selectedCoatings.map((coating, index) => (
                                      <div key={index} className="text-sm">
                                        <div>
                                          <span className="font-medium text-gray-700">{coating.name}</span>
                                          {coating.description && (
                                            <p className="text-xs text-gray-500">{coating.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Lens Tint Color Info */}
                              {item.lensDetail?.selectedTintColor && (
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <h6 className="text-sm font-medium text-gray-800 mb-2">Tint Color</h6>
                                  <div className="text-sm">
                                    <div className="flex items-center">
                                      <span className="font-medium text-gray-700">{item.lensDetail.selectedTintColor.name}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Prescription Information */}
                        {item.lensDetail?.prescription && (
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <h6 className="text-sm font-medium text-gray-800 mb-3">Prescription Information</h6>
                            <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-300">
                                    <th className="text-left py-3 px-3 font-medium text-gray-700">Eye</th>
                                    <th className="text-center py-3 px-3 font-medium text-gray-700">SPH</th>
                                    <th className="text-center py-3 px-3 font-medium text-gray-700">CYL</th>
                                    <th className="text-center py-3 px-3 font-medium text-gray-700">AXIS</th>
                                    {hasAddValues(item.lensDetail.prescription) && (
                                      <th className="text-center py-3 px-3 font-medium text-gray-700">ADD</th>
                                    )}
                                    <th className="text-center py-3 px-3 font-medium text-gray-700">PD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-gray-200">
                                    <td className="py-3 px-3 font-medium text-gray-700">Right</td>
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.rightEye.sphere)}
                                    </td>
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.rightEye.cylinder)}
                                    </td>
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.rightEye.axis, '°')}
                                    </td>
                                    {hasAddValues(item.lensDetail.prescription) && (
                                      <td className="text-center py-3 px-3 text-gray-600">
                                        {formatPrescriptionValue(item.lensDetail.prescription.addRight)}
                                      </td>
                                    )}
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.pdRight)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-3 px-3 font-medium text-gray-700">Left</td>
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.leftEye.sphere)}
                                    </td>
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.leftEye.cylinder)}
                                    </td>
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.leftEye.axis, '°')}
                                    </td>
                                    {hasAddValues(item.lensDetail.prescription) && (
                                      <td className="text-center py-3 px-3 text-gray-600">
                                        {formatPrescriptionValue(item.lensDetail.prescription.addLeft)}
                                      </td>
                                    )}
                                    <td className="text-center py-3 px-3 text-gray-600">
                                      {formatPrescriptionValue(item.lensDetail.prescription.pdLeft)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0">
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this product?')) {
                              localCartService.removeFromLocalCart(item.id);
                              loadCartData(); // Refresh cart
                              toast.success('Product removed from cart');
                            }
                          }}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:sticky lg:top-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              
              {isLoggedIn && cartSummary ? (
                // Backend cart summary
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>Total Frame Price ({cartSummary.totalItems} items)</span>
                    <span>{formatPrice(cartSummary.totalFramePrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Total Lens Price</span>
                    <span>{formatPrice(cartSummary.totalLensPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">-{formatPrice(cartSummary.totalDiscount)}</span>
                  </div>
                  
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-black-600">{formatPrice(cartSummary.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Local cart summary
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>Total Frame Price ({localCartItems.length} items)</span>
                    <span>{formatPrice(localCartItems.reduce((sum, item) => sum + item.framePrice * item.quantity, 0))}</span>
                  </div>
                  
                  {localCartItems.some(item => item.lensDetail?.lensPrice && item.lensDetail.lensPrice > 0) && (
                    <div className="flex justify-between">
                      <span>Total Lens Price</span>
                      <span>{formatPrice(localCartItems.reduce((sum, item) => sum + ((item.lensDetail?.lensPrice || 0) * item.quantity), 0))}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">-{formatPrice(localCartItems.reduce((sum, item) => sum + item.discount, 0))}</span>
                  </div>
                  
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-black-600">{formatPrice(localCartItems.reduce((sum, item) => sum + item.totalPrice, 0))}</span>
                    </div>
                  </div>
                  
                  {!isLoggedIn && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 text-xs mb-2">
                        💡 <strong>Note:</strong> Temporary Cart
                      </p>
                      <p className="text-amber-700 text-xs">
                        Log in to save your cart and proceed to checkout
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {isLoggedIn ? (
                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 sm:mt-6 bg-green-700 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-green-800 transition-colors font-medium text-sm sm:text-base"
                >
                  Checkout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full mt-4 sm:mt-6 block text-center bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    Log in to Checkout
                  </Link>
                  
                  {/* Debug button - remove in production */}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete all cart data in localStorage?')) {
                        localStorage.removeItem('matnice_cart');
                        localStorage.removeItem('matnice_cart_count');
                        // Remove lens data
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith('matnice_lens_data_')) {
                            localStorage.removeItem(key);
                          }
                        });
                        window.location.reload();
                      }
                    }}
                    className="w-full mt-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                  >
                    🧹 Clear Local Cart (Debug)
                  </button>
                </>
              )}
              
              <Link
                to="/glasses"
                className="w-full mt-2 sm:mt-3 block text-center border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 backdrop-fade-in"
            onClick={handleCancelDelete}
          ></div>
          
          {/* Modal Container */}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 w-full max-w-lg modal-slide-up ${
                showDeleteModal 
                  ? 'translate-y-0 opacity-100 sm:scale-100' 
                  : 'translate-y-4 opacity-0 sm:scale-95'
              }`}
            >
              {/* Modal Content */}
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {/* Warning Icon */}
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg 
                      className="h-6 w-6 text-red-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
                      />
                    </svg>
                  </div>
                  
                  {/* Modal Text */}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Confirm Product Removal
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove this product from your cart? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Actions */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto transition-colors duration-200"
                  onClick={handleDeleteItem}
                >
                  Remove Product
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors duration-200"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;
