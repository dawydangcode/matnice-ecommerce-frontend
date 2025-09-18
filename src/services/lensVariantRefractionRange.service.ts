import { apiService } from './api.service';

export interface CreateLensVariantRefractionRangeDto {
  lensVariantId: number;
  refractionType: 'SPHERICAL' | 'CYLINDRICAL' | 'AXIS' | 'ADDITIONAL';
  minValue: number;
  maxValue: number;
  stepValue: number;
}

export interface LensVariantRefractionRangeResponse {
  id: number;
  lensVariantId: number;
  refractionType: string;
  minValue: number;
  maxValue: number;
  stepValue: number;
  createdAt: string;
  updatedAt: string;
}

class LensVariantRefractionRangeService {
  private baseUrl = '/api/v1/lens-refraction-range';

  async createRefractionRange(
    data: CreateLensVariantRefractionRangeDto,
  ): Promise<LensVariantRefractionRangeResponse> {
    const response = await apiService.post<LensVariantRefractionRangeResponse>(
      `${this.baseUrl}`,
      data,
    );
    return response;
  }

  async createMultipleRefractionRanges(
    lensVariantId: number,
    ranges: Omit<CreateLensVariantRefractionRangeDto, 'lensVariantId'>[],
  ): Promise<LensVariantRefractionRangeResponse[]> {
    const rangeData = ranges.map((range) => ({
      ...range,
      lensVariantId,
    }));

    const promises = rangeData.map((data) => this.createRefractionRange(data));
    return Promise.all(promises);
  }
}

export const lensVariantRefractionRangeService =
  new LensVariantRefractionRangeService();
