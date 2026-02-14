import { useState, useEffect } from 'react';
import api from '../services/api';
import { type Brand, type SubCategory } from '../types';

export const useBrands = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBrands();
        fetchSubCategories();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await api.get('/brands');
            setBrands(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await api.get('/subCategories');
            setSubCategories(response.data.data || []);
        } catch (err: any) {
            console.error("Failed to fetch sub-categories", err);
        }
    };

    const deleteBrand = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this brand?')) return;
        try {
            await api.delete(`/brands/${id}`);
            setBrands(prev => prev.filter(b => b._id !== id && b.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete brand');
        }
    };

    const submitBrand = async (data: any, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/brands/${id}`, data);
            } else {
                response = await api.post('/brands', data);
            }

            if (response.data.success) {
                fetchBrands();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit Brand Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        brands,
        subCategories,
        loading,
        error,
        deleteBrand,
        submitBrand,
        refresh: fetchBrands
    };
};
