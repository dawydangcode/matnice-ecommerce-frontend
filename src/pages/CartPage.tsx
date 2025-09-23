import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/auth.store';
import cartService, { CartSummary, CartItemWithDetails } from '../services/cart.service';

// Simple icon components
const ShoppingCartIcon = () => <span className="text-2xl">🛒</span>;
const TrashIcon = () => <span className="text-lg">🗑️</span>;
const ArrowLeftIcon = () => <span className="text-lg">←</span>;
const XMarkIcon = () => <span className="text-lg">✕</span>;

interface PrescriptionDisplay {
  rightEye: {
    sphere: number | undefined;
    cylinder: number | undefined;
    axis: number | undefined;
  };
  leftEye: {
    sphere: number | undefined;
    cylinder: number | undefined;
    axis: number | undefined;
  };
  pdLeft: number | undefined;
  pdRight: number | undefined;
  addLeft?: number | undefined;
  addRight?: number | undefined;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartId] = useState(1); // Hardcoded for now

  const loadCartData = useCallback(async () => {
    try {
      setLoading(true);
      const [items, summary] = await Promise.all([
        cartService.getCartItemsWithFullDetails(cartId),
        cartService.getCartSummary(cartId)
      ]);
      setCartItems(items);
      setCartSummary(summary);
    } catch (error: any) {
      console.error('Error loading cart data:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadCartData();
  }, [isLoggedIn, navigate, loadCartData]);

  const handleDeleteItem = async (cartFrameId: number) => {
    // Use window.confirm instead of confirm
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return;
    }

    try {
      await cartService.deleteCartItem(cartFrameId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      loadCartData(); // Reload cart data
    } catch (error: any) {
      console.error('Error deleting cart item:', error);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const handleClearCart = async () => {
    // Use window.confirm instead of confirm
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      return;
    }

    try {
      await cartService.clearCart(cartId);
      toast.success('Đã xóa toàn bộ giỏ hàng');
      loadCartData(); // Reload cart data
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error('Không thể xóa giỏ hàng');
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0 ₫';
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numPrice);
  };

  const safeParseNumber = (value: number | string | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const formatPrescriptionValue = (value: number | string | undefined, suffix: string = '') => {
    if (value === undefined || value === null) return '-';
    
    // Convert string to number if needed
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return '-';
    if (numValue === 0) return `± 0.00${suffix}`;
    return numValue > 0 ? `+${numValue.toFixed(2)}${suffix}` : `${numValue.toFixed(2)}${suffix}`;
  };

  const parsePrescriptionFromLensDetail = (lensDetail: any): PrescriptionDisplay => {
    return {
      rightEye: {
        sphere: lensDetail.rightEyeSphere ? safeParseNumber(lensDetail.rightEyeSphere) : undefined,
        cylinder: lensDetail.rightEyeCylinder ? safeParseNumber(lensDetail.rightEyeCylinder) : undefined,
        axis: lensDetail.rightEyeAxis ? safeParseNumber(lensDetail.rightEyeAxis) : undefined,
      },
      leftEye: {
        sphere: lensDetail.leftEyeSphere ? safeParseNumber(lensDetail.leftEyeSphere) : undefined,
        cylinder: lensDetail.leftEyeCylinder ? safeParseNumber(lensDetail.leftEyeCylinder) : undefined,
        axis: lensDetail.leftEyeAxis ? safeParseNumber(lensDetail.leftEyeAxis) : undefined,
      },
      pdLeft: lensDetail.pdLeft ? safeParseNumber(lensDetail.pdLeft) : undefined,
      pdRight: lensDetail.pdRight ? safeParseNumber(lensDetail.pdRight) : undefined,
      addLeft: lensDetail.addLeft ? safeParseNumber(lensDetail.addLeft) : undefined,
      addRight: lensDetail.addRight ? safeParseNumber(lensDetail.addRight) : undefined,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon />
                Quay lại
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCartIcon />
                Giỏ hàng của bạn
              </h1>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon />
                Quay lại
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCartIcon />
                Giỏ hàng của bạn
                {cartSummary && (
                  <span className="text-sm font-normal text-gray-500">
                    ({cartSummary.totalItems} sản phẩm)
                  </span>
                )}
              </h1>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <XMarkIcon />
                Xóa toàn bộ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const prescription = item.lensDetail ? parsePrescriptionFromLensDetail(item.lensDetail) : null;
                
                return (
                  <div key={item.frame.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Ảnh sản phẩm</span>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Sản phẩm #{item.frame.productId}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p><strong>Số lượng:</strong> {item.frame.quantity}</p>
                            <p><strong>Giá gọng:</strong> {formatPrice(item.frame.framePrice)}</p>
                            {item.lensDetail && (
                              <p><strong>Giá tròng:</strong> {formatPrice(item.lensDetail.lensPrice)}</p>
                            )}
                          </div>
                          <div>
                            <p><strong>Giảm giá:</strong> {formatPrice(item.frame.discount)}</p>
                            <p><strong>Tổng tiền:</strong> 
                              <span className="text-blue-600 font-semibold">
                                {formatPrice(
                                  safeParseNumber(item.frame.totalPrice) + 
                                  safeParseNumber(item.lensDetail?.lensPrice)
                                )}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Prescription Details */}
                        {prescription && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3">Chi tiết kính cận</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-gray-700 mb-2">Mắt phải (OD)</p>
                                <p>Cầu (SPH): {formatPrescriptionValue(prescription.rightEye.sphere)}</p>
                                <p>Trụ (CYL): {formatPrescriptionValue(prescription.rightEye.cylinder)}</p>
                                <p>Trục (AXIS): {formatPrescriptionValue(prescription.rightEye.axis, '°')}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700 mb-2">Mắt trái (OS)</p>
                                <p>Cầu (SPH): {formatPrescriptionValue(prescription.leftEye.sphere)}</p>
                                <p>Trụ (CYL): {formatPrescriptionValue(prescription.leftEye.cylinder)}</p>
                                <p>Trục (AXIS): {formatPrescriptionValue(prescription.leftEye.axis, '°')}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700 mb-2">Khoảng cách (PD)</p>
                                <p>PD trái: {formatPrescriptionValue(prescription.pdLeft)}</p>
                                <p>PD phải: {formatPrescriptionValue(prescription.pdRight)}</p>
                              </div>
                              {(prescription.addLeft || prescription.addRight) && (
                                <div>
                                  <p className="font-medium text-gray-700 mb-2">ADD</p>
                                  <p>ADD trái: {formatPrescriptionValue(prescription.addLeft)}</p>
                                  <p>ADD phải: {formatPrescriptionValue(prescription.addRight)}</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Lens Notes */}
                            {item.lensDetail?.lensNotes && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <strong>Ghi chú tròng:</strong> {item.lensDetail.lensNotes}
                                </p>
                              </div>
                            )}
                            
                            {/* Prescription Notes */}
                            {item.lensDetail?.prescriptionNotes && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <strong>Ghi chú đơn thuốc:</strong> {item.lensDetail.prescriptionNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleDeleteItem(item.frame.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa sản phẩm"
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
              
              {cartSummary && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá gọng:</span>
                    <span>{formatPrice(cartSummary.totalFramePrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá tròng:</span>
                    <span>{formatPrice(cartSummary.totalLensPrice)}</span>
                  </div>
                  
                  {safeParseNumber(cartSummary.totalDiscount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="text-red-600">-{formatPrice(cartSummary.totalDiscount)}</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(cartSummary.grandTotal)}</span>
                  </div>
                  
                  <button 
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    onClick={() => {
                      toast.success('Chức năng thanh toán sẽ được phát triển trong tương lai!');
                    }}
                  >
                    Tiến hành thanh toán
                  </button>
                  
                  <Link
                    to="/glasses"
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Tiếp tục mua hàng
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
