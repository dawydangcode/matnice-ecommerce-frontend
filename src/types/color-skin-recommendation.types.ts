export enum SkinColorType {
  DARK = 'dark',
  LIGHT = 'light',
  MEDIUM = 'medium',
}

export interface ColorSkinRecommendation {
  id: number;
  productColorId: number;
  skinColorType: SkinColorType;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
  productColor?: {
    id: number;
    colorName: string;
    colorCode: string;
    productId: number;
    stock: number;
    images?: Array<{
      id: number;
      imageUrl: string;
      imageOrder: string;
    }>;
  };
}

export interface CreateColorSkinRecommendationRequest {
  productColorId: number;
  skinColorType: SkinColorType;
}

export interface UpdateColorSkinRecommendationRequest {
  productColorId?: number;
  skinColorType?: SkinColorType;
}

export interface BulkCreateRecommendationsRequest {
  skinColorTypes: SkinColorType[];
}

export interface ColorSkinRecommendationResponse {
  id: number;
  productColorId: number;
  skinColorType: SkinColorType;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendedProductColorsResponse {
  skinColorType: SkinColorType;
  productColorIds: number[];
  count: number;
}
