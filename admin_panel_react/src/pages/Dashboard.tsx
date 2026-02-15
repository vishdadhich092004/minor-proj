import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDashboardData } from '../hooks/useDashboardData';
import DashboardStats from '../components/dashboard/DashboardStats';
import OrdersChart from '../components/dashboard/OrdersChart';
import RecentOrders from '../components/dashboard/RecentOrders';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const { metrics, orders, loading, error, refetch } = useDashboardData();

    if (loading) return <div className="p-10 text-center">{t('common.loading')}</div>;
    if (error) return (
        <div className="p-10 text-center text-red-600">
            <p>{t('common.error')}: {error}</p>
            <button onClick={refetch} className="mt-4 px-4 py-2 bg-primary text-white rounded">{t('common.retry')}</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('dashboard.overview')}</h1>
                 <button onClick={refetch} className="p-2 text-primary hover:bg-gray-100 rounded-full" title="Refresh">
                    🔄
                 </button>
            </div>
           
            {/* Stats Cards */}
            <DashboardStats metrics={metrics} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Chart */}
                 <div className="lg:col-span-1">
                    <OrdersChart ordersByStatus={metrics.ordersByStatus} totalOrders={metrics.totalOrders} />
                 </div>

                 {/* Recent Orders */}
                 <div className="lg:col-span-1">
                     <RecentOrders orders={orders} />
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
