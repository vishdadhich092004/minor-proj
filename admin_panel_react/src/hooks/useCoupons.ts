import { useState, useEffect } from 'react';
import api from '../services/api';
import { type Coupon, type Category, type SubCategory, type Product } from '../types';

export const useCoupons = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dependencies for the form
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchCoupons();
        fetchDependencies();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await api.get('/couponCodes');
            setCoupons(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [catRes, subCatRes, prodRes] = await Promise.all([
                api.get('/categories'),
                api.get('/subCategories'),
                api.get('/products')
            ]);
            setCategories(catRes.data.data || []);
            setSubCategories(subCatRes.data.data || []);
            setProducts(prodRes.data.data || []);
        } catch (err) {
            console.error("Failed to fetch dependencies", err);
        }
    }

    const deleteCoupon = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/couponCodes/${id}`);
            setCoupons(prev => prev.filter(c => c._id !== id && c.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete coupon');
        }
    };

    const submitCoupon = async (data: any, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/couponCodes/${id}`, data);
            } else {
                response = await api.post('/couponCodes', data);
            }

            if (response.data.success) {
                fetchCoupons();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit Coupon Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        coupons,
        categories,
        subCategories,
        products,
        loading,
        error,
        deleteCoupon,
        submitCoupon,
        refresh: fetchCoupons
    };
};
