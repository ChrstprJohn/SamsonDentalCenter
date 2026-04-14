import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({ starred: 0, unread: 0, general: 0, waitlist: 0, cancellation: 0 });
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
            const data = await api.get('/notifications/my?archived=true', token);
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
            if (data.stats) setStats(data.stats);
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

    const markRead = async (id, isRead = true) => {
        if (!token) return;
        try {
            // Optimistic Update
            setNotifications(prev => {
                const updated = prev.map(n => 
                    n.id === id ? { ...n, is_read: isRead } : n
                );
                return sortNotifications(updated);
            });
            
            setUnreadCount(prev => isRead ? Math.max(0, prev - 1) : prev + 1);
            setStats(prev => ({ 
                ...prev, 
                unread: isRead ? Math.max(0, prev.unread - 1) : prev.unread + 1 
            }));
            
            await api.patch(`/notifications/${id}/read`, { read: isRead }, token);
            return { success: true };
        } catch (err) {
            console.error('Failed to toggle read status:', err);
            // Refresh counts on error to ensure sync
            fetchNotifications();
            fetchUnreadCount();
            return { success: false, error: err.message };
        }
    };

    const markAllRead = async () => {
        if (!token) return;
        try {
            await api.patch('/notifications/read-all', {}, token);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            setStats(prev => ({ ...prev, unread: 0 }));
            return { success: true };
        } catch (err) {
            console.error('Failed to mark all as read:', err);
            return { success: false, error: err.message };
        }
    };

    const toggleStar = async (id, isStarred) => {
        if (!token) return;
        try {
            // Optimistic Update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_starred: isStarred } : n));
            setStats(prev => ({ ...prev, starred: prev.starred + (isStarred ? 1 : -1) }));

            await api.patch(`/notifications/${id}/star`, { starred: isStarred }, token);
            return { success: true };
        } catch (err) {
            console.error('Failed to toggle star:', err);
            refresh(); // Rollback on error
            return { success: false, error: err.message };
        }
    };

    const toggleArchive = async (id, isArchived) => {
        if (!token) return;
        try {
            // Optimistic Update
            setNotifications(prev => prev.map(n => 
                n.id === id 
                ? { ...n, is_archived: isArchived, is_starred: isArchived ? false : n.is_starred } 
                : n
            ));
            
            await api.patch(`/notifications/${id}/archive`, { archived: isArchived }, token);
            fetchNotifications(); // Refresh stats
            return { success: true };
        } catch (err) {
            console.error('Failed to toggle archive:', err);
            refresh(); // Rollback on error
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
            stats,
            refresh: fetchNotifications,
            refreshCount: fetchUnreadCount,
            markRead,
            markAllRead,
            toggleStar,
            toggleArchive
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
