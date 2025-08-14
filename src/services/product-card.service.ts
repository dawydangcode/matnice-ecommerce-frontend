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
      if (params.gender) {
        if (Array.isArray(params.gender)) {
          params.gender.forEach((g) => queryParams.append('gender', g));
        } else {
          queryParams.append('gender', params.gender);
        }
      }
      if (params.minPrice !== undefined)
        queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined)
        queryParams.append('maxPrice', params.maxPrice.toString());

      // Add productDetail filters
      if (params.frameType && params.frameType.length > 0) {
        params.frameType.forEach((v) => queryParams.append('frameType', v));
      }
      if (params.frameShape && params.frameShape.length > 0) {
        params.frameShape.forEach((v) => queryParams.append('frameShape', v));
      }
      if (params.frameMaterial && params.frameMaterial.length > 0) {
        params.frameMaterial.forEach((v) =>
          queryParams.append('frameMaterial', v),
        );
      }
      if (params.bridgeDesign && params.bridgeDesign.length > 0) {
        params.bridgeDesign.forEach((v) =>
          queryParams.append('bridgeDesign', v),
        );
      }
      if (params.style && params.style.length > 0) {
        params.style.forEach((v) => queryParams.append('style', v));
      }
      if (params.bridgeWidth !== undefined) {
        if (Array.isArray(params.bridgeWidth)) {
          queryParams.append(
            'bridgeWidthMin',
            params.bridgeWidth[0].toString(),
          );
          queryParams.append(
            'bridgeWidthMax',
            params.bridgeWidth[1].toString(),
          );
        } else {
          queryParams.append('bridgeWidth', params.bridgeWidth.toString());
        }
      }
      if (params.frameWidth !== undefined) {
        if (Array.isArray(params.frameWidth)) {
          queryParams.append('frameWidthMin', params.frameWidth[0].toString());
          queryParams.append('frameWidthMax', params.frameWidth[1].toString());
        } else {
          queryParams.append('frameWidth', params.frameWidth.toString());
        }
      }
      if (params.lensHeight !== undefined) {
        if (Array.isArray(params.lensHeight)) {
          queryParams.append('lensHeightMin', params.lensHeight[0].toString());
          queryParams.append('lensHeightMax', params.lensHeight[1].toString());
        } else {
          queryParams.append('lensHeight', params.lensHeight.toString());
        }
      }
      if (params.lensWidth !== undefined) {
        if (Array.isArray(params.lensWidth)) {
          queryParams.append('lensWidthMin', params.lensWidth[0].toString());
          queryParams.append('lensWidthMax', params.lensWidth[1].toString());
        } else {
          queryParams.append('lensWidth', params.lensWidth.toString());
        }
      }
      if (params.templeLength !== undefined) {
        if (Array.isArray(params.templeLength)) {
          queryParams.append(
            'templeLengthMin',
            params.templeLength[0].toString(),
          );
          queryParams.append(
            'templeLengthMax',
            params.templeLength[1].toString(),
          );
        } else {
          queryParams.append('templeLength', params.templeLength.toString());
        }
      }
      if (params.springHinges !== undefined) {
        queryParams.append('springHinges', params.springHinges ? '1' : '0');
      }
      if (params.weight !== undefined) {
        if (Array.isArray(params.weight)) {
          queryParams.append('weightMin', params.weight[0].toString());
          queryParams.append('weightMax', params.weight[1].toString());
        } else {
          queryParams.append('weight', params.weight.toString());
        }
      }
      if (params.multifocal !== undefined) {
        queryParams.append('multifocal', params.multifocal ? '1' : '0');
      }

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
