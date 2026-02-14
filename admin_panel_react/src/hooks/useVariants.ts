import { useState, useEffect } from 'react';
import api from '../services/api';
import { type Variant, type VariantType } from '../types';

export const useVariants = () => {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVariants();
        fetchVariantTypes();
    }, []);

    const fetchVariants = async () => {
        setLoading(true);
        try {
            const response = await api.get('/variants');
            setVariants(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch variants');
        } finally {
            setLoading(false);
        }
    };

    const fetchVariantTypes = async () => {
        try {
            const response = await api.get('/variantTypes');
            setVariantTypes(response.data.data || []);
        } catch (err: any) {
            console.error("Failed to fetch variant types", err);
        }
    };

    const deleteVariant = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this variant?')) return;
        try {
            await api.delete(`/variants/${id}`);
            setVariants(prev => prev.filter(v => v._id !== id && v.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete variant');
        }
    };

    const submitVariant = async (data: any, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/variants/${id}`, data);
            } else {
                response = await api.post('/variants', data);
            }

            if (response.data.success) {
                fetchVariants();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit Variant Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        variants,
        variantTypes,
        loading,
        error,
        deleteVariant,
        submitVariant,
        refresh: fetchVariants
    };
};
