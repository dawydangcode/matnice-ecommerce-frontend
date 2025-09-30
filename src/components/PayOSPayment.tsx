import React, { useState, useEffect, useCallback, useRef } from 'react';
import payosService from '../services/payos.service';
import toast from 'react-hot-toast';

interface PayOSPaymentProps {
  isVisible: boolean;
  onSuccess: (orderCode: number) => void;
  onCancel: () => void;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
}

const PayOSPayment: React.FC<PayOSPaymentProps> = ({
  isVisible,
  onSuccess,
  onCancel,
  customerInfo,
}) => {
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [paymentResult, setPaymentResult] = useState<string>('');
  // State to track if payment link has been created for this session
  const [hasCreatedLink, setHasCreatedLink] = useState(false);
  // Ref to prevent multiple simultaneous calls
  const isCreatingRef = useRef(false);
  // Unique instance ID to prevent cross-contamination between modal instances
  const instanceId = useRef(`payos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`).current;
  
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');

  const handleCreatePaymentLink = useCallback(async () => {
    console.log(`[PayOS ${instanceId}] handleCreatePaymentLink called, isCreatingRef:`, isCreatingRef.current);
    
    // Prevent multiple simultaneous calls
    if (isCreatingRef.current) {
      console.log(`[PayOS ${instanceId}] Already creating, skipping...`);
      return;
    }

    try {
      console.log(`[PayOS ${instanceId}] Starting payment link creation...`);
      isCreatingRef.current = true;
      setIsCreatingLink(true);

      // Create payment link for current user's cart
      const result = await payosService.createCartPayment(
        `${window.location.origin}/checkout/payment-success`, // Return URL
        `${window.location.origin}/checkout`, // Cancel URL - back to checkout
        {
          name: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
        }
      );

      console.log(`[PayOS ${instanceId}] PayOS payment link created:`, result);
      console.log(`[PayOS ${instanceId}] Response structure check:`, {
        hasData: !!(result as any).data,
        hasDirectCheckoutUrl: !!(result as any).checkoutUrl,
        dataKeys: (result as any).data ? Object.keys((result as any).data) : null,
        responseKeys: Object.keys(result as any)
      });
      
      // Check response structure and extract checkout URL
      let checkoutUrl: string | null = null;
      
      // Handle different response structures - use type assertion to bypass TypeScript
      const response = result as any;
      
      if (response.data && response.data.checkoutUrl) {
        checkoutUrl = response.data.checkoutUrl;
      } else if (response.checkoutUrl) {
        checkoutUrl = response.checkoutUrl;
      } else if (response.data && response.data.paymentLinkId) {
        // If we have paymentLinkId but no checkoutUrl, construct the URL
        console.warn(`[PayOS ${instanceId}] No checkoutUrl found, trying to construct from paymentLinkId:`, response.data.paymentLinkId);
        // PayOS URL pattern - you might need to adjust this based on PayOS documentation
        checkoutUrl = `https://pay.payos.vn/web/${response.data.paymentLinkId}`;
      }
      
      console.log(`[PayOS ${instanceId}] Extracted checkout URL:`, checkoutUrl);
      
      if (checkoutUrl) {
        // Set checkout URL and automatically redirect
        setCheckoutUrl(checkoutUrl);
        
        toast.success('Đang chuyển hướng đến trang thanh toán...');
        
        // Automatically redirect to payment page after a short delay
        setTimeout(() => {
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          }
        }, 1000);
      } else {
        console.error(`[PayOS ${instanceId}] No checkout URL found in response:`, result);
        console.log(`[PayOS ${instanceId}] Full response structure:`, JSON.stringify(result, null, 2));
        toast.error('Không thể lấy link thanh toán. Vui lòng thử lại.');
      }
      
    } catch (error: any) {
      console.error(`[PayOS ${instanceId}] Error creating PayOS payment link:`, error);
      toast.error('Không thể tạo link thanh toán. Vui lòng thử lại.');
    } finally {
      console.log(`[PayOS ${instanceId}] Payment link creation finished`);
      setIsCreatingLink(false);
      isCreatingRef.current = false;
    }
  }, [customerInfo, instanceId]);

  // Automatically create payment link when component becomes visible
  useEffect(() => {
    console.log(`[PayOS ${instanceId}] useEffect triggered:`, {
      isVisible,
      hasCreatedLink,
      isCreatingRefCurrent: isCreatingRef.current
    });
    
    if (isVisible && !hasCreatedLink && !isCreatingRef.current) {
      console.log(`[PayOS ${instanceId}] Creating payment link...`);
      setHasCreatedLink(true);
      handleCreatePaymentLink();
    }
  }, [isVisible, hasCreatedLink, handleCreatePaymentLink, instanceId]);

  // Handle visibility changes
  useEffect(() => {
    console.log(`[PayOS ${instanceId}] Visibility changed:`, isVisible);
    
    if (!isVisible) {
      console.log(`[PayOS ${instanceId}] Component hidden, cleaning up...`);
      setCheckoutUrl('');
      setPaymentResult('');
      setHasCreatedLink(false); // Reset the flag when component becomes invisible
      isCreatingRef.current = false; // Reset ref as well
    }
  }, [isVisible, instanceId]);

  if (paymentResult) {
    return (
      <div className="text-center p-6">
        <div className="mb-4">
          <div className={`text-lg font-semibold ${
            paymentResult.includes('thành công') ? 'text-green-600' : 'text-red-600'
          }`}>
            {paymentResult}
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => {
            if (paymentResult.includes('thành công')) {
              // Payment successful - this will be handled by onSuccess callback
            } else {
              setPaymentResult('');
              onCancel();
            }
          }}
        >
          {paymentResult.includes('thành công') ? 'Tiếp tục' : 'Quay lại'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Thanh toán qua PayOS</h3>
        
        {isCreatingLink && (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-xl font-semibold mb-2">Đang tạo liên kết thanh toán...</div>
            <div className="text-sm text-gray-600 mb-4">Vui lòng đợi, hệ thống đang xử lý</div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
              <p className="text-sm">
                ✨ Liên kết thanh toán sẽ được mở tự động trong giây lát
              </p>
            </div>
          </div>
        )}
        
        {checkoutUrl && !isCreatingLink && (
          <div className="space-y-4 p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center text-green-600 mb-2">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Link thanh toán đã sẵn sàng!</span>
              </div>
              <p className="text-green-700 text-sm">
                Bạn sẽ được chuyển hướng đến trang thanh toán PayOS
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = checkoutUrl}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                🚀 Tiến hành thanh toán
              </button>
              
              <button
                onClick={onCancel}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ Hủy thanh toán
              </button>
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
              <p>💡 <strong>Lưu ý:</strong> Sau khi thanh toán thành công, bạn sẽ được chuyển về trang xác nhận đơn hàng.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayOSPayment;
