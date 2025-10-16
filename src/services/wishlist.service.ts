import { apiService } from './api.service';

export interface WishlistItem {
  id: number;
  userId: number;
  itemType: 'product' | 'lens';
  productId?: number;
  lensId?: number;
  selectedColorId?: number;
  addedAt: string;
  // Populated data from joins
  productName?: string;
  productPrice?: number;
  colorName?: string;
  brandName?: string;
  lensName?: string;
  lensBrandName?: string;
}

export interface WishlistResponse {
  total: number;
  data: WishlistItem[];
}

export interface AddToWishlistRequest {
  itemType: 'product' | 'lens';
  productId?: number;
  lensId?: number;
  selectedColorId?: number;
}

class WishlistService {
  private baseUrl = '/api/v1/wishlist';

  async getWishlist(
    page?: number,
    limit?: number,
    itemType?: 'product' | 'lens',
  ): Promise<WishlistResponse> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (itemType) params.append('itemType', itemType);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

      console.log('[WishlistService] Making API call to:', url);
      const response = await apiService.get(url);
      console.log('[WishlistService] Raw API response:', response);

      // Backend returns the WishlistResponse format directly
      // Check different response structures
      let wishlistResponse: WishlistResponse;

      if (Array.isArray(response)) {
        // If response is directly an array
        console.log('[WishlistService] Response is array, wrapping...');
        wishlistResponse = {
          total: response.length,
          data: response,
        };
      } else if (response && typeof response === 'object') {
        if (
          'data' in response &&
          response.data &&
          typeof response.data === 'object' &&
          'total' in response.data &&
          'data' in response.data
        ) {
          // If response is wrapped: { data: { total, data } }
          console.log(
            '[WishlistService] Response is nested object, extracting...',
          );
          wishlistResponse = response.data as WishlistResponse;
        } else if ('total' in response && 'data' in response) {
          // If response is already correct format: { total, data }
          console.log('[WishlistService] Response is correct format');
          wishlistResponse = response as WishlistResponse;
        } else {
          // Unknown format, return empty
          console.warn('[WishlistService] Unknown response format:', response);
          wishlistResponse = { total: 0, data: [] };
        }
      } else {
        console.warn('[WishlistService] Invalid response:', response);
        wishlistResponse = { total: 0, data: [] };
      }

      console.log(
        '[WishlistService] Final wishlistResponse:',
        wishlistResponse,
      );
      return wishlistResponse;
    } catch (error) {
      console.error('[WishlistService] Error fetching wishlist:', error);
      throw error;
    }
  }

  async addToWishlist(data: AddToWishlistRequest): Promise<WishlistItem> {
    try {
      const response = (await apiService.post(`${this.baseUrl}/add`, data)) as {
        data: WishlistItem;
      };
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(wishlistItemId: number): Promise<boolean> {
    try {
      await apiService.delete(`${this.baseUrl}/${wishlistItemId}`);
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  async checkItemInWishlist(
    itemType: 'product' | 'lens',
    itemId: number,
  ): Promise<boolean> {
    try {
      const response = (await apiService.get(
        `${this.baseUrl}/check/${itemType}/${itemId}`,
      )) as { data: { isInWishlist: boolean } };
      return response.data.isInWishlist;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  async getWishlistCount(): Promise<number> {
    try {
      const response = (await apiService.get(`${this.baseUrl}/count`)) as {
        data: { count: number };
      };
      return response.data.count;
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      return 0;
    }
  }
}

const wishlistService = new WishlistService();
export default wishlistService;
