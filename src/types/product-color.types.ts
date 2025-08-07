// Product Color/Variant Types
export interface ProductColor {
  id: number;
  productId: number;
  product_variant_name: string; // Tên biến thể
  product_number: string; // Mã sản phẩm variant
  color_name: string; // Tên màu
  stock: number; // Số lượng tồn kho
  is_thumbnail: boolean; // Có phải thumbnail chính không
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductColorRequest {
  productId: number;
  product_variant_name: string;
  product_number: string;
  color_name: string;
  stock: number;
  is_thumbnail: boolean;
}

export interface ProductColorFormData {
  product_variant_name: string;
  product_number: string;
  color_name: string;
  stock: number;
  is_thumbnail: boolean;
}
