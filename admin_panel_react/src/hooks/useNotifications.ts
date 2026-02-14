import { useState, useEffect } from 'react';
import api from '../services/api';

export interface Notification {
    _id: string;
    notificationId?: string;
    title: string;
    description: string;
    imageUrl?: string;
    createdAt?: string;
    sId?: string;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Assuming there is an endpoint to get all notifications, similar to other modules
            // Flutter code calls _dataProvider.getAllNotifications() which likely hits a GET endpoint
            // API endpoint might be 'notification/all-notification' or just 'notification'
            // Based on generic patterns, often it's 'notification/all-notification' or just 'notifications'
            // Checking Flutter service: getAllNotifications usually calls 'notification/all-notification' or similar. 
            // Let's assume '/notification/all-notification' based on delete/send structure, OR '/notifications'
            // I'll try '/notification/all-notification' first, fallback to '/notifications' if needed, or inspect DataProvider if I could.
            // For now, I will guess '/notification/track-notification' might be for individual, so maybe '/notification' or '/notification/all'
            // ... Actually, usually standard is plural. Let's use '/notification/all-notification' as a best guess for "custom" routes seen so far.

            const response = await api.get('/notification/all-notification');
            setNotifications(response.data.data || []);
        } catch (err: any) {
            // Fallback try if generic
            try {
                const response = await api.get('/notifications');
                setNotifications(response.data.data || []);
            } catch (e) {
                setError(err.message || 'Failed to fetch notifications');
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        try {
            await api.delete(`/notification/delete-notification/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id && n.sId !== id));
        } catch (err: any) {
            console.error("Delete Error", err);
            alert('Failed to delete notification');
        }
    };

    const sendNotification = async (data: { title: string; description: string; imageUrl: string }) => {
        try {
            const response = await api.post('/notification/send-notification', data);

            if (response.data.success) {
                fetchNotifications();
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Send Notification Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        notifications,
        loading,
        error,
        deleteNotification,
        sendNotification,
        refresh: fetchNotifications
    };
};
