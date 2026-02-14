import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Product } from '../types';
import type { Order } from '../types/order';

interface DashboardMetrics {
    totalProducts: number;
    outOfStock: number;
    limitedStock: number;
    otherStock: number;
    totalOrders: number;
    ordersByStatus: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
}

export const useDashboardData = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalProducts: 0,
        outOfStock: 0,
        limitedStock: 0,
        otherStock: 0,
        totalOrders: 0,
        ordersByStatus: {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, ordersRes] = await Promise.all([
                api.get('/products'),
                api.get('/orders'),
            ]);

            const productsData: Product[] = productsRes.data.data || [];
            const ordersData: Order[] = ordersRes.data.data || [];

            setProducts(productsData);
            setOrders(ordersData);

            // Calculate Metrics
            const totalProducts = productsData.length;
            const outOfStock = productsData.filter(p => p.quantity === 0).length;
            const limitedStock = productsData.filter(p => p.quantity === 1).length;
            const otherStock = totalProducts - outOfStock - limitedStock;

            const totalOrders = ordersData.length;
            const ordersByStatus = {
                pending: ordersData.filter(o => o.orderStatus === 'pending').length,
                processing: ordersData.filter(o => o.orderStatus === 'processing').length,
                shipped: ordersData.filter(o => o.orderStatus === 'shipped').length,
                delivered: ordersData.filter(o => o.orderStatus === 'delivered').length,
                cancelled: ordersData.filter(o => o.orderStatus === 'cancelled').length,
            };

            setMetrics({
                totalProducts,
                outOfStock,
                limitedStock,
                otherStock,
                totalOrders,
                ordersByStatus,
            });

        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { metrics, products, orders, loading, error, refetch: fetchData };
};
