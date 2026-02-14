import { useState, useEffect } from 'react';
import api from '../services/api';
import { type SubCategory, type Category } from '../types';

export const useSubCategories = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
    }, []);

    const fetchSubCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/subCategories');
            setSubCategories(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch sub-categories');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || []);
        } catch (err: any) {
            console.error("Failed to fetch categories", err);
        }
    };

    const deleteSubCategory = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this sub-category?')) return;
        try {
            await api.delete(`/subCategories/${id}`);
            setSubCategories(prev => prev.filter(s => s._id !== id && s.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete sub-category');
        }
    };

    const submitSubCategory = async (data: any, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/subCategories/${id}`, data);
            } else {
                response = await api.post('/subCategories', data);
            }

            if (response.data.success) {
                fetchSubCategories();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit SubCategory Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        subCategories,
        categories,
        loading,
        error,
        deleteSubCategory,
        submitSubCategory,
        refresh: fetchSubCategories
    };
};
