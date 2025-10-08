import { apiService } from './api.service';

export interface StockReservationItem {
  productColorId: number;
  quantity: number;
}

export interface StockValidationResult {
  isValid: boolean;
  errors: Array<{
    productColorId: number;
    colorName: string;
    requested: number;
    available: number;
    message: string;
  }>;
}

export interface OrderStockUpdateResult {
  success: boolean;
  message: string;
  details?: {
    productColorUpdates?: Array<{
      productColorId: number;
      previousStock: number;
      newStock: number;
      quantityReduced: number;
    }>;
    lensVariantUpdates?: Array<{
      lensVariantId: number;
      previousStock: number;
      newStock: number;
      quantityReduced: number;
    }>;
  };
}

export interface ProductStockStatus {
  productId: number;
  colors: Array<{
    colorId: number;
    colorName: string;
    stock: number;
  }>;
  totalStock: number;
}

export interface LensVariantStockStatus {
  lensVariantId: number;
  stock: number;
  material: string;
  design: string;
}

export interface OrderStockAvailability {
  available: boolean;
  issues: string[];
}

export interface StockItem {
  id: number;
  name: string;
  type: 'product' | 'lens-variant';
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  productName?: string;
  colorName?: string;
  productId?: number;
  material?: string;
  design?: string;
  lensId?: number;
}

class StockService {
  private baseUrl = '/stock';

  /**
   * Kiểm tra stock availability cho một order
   */
  async checkOrderStockAvailability(
    orderId: number,
  ): Promise<OrderStockAvailability> {
    try {
      const response = await apiService.get(
        `${this.baseUrl}/orders/${orderId}/check`,
      );
      console.log(
        'StockService.checkOrderStockAvailability: Success',
        response,
      );
      return response as OrderStockAvailability;
    } catch (error) {
      console.error('StockService.checkOrderStockAvailability: Error', error);
      throw error;
    }
  }

