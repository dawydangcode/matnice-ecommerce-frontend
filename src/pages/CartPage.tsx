import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/auth.store';
import cartService, { CartSummary } from '../services/cart.service';
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
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadCartData = useCallback(async () => {
    try {
      setLoading(true);
      const summary = await cartService.getMyCartSummary();
      console.log('Cart summary data:', summary);
      setCartSummary(summary);
    } catch (error: any) {
      console.error('Error loading cart data:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadCartData();
    }
  }, [isLoggedIn, loadCartData]);

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
      'PROGRESSIVE': 'Đa tròng',
      'SINGLE_VISION': 'Đơn tròng',
      'BIFOCAL': 'Hai tròng'
    };
    return translations[lensType] || lensType;
  };

  const translateDesign = (design: string) => {
    const translations: { [key: string]: string } = {
      'NONE': 'Không',
      'STANDARD': 'Tiêu chuẩn',
      'PREMIUM': 'Cao cấp'
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
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      await loadCartData();
      setShowDeleteModal(false);
      setItemToDelete(null);
      // Restore body scroll
      document.body.style.overflow = 'unset';
    } catch (error: any) {
      console.error('Error deleting cart item:', error);
      toast.error('Không thể xóa sản phẩm');
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập để xem giỏ hàng
          </h1>
          <Link
            to="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-xl">Đang tải giỏ hàng...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cartSummary || cartSummary.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Basket</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Hãy khám phá bộ sưu tập kính mắt và tròng kính của chúng tôi để tìm những sản phẩm phù hợp với bạn.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/glasses"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mua kính mắt
            </Link>
            <Link
              to="/lenses"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Mua tròng kính
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      {/* Cart Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Basket</h1>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              ✓ Tròng kính đã được thêm vào giỏ hàng
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {cartSummary.items.map((item) => {
                return (
                  <div key={item.cartFrameId} className="bg-white rounded-lg shadow-sm border p-10">
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
                                let displayName = item.productName || `Sản phẩm #${item.productId}`;
                                if (item.selectedColor?.productVariantName) {
                                  displayName += ` ${item.selectedColor.productVariantName}`;
                                }
                                return displayName;
                              })()}
                            </h3>
                            
                            {/* Display selected color if available */}
                            {item.selectedColor && (
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Màu:</strong> {item.selectedColor.colorName}
                              </p>
                            )}
                            
                            <p className="text-sm text-gray-600">
                              <strong>Số lượng:</strong> {item.quantity}
                            </p>
                          </div>

                          {/* Right side - Price Information */}
                          <div className="text-right space-y-1">
                            <div className="text-sm text-gray-600">
                              <p><strong>Giá gọng:</strong> {formatPrice(item.framePrice)}</p>
                              {item.lensDetail && (
                                <p><strong>Giá tròng:</strong> {formatPrice(item.lensDetail.lensPrice)}</p>
                              )}
                              
                              {/* Coating prices */}
                              {item.lensDetail?.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                <div>
                                  {item.lensDetail.selectedCoatings.map((coating, index) => (
                                    <p key={index}><strong>Lớp phủ ({coating.name}):</strong> +{formatPrice(coating.price)}</p>
                                  ))}
                                </div>
                              )}
                              
                              {/* Tint color price */}
                              {item.lensDetail?.selectedTintColor?.price && (
                                <p><strong>Màu tông ({item.lensDetail.selectedTintColor.name}):</strong> +{formatPrice(item.lensDetail.selectedTintColor.price)}</p>
                              )}
                              
                              {safeParseNumber(item.discount) > 0 && (
                                <p><strong>Giảm giá:</strong> -{formatPrice(item.discount)}</p>
                              )}
                            </div>
                            
                            {/* Total Price */}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <p className="text-lg font-bold text-black">
                                <strong>Tổng tiền:</strong> 
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
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Lens Information */}
                        {(item.lensInfo || item.lensVariantInfo) && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Thông tin tròng kính</h4>
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
                                      <p><span className="font-medium">Loại:</span> {translateLensType(item.lensInfo.lensType)}</p>
                                      {item.lensInfo.origin && (
                                        <p><span className="font-medium">Xuất xứ:</span> {item.lensInfo.origin}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Lens Variant Info */}
                              {item.lensVariantInfo && (
                                <div className="border-t border-gray-200 pt-3">
                                  <h6 className="text-sm font-medium text-gray-800 mb-2">Tùy chọn</h6>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700">Thiết kế:</span>
                                      <span className="ml-2 text-gray-600">{translateDesign(item.lensVariantInfo.design)}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Chất liệu:</span>
                                      <span className="ml-2 text-gray-600">{item.lensVariantInfo.material}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Giá:</span>
                                      <span className="ml-2 text-gray-600">{formatPrice(item.lensVariantInfo.price)}</span>
                                    </div>
                                    {item.lensVariantInfo.lensThickness && (
                                      <div>
                                        <span className="font-medium text-gray-700">Độ dày:</span>
                                        <span className="ml-2 text-gray-600">{item.lensVariantInfo.lensThickness.name} (Chỉ số: {item.lensVariantInfo.lensThickness.indexValue})</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Lens Coating Info */}
                              {item.lensDetail?.selectedCoatings && item.lensDetail.selectedCoatings.length > 0 && (
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <h6 className="text-sm font-medium text-gray-800 mb-2">Lớp phủ</h6>
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
                                  <h6 className="text-sm font-medium text-gray-800 mb-2">Màu tông</h6>
                                  <div className="text-sm">
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
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <h6 className="text-sm font-medium text-gray-800 mb-3">Thông tin đơn thuốc</h6>
                            <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-300">
                                    <th className="text-left py-3 px-3 font-medium text-gray-700">Mắt</th>
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
                                    <td className="py-3 px-3 font-medium text-gray-700">Phải</td>
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
                                    <td className="py-3 px-3 font-medium text-gray-700">Trái</td>
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
                          onClick={() => handleDeleteClick(item.cartFrameId)}
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
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tổng đơn hàng</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Tổng giá gọng ({cartSummary.totalItems} sản phẩm)</span>
                  <span>{formatPrice(cartSummary.totalFramePrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tổng giá tròng</span>
                  <span>{formatPrice(cartSummary.totalLensPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Giảm giá</span>
                  <span className="text-green-600">-{formatPrice(cartSummary.totalDiscount)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-black-600">{formatPrice(cartSummary.grandTotal)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors font-medium"
              >
                Thanh toán
              </button>
              
              <Link
                to="/glasses"
                className="w-full mt-3 block text-center border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tiếp tục mua hàng
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
                      Xác nhận xóa sản phẩm
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng? Hành động này không thể hoàn tác.
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
                  Xóa sản phẩm
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors duration-200"
                  onClick={handleCancelDelete}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default CartPage;
