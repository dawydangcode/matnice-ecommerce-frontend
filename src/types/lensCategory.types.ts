export interface LensCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLensCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateLensCategoryDto {
  name?: string;
  description?: string;
}

export interface LensCategoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
