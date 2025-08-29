import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './LensCharts.css';

interface LensChartsProps {
  lensQualities: any[];
  lensThicknesses: any[];
  lensTints: any[];
}

const LensCharts: React.FC<LensChartsProps> = ({ 
  lensQualities, 
  lensThicknesses, 
  lensTints 
}) => {
  // Set dynamic widths for progress bars
  useEffect(() => {
    const progressBars = document.querySelectorAll('.lens-charts-progress-bar[data-percentage]');
    progressBars.forEach((bar) => {
      const percentage = bar.getAttribute('data-percentage');
      if (percentage) {
        (bar as HTMLElement).style.width = `${percentage}%`;
      }
    });
  }, [lensQualities, lensThicknesses, lensTints]);
  // Prepare data for simple visualizations  
  const safeQualities = Array.isArray(lensQualities) ? lensQualities.filter(q => q && typeof q === 'object') : [];
  const featuresData = [
    {
      name: 'UV Protection',
      count: safeQualities.filter(q => q.uvProtection).length,
      percentage: safeQualities.length > 0 ? (safeQualities.filter(q => q.uvProtection).length / safeQualities.length) * 100 : 0,
      color: 'bg-blue-500'
    },
    {
      name: 'Anti-Reflective',
      count: safeQualities.filter(q => q.antiReflective).length,
      percentage: safeQualities.length > 0 ? (safeQualities.filter(q => q.antiReflective).length / safeQualities.length) * 100 : 0,
      color: 'bg-green-500'
    },
    {
      name: 'Hard Coating',
      count: safeQualities.filter(q => q.hardCoating).length,
      percentage: safeQualities.length > 0 ? (safeQualities.filter(q => q.hardCoating).length / safeQualities.length) * 100 : 0,
      color: 'bg-yellow-500'
    },
    {
      name: 'Night/Day Optimization',
      count: safeQualities.filter(q => q.nightDayOptimization).length,
      percentage: safeQualities.length > 0 ? (safeQualities.filter(q => q.nightDayOptimization).length / safeQualities.length) * 100 : 0,
      color: 'bg-purple-500'
    },
    {
      name: 'Free Form Technology',
      count: safeQualities.filter(q => q.freeFormTechnology).length,
      percentage: safeQualities.length > 0 ? (safeQualities.filter(q => q.freeFormTechnology).length / safeQualities.length) * 100 : 0,
      color: 'bg-indigo-500'
    },
    {
      name: 'Transitions Option',
      count: safeQualities.filter(q => q.transitionsOption).length,
      percentage: safeQualities.length > 0 ? (safeQualities.filter(q => q.transitionsOption).length / safeQualities.length) * 100 : 0,
      color: 'bg-pink-500'
    }
  ];

  const priceRanges = [
    {
      range: '< 500K VNĐ',
      count: [...lensQualities, ...lensTints].filter(item => item && item.price && item.price < 500000).length,
      color: 'bg-green-400'
    },
    {
      range: '500K - 1M VNĐ',
      count: [...lensQualities, ...lensTints].filter(item => item && item.price && item.price >= 500000 && item.price < 1000000).length,
      color: 'bg-yellow-400'
    },
    {
      range: '1M - 2M VNĐ',
      count: [...lensQualities, ...lensTints].filter(item => item && item.price && item.price >= 1000000 && item.price < 2000000).length,
      color: 'bg-orange-400'
    },
    {
      range: '> 2M VNĐ',
      count: [...lensQualities, ...lensTints].filter(item => item && item.price && item.price >= 2000000).length,
      color: 'bg-red-400'
    }
  ];

  const validPriceItems = [...lensQualities, ...lensTints].filter(item => item && typeof item.price === 'number');
  const averagePrice = validPriceItems.length > 0 
    ? Math.round(validPriceItems.reduce((sum, q) => sum + q.price, 0) / validPriceItems.length)
    : 0;

  const mostCommonThickness = lensThicknesses.length > 0 
    ? lensThicknesses.sort((a, b) => (a.indexValue || 0) - (b.indexValue || 0))[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h4 className="text-sm font-medium text-blue-100">Giá trung bình chất lượng</h4>
          <p className="text-2xl font-bold mt-2">
            {(averagePrice || 0).toLocaleString()} VNĐ
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-blue-200 mr-1" />
            <span className="text-xs text-blue-200">So với tháng trước</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h4 className="text-sm font-medium text-green-100">Độ dày phổ biến nhất</h4>
          <p className="text-2xl font-bold mt-2">
            {mostCommonThickness ? `Index ${mostCommonThickness.indexValue || 'N/A'}` : 'N/A'}
          </p>
          <div className="flex items-center mt-2">
            <Minus className="w-4 h-4 text-green-200 mr-1" />
            <span className="text-xs text-green-200">Ổn định</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h4 className="text-sm font-medium text-purple-100">Tổng tùy chọn màu sắc</h4>
          <p className="text-2xl font-bold mt-2">
            {lensTints.length}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-purple-200 mr-1" />
            <span className="text-xs text-purple-200">+12% từ tháng trước</span>
          </div>
        </div>
      </div>

      {/* Features Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Phân bố tính năng chất lượng lens
        </h3>
        <div className="space-y-4">
          {featuresData.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm font-medium text-gray-700 flex-shrink-0">
                {feature.name}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${feature.color} lens-charts-progress-bar`}
                    data-percentage={Math.max(feature.percentage, 5)}
                  ></div>
                </div>
              </div>
              <div className="w-20 text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {feature.count}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({feature.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phân bố giá sản phẩm lens
          </h3>
          <div className="space-y-3">
            {priceRanges.map((range, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded ${range.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {range.range}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-900 mr-2">
                    {range.count}
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${range.color} lens-charts-progress-bar`}
                      data-percentage={Math.max((range.count / Math.max(...priceRanges.map(r => r.count))) * 100, 10)}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thickness Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Độ dày lens và giá cả
          </h3>
          <div className="space-y-3">
            {lensThicknesses.slice(0, 6).map((thickness, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {thickness.name}
                  </span>
                  <div className="text-xs text-gray-500">
                    Index {thickness.indexValue}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {(thickness.price || 0).toLocaleString()} VNĐ
                  </div>
                  <div className="flex items-center text-xs">
                    {(thickness.price || 0) > averagePrice ? (
                      <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                    ) : (thickness.price || 0) < averagePrice ? (
                      <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <Minus className="w-3 h-3 text-gray-400 mr-1" />
                    )}
                    <span className={`${
                      (thickness.price || 0) > averagePrice ? 'text-red-600' :
                      (thickness.price || 0) < averagePrice ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {(thickness.price || 0) > averagePrice ? 'Cao' : 
                       (thickness.price || 0) < averagePrice ? 'Thấp' : 'TB'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin chi tiết
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Top tính năng được yêu thích
            </h4>
            <div className="space-y-2">
              {featuresData
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {index + 1}. {feature.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {feature.count} sản phẩm
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Thống kê giá
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giá cao nhất:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {validPriceItems.length > 0 
                    ? Math.max(...validPriceItems.map(item => item.price)).toLocaleString() 
                    : '0'} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giá thấp nhất:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {validPriceItems.length > 0 
                    ? Math.min(...validPriceItems.map(item => item.price)).toLocaleString() 
                    : '0'} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trung bình:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {averagePrice.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LensCharts;
