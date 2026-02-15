import { create } from 'zustand';
import api from '../services/api';
import type { Product, Category, Poster, Variant, ApiResponse } from '../types';

interface DataState {
    products: Product[];
    categories: Category[];
    posters: Poster[];
    variants: Variant[];
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchPosters: () => Promise<void>;
    fetchVariants: () => Promise<void>;
    fetchAll: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
    products: [],
    categories: [],
    posters: [],
    variants: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        try {
            const response = await api.get<ApiResponse<Product[]>>('/products');
            if (response.data.success && response.data.data) {
                set({ products: response.data.data });
            }
        } catch (error: any) {
            console.error('Failed to fetch products', error);
            set({ error: error.message });
        }
    },

    fetchCategories: async () => {
        try {
            const response = await api.get<ApiResponse<Category[]>>('/categories');
            if (response.data.success && response.data.data) {
                set({ categories: response.data.data });
            }
        } catch (error: any) {
            console.error('Failed to fetch categories', error);
            set({ error: error.message });
        }
    },

    fetchPosters: async () => {
        try {
            const response = await api.get<ApiResponse<Poster[]>>('/posters');
            if (response.data.success && response.data.data) {
                set({ posters: response.data.data });
            }
        } catch (error: any) {
            console.error('Failed to fetch posters', error);
            set({ error: error.message });
        }
    },

    fetchVariants: async () => {
        try {
            const response = await api.get<ApiResponse<Variant[]>>('/variants');
            if (response.data.success && response.data.data) {
                set({ variants: response.data.data });
            }
        } catch (error: any) {
            console.error('Failed to fetch variants', error);
            set({ error: error.message });
        }
    },

    fetchAll: async () => {
        set({ isLoading: true, error: null });
        try {
            await Promise.all([
                get().fetchProducts(),
                get().fetchCategories(),
                get().fetchPosters(),
                get().fetchVariants(),
            ]);
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    }
}));
