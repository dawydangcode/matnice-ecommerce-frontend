import React from 'react';
import { MonthlyRevenue } from '../../services/dashboard.service';

interface SimpleBarChartProps {
  data: MonthlyRevenue[];
  loading?: boolean;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#43AC78]"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  // Find max value for scaling
  const maxRevenue = Math.max(...data.map(item => item.revenue));
  const maxHeight = 200; // Max height in pixels

  // Determine how many items to show based on data length
  const displayData = data.length <= 7 ? data : data.slice(-6);
  
  return (
    <div className="h-64 p-4">
      <div className="flex items-end justify-between h-full space-x-2">
        {displayData.map((item, index) => {
          const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * maxHeight : 0;
          const formattedRevenue = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.revenue);

          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              {/* Bar */}
              <div className="relative w-full flex items-end justify-center mb-2">
                <div
                  className="bg-gradient-to-t from-[#43AC78] to-[#64C695] rounded-t-md transition-all duration-300 group-hover:from-[#64C695] group-hover:to-[#66D6A2] min-h-[4px] w-full max-w-12"
                  style={{ height: Math.max(height, 4) + 'px' }}
                ></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="text-center">
                    <div className="font-medium">{formattedRevenue}</div>
                    <div className="text-gray-300">{item.orders} đơn hàng</div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              {/* Month label */}
              <div className="text-xs text-gray-600 text-center leading-tight">
                {item.month}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Y-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
        <span>0</span>
        <span>
          {maxRevenue > 0 
            ? new Intl.NumberFormat('vi-VN', { 
                notation: 'compact', 
                compactDisplay: 'short' 
              }).format(maxRevenue)
            : '0'
          }
        </span>
      </div>
    </div>
  );
};

export default SimpleBarChart;
