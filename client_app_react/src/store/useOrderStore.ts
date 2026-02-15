import { create } from 'zustand';
import api from '../services/api';
import type { Order, ApiResponse } from '../types';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;

    fetchMyOrders: (userId: string) => Promise<void>;
    fetchOrderById: (id: string) => Promise<Order | null>;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchMyOrders: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            // Typically an API would filter by user, or valid token does it.
            // If endpoint returns all, we might filter here, but let's assume endpoint handles it or we filter.
            // Based on flutter app, it calls 'orders'.
            const response = await api.get<ApiResponse<Order[]>>('/orders');
            if (response.data.success && response.data.data) {
                // Filter client side just in case, if the API doesn't do it automatically based on token
                // The API might be generic.
                const userOrders = response.data.data.filter(order => {
                    if (typeof order.userID === 'string') return order.userID === userId;
                    return order.userID._id === userId;
                });
                set({ orders: userOrders });
            }
        } catch (error: any) {
            console.error('Failed to fetch orders', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOrderById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
            if (response.data.success && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error: any) {
            console.error('Failed to fetch order', error);
            set({ error: error.message });
            return null;
        } finally {
            set({ isLoading: false });
        }
    }
}));
