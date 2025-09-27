export interface UserAddress {
  id: number;
  userId: number;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
  notes?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateUserAddressDto {
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault?: boolean;
  notes?: string;
}

export interface UpdateUserAddressDto {
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  isDefault?: boolean;
  notes?: string;
}

export interface UserAddressFilters {
  userId?: number;
  province?: string;
  district?: string;
  isDefault?: boolean;
}

export interface UserAddressPagination {
  data: UserAddress[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Vietnam address data types
export interface Province {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
}

export interface District {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  provinceCode: string;
}

export interface Ward {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  districtCode: string;
}
