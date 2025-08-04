// Updated to match backend API structure
export interface Brand {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateBrandDto {
  name: string;
  description?: string;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
}

export interface BrandFilters {
  page?: number;
  limit?: number;
  q?: string;
}
