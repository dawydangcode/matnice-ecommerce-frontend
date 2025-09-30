import { apiService } from './api.service';

export interface PaymentItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CreatePaymentLinkRequest {
  orderId: number;
  amount: number;
  description: string;
  items: PaymentItem[];
  returnUrl: string;
  cancelUrl: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
}

export interface CreateEmbeddedPaymentRequest {
  cartId: number;
  returnUrl: string;
  cancelUrl: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
}

export interface PaymentLinkResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
  paymentId?: number;
}

export interface EmbeddedPaymentResponse {
  checkoutUrl: string;
  paymentLinkId: string;
  orderCode: number;
  amount: number;
  paymentId: number;
}

class PayOSService {
  async createPaymentLink(
    data: CreatePaymentLinkRequest,
  ): Promise<PaymentLinkResponse> {
    try {
      console.log('Creating PayOS payment link:', data);
      const response = await apiService.post<PaymentLinkResponse>(
        '/api/payment/payos/create-payment-link',
        data,
      );
      return response;
    } catch (error: any) {
      console.error('Error creating PayOS payment link:', error);
      throw error;
    }
  }

  async createEmbeddedPaymentLink(
    data: CreateEmbeddedPaymentRequest,
  ): Promise<EmbeddedPaymentResponse> {
    try {
      console.log('Creating embedded PayOS payment link:', data);
      const response = await apiService.post<EmbeddedPaymentResponse>(
        '/api/payment/payos/create-embedded-payment-link',
        data,
      );
      return response;
    } catch (error: any) {
      console.error('Error creating embedded PayOS payment link:', error);
      throw error;
    }
  }

  async getPaymentInfo(paymentLinkId: string): Promise<any> {
    try {
      const response = await apiService.get<any>(
        `/api/payment/payos/payment-info/${paymentLinkId}`,
      );
      return response;
    } catch (error: any) {
      console.error('Error getting PayOS payment info:', error);
      throw error;
    }
  }

  async cancelPayment(paymentLinkId: string, reason?: string): Promise<any> {
    try {
      const response = await apiService.post<any>(
        `/api/payment/payos/cancel-payment/${paymentLinkId}`,
        { reason },
      );
      return response;
    } catch (error: any) {
      console.error('Error cancelling PayOS payment:', error);
      throw error;
    }
  }

  // Helper method to get current user cart and create payment
  async createCartPayment(
    returnUrl: string,
    cancelUrl: string,
    buyerInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    },
  ): Promise<EmbeddedPaymentResponse> {
    try {
      // First get user's cart
      const cart = await apiService.get<any>('/api/v1/cart/my-cart/summary');

      if (!cart || !cart.cartId) {
        throw new Error('No active cart found');
      }

      return await this.createEmbeddedPaymentLink({
        cartId: cart.cartId,
        returnUrl,
        cancelUrl,
        buyerName: buyerInfo?.name,
        buyerEmail: buyerInfo?.email,
        buyerPhone: buyerInfo?.phone,
        buyerAddress: buyerInfo?.address,
      });
    } catch (error: any) {
      console.error('Error creating cart payment:', error);
      throw error;
    }
  }

  async createOrderFromPayment(
    transactionId: string,
    customerInfo: {
      fullName: string;
      phone: string;
      email: string;
      province: string;
      district: string;
      ward: string;
      addressDetail: string;
      notes?: string;
    },
  ): Promise<any> {
    try {
      console.log('Creating order from payment:', {
        transactionId,
        customerInfo,
      });

      const response = await apiService.post<any>(
        '/api/payment/payos/create-order-from-payment',
        {
          transactionId,
          customerInfo,
        },
      );

      return response;
    } catch (error: any) {
      console.error('Error creating order from payment:', error);
      throw error;
    }
  }
}

const payosService = new PayOSService();
export default payosService;
