import { apiService } from './api.service';
import {
  ColorSkinRecommendation,
  CreateColorSkinRecommendationRequest,
  UpdateColorSkinRecommendationRequest,
  BulkCreateRecommendationsRequest,
  ColorSkinRecommendationResponse,
  RecommendedProductColorsResponse,
  SkinColorType,
} from '../types/color-skin-recommendation.types';
import { PaginatedResponse } from '../types/common.types';

export class ColorSkinRecommendationService {
  // Get all color skin recommendations with pagination and filters
  async getColorSkinRecommendations(
    page?: number,
    limit?: number,
    skinColorType?: SkinColorType,
    productColorId?: number,
  ): Promise<PaginatedResponse<ColorSkinRecommendation>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (skinColorType) params.append('skinColorType', skinColorType);
    if (productColorId)
      params.append('productColorId', productColorId.toString());

    return await apiService.get(
      `/api/v1/color-skin-recommendations/list?${params.toString()}`,
    );
  }

  // Get color skin recommendation by ID
  async getColorSkinRecommendationById(
    id: number,
  ): Promise<ColorSkinRecommendation> {
    return await apiService.get(
      `/api/v1/color-skin-recommendation/${id}/detail`,
    );
  }

  // Get recommendations by product color ID
  async getRecommendationsByProductColor(
    productColorId: number,
  ): Promise<ColorSkinRecommendation[]> {
    return await apiService.get(
      `/api/v1/product-color/${productColorId}/skin-recommendations`,
    );
  }

  // Get recommendations by skin color type
  async getRecommendationsBySkinColor(
    skinColorType: SkinColorType,
  ): Promise<ColorSkinRecommendation[]> {
    return await apiService.get(
      `/api/v1/skin-color/${skinColorType}/color-recommendations`,
    );
  }

  // Get product color IDs by skin color type
  async getProductColorIdsBySkinColor(
    skinColorType: SkinColorType,
  ): Promise<RecommendedProductColorsResponse> {
    return await apiService.get(
      `/api/v1/skin-color/${skinColorType}/recommended-product-colors`,
    );
  }

  // Create single color skin recommendation
  async createColorSkinRecommendation(
    data: CreateColorSkinRecommendationRequest,
  ): Promise<ColorSkinRecommendationResponse> {
    return await apiService.post(
      `/api/v1/color-skin-recommendation/create`,
      data,
    );
  }

  // Bulk create recommendations for a product color
  async bulkCreateRecommendations(
    productColorId: number,
    data: BulkCreateRecommendationsRequest,
  ): Promise<ColorSkinRecommendationResponse[]> {
    return await apiService.post(
      `/api/v1/product-color/${productColorId}/bulk-recommendations`,
      data,
    );
  }

  // Update color skin recommendation
  async updateColorSkinRecommendation(
    id: number,
    data: UpdateColorSkinRecommendationRequest,
  ): Promise<ColorSkinRecommendationResponse> {
    return await apiService.put(
      `/api/v1/color-skin-recommendation/${id}/update`,
      data,
    );
  }

  // Delete color skin recommendation
  async deleteColorSkinRecommendation(id: number): Promise<boolean> {
    return await apiService.delete(
      `/api/v1/color-skin-recommendation/${id}/delete`,
    );
  }
}

export const colorSkinRecommendationService =
  new ColorSkinRecommendationService();
