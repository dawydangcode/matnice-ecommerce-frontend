import { useState, useEffect } from 'react';
import dashboardService, {
  DashboardStats,
  RecentOrder,
  MonthlyRevenue,
  TopProduct,
} from '../services/dashboard.service';
import toast from 'react-hot-toast';

interface UseDashboardDataReturn {
  stats: DashboardStats | null;
  recentOrders: RecentOrder[];
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [statsData, ordersData, revenueData, topProductsData] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentOrders(5),
          dashboardService.getMonthlyRevenue(12),
          dashboardService.getTopProducts(5),
        ]);

      setStats(statsData);
      setRecentOrders(ordersData);
      setMonthlyRevenue(revenueData);
      setTopProducts(topProductsData);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tải dữ liệu dashboard';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    recentOrders,
    monthlyRevenue,
    topProducts,
    loading,
    error,
    refetch: fetchData,
  };
};
