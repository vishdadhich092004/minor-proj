import React from 'react';
import { Package, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 flex items-center">
      <div className={`flex-shrink-0 p-3 rounded-md ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div className="ml-5 w-0 flex-1">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
        <dd className="flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{count}</div>
        </dd>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  metrics: {
    totalProducts: number;
    outOfStock: number;
    limitedStock: number;
    otherStock: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="All Products" 
        count={metrics.totalProducts} 
        icon={<Package className="h-6 w-6 text-blue-600" />} 
        color="bg-blue-600"
      />
      <StatCard 
        title="Out of Stock" 
        count={metrics.outOfStock} 
        icon={<AlertCircle className="h-6 w-6 text-red-600" />} 
        color="bg-red-600"
      />
      <StatCard 
        title="Limited Stock" 
        count={metrics.limitedStock} 
        icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />} 
        color="bg-yellow-500"
      />
      <StatCard 
        title="Other Stock" 
        count={metrics.otherStock} 
        icon={<CheckCircle className="h-6 w-6 text-green-500" />} 
        color="bg-green-500"
      />
    </div>
  );
};

export default DashboardStats;
