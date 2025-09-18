import { apiService } from './api.service';

export interface CreateLensImageDto {
  lensId: number;
  imageUrl: string;
  order: 'a' | 'b' | 'c' | 'd' | 'e';
}

export interface LensImageResponse {
  id: number;
  lensId: number;
  imageUrl: string;
  order: string;
  createdAt: string;
  updatedAt: string;
}

class LensImageService {
  private baseUrl = '/lens-images';

  async createLensImage(data: CreateLensImageDto): Promise<LensImageResponse> {
    const response = await apiService.post<LensImageResponse>(
      `${this.baseUrl}`,
      data,
    );
    return response;
  }

  async createMultipleLensImages(
    lensId: number,
    images: Omit<CreateLensImageDto, 'lensId'>[],
  ): Promise<LensImageResponse[]> {
    const imageData = images.map((img) => ({
      ...img,
      lensId,
    }));

    const promises = imageData.map((data) => this.createLensImage(data));
    return Promise.all(promises);
  }
}

export const lensImageService = new LensImageService();
