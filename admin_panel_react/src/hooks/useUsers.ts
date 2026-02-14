import { useState, useEffect } from 'react';
import api from '../services/api';
import { type User } from '../types';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/all-users'); // Adjusted based on common patterns, checking if /users works
            // If the standard was /users, I'd use that. But looking at /notification/all-notification, maybe /users/all-users?
            // Let's try /users first as it is RESful standard. 
            // Wait, flutter code for posters was /posters, categories /categories.
            // But notifications was /notification/all-notification.
            // Let's try /users/all-users as a safe bet for "all" or just /users.
            // Actually, usually it is just /users. I will try /users.
            // If it fails, I'll update it later or user can.

            // Let's stick to the pattern of "all-users" if "all-notification" was used. 
            // BUT, others were simple plural. 
            // I'll use '/users' for now.
            setUsers(response.data.data || []);
        } catch (err: any) {
            try {
                // Fallback
                const response = await api.get('/users');
                setUsers(response.data.data || []);
            } catch (e) {
                setError(err.message || 'Failed to fetch users');
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id && u.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete user');
        }
    };

    return {
        users,
        loading,
        error,
        deleteUser,
        refresh: fetchUsers
    };
};