  /**
   * Trừ stock cho một order (manual operation for admin)
   */
  async reduceStockForOrder(
    orderId: number,
    userId: number = 1,
  ): Promise<OrderStockUpdateResult> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/orders/${orderId}/reduce`,
        {
          userId,
        },
      );
      console.log('StockService.reduceStockForOrder: Success', response);
      return response as OrderStockUpdateResult;
    } catch (error) {
      console.error('StockService.reduceStockForOrder: Error', error);
      throw error;
    }
  }

  /**
   * Hoàn stock cho một order (manual operation for admin)
   */
  async restoreStockForOrder(
    orderId: number,
    userId: number = 1,
  ): Promise<OrderStockUpdateResult> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/orders/${orderId}/restore`,
        {
          userId,
        },
      );
      console.log('StockService.restoreStockForOrder: Success', response);
      return response as OrderStockUpdateResult;
    } catch (error) {
      console.error('StockService.restoreStockForOrder: Error', error);
      throw error;
    }
  }

  /**
   * Lấy stock status của một product
   */
  async getProductStockStatus(productId: number): Promise<ProductStockStatus> {
    try {
      const response = await apiService.get(
        `${this.baseUrl}/products/${productId}`,
      );
      console.log('StockService.getProductStockStatus: Success', response);
      return response as ProductStockStatus;
    } catch (error) {
      console.error('StockService.getProductStockStatus: Error', error);
      throw error;
    }
  }

  /**
   * Lấy stock status của một lens variant
   */
  async getLensVariantStockStatus(
    lensVariantId: number,
  ): Promise<LensVariantStockStatus> {
    try {
      const response = await apiService.get(
        `${this.baseUrl}/lens-variants/${lensVariantId}`,
      );
      console.log('StockService.getLensVariantStockStatus: Success', response);
      return response as LensVariantStockStatus;
    } catch (error) {
      console.error('StockService.getLensVariantStockStatus: Error', error);
      throw error;
    }
  }

  /**
   * Cập nhật stock cho một product color (admin only)
   */
  async updateProductColorStock(
    productColorId: number,
    stock: number,
    userId: number = 1,
  ): Promise<{ message: string }> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/product-colors/${productColorId}/update`,
        {
          stock,
          userId,
        },
      );
      console.log('StockService.updateProductColorStock: Success', response);
      return response as { message: string };
    } catch (error) {
      console.error('StockService.updateProductColorStock: Error', error);
      throw error;
    }
  }

  /**
   * Cập nhật stock cho một lens variant (admin only)
   */
  async updateLensVariantStock(
    lensVariantId: number,
    stock: number,
    userId: number = 1,
  ): Promise<{ message: string }> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/lens-variants/${lensVariantId}/update`,
        {
          stock,
          userId,
        },
      );
      console.log('StockService.updateLensVariantStock: Success', response);
      return response as { message: string };
    } catch (error) {
      console.error('StockService.updateLensVariantStock: Error', error);
      throw error;
    }
  }

  /**
   * Validate stock trước khi checkout (client-side validation)
   */
  async validateStockForCart(
    items: StockReservationItem[],
  ): Promise<StockValidationResult> {
    try {
      // Gọi API để validate từng item
      const validationPromises = items.map(async (item) => {
        // Giả sử chúng ta có API để lấy current stock
        const currentStock = await this.getCurrentProductColorStock(
          item.productColorId,
        );

        if (currentStock < item.quantity) {
          return {
            productColorId: item.productColorId,
            colorName: 'Unknown', // Sẽ được backend điền
            requested: item.quantity,
            available: currentStock,
            message: `Insufficient stock. Requested: ${item.quantity}, Available: ${currentStock}`,
          };
        }
        return null;
      });

      const results = await Promise.all(validationPromises);
      const errors = results.filter((result) => result !== null) as any[];

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      console.error('StockService.validateStockForCart: Error', error);
      throw error;
    }
  }

  /**
   * Lấy current stock của một product color
   */
  async getCurrentProductColorStock(productColorId: number): Promise<number> {
    try {
      // Tạm thời return mock data - sẽ implement API này nếu cần
      console.log(`Getting current stock for product color ${productColorId}`);
      return 10; // Mock data
    } catch (error) {
      console.error('StockService.getCurrentProductColorStock: Error', error);
      return 0;
    }
  }

  /**
   * Format stock display message
   */
  formatStockMessage(stock: number): string {
    if (stock <= 0) {
      return 'Hết hàng';
    } else if (stock <= 5) {
      return `Chỉ còn ${stock} sản phẩm`;
    } else if (stock <= 20) {
      return `Còn ${stock} sản phẩm`;
    } else {
      return 'Còn hàng';
    }
  }

  /**
   * Get stock status color for UI
   */
  getStockStatusColor(stock: number): string {
    if (stock <= 0) {
      return '#dc2626'; // red-600
    } else if (stock <= 5) {
      return '#f59e0b'; // amber-500
    } else {
      return '#059669'; // green-600
    }
  }

  /**
   * Check if product is available
   */
  isProductAvailable(stock: number): boolean {
    return stock > 0;
  }

  /**
   * Get all stock items from API
   */
  async getAllStockItems(): Promise<StockItem[]> {
    try {
      const response = await apiService.get<StockItem[]>('/stock/items');
      return response;
    } catch (error) {
      console.error('Error fetching all stock items:', error);
      throw error;
    }
  }

  /**
   * Get all product color stock from API
   */
  async getAllProductColorStock(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/stock/products');
      return response;
    } catch (error) {
      console.error('Error fetching product color stock:', error);
      throw error;
    }
  }

  /**
   * Get all lens variant stock from API
   */
  async getAllLensVariantStock(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/stock/lens-variants');
      return response;
    } catch (error) {
      console.error('Error fetching lens variant stock:', error);
      throw error;
    }
  }
}

const stockService = new StockService();
export default stockService;
