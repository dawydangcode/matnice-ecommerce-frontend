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
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  framePrice: number;
  totalPrice: number;
  discount: number;
  selectedColorId?: number;
  productInfo?: {
    productName: string;
    productPrice: number;
    productDescription: string;
    brandName: string;
    colorInfo?: {
      colorName: string;
      productVariantName: string;
      productNumber: number;
    };
  };
  lensDetails?: EnrichedLensDetail[];
  // Legacy fields for backward compatibility
  product?: {
    id: number;
    product_name: string;
    price: number;
    image_url?: string;
  };
  orderLensDetails?: OrderLensDetail[];
}

export interface EnrichedLensDetail {
  id: number;
  orderItemId: number;
  lensVariantId: number;
  rightEyeSphere: number;
  rightEyeCylinder?: number;
  rightEyeAxis?: number;
  leftEyeSphere: number;
  leftEyeCylinder?: number;
  leftEyeAxis?: number;
  pdLeft?: number;
  pdRight?: number;
  addLeft?: number;
  addRight?: number;
  lensPrice: number;
  selectedCoatingIds?: string;
  selectedTintColorId?: number;
  prescriptionNotes?: string;
  lensNotes?: string;
  manufacturingNotes?: string;
  lensInfo?: {
    lensName: string;
    lensType: string;
    lensDescription: string;
    brandLens: string;
    lensVariant: {
      design: string;
      material: string;
      price: number;
    };
    lensThickness?: {
      name: string;
      indexValue: number;
      price: number;
      description: string;
    };
    lensCoatings?: Array<{
      name: string;
      price: number;
      description: string;
    }>;
    tintColor?: {
      name: string;
      colorCode: string;
    };
  };
}

export interface OrderLensDetail {
  id: number;
  orderItemId: number;
  eye: 'left' | 'right';
  sph: number;
  cyl: number;
  axis: number;
  pd: number;
  add?: number;
  lensId: number;
  lens: {
    id: number;
    lens_name: string;
    price: number;
  };
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: number;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'orderDate' | 'totalPrice' | 'status' | 'id';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateTrackingRequest {
  trackingNumber?: string;
  deliveryDate?: string;
}

export interface OrderReport {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  ordersByDate: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
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

  async getOrderDetails(orderId: number): Promise<OrderResponse> {
    try {
      console.log(
        'OrderService.getOrderDetails: Fetching order details for ID:',
        orderId,
      );

      const response = await apiService.get<{ data: OrderResponse }>(
        `/api/v1/orders/${orderId}/details`,
      );
      console.log('OrderService.getOrderDetails: Success', response);
      return response.data;
    } catch (error) {
      console.error('OrderService.getOrderDetails: Error', error);
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
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.minPrice)
        queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice)
        queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

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

  async getOrdersWithDetails(params: GetOrdersParams): Promise<OrdersResponse> {
    try {
      console.log(
        'OrderService.getOrdersWithDetails: Fetching detailed orders with params:',
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
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.minPrice)
        queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice)
        queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiService.get<OrdersResponse>(
        `/api/v1/orders/detailed?${queryParams.toString()}`,
      );
      console.log('OrderService.getOrdersWithDetails: Success', response);
      return response;
    } catch (error) {
      console.error('OrderService.getOrdersWithDetails: Error', error);
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

  async updateTrackingInfo(
    id: number,
    trackingInfo: UpdateTrackingRequest,
  ): Promise<OrderResponse> {
    try {
      console.log('OrderService.updateTrackingInfo: Updating tracking info', {
        id,
        trackingInfo,
      });

      const response = await apiService.put<{ data: OrderResponse }>(
        `/api/v1/orders/${id}/tracking`,
        trackingInfo,
      );
      console.log('OrderService.updateTrackingInfo: Success', response);
      return response.data;
    } catch (error) {
      console.error('OrderService.updateTrackingInfo: Error', error);
      throw error;
    }
  }

  async exportOrdersPDF(params: GetOrdersParams): Promise<Blob> {
    try {
      console.log(
        'OrderService.exportOrdersPDF: Exporting orders to PDF',
        params,
      );

      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.paymentStatus)
        queryParams.append('paymentStatus', params.paymentStatus);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await apiService.get<Blob>(
        `/api/v1/orders/export/pdf?${queryParams.toString()}`,
        { responseType: 'blob' },
      );
      console.log('OrderService.exportOrdersPDF: Success');
      return response;
    } catch (error) {
      console.error('OrderService.exportOrdersPDF: Error', error);
      throw error;
    }
  }

  async exportOrdersExcel(params: GetOrdersParams): Promise<Blob> {
    try {
      console.log(
        'OrderService.exportOrdersExcel: Exporting orders to Excel',
        params,
      );

      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.paymentStatus)
        queryParams.append('paymentStatus', params.paymentStatus);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await apiService.get<Blob>(
        `/api/v1/orders/export/excel?${queryParams.toString()}`,
        { responseType: 'blob' },
      );
      console.log('OrderService.exportOrdersExcel: Success');
      return response;
    } catch (error) {
      console.error('OrderService.exportOrdersExcel: Error', error);
      throw error;
    }
  }

  async getOrderReport(
    startDate: string,
    endDate: string,
  ): Promise<OrderReport> {
    try {
      console.log('OrderService.getOrderReport: Fetching order report', {
        startDate,
        endDate,
      });

      const response = await apiService.get<{ data: OrderReport }>(
        `/api/v1/orders/reports?startDate=${startDate}&endDate=${endDate}`,
      );
      console.log('OrderService.getOrderReport: Success', response);
      return response.data;
    } catch (error) {
      console.error('OrderService.getOrderReport: Error', error);
      throw error;
    }
  }

  async sendOrderNotification(
    orderId: number,
    type: 'status_update' | 'tracking_update',
  ): Promise<boolean> {
    try {
      console.log('OrderService.sendOrderNotification: Sending notification', {
        orderId,
        type,
      });

      await apiService.post(`/api/v1/orders/${orderId}/notifications`, {
        type,
      });
      console.log('OrderService.sendOrderNotification: Success');
      return true;
    } catch (error) {
      console.error('OrderService.sendOrderNotification: Error', error);
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
