import { useState, useEffect, useCallback } from 'react';
import dashboardService, {
  DashboardStats,
  RecentOrder,
  MonthlyRevenue,
  TopProduct,
} from '../services/dashboard.service';
import toast from 'react-hot-toast';

type TimeRange = 'monthly' | 'weekly' | 'annually';

interface UseDashboardDataReturn {
  stats: DashboardStats | null;
  recentOrders: RecentOrder[];
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (
  timeRange: TimeRange = 'monthly',
): UseDashboardDataReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching dashboard data with timeRange:', timeRange);

      // Map frontend timeRange to backend timeRange
      const backendTimeRange =
        timeRange === 'monthly'
          ? 'month'
          : timeRange === 'weekly'
            ? 'week'
            : timeRange === 'annually'
              ? 'year'
              : 'month';

      // Fetch all data in parallel
      const [statsResult, ordersResult, revenueResult, productsResult] =
        await Promise.all([
          dashboardService.getStats(backendTimeRange),
          dashboardService.getRecentOrders(5),
          dashboardService.getRevenueData(backendTimeRange),
          dashboardService.getTopProducts(5),
        ]);

      console.log('Dashboard data fetched successfully:', {
        stats: statsResult,
        orders: ordersResult?.length || 0,
        revenue: revenueResult?.length || 0,
        products: productsResult?.length || 0,
        timeRange: backendTimeRange,
      });

      setStats(statsResult);
      setRecentOrders(ordersResult);
      setMonthlyRevenue(revenueResult);
      setTopProducts(productsResult);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Không thể tải dữ liệu dashboard',
      );
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
