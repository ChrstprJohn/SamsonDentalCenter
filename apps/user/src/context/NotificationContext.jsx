import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabase';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({
        starred: 0,
        unread: 0,
        general: 0,
        waitlist: 0,
        cancellation: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sortNotifications = (notifs) => {
        return [...notifs].sort((a, b) => {
            // Sort by date desc (newest first)
            return new Date(b.sent_at) - new Date(a.sent_at);
        });
    };

    const fetchNotifications = useCallback(
        async (page = 1, limit = 10, archived = true, isBackground = false) => {
            if (!token) {
                setLoading(false);
                return;
            }

            // Only set loading if not a background refresh
            if (!isBackground) setLoading(true);
            setError(null);

            try {
                const data = await api.get(
                    `/notifications/my?archived=${archived}&page=${page}&limit=${limit}`,
                    token,
                );
                const parsed = (data.notifications || []).map((n) => {
                    if (n.message && n.message.startsWith('{')) {
                        try {
                            const meta = JSON.parse(n.message);
                            if (meta._isJSON) {
                                return {
                                    ...n,
                                    title: meta._title || n.title,
                                    message: meta._fallback || n.message,
                                    metadata: meta,
                                };
                            }
                        } catch (e) {
                            return n;
                        }
                    }
                    return n;
                });

                setNotifications(sortNotifications(parsed));
                setTotalNotifications(data.total || 0);
                if (data.stats) setStats(data.stats);
            } catch (err) {
                setError(err.message || 'Failed to load notifications.');
            } finally {
                setLoading(false);
            }
        },
        [token],
    );

    const fetchUnreadCount = useCallback(async (isBackground = false) => {
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
            setNotifications((prev) => {
                const updated = prev.map((n) => (n.id === id ? { ...n, is_read: isRead } : n));
                return sortNotifications(updated);
            });

            setUnreadCount((prev) => (isRead ? Math.max(0, prev - 1) : prev + 1));
            setStats((prev) => ({
                ...prev,
                unread: isRead ? Math.max(0, prev.unread - 1) : prev.unread + 1,
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
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
            setStats((prev) => ({ ...prev, unread: 0 }));
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
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_starred: isStarred } : n)),
            );
            setStats((prev) => ({ ...prev, starred: prev.starred + (isStarred ? 1 : -1) }));

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
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id
                        ? {
                              ...n,
                              is_archived: isArchived,
                              is_starred: isArchived ? false : n.is_starred,
                          }
                        : n,
                ),
            );

            await api.patch(`/notifications/${id}/archive`, { archived: isArchived }, token);
            fetchNotifications(); // Refresh stats
            return { success: true };
        } catch (err) {
            console.error('Failed to toggle archive:', err);
            refresh(); // Rollback on error
            return { success: false, error: err.message };
        }
    };

    // ── Initial Data Load ──
    useEffect(() => {
        if (token) {
            fetchNotifications(1);
            fetchUnreadCount();
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
        }
    }, [token, fetchNotifications, fetchUnreadCount]);

    // ── Supabase Realtime Subscription & Sync Logic ──
    useEffect(() => {
        if (!token || !user?.id) return;

        // 1. Initial listener for Realtime events
        const channel = supabase
            .channel(`notifs:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('Realtime notification received:', payload);
                    
                    if (payload.eventType === 'INSERT') {
                        // Optimistically update the list if it's the first page
                        setNotifications(prev => {
                            // Avoid duplicates
                            if (prev.find(n => n.id === payload.new.id)) return prev;
                            const updated = [payload.new, ...prev];
                            return sortNotifications(updated).slice(0, 10); // Keep it paged
                        });
                        setUnreadCount(prev => prev + 1);
                        setStats(prev => ({ ...prev, unread: prev.unread + 1 }));
                    }
                    
                    // Always refresh to stay in sync with server metadata/sorting
                    // Use background=true to prevent UI flickering/skeletons
                    fetchNotifications(1, 10, true, true);
                    fetchUnreadCount(true);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                   // Refresh everything on update in background
                   fetchNotifications(1, 10, true, true);
                   fetchUnreadCount(true);
                }
            )
            .subscribe((status) => {
               if (status === 'SUBSCRIBED') {
                   console.log('Realtime notification subscription active');
               }
            });

        // 2. Sync on Focus (Alternative to polling)
        // When user returns to tab, refresh counts/list in background
        const handleFocus = () => {
            fetchUnreadCount(true);
            fetchNotifications(1, 10, true, true);
        };

        // 3. Sync on Reconnect
        // Supabase Realtime handles reconnection internally, 
        // but we can listen for visibility/online changes to be sure.
        const handleOnline = () => {
            fetchNotifications(1, 10, true, true);
            fetchUnreadCount(true);
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('online', handleOnline);

        return () => {
            channel.unsubscribe();
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('online', handleOnline);
        };
    }, [token, user?.id, fetchNotifications, fetchUnreadCount]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                totalNotifications,
                unreadCount,
                stats,
                loading,
                error,
                fetchNotifications,
                markRead,
                markAllRead,
                toggleStar,
                toggleArchive,
                refresh: fetchNotifications,
            }}
        >
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
