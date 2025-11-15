import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ComposedChart,
} from 'recharts';
import { MonthlyRevenue } from '../../services/dashboard.service';

interface RechartsLineChartProps {
  data: MonthlyRevenue[];
  loading?: boolean;
  metric?: 'revenue' | 'orders';
}

const RechartsLineChart: React.FC<RechartsLineChartProps> = ({ data, loading, metric = 'orders' }) => {
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

  // Prepare chart data - show all periods (months/days)
  const chartData = data.map(item => ({
    name: item.month,
    orders: item.orders,
    revenue: item.revenue,
  }));

  // Custom tooltip with both metrics
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-gray-700 font-medium mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#43AC78] rounded-full"></div>
              <p className="text-[#43AC78] font-semibold text-sm">
                {data.orders} đơn hàng
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#3b82f6] rounded-full"></div>
              <p className="text-[#3b82f6] font-semibold text-sm">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(data.revenue)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <ComposedChart
          width={900}
          height={240}
          data={chartData}
          margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#43AC78" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#43AC78" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          
          {metric === 'orders' ? (
            // Single Y-axis for Orders
            <YAxis 
              stroke="#43AC78"
              style={{ fontSize: '11px' }}
              allowDecimals={false}
              label={{ 
                value: 'Số đơn hàng', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '11px', fill: '#43AC78' }
              }}
            />
          ) : (
            // Single Y-axis for Revenue
            <YAxis 
              stroke="#3b82f6"
              style={{ fontSize: '11px' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
              label={{ 
                value: 'Doanh thu (₫)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '11px', fill: '#3b82f6' }
              }}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          
          {metric === 'orders' ? (
            // Area chart for Orders
            <Area 
              type="monotone" 
              dataKey="orders" 
              stroke="#43AC78" 
              strokeWidth={2}
              fill="url(#colorOrders)"
              dot={{ fill: '#43AC78', r: 3, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          ) : (
            // Area chart for Revenue
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              dot={{ fill: '#3b82f6', r: 3, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          )}
        </ComposedChart>
      </div>
    </div>
  );
};

export default RechartsLineChart;
