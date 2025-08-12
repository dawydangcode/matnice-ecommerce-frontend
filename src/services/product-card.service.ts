import { apiService } from './api.service';
import {
  ProductCard,
  ProductCardResponse,
  ProductCardQueryParams,
} from '../types/product-card.types';

class ProductCardService {
  /**
   * Get products for card display with filtering and pagination
   */
  async getProductCards(
    params: ProductCardQueryParams = {},
  ): Promise<ProductCardResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      // Add search
      if (params.search) queryParams.append('search', params.search);

      // Add filters
      if (params.productTypeIds && params.productTypeIds.length > 0) {
        params.productTypeIds.forEach((id) =>
          queryParams.append('productTypeIds', id.toString()),
        );
      }
      if (params.brandIds && params.brandIds.length > 0) {
        params.brandIds.forEach((id) =>
          queryParams.append('brandIds', id.toString()),
        );
      }
      if (params.categoryIds && params.categoryIds.length > 0) {
        params.categoryIds.forEach((id) =>
          queryParams.append('categoryIds', id.toString()),
        );
      }
      if (params.gender) queryParams.append('gender', params.gender);
      if (params.minPrice !== undefined)
        queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined)
        queryParams.append('maxPrice', params.maxPrice.toString());

      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiService.get<ProductCardResponse>(
        `/api/v1/products/cards?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching product cards:', error);
      throw error;
    }
  }

  /**
   * Get featured/recommended products for homepage
   */
  async getFeaturedProducts(limit: number = 8): Promise<ProductCard[]> {
    try {
      const response = await this.getProductCards({
        limit,
        sortBy: 'newest',
        sortOrder: 'DESC',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  /**
   * Get new products
   */
  async getNewProducts(limit: number = 12): Promise<ProductCard[]> {
    try {
      // For now, we'll use the sortBy newest since we don't have a specific isNew filter in the query
      // You might want to add this filter to the backend if needed
      const response = await this.getProductCards({
        limit,
        sortBy: 'newest',
        sortOrder: 'DESC',
      });
      return response.data.filter((product) => product.isNew);
    } catch (error) {
      console.error('Error fetching new products:', error);
      throw error;
    }
  }

  /**
   * Search products by query
   */
  async searchProducts(
    searchQuery: string,
    params: Omit<ProductCardQueryParams, 'search'> = {},
  ): Promise<ProductCardResponse> {
    try {
      return await this.getProductCards({
        ...params,
        search: searchQuery,
      });
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

const productCardService = new ProductCardService();
export default productCardService;
