import { apiService } from './api.service';

export interface LensCoatingCreateRequest {
  lensId: number;
  name: string;
  price: number;
  description: string;
}

export interface LensCoatingResponse {
  id: number;
  lensId: number;
  name: string;
  price: number;
  description: string;
  createdAt: string;
  createdBy: number;
}

class LensCoatingService {
  private baseUrl = '/api/v1/lens-coating';

  async createLensCoating(
    data: LensCoatingCreateRequest,
  ): Promise<LensCoatingResponse> {
    const response = await apiService.post(`${this.baseUrl}/create`, data);
    return response as LensCoatingResponse;
  }

  async createMultipleLensCoatings(
    lensId: number,
    coatings: Omit<LensCoatingCreateRequest, 'lensId'>[],
  ): Promise<LensCoatingResponse[]> {
    const promises = coatings.map((coating) =>
      this.createLensCoating({
        ...coating,
        lensId,
      }),
    );

    return Promise.all(promises);
  }

  async getLensCoatingsByLensId(
    lensId: number,
  ): Promise<LensCoatingResponse[]> {
    const response = await apiService.get(`${this.baseUrl}/list`, {
      params: { lensId },
    });
    return response as LensCoatingResponse[];
  }

  async deleteLensCoating(id: number): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}/delete`);
  }
}

export const lensCoatingService = new LensCoatingService();
