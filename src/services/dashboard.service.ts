import { apiService } from './api.service';

export interface TopProduct {
  id: number;
  name: string;
  brand: string;
  soldQuantity: number;
  revenue: number;
}

export interface DashboardStats {
  revenue: {
    total: number;
    growth: number;
    period: string;
  };
  orders: {
    total: number;
    growth: number;
    period: string;
  };
  products: {
    total: number;
    newProducts: number;
    period: string;
  };
  customers: {
    total: number;
    growth: number;
    period: string;
  };
  topProducts?: TopProduct[];
}

export interface RecentOrder {
  id: number;
  orderNumber: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName?: string;
  paymentStatus?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

class DashboardService {
  private baseUrl = '/dashboard';

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get<DashboardStats>(
        `${this.baseUrl}/stats`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get recent orders for dashboard
   */
  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    try {
      const response = await apiService.get<RecentOrder[]>(
        `${this.baseUrl}/recent-orders?limit=${limit}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  }

  /**
   * Get monthly revenue data for charts
   */
  async getMonthlyRevenue(months: number = 12): Promise<MonthlyRevenue[]> {
    try {
      const response = await apiService.get<MonthlyRevenue[]>(
        `${this.baseUrl}/monthly-revenue?months=${months}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  /**
   * Format number with thousand separators
   */
  formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

  /**
   * Get top selling products
   */
  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    try {
      const response = await apiService.get<TopProduct[]>(
        `${this.baseUrl}/top-products?limit=${limit}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }

  /**
   * Get growth percentage display
   */
  formatGrowth(growth: number): string {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth}%`;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
