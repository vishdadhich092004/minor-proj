import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface OrdersChartProps {
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  totalOrders: number;
}

const OrdersChart: React.FC<OrdersChartProps> = ({ ordersByStatus, totalOrders }) => {
  const { t } = useTranslation();
  const data = [
    { name: t('common.status.pending'), value: ordersByStatus.pending, color: '#FCD34D' }, // yellow-300
    { name: t('common.status.processing'), value: ordersByStatus.processing, color: '#9CA3AF' }, // gray-400
    { name: t('common.status.shipped'), value: ordersByStatus.shipped, color: '#3B82F6' }, // blue-500
    { name: t('common.status.delivered'), value: ordersByStatus.delivered, color: '#22C55E' }, // green-500
    { name: t('common.status.cancelled'), value: ordersByStatus.cancelled, color: '#EF4444' }, // red-500
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">{t('dashboard.chart.orders_overview')}</h3>
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-8">
            <span className="text-3xl font-bold text-gray-900 dark:text-white block">{totalOrders}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.chart.total_orders')}</span>
        </div>
      </div>
      
      {/* Legend Grid - Optional if built-in Legend isn't enough */}
      <div className="grid grid-cols-2 gap-4 mt-4">
           {data.map(item => (
               <div key={item.name} className="flex items-center justify-between text-sm">
                   <div className="flex items-center">
                       <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                       <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                   </div>
                   <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
               </div>
           ))}
      </div>
    </div>
  );
};

export default OrdersChart;
