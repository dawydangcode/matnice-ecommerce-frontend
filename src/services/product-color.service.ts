import { apiService } from './api.service';

export interface ProductColor {
  id: number;
  productId: number;
  productVariantName: string; // Tên biến thể
  productNumber: string; // Mã sản phẩm variant
  colorName: string; // Tên màu
  stock: number; // Số lượng tồn kho
  isThumbnail: boolean; // Có phải thumbnail chính không
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateProductColorRequest {
  productId: number;
  productVariantName: string;
  productNumber: string;
  colorName: string;
  stock: number;
  isThumbnail: boolean;
}

export interface UpdateProductColorRequest {
  productVariantName?: string;
  productNumber?: string;
  colorName?: string;
  stock?: number;
  isThumbnail?: boolean;
}

class ProductColorService {
  private readonly baseUrl = '/api/v1';

  // Get all colors for a product
  async getProductColors(productId: number): Promise<ProductColor[]> {
    try {
      const response = await apiService.get<ProductColor[]>(
        `${this.baseUrl}/product-color/${productId}/product`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch product colors',
      );
    }
  }

  // Get specific color
  async getProductColor(
    productId: number,
    colorId: number,
  ): Promise<ProductColor> {
    try {
      const response = await apiService.get<ProductColor>(
        `${this.baseUrl}/product-color/${colorId}/detail`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch product color',
      );
    }
  }

  // Create new color
  async createProductColor(
    productId: number,
    colorData: CreateProductColorRequest,
  ): Promise<ProductColor> {
    console.log('ProductColorService.createProductColor called:', {
      productId,
      colorData,
    });
    const url = `${this.baseUrl}/product-color/create`;
    console.log('API URL:', url);

    try {
      const response = await apiService.post<ProductColor>(url, colorData);
      console.log('ProductColorService.createProductColor success:', response);
      return response;
    } catch (error: any) {
      console.error('ProductColorService.createProductColor failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(
        error.response?.data?.message || 'Failed to create product color',
      );
    }
  }

  // Update color
  async updateProductColor(
    productId: number,
    colorId: number,
    colorData: UpdateProductColorRequest,
  ): Promise<ProductColor> {
    try {
      const response = await apiService.put<ProductColor>(
        `${this.baseUrl}/product-color/${colorId}/update`,
        colorData,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update product color',
      );
    }
  }

  // Delete color
  async deleteProductColor(productId: number, colorId: number): Promise<void> {
    try {
      await apiService.delete(
        `${this.baseUrl}/product-color/${colorId}/delete`,
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete product color',
      );
    }
  }
}

export const productColorService = new ProductColorService();
