import { apiService } from "./api.service";

export interface ProductDetail {
  id: number;
  productId: number;
  bridgeWidth: number;
  frameWidth: number;
  lensHeight: number;
  lensWidth: number;
  templeLength: number;
  productNumber: number;
  frameMaterial: string;
  frameShape: string;
  frameType: string;
  bridgeDesign: string;
  style: string;
  springHinges: boolean;
  weight: number;
  multifocal: boolean;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateProductDetailRequest {
  productId: number;
  bridgeWidth: number;
  frameWidth: number;
  lensHeight: number;
  lensWidth: number;
  templeLength: number;
  productNumber?: number;
  frameMaterial: string;
  frameShape: string;
  frameType: string;
  bridgeDesign?: string;
  style?: string;
  springHinges: boolean;
  weight: number;
  multifocal: boolean;
}

export interface UpdateProductDetailRequest
  extends Partial<CreateProductDetailRequest> {}

class ProductDetailService {
  private readonly baseUrl = "/api/v1";

  // Get detail for a product by productDetailId
  async getProductDetail(
    productDetailId: number
  ): Promise<ProductDetail | null> {
    try {
      const response = await apiService.get<ProductDetail>(
        `${this.baseUrl}/products-detail/${productDetailId}/details`
      );
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No detail exists yet
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch product detail"
      );
    }
  }

  // Create new detail
  async createProductDetail(
    detailData: CreateProductDetailRequest
  ): Promise<ProductDetail> {
    console.log("ProductDetailService.createProductDetail called:", {
      detailData,
    });
    const url = `${this.baseUrl}/product-detail/create`;
    console.log("API URL:", url);

    try {
      const response = await apiService.post<ProductDetail>(url, detailData);
      console.log(
        "ProductDetailService.createProductDetail success:",
        response
      );
      return response;
    } catch (error: any) {
      console.error("ProductDetailService.createProductDetail failed:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(
        error.response?.data?.message || "Failed to create product detail"
      );
    }
  }

  // Update detail
  async updateProductDetail(
    productDetailId: number,
    detailData: UpdateProductDetailRequest
  ): Promise<ProductDetail> {
    try {
      const response = await apiService.put<ProductDetail>(
        `${this.baseUrl}/product-detail/${productDetailId}/update`,
        detailData
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update product detail"
      );
    }
  }

  // Delete detail
  async deleteProductDetail(productDetailId: number): Promise<void> {
    try {
      await apiService.delete(
        `${this.baseUrl}/product-detail/${productDetailId}/delete`
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete product detail"
      );
    }
  }
}

export const productDetailService = new ProductDetailService();
