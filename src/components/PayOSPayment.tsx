import React, { useState, useEffect } from 'react';
import { usePayOS } from '@payos/payos-checkout';
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

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: `${window.location.origin}/checkout/payment-success`, // required
    ELEMENT_ID: 'embedded-payment-container', // required
    CHECKOUT_URL: '', // required
    embedded: true, // Use embedded interface
    onSuccess: (event: any) => {
      console.log('PayOS payment success:', event);
      setPaymentResult('Thanh toán thành công!');
      // Extract order code from event or URL params
      const orderCode = event?.orderCode || Date.now();
      onSuccess(orderCode);
    },
    onExit: (event: any) => {
      console.log('PayOS payment exit:', event);
      onCancel();
    },
    onCancel: (event: any) => {
      console.log('PayOS payment cancelled:', event);
      setPaymentResult('Thanh toán đã bị hủy');
      onCancel();
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleCreatePaymentLink = async () => {
    try {
      setIsCreatingLink(true);
      exit(); // Close any existing payment interface

      // Create embedded payment link for current user's cart
      const result = await payosService.createCartPayment(
        payOSConfig.RETURN_URL,
        `${window.location.origin}/checkout`, // Cancel URL - back to checkout
        {
          name: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
        }
      );

      console.log('PayOS payment link created:', result);

      // Update config with checkout URL
      setPayOSConfig((oldConfig) => ({
        ...oldConfig,
        CHECKOUT_URL: result.checkoutUrl,
      }));

      toast.success('Link thanh toán đã được tạo!');
    } catch (error: any) {
      console.error('Error creating PayOS payment link:', error);
      toast.error('Không thể tạo link thanh toán. Vui lòng thử lại.');
    } finally {
      setIsCreatingLink(false);
    }
  };

  // Open payment interface when checkout URL is available
  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL && isVisible) {
      open();
    }
  }, [payOSConfig.CHECKOUT_URL, isVisible, open]);

  // Handle visibility changes
  useEffect(() => {
    if (!isVisible) {
      exit();
      setPayOSConfig(prev => ({ ...prev, CHECKOUT_URL: '' }));
      setPaymentResult('');
    }
  }, [isVisible, exit]);

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
        
        {!payOSConfig.CHECKOUT_URL ? (
          <div>
            {isCreatingLink ? (
              <div className="text-center p-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div className="mt-2 font-semibold">Đang tạo link thanh toán...</div>
              </div>
            ) : (
              <button
                onClick={handleCreatePaymentLink}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Tạo Link Thanh Toán
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                exit();
                onCancel();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Đóng Thanh Toán
            </button>
            
            <div className="text-sm text-gray-600 max-w-md mx-auto">
              Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5-10 giây để
              hệ thống tự động cập nhật.
            </div>
          </div>
        )}
      </div>

      {/* PayOS Embedded Payment Container */}
      <div
        id="embedded-payment-container"
        className="min-h-[400px] border rounded-lg"
        style={{
          display: payOSConfig.CHECKOUT_URL ? 'block' : 'none',
        }}
      />
    </div>
  );
};

export default PayOSPayment;
