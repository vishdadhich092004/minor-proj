import { useState, useEffect } from 'react';
import api from '../services/api';
import { type VariantType } from '../types';

export const useVariantTypes = () => {
    const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVariantTypes();
    }, []);

    const fetchVariantTypes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/variantTypes');
            setVariantTypes(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch variant types');
        } finally {
            setLoading(false);
        }
    };

    const deleteVariantType = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this variant type?')) return;
        try {
            await api.delete(`/variantTypes/${id}`);
            setVariantTypes(prev => prev.filter(v => v._id !== id && v.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete variant type');
        }
    };

    const submitVariantType = async (data: any, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/variantTypes/${id}`, data);
            } else {
                response = await api.post('/variantTypes', data);
            }

            if (response.data.success) {
                fetchVariantTypes();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit Variant Type Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        variantTypes,
        loading,
        error,
        deleteVariantType,
        submitVariantType,
        refresh: fetchVariantTypes
    };
};
