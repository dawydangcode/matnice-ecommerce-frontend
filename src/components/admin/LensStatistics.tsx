import React, { useEffect, useState } from 'react';
import { 
  Eye, 
  Settings, 
  Palette, 
  Layers, 
  Package, 
  Zap,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import LensCharts from './LensCharts';

interface StatCard {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const LensStatistics: React.FC = () => {
  const {
    lenses,
    lensQualities,
    lensThicknesses,
    lensTints,
    lensUpgrades,
    lensDetails,
    fetchLenses,
    fetchLensQualities,
    fetchLensThicknesses,
    fetchLensTints,
    fetchLensUpgrades,
    fetchLensDetails
  } = useLensStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchLenses({ limit: 1000 }),
          fetchLensQualities({ limit: 1000 }),
          fetchLensThicknesses({ limit: 1000 }),
          fetchLensTints({ limit: 1000 }),
          fetchLensUpgrades({ limit: 1000 }),
          fetchLensDetails({})
        ]);
      } catch (error) {
        console.error('Error loading lens statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [fetchLenses, fetchLensQualities, fetchLensThicknesses, fetchLensTints, fetchLensUpgrades, fetchLensDetails]);

  const stats: StatCard[] = [
    {
      title: 'Lens cơ bản',
      value: lenses.length,
      icon: Eye,
      color: 'blue',
      description: 'Tổng số loại lens cơ bản trong hệ thống'
    },
    {
      title: 'Chất lượng lens',
      value: lensQualities.length,
      icon: Settings,
      color: 'green',
      description: 'Các tùy chọn chất lượng và tính năng lens'
    },
    {
      title: 'Độ dày lens',
      value: lensThicknesses.length,
      icon: Layers,
      color: 'purple',
      description: 'Các tùy chọn độ dày và chỉ số khúc xạ'
    },
    {
      title: 'Màu sắc lens',
      value: lensTints.length,
      icon: Palette,
      color: 'pink',
      description: 'Các tùy chọn màu sắc và tint lens'
    },
    {
      title: 'Nâng cấp lens',
      value: lensUpgrades.length,
      icon: Zap,
      color: 'yellow',
      description: 'Các tùy chọn nâng cấp và cải tiến lens'
    },
    {
      title: 'Chi tiết lens',
      value: lensDetails.length,
      icon: Package,
      color: 'indigo',
      description: 'Thông tin chi tiết và cấu hình lens'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-900' },
      green: { bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-900' },
      purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-900' },
      pink: { bg: 'bg-pink-50', icon: 'text-pink-600', text: 'text-pink-900' },
      yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', text: 'text-yellow-900' },
      indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', text: 'text-indigo-900' }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const calculateTrend = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change),
      isPositive: change > 0,
      isNeutral: change === 0
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="mt-4 h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          const trend = calculateTrend(stat.value, stat.previousValue);

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${colors.text} mb-2`}>
                    {stat.value.toLocaleString()}
                  </p>
                  
                  {/* Trend indicator */}
                  {trend && (
                    <div className="flex items-center space-x-1">
                      {trend.isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : trend.isNeutral ? (
                        <Activity className="w-4 h-4 text-gray-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${
                        trend.isPositive ? 'text-green-600' : 
                        trend.isNeutral ? 'text-gray-400' : 'text-red-600'
                      }`}>
                        {trend.percentage.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Detailed Analysis */}
      <LensCharts 
        lensQualities={lensQualities}
        lensThicknesses={lensThicknesses}
        lensTints={lensTints}
      />
    </div>
  );
};

export default LensStatistics;
