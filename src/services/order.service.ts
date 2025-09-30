import { apiService } from './api.service';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  VNPAY = 'vnpay',
  MOMO = 'momo',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface CreateOrderRequest {
  userId?: number;
  cartId?: number;
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  paymentMethod:
    | 'cash'
    | 'bank_transfer'
    | 'credit_card'
    | 'debit_card'
    | 'paypal'
    | 'vnpay'
    | 'momo';
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  notes?: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  cartId: number;
  orderDate: string;
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  deliveryDate?: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  notes?: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: number;
}

export interface OrdersResponse {
  data: OrderResponse[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

class OrderService {
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await apiService.post<{ data: OrderResponse }>(
        '/api/v1/orders',
        orderData,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.response?.data?.message);
      throw error;
    }
  }

  async getMyOrders(): Promise<OrderResponse[]> {
    try {
      const response = await apiService.get<{ data: OrderResponse[] }>(
        '/api/v1/orders/my-orders',
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  }

  async getOrderById(orderId: number): Promise<OrderResponse> {
    try {
      const response = await apiService.get<{ data: OrderResponse }>(
        `/api/v1/orders/${orderId}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Admin methods
  async getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
    try {
      console.log(
        'OrderService.getOrders: Fetching orders with params:',
        params,
      );

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.paymentStatus)
        queryParams.append('paymentStatus', params.paymentStatus);
      if (params.userId) queryParams.append('userId', params.userId.toString());

      const response = await apiService.get<OrdersResponse>(
        `/api/v1/orders?${queryParams.toString()}`,
      );
      console.log('OrderService.getOrders: Success', response);
      return response;
    } catch (error) {
      console.error('OrderService.getOrders: Error', error);
      throw error;
    }
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
  ): Promise<OrderResponse> {
    try {
      console.log('OrderService.updateOrderStatus: Updating order status', {
        id,
        status,
      });

      const response = await apiService.put<{ data: OrderResponse }>(
        `/api/v1/orders/${id}/status`,
        { status },
      );
      console.log('OrderService.updateOrderStatus: Success', response);
      return response.data;
    } catch (error) {
      console.error('OrderService.updateOrderStatus: Error', error);
      throw error;
    }
  }

  async updatePaymentStatus(
    id: number,
    paymentStatus: PaymentStatus,
  ): Promise<OrderResponse> {
    try {
      console.log('OrderService.updatePaymentStatus: Updating payment status', {
        id,
        paymentStatus,
      });

      const response = await apiService.put<{ data: OrderResponse }>(
        `/api/v1/orders/${id}/payment-status`,
        { paymentStatus },
      );
      console.log('OrderService.updatePaymentStatus: Success', response);
      return response.data;
    } catch (error) {
      console.error('OrderService.updatePaymentStatus: Error', error);
      throw error;
    }
  }

  async deleteOrder(id: number): Promise<boolean> {
    try {
      console.log('OrderService.deleteOrder: Deleting order with ID:', id);

      await apiService.delete(`/api/v1/orders/${id}`);
      console.log('OrderService.deleteOrder: Success');
      return true;
    } catch (error) {
      console.error('OrderService.deleteOrder: Error', error);
      throw error;
    }
  }

  // Helper methods for status display
  getStatusDisplayName(status: OrderStatus | string): string {
    const statusMap: Record<string, string> = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  }

  getPaymentStatusDisplayName(status: PaymentStatus | string): string {
    const statusMap: Record<string, string> = {
      pending: 'Chờ thanh toán',
      processing: 'Đang xử lý',
      completed: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      cancelled: 'Đã hủy',
      refunded: 'Đã hoàn tiền',
    };
    return statusMap[status] || status;
  }

  getPaymentMethodDisplayName(method: PaymentMethod | string): string {
    const methodMap: Record<string, string> = {
      cash: 'Tiền mặt',
      credit_card: 'Thẻ tín dụng',
      debit_card: 'Thẻ ghi nợ',
      bank_transfer: 'Chuyển khoản',
      paypal: 'PayPal',
      vnpay: 'VNPay',
      momo: 'MoMo',
    };
    return methodMap[method] || method;
  }

  getStatusColor(status: OrderStatus | string): string {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  getPaymentStatusColor(status: PaymentStatus | string): string {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      refunded: 'bg-orange-100 text-orange-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }
}

const orderService = new OrderService();
export default orderService;
