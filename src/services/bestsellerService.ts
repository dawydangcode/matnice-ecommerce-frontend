import { apiService } from './api.service';

export interface BestsellerProduct {
  id: number;
  productName: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  brand: {
    id: number;
    name: string;
  };
  image: string;
  isBoutique: boolean;
  isNew: boolean;
  totalSales: number;
  isPinned: boolean;
  productCode?: string;
}

export interface GetBestsellersParams {
  limit?: number;
  pinnedOnly?: boolean;
}

class BestsellerService {
  /**
   * Get bestsellers for homepage
   */
  async getBestsellers(
    params?: GetBestsellersParams,
  ): Promise<BestsellerProduct[]> {
    try {
      const queryParams = {
        limit: params?.limit || 8,
        pinnedOnly: params?.pinnedOnly || false,
      };

      const data = await apiService.get<BestsellerProduct[]>(
        '/api/v1/bestsellers',
        queryParams,
      );

      return data;
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      throw error;
    }
  }
}

const bestsellerService = new BestsellerService();
export default bestsellerService;
