import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sortNotifications = (notifs) => {
        return [...notifs].sort((a, b) => {
            // Sort by date desc (newest first)
            return new Date(b.sent_at) - new Date(a.sent_at);
        });
    };

    const fetchNotifications = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        
        // Only set loading if we don't have any notifications yet
        if (notifications.length === 0) setLoading(true);
        setError(null);
        
        try {
            const data = await api.get('/notifications/my', token);
            const parsed = (data.notifications || []).map(n => {
                if (n.message && n.message.startsWith('{')) {
                    try {
                        const meta = JSON.parse(n.message);
                        if (meta._isJSON) {
                            return {
                                ...n,
                                title: meta._title || n.title,
                                message: meta._fallback || n.message,
                                metadata: meta
                            };
                        }
                    } catch (e) {
                        return n;
                    }
                }
                return n;
            });
            
            setNotifications(sortNotifications(parsed));
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
            // Check if it's already read to avoid redundant API calls and count decrement
            const target = notifications.find(n => n.id === id);
            if (target && target.is_read) return { success: true };

            await api.patch(`/notifications/${id}/read`, {}, token);
            
            // Optimistic Update
            setNotifications(prev => {
                const updated = prev.map(n => 
                    n.id === id ? { ...n, is_read: true } : n
                );
                return sortNotifications(updated);
            });
            
            setUnreadCount(prev => Math.max(0, prev - 1));
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

    // Initial load and polling
    useEffect(() => {
        if (token) {
            fetchNotifications();
            fetchUnreadCount();
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
        }

        const interval = setInterval(() => {
            if (token) {
                fetchNotifications();
                fetchUnreadCount();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [token, fetchNotifications, fetchUnreadCount]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            error,
            refresh: fetchNotifications,
            refreshCount: fetchUnreadCount,
            markRead,
            markAllRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationState = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationState must be used within a NotificationProvider');
    }
    return context;
};
