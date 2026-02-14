import { useState, useEffect } from 'react';
import api from '../services/api';
import { type Poster } from '../types';

export const usePosters = () => {
    const [posters, setPosters] = useState<Poster[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosters();
    }, []);

    const fetchPosters = async () => {
        setLoading(true);
        try {
            const response = await api.get('/posters');
            setPosters(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch posters');
        } finally {
            setLoading(false);
        }
    };

    const deletePoster = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this poster?')) return;
        try {
            await api.delete(`/posters/${id}`);
            setPosters(prev => prev.filter(p => p._id !== id && p.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete poster');
        }
    };

    const submitPoster = async (formData: FormData, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            // Axios handles multipart/form-data automatically when passed FormData
            if (isUpdate) {
                response = await api.put(`/posters/${id}`, formData);
            } else {
                response = await api.post('/posters', formData);
            }

            if (response.data.success) {
                fetchPosters();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit Poster Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        posters,
        loading,
        error,
        deletePoster,
        submitPoster,
        refresh: fetchPosters
    };
};
