import { useState, useEffect } from 'react';
import api from '../services/api';
import { type Category } from '../types';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c._id !== id && c.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete category');
        }
    };

    const submitCategory = async (formData: FormData, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/categories/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await api.post('/categories', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data.success) {
                fetchCategories();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit Category Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        categories,
        loading,
        error,
        deleteCategory,
        submitCategory,
        refresh: fetchCategories
    };
};
