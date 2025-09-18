import { apiService } from './api.service';

export interface LensCategoryCreateRequest {
  lensId: number;
  categoryLensId: number;
}

export interface LensCategoryResponse {
  id: number;
  lensId: number;
  categoryLensId: number;
  createdAt: string;
  createdBy: number;
}

class LensCategoryService {
  private baseUrl = '/lens-category';

  async createLensCategory(
    data: LensCategoryCreateRequest,
  ): Promise<LensCategoryResponse> {
    const response = await apiService.post(`${this.baseUrl}/create`, data);
    return response as LensCategoryResponse;
  }

  async createMultipleLensCategories(
    lensId: number,
    categoryLensIds: number[],
  ): Promise<LensCategoryResponse[]> {
    const promises = categoryLensIds.map((categoryLensId) =>
      this.createLensCategory({ lensId, categoryLensId }),
    );
    return Promise.all(promises);
  }

  async getLensCategoriesByLensId(
    lensId: number,
  ): Promise<LensCategoryResponse[]> {
    const response = await apiService.get(`/lens/${lensId}`);
    return response as LensCategoryResponse[];
  }

  async deleteLensCategory(id: number): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}/delete`);
  }
}

export const lensCategoryService = new LensCategoryService();
