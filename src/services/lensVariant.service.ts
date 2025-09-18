import { apiService } from './api.service';

export interface LensVariantCreateRequest {
  lensId: number;
  lensThicknessId: number;
  design: string;
  material: string;
  price: number;
  stock: number;
}

export interface LensVariantResponse {
  id: number;
  lensId: number;
  lensThicknessId: number;
  design: string;
  material: string;
  price: number;
  stock: number;
  createdAt: string;
  createdBy: number;
}

class LensVariantService {
  private baseUrl = '/api/v1/lens-variant';

  async createLensVariant(
    data: LensVariantCreateRequest,
  ): Promise<LensVariantResponse> {
    const response = await apiService.post(`${this.baseUrl}/create`, data);
    return response as LensVariantResponse;
  }

  async createMultipleLensVariants(
    lensId: number,
    variants: Omit<LensVariantCreateRequest, 'lensId'>[],
  ): Promise<LensVariantResponse[]> {
    const promises = variants.map((variant) =>
      this.createLensVariant({
        ...variant,
        lensId,
      }),
    );

    return Promise.all(promises);
  }

  async getLensVariantsByLensId(
    lensId: number,
  ): Promise<LensVariantResponse[]> {
    const response = await apiService.get(
      `/api/v1/lens-variants/by-lens/${lensId}`,
    );
    return response as LensVariantResponse[];
  }

  async deleteLensVariant(id: number): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}/delete`);
  }
}

export const lensVariantService = new LensVariantService();
