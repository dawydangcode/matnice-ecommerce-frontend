import { apiService } from './api.service';

export interface ProductThicknessCompatibility {
  id: number;
  productId: number;
  lensThicknessId: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  deletedAt?: Date;
  deletedBy?: number;
}

export class ProductThicknessCompatibilityService {
  async getCompatibilities(
    productId?: number,
    lensThicknessId?: number,
  ): Promise<ProductThicknessCompatibility[]> {
    try {
      const params = new URLSearchParams();
      if (productId) params.append('productId', productId.toString());
      if (lensThicknessId)
        params.append('lensThicknessId', lensThicknessId.toString());

      const response = await apiService.get<ProductThicknessCompatibility[]>(
        `/api/v1/product-thickness-compatibility/list?${params.toString()}`,
      );
      return response;
    } catch (error) {
      console.error('Failed to get compatibilities:', error);
      throw error;
    }
  }

  async getCompatibleThicknessIds(productId: number): Promise<number[]> {
    // Validation productId
    if (!productId || isNaN(Number(productId)) || productId <= 0) {
      throw new Error(`Invalid productId: ${productId}`);
    }

    try {
      const response = await apiService.get<number[]>(
        `/api/v1/product-thickness-compatibility/product/${productId}/thickness-ids`,
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to get compatible thickness IDs for product ${productId}:`,
        error,
      );
      throw error;
    }
  }

  async getCompatibleProductIds(thicknessId: number): Promise<number[]> {
    try {
      const response = await apiService.get<number[]>(
        `/api/v1/product-thickness-compatibility/thickness/${thicknessId}/product-ids`,
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to get compatible product IDs for thickness ${thicknessId}:`,
        error,
      );
      throw error;
    }
  }

  async checkCompatibility(
    productId: number,
    thicknessId: number,
  ): Promise<boolean> {
    try {
      const response = await apiService.get<{ compatible: boolean }>(
        `/api/v1/product-thickness-compatibility/check/${productId}/${thicknessId}`,
      );
      return response.compatible;
    } catch (error) {
      console.error(
        `Failed to check compatibility for product ${productId} and thickness ${thicknessId}:`,
        error,
      );
      throw error;
    }
  }

  async createCompatibility(
    productId: number,
    lensThicknessId: number,
  ): Promise<ProductThicknessCompatibility> {
    try {
      const response = await apiService.post<ProductThicknessCompatibility>(
        `/api/v1/product-thickness-compatibility/create`,
        { productId, lensThicknessId },
      );
      return response;
    } catch (error) {
      console.error('Failed to create compatibility:', error);
      throw error;
    }
  }

  async updateProductCompatibilities(
    productId: number,
    lensThicknessIds: number[],
  ): Promise<ProductThicknessCompatibility[]> {
    try {
      const response = await apiService.put<ProductThicknessCompatibility[]>(
        `/api/v1/product-thickness-compatibility/product/${productId}/compatibilities`,
        { lensThicknessIds },
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to update compatibilities for product ${productId}:`,
        error,
      );
      throw error;
    }
  }

  async deleteCompatibility(
    productId: number,
    thicknessId: number,
  ): Promise<boolean> {
    try {
      const response = await apiService.delete<{ success: boolean }>(
        `/api/v1/product-thickness-compatibility/${productId}/${thicknessId}`,
      );
      return response.success;
    } catch (error) {
      console.error(
        `Failed to delete compatibility for product ${productId} and thickness ${thicknessId}:`,
        error,
      );
      throw error;
    }
  }

  async deleteProductCompatibilities(productId: number): Promise<boolean> {
    try {
      const response = await apiService.delete<{ success: boolean }>(
        `/api/v1/product-thickness-compatibility/product/${productId}/all`,
      );
      return response.success;
    } catch (error) {
      console.error(
        `Failed to delete all compatibilities for product ${productId}:`,
        error,
      );
      throw error;
    }
  }
}

export const productThicknessCompatibilityService =
  new ProductThicknessCompatibilityService();
