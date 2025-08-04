// Updated to match backend API structure
export interface Category {
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

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  q?: string;
}
