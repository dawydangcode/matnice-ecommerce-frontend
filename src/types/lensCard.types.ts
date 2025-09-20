// Lens Card Types for Frontend Display
export interface LensCard {
  id: number;
  name: string;
  description?: string;
  type?: LensType;
  basePrice: number | string;
  isNew?: boolean;
  isFeatured?: boolean;
  images: {
    id: number;
    imageUrl: string;
    imageOrder: string; // "a", "b", "c", etc.
    isThumbnail?: number; // 0 or 1 from backend
  }[];
  brandLens?: {
    id: number;
    name: string;
  };
  categoryLens?: {
    id: number;
    name: string;
  };
}

export enum LensType {
  SINGLE_VISION = 'SINGLE_VISION',
  DRIVE_SAFE = 'DRIVE_SAFE',
  PROGRESSIVE = 'PROGRESSIVE',
  OFFICE = 'OFFICE',
  NON_PRESCRIPTION = 'NON_PRESCRIPTION',
}

// Lens Card Filters
export interface LensCardFilters {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'newest';
  sortOrder?: 'ASC' | 'DESC';
  brandIds?: number[];
  categoryIds?: number[];
  types?: string[];
  search?: string;
}

// API Response
export interface LensCardResponse {
  data: LensCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Brand Lens Data for Filter
export interface BrandLensData {
  id: number;
  name: string;
  description?: string;
}

// Category Lens Data for Filter
export interface LensCategoryData {
  id: number;
  name: string;
  description?: string;
}

// Alias for backward compatibility
export type CategoryLensData = LensCategoryData;
