import { apiService } from './api.service';

export interface ProductDetail {
  id: number;
  productName: string;
  description: string;
  price: number;
  brandId: number;
  brand?: {
    id: number;
    name: string;
  };
  productDetail?: {
    id: number;
    frameWidth: number;
    frameType: string;
    frameShape: string;
    frameMaterial: string;
    bridgeDesign: string;
    style: string;
    springHinges: boolean;
    weight: number;
    multifocal: boolean;
    bridgeWidth: number;
    lensHeight: number;
    lensWidth: number;
    templeLength: number;
  };
  productColors?: Array<{
    id: number;
    colorName: string;
    productVariantName: string;
    productNumber: string;
    stock: number;
    isThumbnail: boolean;
  }>;
  productImages?: Array<{
    id: number;
    imageUrl: string;
    imageOrder: string;
    productColorId?: number;
  }>;
}

export interface ProductCard {
  id: number;
  productName: string;
  brandName: string;
  price: number;
  thumbnailUrl: string;
  displayName: string;
}

class ProductService {
  // Get product detail by ID
  async getProductById(productId: number): Promise<ProductDetail> {
    try {
      const response = (await apiService.get(
        `/api/v1/product/${productId}/detail`,
      )) as any;
      return response.data;
    } catch (error) {
      console.error('Error fetching product detail:', error);
      throw new Error('Failed to fetch product detail');
    }
  }

  // Get product detail technical info
  async getProductDetailInfo(productId: number) {
    try {
      const response = (await apiService.get(
        `/api/v1/products-detail/${productId}/details`,
      )) as any;
      return response.data;
    } catch (error) {
      console.error('Error fetching product detail info:', error);
      throw new Error('Failed to fetch product detail info');
    }
  }

  // Get product with all related data (colors, images, details)
  async getProductWithDetails(productId: number): Promise<ProductDetail> {
    try {
      // Fetch product basic info and detail in parallel
      const [productResponse, detailResponse] = await Promise.all([
        apiService.get(`/api/v1/product/${productId}/detail`) as Promise<any>,
        apiService.get(
          `/api/v1/products-detail/${productId}/details`,
        ) as Promise<any>,
      ]);

      console.log('Product basic response:', productResponse);
      console.log('Product detail response:', detailResponse);

      const product = productResponse;
      const detail = detailResponse;

      // Fetch related data in parallel
      const [colorsResponse, imagesResponse] = await Promise.all([
        (
          apiService.get(
            `/api/v1/product-color/${productId}/product`,
          ) as Promise<any>
        ).catch(() => []),
        (
          apiService.get(
            `/api/v1/product/${productId}/product-image/list`,
          ) as Promise<any>
        ).catch(() => ({ data: [] })),
      ]);

      console.log('Colors response:', colorsResponse);
      console.log('Images response:', imagesResponse);

      // Fetch brand info if needed
      let brandInfo = null;
      if (product.brandId) {
        try {
          brandInfo = (await apiService.get(
            `/api/v1/brand/${product.brandId}/detail`,
          )) as any;
        } catch (err) {
          console.log('Brand info not available');
        }
      }

      // Combine all data
      const productWithDetails: ProductDetail = {
        ...product,
        brand: brandInfo,
        productDetail: detail,
        productColors: Array.isArray(colorsResponse) ? colorsResponse : [],
        productImages: imagesResponse?.data || [],
      };

      return productWithDetails;
    } catch (error) {
      console.error('Error fetching product with details:', error);
      throw new Error('Failed to fetch product details');
    }
  }

  // Get product colors by product ID
  async getProductColors(productId: number) {
    try {
      const response = (await apiService.get(
        `/api/v1/product-color/${productId}/product`,
      )) as any;
      return response.data;
    } catch (error) {
      console.error('Error fetching product colors:', error);
      throw new Error('Failed to fetch product colors');
    }
  }

  // Get product images by product ID
  async getProductImages(productId: number) {
    try {
      const response = (await apiService.get(
        `/api/v1/product/${productId}/product-image/list`,
      )) as any;
      return response.data;
    } catch (error) {
      console.error('Error fetching product images:', error);
      throw new Error('Failed to fetch product images');
    }
  }

  // Get product images by color ID
  async getProductImagesByColor(productId: number, colorId: number) {
    try {
      const response = (await apiService.get(
        `/api/v1/product-image/product/${productId}/color/${colorId}`,
      )) as any;
      return response.data;
    } catch (error) {
      console.error('Error fetching product images by color:', error);
      throw new Error('Failed to fetch product images by color');
    }
  }

  // Get products for card display (for product listing)
  async getProductsForCardDisplay(params?: {
    page?: number;
    limit?: number;
    brandIds?: number[];
    categoryIds?: number[];
    genderFilter?: string[];
    priceRange?: { min?: number; max?: number };
    searchQuery?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    frameType?: string[];
    frameShape?: string[];
    frameMaterial?: string[];
    bridgeDesign?: string[];
    style?: string[];
    frameWidthMin?: number;
    frameWidthMax?: number;
  }) {
    try {
      const response = (await apiService.get('/api/v1/products/cards', {
        params,
      })) as any;
      return response.data;
    } catch (error) {
      console.error('Error fetching products for card display:', error);
      throw new Error('Failed to fetch products');
    }
  }
}

const productService = new ProductService();
export default productService;
