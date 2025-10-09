import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { MonthlyRevenue } from '../../services/dashboard.service';

interface RechartsLineChartProps {
  data: MonthlyRevenue[];
  loading?: boolean;
}

const RechartsLineChart: React.FC<RechartsLineChartProps> = ({ data, loading }) => {
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

  // Determine how many items to show based on data length
  const displayData = data.length <= 7 ? data : data.slice(-6);

  // Transform data for Recharts
  const chartData = displayData.map(item => ({
    name: item.month,
    orders: item.orders,
    revenue: item.revenue,
    formattedRevenue: new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(item.revenue)
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-gray-700 font-medium mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#43AC78] rounded-full"></div>
            <p className="text-[#43AC78] font-semibold">
              {payload[0].value} đơn hàng
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Doanh thu: {payload[0].payload.formattedRevenue}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot component
  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#43AC78"
        stroke="#ffffff"
        strokeWidth={2}
        className="drop-shadow-sm"
      />
    );
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#43AC78" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#43AC78" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            opacity={0.5}
          />
          
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            dy={10}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ 
              value: 'Số đơn hàng', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#43AC78"
            strokeWidth={3}
            fill="url(#colorOrders)"
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: '#43AC78', stroke: '#ffffff', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsLineChart;
