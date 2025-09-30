import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/auth.store';
import cartService, { CartSummary } from '../services/cart.service';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// Simple icon components
const TrashIcon = () => <span className="text-lg">X</span>;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCartData = useCallback(async () => {
    try {
      setLoading(true);
      const summary = await cartService.getMyCartSummary();
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
    return (prescription.rightEye?.add !== undefined && prescription.rightEye?.add !== null) ||
           (prescription.leftEye?.add !== undefined && prescription.leftEye?.add !== null);
  };

  const safeParseNumber = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const handleDeleteItem = async (cartFrameId: number) => {
    try {
      await cartService.deleteCartItem(cartFrameId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      await loadCartData();
    } catch (error: any) {
      console.error('Error deleting cart item:', error);
      toast.error('Không thể xóa sản phẩm');
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartSummary.items.map((item) => {
                const lensDetail = item.lensDetail;
                const prescription = lensDetail ? {
                  rightEye: {
                    sphere: lensDetail.prescription.rightEye.sphere,
                    cylinder: lensDetail.prescription.rightEye.cylinder,
                    axis: lensDetail.prescription.rightEye.axis,
                    add: (lensDetail.prescription.rightEye as any)?.add,
                  },
                  leftEye: {
                    sphere: lensDetail.prescription.leftEye.sphere,
                    cylinder: lensDetail.prescription.leftEye.cylinder,
                    axis: lensDetail.prescription.leftEye.axis,
                    add: (lensDetail.prescription.leftEye as any)?.add,
                  },
                  pdLeft: lensDetail.prescription.pdLeft,
                  pdRight: lensDetail.prescription.pdRight,
                } : null;
                
                return (
                  <div key={item.cartFrameId} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start gap-4">
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
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p><strong>Số lượng:</strong> {item.quantity}</p>
                            <p><strong>Giá gọng:</strong> {formatPrice(item.framePrice)}</p>
                            {item.lensDetail && (
                              <p><strong>Giá tròng:</strong> {formatPrice(item.lensDetail.lensPrice)}</p>
                            )}
                          </div>
                          <div>
                            <p><strong>Giảm giá:</strong> {formatPrice(item.discount)}</p>
                            <p><strong>Tổng tiền:</strong> 
                              <span className="text-blue-600 font-semibold">
                                {formatPrice(
                                  safeParseNumber(item.totalPrice) + 
                                  safeParseNumber(item.lensDetail?.lensPrice)
                                )}
                              </span>
                            </p>
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
                                      <p><span className="font-medium">Loại:</span> {item.lensInfo.lensType}</p>
                                      {item.lensInfo.origin && (
                                        <p><span className="font-medium">Xuất xứ:</span> {item.lensInfo.origin}</p>
                                      )}
                                      {item.lensInfo.description && (
                                        <p><span className="font-medium">Mô tả:</span> {item.lensInfo.description}</p>
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
                                      <span className="ml-2 text-gray-600">{item.lensVariantInfo.design}</span>
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
                            </div>
                          </div>
                        )}

                        {/* Prescription Information */}
                        {prescription && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Thông tin đơn thuốc</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-2 px-1 font-medium text-gray-700">Mắt</th>
                                      <th className="text-center py-2 px-1 font-medium text-gray-700">SPH</th>
                                      <th className="text-center py-2 px-1 font-medium text-gray-700">CYL</th>
                                      <th className="text-center py-2 px-1 font-medium text-gray-700">AXIS</th>
                                      {hasAddValues(prescription) && <th className="text-center py-2 px-1 font-medium text-gray-700">ADD</th>}
                                      <th className="text-center py-2 px-1 font-medium text-gray-700">PD</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-xs">
                                    <tr className="border-b border-gray-100">
                                      <td className="py-2 px-1 font-medium text-gray-600">Mắt phải</td>
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.rightEye.sphere)}</td>
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.rightEye.cylinder)}</td>
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.rightEye.axis, '°')}</td>
                                      {hasAddValues(prescription) && <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.rightEye.add)}</td>}
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.pdRight)}</td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 px-1 font-medium text-gray-600">Mắt trái</td>
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.leftEye.sphere)}</td>
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.leftEye.cylinder)}</td>
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.leftEye.axis, '°')}</td>
                                      {hasAddValues(prescription) && <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.leftEye.add)}</td>}
                                      <td className="text-center py-2 px-1 text-gray-800">{formatPrescriptionValue(prescription.pdLeft)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0">
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => handleDeleteItem(item.cartFrameId)}
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
                    <span className="text-blue-600">{formatPrice(cartSummary.grandTotal)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Đặt hàng (COD)
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
      
      <Footer />
    </div>
  );
};

export default CartPage;
