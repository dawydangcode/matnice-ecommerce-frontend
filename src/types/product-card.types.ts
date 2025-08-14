// Product Card types for displaying products in grid/list format
export interface ProductCard {
  id: number;
  productName: string;
  displayName: string; // Product name + variant name
  brandName: string;
  price: number;
  thumbnailUrl: string | null;
  // Additional useful info for cards
  productType: string;
  gender: string;
  isNew: boolean;
  isBoutique: boolean;
  isSustainable: boolean;
  // Variant info
  variantName: string | null;
  colorName: string | null;
  stock: number;
  totalVariants: number;
}

export interface ProductCardResponse {
  data: ProductCard[];
  total: number;
}

export interface ProductCardQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  productTypeIds?: number[];
  brandIds?: number[];
  categoryIds?: number[];
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'newest';
  sortOrder?: 'ASC' | 'DESC';
  // Filter productDetail
  frameType?: string[];
  frameShape?: string[];
  frameMaterial?: string[];
  bridgeDesign?: string[];
  style?: string[];
  bridgeWidth?: number | [number, number];
  frameWidth?: number | [number, number];
  lensHeight?: number | [number, number];
  lensWidth?: number | [number, number];
  templeLength?: number | [number, number];
  springHinges?: boolean;
  weight?: number | [number, number];
  multifocal?: boolean;
}
