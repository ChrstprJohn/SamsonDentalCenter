import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNotificationState } from '../context/NotificationContext';

/**
 * Hook to manage patient waitlist entries and offers.
 */
const useWaitlist = () => {
    const { token } = useAuth();
    const { refresh: refreshNotifications } = useNotificationState();
    const [entries, setEntries] = useState([]);
    const [stats, setStats] = useState({ waiting: 0, offered: 0, claimed: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWaitlist = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/waitlist/my', token);
            setEntries(response.waitlist || []);
            if (response.stats) setStats(response.stats);
        } catch (err) {
            setError(err.message || 'Failed to fetch waitlist entries');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchWaitlist();
    }, [fetchWaitlist]);

    const join = async (waitlistData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/waitlist/join', waitlistData, token);
            await fetchWaitlist();
            // Proactively refresh the notification header badge
            refreshNotifications();
            return response;
        } catch (err) {
            setError(err.message || 'Failed to join waitlist');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // options: { removeBackup: boolean }
    const cancel = async (id, options = {}) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/waitlist/${id}`, token, { remove_backup: options.removeBackup === true });
            await fetchWaitlist();
            // Proactively refresh the notification header badge
            refreshNotifications();
        } catch (err) {
            setError(err.message || 'Failed to cancel waitlist entry');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const confirmOffer = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.post(`/waitlist/${id}/confirm`, {}, token);
            await fetchWaitlist();
            // Proactively refresh the notification header badge
            refreshNotifications();
            return result;
        } catch (err) {
            setError(err.message || 'Failed to confirm waitlist offer');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Derived state: separate active offers from waiting entries
    const offers = entries.filter(e => e.status === 'OFFER_PENDING' || e.status === 'NOTIFIED');
    const waiting = entries.filter(e => e.status === 'WAITING');

    // Hero Entry: Highest priority (Offered > Waiting)
    const heroEntry = offers.length > 0 ? offers[0] : (waiting.length > 0 ? waiting[0] : null);

    return {
        entries,
        offers,
        waiting,
        heroEntry,
        stats,
        loading,
        error,
        refresh: fetchWaitlist,
        join,
        cancel,
        confirmOffer
    };
};

export default useWaitlist;
