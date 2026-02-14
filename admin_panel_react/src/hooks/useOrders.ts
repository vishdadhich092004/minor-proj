import { useState, useEffect } from 'react';
import api from '../services/api';
import { type Order } from '../types/order';

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders');
            setOrders(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        try {
            await api.delete(`/orders/${id}`);
            setOrders(prev => prev.filter(o => o._id !== id && o.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete order');
        }
    };

    const updateOrderStatus = async (id: string, status: string, trackingUrl?: string) => {
        try {
            const data = { orderStatus: status, trackingUrl };
            const response = await api.put(`/orders/${id}`, data);

            if (response.data.success) {
                fetchOrders();
                return { success: true, message: 'Order updated successfully' };
            } else {
                return { success: false, message: response.data.message || 'Update failed' };
            }
        } catch (err: any) {
            console.error("Update Order Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        orders,
        loading,
        error,
        deleteOrder,
        updateOrderStatus,
        refresh: fetchOrders
    };
};
