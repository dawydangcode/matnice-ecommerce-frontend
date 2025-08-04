// Common types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Product related types based on backend
export enum ProductType {
  GLASSES = "glasses",
  SUNGLASSES = "sunglasses",
}

export enum ProductGenderType {
  MALE = "male",
  FEMALE = "female",
}

export interface Product {
  id: number;
  productName: string;
  productType: ProductType;
  brandId: number;
  gender: ProductGenderType;
  price: number;
  stock: number;
  description: string;
  isSustainable: boolean;
  createdAt: string;
  updatedAt: string;
  brand?: Brand;
  categories?: Category[];
  images?: ProductImage[];
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}
