export interface Order {
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

  // Customer information
  fullName: string;
  phone: string;
  email: string;

  // Address information
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  notes?: string;

  status: OrderStatus;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
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
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface OrderLensDetail {
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
  selectedCoatingIds?: string; // JSON array
  selectedTintColorId?: number;
  prescriptionNotes?: string;
  lensNotes?: string;
  manufacturingNotes?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateOrderDto {
  cartId: number;
  paymentMethod: string;

  // Customer information
  fullName: string;
  phone: string;
  email: string;

  // Address information
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  notes?: string;

  // Optional fields
  shippingCost?: number;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  deliveryDate?: string;

  // Address information (if needed to update)
  fullName?: string;
  phone?: string;
  email?: string;
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  notes?: string;
}

export interface OrderFilters {
  userId?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  province?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderPagination {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderSummary {
  orderId: number;
  orderDate: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  itemCount: number;
}

export interface OrderDetail extends Order {
  items: (OrderItem & {
    product: {
      id: number;
      productName: string;
      brandName: string;
      imageUrl?: string;
    };
    productColor?: {
      id: number;
      colorName: string;
    };
    lensDetail?: OrderLensDetail & {
      lensVariant: {
        id: number;
        lens: {
          name: string;
          brandName: string;
        };
        thickness: {
          name: string;
          indexValue: number;
        };
      };
      coatings?: Array<{
        id: number;
        name: string;
        price: number;
      }>;
      tintColor?: {
        id: number;
        name: string;
        colorCode: string;
      };
    };
  })[];
}

// Enums
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  E_WALLET = 'e_wallet',
}
