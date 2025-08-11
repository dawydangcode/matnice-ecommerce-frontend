import { apiService } from './api.service';
import {
  ProductImageModel,
  UploadColorImageRequest,
  ProductImagesGroupedByColor,
  ImageOrder,
} from '../types/product-image.types';

class ProductColorImageService {
  private readonly baseUrl = '/api/v1';

  /**
   * Upload single product color image
   */
  async uploadProductColorImage({
    productId,
    colorId,
    productNumber,
    imageOrder,
    file,
  }: UploadColorImageRequest): Promise<ProductImageModel> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productNumber', productNumber);
    formData.append('imageOrder', imageOrder);

    try {
      const response = await apiService.post<ProductImageModel>(
        `${this.baseUrl}/product/${productId}/color/${colorId}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to upload color image',
      );
    }
  }

  /**
   * Upload multiple product color images
   */
  async uploadMultipleColorImages(
    productId: number,
    colorId: number,
    productNumber: string,
    files: Array<{ file: File; imageOrder: ImageOrder }>,
  ): Promise<ProductImageModel[]> {
    const results: ProductImageModel[] = [];

    for (const { file, imageOrder } of files) {
      try {
        const result = await this.uploadProductColorImage({
          productId,
          colorId,
          productNumber,
          imageOrder,
          file,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload image ${imageOrder}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Get all images for a product color
   */
  async getProductColorImages(
    productId: number,
    colorId: number,
  ): Promise<ProductImageModel[]> {
    // Validation productId
    if (!productId || isNaN(Number(productId)) || productId <= 0) {
      throw new Error(`Invalid productId: ${productId}`);
    }

    try {
      const response = await apiService.get<ProductImageModel[]>(
        `${this.baseUrl}/product/${productId}/color/${colorId}/images`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch color images',
      );
    }
  }

  /**
   * Get thumbnail images for product (only a and b orders)
   */
  async getProductThumbnailImages(
    productId: number,
  ): Promise<ProductImageModel[]> {
    try {
      const response = await apiService.get<ProductImageModel[]>(
        `${this.baseUrl}/product/${productId}/thumbnails`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch thumbnail images',
      );
    }
  }

  /**
   * Get all product images grouped by color
   */
  async getProductImagesGroupedByColor(
    productId: number,
  ): Promise<ProductImagesGroupedByColor> {
    try {
      const response = await apiService.get<ProductImagesGroupedByColor>(
        `${this.baseUrl}/product/${productId}/images/grouped-by-color`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch grouped images',
      );
    }
  }

  /**
   * Delete product color image by order
   */
  async deleteProductColorImage(
    productId: number,
    colorId: number,
    imageOrder: ImageOrder,
  ): Promise<boolean> {
    try {
      const response = await apiService.delete<boolean>(
        `${this.baseUrl}/product/${productId}/color/${colorId}/image/${imageOrder}`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete color image',
      );
    }
  }

  /**
   * Delete all images for a product color
   */
  async deleteProductColorImages(
    productId: number,
    colorId: number,
  ): Promise<boolean> {
    try {
      const response = await apiService.delete<boolean>(
        `${this.baseUrl}/product/${productId}/color/${colorId}/images`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete color images',
      );
    }
  }

  /**
   * Generate expected filename for display
   */
  generateExpectedFileName(
    productNumber: string,
    imageOrder: ImageOrder,
    extension: string = 'jpg',
  ): string {
    return `${productNumber}_${imageOrder}.${extension}`;
  }

  /**
   * Check if image order is thumbnail
   */
  isThumbnailOrder(imageOrder: ImageOrder): boolean {
    return imageOrder === 'a' || imageOrder === 'b';
  }

  /**
   * Get available image orders
   */
  getImageOrders(): ImageOrder[] {
    return ['a', 'b', 'c', 'd', 'e'];
  }

  /**
   * Get thumbnail orders only
   */
  getThumbnailOrders(): ImageOrder[] {
    return ['a', 'b'];
  }
}

export const productColorImageService = new ProductColorImageService();
