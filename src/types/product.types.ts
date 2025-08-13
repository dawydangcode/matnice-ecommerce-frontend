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
  isNew?: boolean;
  isBoutique?: boolean;
  newUntil?: string;
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
  productDetail?: ProductDetail;
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
  GLASSES = 'glasses',
  SUNGLASSES = 'sunglasses',
}

export enum ProductGenderType {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex',
}

// Frame related enums
export enum FrameType {
  FULL_RIM = 'full_rim',
  HALF_RIM = 'half_rim',
  RIMLESS = 'rimless',
}

export enum FrameShapeType {
  ROUND = 'round',
  SQUARE = 'square',
  RECTANGLE = 'rectangle',
  BROWLINE = 'browline',
  BUTTERFLY = 'butterfly',
  AVIATOR = 'aviator',
  NARROW = 'narrow',
  OVAL = 'oval',
}

export enum FrameMaterialType {
  PLASTIC = 'plastic',
  METAL = 'metal',
  TITAN = 'titan',
  WOOD = 'wood',
  CARBON = 'carbon',
  ALUMINIUM = 'aluminium',
  CELLULOSE = 'cellulose',
  LEATHER = 'leather',
}

export enum FrameBridgeDesignType {
  WITHOUT_NOSE_PADS = 'without_nose_pads',
  WITH_NOSE_PADS = 'with_nose_pads',
  WITH_KEYHOLE_BRIDGE = 'keyhole_bridge',
}

export enum FrameStyleType {
  CLASSIC = 'classic',
  MODERN = 'modern',
  EXTRAVAGANT = 'extravagant',
  SPORTY = 'sporty',
}
export enum FaceShapeType {
  ROUND = 'round',
  SQUARE = 'square',
  OVAL = 'oval',
  HEART = 'heart',
  DIAMOND = 'diamond',
}
// Product Detail interface
export interface ProductDetail {
  id: number;
  productId: number;
  productNumber: string;
  color: string;
  bridgeWidth: number;
  frameWidth: number;
  lensHeight: number;
  lensWidth: number;
  templeLength: number;
  frameColor: string;
  frameMaterial: FrameMaterialType;
  frameShape: FrameShapeType;
  frameType: FrameType;
  bridgeDesign: FrameBridgeDesignType;
  style: FrameStyleType;
  springHinges: boolean;
  weight: number;
  multifocal: boolean;
  lensThicknessIds?: number[]; // Array of lens thickness IDs
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDetailRequest {
  productNumber?: string; // Optional since we'll auto-generate from productName
  bridgeWidth: number;
  frameWidth: number;
  lensHeight: number;
  lensWidth: number;
  templeLength: number;
  frameMaterial: FrameMaterialType;
  frameShape: FrameShapeType;
  frameType: FrameType;
  springHinges: boolean;
  bridgeDesign: FrameBridgeDesignType;
  style: FrameStyleType;
  weight: number;
  multifocal: boolean;
  lensThicknessIds?: number[]; // Array of lens thickness IDs
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
  isNew?: boolean;
  isBoutique?: boolean;
  imageUrls?: string[];
  // Product detail included in creation
  productDetail?: CreateProductDetailRequest;
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
  isNew: boolean;
  isBoutique: boolean;
  images: File[];
}
