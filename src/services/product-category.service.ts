import { apiService } from "./api.service";

export interface UpdateProductCategoriesDto {
  categoryIds: number[];
}

export interface ProductCategoryModel {
  id: number;
  productId: number;
  categoryId: number;
  createdAt: string;
  createdBy: number;
  updatedAt?: string;
  updatedBy?: number;
}

class ProductCategoryService {
  private baseUrl = "/api/v1/product-category";

  async updateProductCategories(
    productId: number,
    categoryIds: number[]
  ): Promise<ProductCategoryModel[]> {
    const response = await apiService.put<ProductCategoryModel[]>(
      `${this.baseUrl}/product/${productId}/categories`,
      { categoryIds }
    );
    return response;
  }

  async getCategoriesByProduct(productId: number): Promise<number[]> {
    const response = await apiService.get<number[]>(
      `${this.baseUrl}/product/${productId}/categories`
    );
    return response;
  }

  async getCategoriesWithDetailsByProduct(productId: number): Promise<any[]> {
    const response = await apiService.get<any[]>(
      `${this.baseUrl}/product/${productId}/categories/details`
    );
    return response;
  }

  async getProductsByCategory(categoryId: number): Promise<number[]> {
    const response = await apiService.get<number[]>(
      `${this.baseUrl}/category/${categoryId}/products`
    );
    return response;
  }

  async createProductCategory(
    productId: number,
    categoryId: number
  ): Promise<ProductCategoryModel> {
    const response = await apiService.post<ProductCategoryModel>(
      `${this.baseUrl}/create`,
      {
        productId,
        categoryId,
      }
    );
    return response;
  }

  async deleteProductCategory(
    productId: number,
    categoryId: number
  ): Promise<boolean> {
    const response = await apiService.delete<boolean>(
      `${this.baseUrl}/product/${productId}/category/${categoryId}`
    );
    return response;
  }
}

export const productCategoryService = new ProductCategoryService();
