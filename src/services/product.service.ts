import { apiService } from './api.service';
import {
  Product,
  ProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  Category,
  Brand,
  ProductImage,
} from '../types/product.types';

class ProductService {
  private readonly baseUrl = '/api/v1';

  // Products
  async getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category)
        queryParams.append('category', params.category.toString());
      if (params?.brand) queryParams.append('brand', params.brand.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.gender) queryParams.append('gender', params.gender);

      const url = `${this.baseUrl}/products/list${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;

      // API returns { total: number, data: Product[] } but we need { products: Product[], total: number, page: number, limit: number }
      const apiResponse = await apiService.get<{ total: number; data: any[] }>(
        url,
      );
      console.log('Products API response:', apiResponse);

      // Transform the data to match our Product interface (API uses 'id' but we expect 'productId')
      const transformedProducts =
        apiResponse.data?.map((product: any) => ({
          ...product,
          productId: product.id, // Transform id to productId
          categoryId: product.categoryId || 0, // Ensure categoryId exists
          stock: product.stock || 0, // Ensure stock exists (API doesn't provide this yet)
          // Keep the original id field as well for compatibility
          id: product.id,
        })) || [];

      const response: ProductsResponse = {
        products: transformedProducts,
        total: apiResponse.total || 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
      };

      console.log('Transformed products response:', response);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch products',
      );
    }
  }

  async getProductsWithColors(): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>(
        `${this.baseUrl}/products/with-colors`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch products with colors',
      );
    }
  }

  async getProductById(productId: number): Promise<Product> {
    try {
      const response = await apiService.get<Product>(
        `${this.baseUrl}/product/${productId}/detail`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch product',
      );
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    console.log('ProductService.createProduct called with:', productData);
    const url = `${this.baseUrl}/product/create`;
    console.log('API URL:', url);

    try {
      const response = await apiService.post<any>(url, productData);
      console.log('ProductService.createProduct success:', response);

      // Transform the response to match our Product interface
      const product: Product = {
        ...response,
        productId: response.id || response.productId, // Handle both id and productId
      };

      return product;
    } catch (error: any) {
      console.error('ProductService.createProduct failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request URL:', url);
      console.error('Request data:', productData);
      throw new Error(
        error.response?.data?.message || 'Failed to create product',
      );
    }
  }

  async updateProduct(
    productId: number,
    productData: Partial<CreateProductRequest>,
  ): Promise<Product> {
    try {
      const response = await apiService.put<Product>(
        `${this.baseUrl}/product/${productId}/update`,
        productData,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update product',
      );
    }
  }

  async deleteProduct(
    productId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/product/${productId}/delete`);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete product',
      );
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiService.get<{
        total: number;
        data: Category[];
      }>(`${this.baseUrl}/category/list`);
      console.log('Categories API response:', response);
      return response.data || [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch categories',
      );
    }
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    try {
      const response = await apiService.get<{ total: number; data: Brand[] }>(
        `${this.baseUrl}/brand/list`,
      );
      console.log('Brands API response:', response);
      return response.data || [];
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch brands',
      );
    }
  }

  // Product Images
  async uploadProductImages(
    productId: number,
    images: File[],
  ): Promise<ProductImage[]> {
    try {
      const formData = new FormData();
      formData.append('productId', productId.toString());

      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await apiService.post<ProductImage[]>(
        `${this.baseUrl}/product-image/upload`,
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
        error.response?.data?.message || 'Failed to upload images',
      );
    }
  }

  async uploadImages(images: File[]): Promise<string[]> {
    try {
      const formData = new FormData();

      images.forEach((image) => {
        formData.append(`images`, image);
      });

      const response = await apiService.post<{ imageUrls: string[] }>(
        `${this.baseUrl}/product-image/upload-temporary`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.imageUrls; // Extract imageUrls from response
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to upload images',
      );
    }
  }

  async deleteProductImage(
    imageId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/product-image/${imageId}/delete`);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete image',
      );
    }
  }

  async getProductImages(productId: number): Promise<ProductImage[]> {
    try {
      const response = await apiService.get<ProductImage[]>(
        `${this.baseUrl}/product-image/product/${productId}/list`,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch product images',
      );
    }
  }
}

export const productService = new ProductService();
