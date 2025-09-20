import { apiService } from './api.service';
import {
  LensCard,
  LensCardFilters,
  LensCardResponse,
  BrandLensData,
  CategoryLensData,
} from '../types/lensCard.types';

class LensCardService {
  // Get lens cards with filters
  async getLensCards(filters?: LensCardFilters): Promise<LensCardResponse> {
    try {
      console.log('Fetching lens cards with filters:', filters);
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.minPrice)
        params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice)
        params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters?.search) params.append('search', filters.search);

      // Array filters
      if (filters?.brandIds?.length) {
        params.append('brandLensIds', filters.brandIds.join(','));
      }
      if (filters?.categoryIds?.length) {
        params.append('categoryLensIds', filters.categoryIds.join(','));
      }
      if (filters?.types?.length) {
        params.append('lensTypes', filters.types.join(','));
      }

      const response = await apiService.get<LensCardResponse>(
        `/api/v1/lens/cards${params.toString() ? `?${params.toString()}` : ''}`,
      );
      console.log(
        'Full API URL:',
        `/api/v1/lens/cards${params.toString() ? `?${params.toString()}` : ''}`,
      );
      console.log('Lens cards response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching lens cards:', error);
      throw error;
    }
  }

  // Get single lens card by ID
  async getLensCardById(id: number): Promise<LensCard> {
    try {
      const response = await apiService.get<LensCard>(
        `/api/v1/lens/${id}/detail`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching lens card:', error);
      throw error;
    }
  }

  // Get brands for filter
  async getBrandLensForFilter(): Promise<BrandLensData[]> {
    try {
      const response =
        await apiService.get<BrandLensData[]>('/api/v1/brand-lens');
      return response;
    } catch (error) {
      console.error('Error fetching brand lens for filter:', error);
      throw error;
    }
  }

  // Get categories for filter
  async getCategoryLensForFilter(): Promise<CategoryLensData[]> {
    try {
      const response = await apiService.get<CategoryLensData[]>(
        '/api/v1/lens-categories',
      );
      return response;
    } catch (error) {
      console.error('Error fetching category lens for filter:', error);
      throw error;
    }
  }
}

export const lensCardService = new LensCardService();
