// Product related types
export interface Product {
  productId: number;
  productType: ProductType;
  productName: string;
  categoryId: number;
  brandId: number;
  gender: ProductGenderType;
  price: number;
  description?: string;
  stock: number;
  isSustainable: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional product properties
  material?: string;
  shape?: string;
  color?: string;
  lensType?: string;
  frameMaterial?: string;
  // Relations
  brand?: Brand;
  category?: Category;
  categories?: Category[];
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ProductType {
  GLASSES = "glasses",
  SUNGLASSES = "sunglasses",
  CONTACT_LENSES = "contact_lenses",
}

export enum ProductGenderType {
  MEN = "men",
  WOMEN = "women",
  UNISEX = "unisex",
}

// Request/Response types
export interface CreateProductRequest {
  categoryId: number;
  productName: string;
  productType: ProductType;
  brandId: number;
  gender: ProductGenderType;
  price: number;
  stock: number;
  description?: string;
  isSustainable?: boolean;
  material?: string;
  shape?: string;
  color?: string;
  lensType?: string;
  frameMaterial?: string;
  imageUrls?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  productId: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
  brand?: number;
  type?: ProductType;
  gender?: ProductGenderType;
}

// Form types
export interface ProductFormData {
  productName: string;
  productType: ProductType;
  brandId: number;
  gender: ProductGenderType;
  price: number;
  stock: number;
  description: string;
  isSustainable: boolean;
  images: File[];
}
