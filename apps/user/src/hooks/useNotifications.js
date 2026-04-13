import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to manage patient notifications.
 * Connects to GET /api/v1/notifications/my
 */
const useNotifications = () => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        // Only set loading on first fetch
        if (notifications.length === 0) setLoading(true);
        setError(null);
        try {
            const data = await api.get('/notifications/my', token);
            setNotifications(data.notifications || []);
        } catch (err) {
            setError(err.message || 'Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    }, [token, notifications.length]);

    const fetchUnreadCount = useCallback(async () => {
        if (!token) return;
        try {
            const data = await api.get('/notifications/unread-count', token);
            setUnreadCount(data.unread_count || 0);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    }, [token]);

    const markRead = async (id) => {
        if (!token) return;
        try {
            await api.patch(`/notifications/${id}/read`, {}, token);
            
            // Optimistic Update
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, is_read: true } : n
            ));
            
            // Update local unread count
            const notification = notifications.find(n => n.id === id);
            if (notification && !notification.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            
            return { success: true };
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
            return { success: false, error: err.message };
        }
    };

    const markAllRead = async () => {
        if (!token) return;
        try {
            await api.patch('/notifications/read-all', {}, token);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            return { success: true };
        } catch (err) {
            console.error('Failed to mark all as read:', err);
            return { success: false, error: err.message };
        }
    };

    // Polling and Initial load
    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();

        // Near-real-time polling (every 30 seconds)
        const interval = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        refresh: fetchNotifications,
        refreshCount: fetchUnreadCount,
        markRead,
        markAllRead
    };
};

export default useNotifications;
