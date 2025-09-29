import { apiService } from './api.service';

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
}

const orderService = new OrderService();
export default orderService;
