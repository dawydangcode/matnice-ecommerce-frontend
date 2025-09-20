import { apiService } from './api.service';

export interface LensDetail {
  lens: {
    id: string;
    name: string;
    origin?: string;
    lensType: string;
    status: string;
    description?: string;
    createdAt: string;
    brandLens: {
      id: string;
      name: string;
      description?: string;
    };
  };
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  variants: Array<{
    id: string;
    lensThicknessId: string;
    design: string;
    material: string;
    price: string;
    stock: number;
    refractionRanges: Array<{
      id: string;
      refractionType: string;
      minValue: string;
      maximumValue: string;
      stepValue: string;
    }>;
    tintColors: Array<any>;
    lensThickness: {
      id: string;
      name: string;
      indexValue: number;
      price: string;
      description: string;
    };
  }>;
  coatings: Array<{
    id: string;
    name: string;
    price: string;
    description?: string;
  }>;
  images: Array<{
    id: string;
    imageUrl: string;
    imageOrder: string;
    isThumbnail: boolean;
  }>;
  summary: {
    totalVariants: number;
    totalCoatings: number;
    totalImages: number;
    priceRange: {
      min: number;
      max: number;
    };
    availableStock: number;
  };
}

class LensDetailService {
  async getLensDetail(id: number): Promise<LensDetail> {
    try {
      const response = await apiService.get<LensDetail>(`/api/v1/lens/${id}/full-details`);
      return response;
    } catch (error) {
      console.error('Error fetching lens detail:', error);
      throw error;
    }
  }
}

export const lensDetailService = new LensDetailService();
