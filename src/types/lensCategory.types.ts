export interface LensCategory {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
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
