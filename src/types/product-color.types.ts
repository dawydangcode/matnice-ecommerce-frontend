// Product Color/Variant Types
export interface ProductColor {
  id: number;
  productId: number;
  productVariantName: string; // Tên biến thể
  productNumber: string; // Mã sản phẩm variant
  colorName: string; // Tên màu
  stock: number; // Số lượng tồn kho
  isThumbnail: boolean; // Có phải thumbnail chính không
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductColorRequest {
  productId: number;
  productVariantName: string;
  productNumber: string;
  colorName: string;
  stock: number;
  isThumbnail: boolean;
}

export interface ProductColorFormData {
  productVariantName: string;
  productNumber: string;
  colorName: string;
  stock: number;
  isThumbnail: boolean;
}
