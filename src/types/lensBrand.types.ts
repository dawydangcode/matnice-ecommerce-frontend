export interface LensBrand {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
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
