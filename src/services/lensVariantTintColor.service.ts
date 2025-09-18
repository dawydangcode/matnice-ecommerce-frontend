import { apiService } from './api.service';

export interface CreateLensVariantTintColorDto {
  lensVariantId: number;
  name: string;
  colorCode: string;
  image?: string; // URL của ảnh sau khi upload
}

export interface LensVariantTintColorResponse {
  id: number;
  lensVariantId: number;
  name: string;
  colorCode: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

class LensVariantTintColorService {
  private baseUrl = '/api/v1/lens-tint-color';

  async createTintColor(
    data: CreateLensVariantTintColorDto,
  ): Promise<LensVariantTintColorResponse> {
    const response = await apiService.post<LensVariantTintColorResponse>(
      `${this.baseUrl}`,
      data,
    );
    return response;
  }

  async createMultipleTintColors(
    lensVariantId: number,
    tintColors: Omit<CreateLensVariantTintColorDto, 'lensVariantId'>[],
  ): Promise<LensVariantTintColorResponse[]> {
    const tintColorData = tintColors.map((tint) => ({
      ...tint,
      lensVariantId,
    }));

    const promises = tintColorData.map((data) => this.createTintColor(data));
    return Promise.all(promises);
  }
}

export const lensVariantTintColorService = new LensVariantTintColorService();
