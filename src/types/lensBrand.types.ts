export interface LensBrand {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLensBrandDto {
  name: string;
  description?: string;
}

export interface UpdateLensBrandDto {
  name?: string;
  description?: string;
}

export interface LensBrandPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
