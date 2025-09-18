export interface LensThickness {
  id: number;
  name: string;
  description?: string;
  indexValue: number;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface CreateLensThicknessDto {
  name: string;
  description?: string;
  indexValue: number;
}

export interface UpdateLensThicknessDto {
  name?: string;
  description?: string;
  indexValue?: number;
}

export interface LensThicknessPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
