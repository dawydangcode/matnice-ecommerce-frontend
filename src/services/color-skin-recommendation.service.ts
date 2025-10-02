import axios from 'axios';
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class ColorSkinRecommendationService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

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

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/color-skin-recommendations/list?${params.toString()}`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Get color skin recommendation by ID
  async getColorSkinRecommendationById(
    id: number,
  ): Promise<ColorSkinRecommendation> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/color-skin-recommendation/${id}/detail`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Get recommendations by product color ID
  async getRecommendationsByProductColor(
    productColorId: number,
  ): Promise<ColorSkinRecommendation[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/product-color/${productColorId}/skin-recommendations`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Get recommendations by skin color type
  async getRecommendationsBySkinColor(
    skinColorType: SkinColorType,
  ): Promise<ColorSkinRecommendation[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/skin-color/${skinColorType}/color-recommendations`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Get product color IDs by skin color type
  async getProductColorIdsBySkinColor(
    skinColorType: SkinColorType,
  ): Promise<RecommendedProductColorsResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/skin-color/${skinColorType}/recommended-product-colors`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Create single color skin recommendation
  async createColorSkinRecommendation(
    data: CreateColorSkinRecommendationRequest,
  ): Promise<ColorSkinRecommendationResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/color-skin-recommendation/create`,
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Bulk create recommendations for a product color
  async bulkCreateRecommendations(
    productColorId: number,
    data: BulkCreateRecommendationsRequest,
  ): Promise<ColorSkinRecommendationResponse[]> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/product-color/${productColorId}/bulk-recommendations`,
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Update color skin recommendation
  async updateColorSkinRecommendation(
    id: number,
    data: UpdateColorSkinRecommendationRequest,
  ): Promise<ColorSkinRecommendationResponse> {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/color-skin-recommendation/${id}/update`,
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  // Delete color skin recommendation
  async deleteColorSkinRecommendation(id: number): Promise<boolean> {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/color-skin-recommendation/${id}/delete`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }
}

export const colorSkinRecommendationService =
  new ColorSkinRecommendationService();
