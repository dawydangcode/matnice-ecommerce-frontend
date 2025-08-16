// Basic Lens Types
export interface Lens {
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

export interface CreateLensDto {
  name: string;
  description?: string;
}

export interface UpdateLensDto {
  name?: string;
  description?: string;
}

// Lens Quality Types
export interface LensQuality {
  id: number;
  name: string;
  price: number;
  description?: string;
  uvProtection: boolean;
  antiReflective: boolean;
  hardCoating: boolean;
  nightDayOptimization: boolean;
  antistaticCoating: boolean;
  freeFormTechnology: boolean;
  transitionsOption: boolean;
  createdAt: string;
  createdBy: number;
  updatedAt?: string;
  updatedBy?: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateLensQualityDto {
  name: string;
  price: number;
  description?: string;
  uvProtection?: boolean;
  antiReflective?: boolean;
  hardCoating?: boolean;
  nightDayOptimization?: boolean;
  antistaticCoating?: boolean;
  freeFormTechnology?: boolean;
  transitionsOption?: boolean;
}

export interface UpdateLensQualityDto extends Partial<CreateLensQualityDto> {}

// Lens Thickness Types
export interface LensThickness {
  id: number;
  name: string;
  indexValue: number;
  price: number;
  description?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateLensThicknessDto {
  name: string;
  indexValue: number;
  price: number;
  description?: string;
}

export interface UpdateLensThicknessDto
  extends Partial<CreateLensThicknessDto> {}

// Lens Tint Types
export interface LensTint {
  id: number;
  name: string;
  price: number;
  description?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateLensTintDto {
  name: string;
  price: number;
  description?: string;
}

export interface UpdateLensTintDto extends Partial<CreateLensTintDto> {}

// Tint Color Types
export interface TintColor {
  id: number;
  tintId: number;
  name: string;
  imageUrl?: string;
  colorCode?: string;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateTintColorDto {
  tintId: number;
  name: string;
  imageUrl?: string;
  colorCode?: string;
}

export interface UpdateTintColorDto extends Partial<CreateTintColorDto> {}

// Lens Upgrade Types
export interface LensUpgrade {
  id: number;
  upgradeName: string;
  description?: string;
  price: number;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateLensUpgradeDto {
  upgradeName: string;
  description?: string;
  price: number;
}

export interface UpdateLensUpgradeDto extends Partial<CreateLensUpgradeDto> {}

// Lens Detail Types
export interface LensDetail {
  id: number;
  lensId: number;
  lensThicknessId?: number;
  lensQualityId?: number;
  tintId?: number;
  powerSphereLeft?: number;
  powerSphereRight?: number;
  powerCylinderLeft?: number;
  powerCylinderRight?: number;
  axisLeft?: number;
  axisRight?: number;
  pdLeft?: number;
  pdRight?: number;
  prescriptionDate: string;
  material?: string;
  coating?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateLensDetailDto {
  lensId: number;
  lensThicknessId?: number;
  lensQualityId?: number;
  tintId?: number;
  powerSphereLeft?: number;
  powerSphereRight?: number;
  powerCylinderLeft?: number;
  powerCylinderRight?: number;
  axisLeft?: number;
  axisRight?: number;
  pdLeft?: number;
  pdRight?: number;
  prescriptionDate: Date;
  material?: string;
  coating?: string;
}

export interface UpdateLensDetailDto extends Partial<CreateLensDetailDto> {}

// Lens Upgrade Detail Types
export interface LensUpgradeDetail {
  id: number;
  name: string;
  upgradeHardCoating: boolean;
  upgradeAntiReflection: boolean;
  upgradeUvProtection: boolean;
  upgradeBlueLight: boolean;
  upgradeLotusEffect: boolean;
  upgradeSmartFocus: boolean;
  upgradeTransition: boolean;
  upgradeProgressive: boolean;
  upgradeHardCoatingPrice: number;
  upgradeAntiReflectionPrice: number;
  upgradeUvProtectionPrice: number;
  upgradeBluelightPrice: number;
  upgradeLotusEffectPrice: number;
  upgradeSmartFocusPrice: number;
  upgradeTransitionPrice: number;
  upgradeProgressivePrice: number;
  totalUpgradesPrice: number;
  description?: string;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateLensUpgradeDetailDto {
  name: string;
  upgradeHardCoating?: boolean;
  upgradeAntiReflection?: boolean;
  upgradeUvProtection?: boolean;
  upgradeBlueLight?: boolean;
  upgradeLotusEffect?: boolean;
  upgradeSmartFocus?: boolean;
  upgradeTransition?: boolean;
  upgradeProgressive?: boolean;
  upgradeHardCoatingPrice?: number;
  upgradeAntiReflectionPrice?: number;
  upgradeUvProtectionPrice?: number;
  upgradeBluelightPrice?: number;
  upgradeLotusEffectPrice?: number;
  upgradeSmartFocusPrice?: number;
  upgradeTransitionPrice?: number;
  upgradeProgressivePrice?: number;
  totalUpgradesPrice?: number;
  description?: string;
}

export interface UpdateLensUpgradeDetailDto
  extends Partial<CreateLensUpgradeDetailDto> {}

// Filter and Pagination Types
export interface LensFilters {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
}

export interface LensQualityFilters extends LensFilters {
  uvProtection?: boolean;
  antiReflective?: boolean;
  nightDayOptimization?: boolean;
  freeFormTechnology?: boolean;
}

export interface LensThicknessFilters extends LensFilters {
  minIndex?: number;
  maxIndex?: number;
}

export interface LensTintFilters extends LensFilters {
  minPrice?: number;
  maxPrice?: number;
}

export interface LensUpgradeFilters extends LensFilters {
  minPrice?: number;
  maxPrice?: number;
}

// Response Types
export interface LensResponse {
  data: Lens[];
  total: number;
}

export interface LensQualityResponse {
  data: LensQuality[];
  total: number;
}

export interface LensThicknessResponse {
  data: LensThickness[];
  total: number;
}

export interface LensTintResponse {
  data: LensTint[];
  total: number;
}

export interface LensUpgradeResponse {
  data: LensUpgrade[];
  total: number;
}

export interface LensDetailResponse {
  data: LensDetail[];
  total: number;
}

export interface LensUpgradeDetailResponse {
  data: LensUpgradeDetail[];
  total: number;
}

// Common pagination type
export interface PaginationParams {
  page?: number;
  limit?: number;
}
