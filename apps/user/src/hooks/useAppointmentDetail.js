import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { useNotificationState } from '../context/NotificationContext';

/**
 * useAppointmentDetail — robust real-time synchronization for a single appointment.
 */
const useAppointmentDetail = (id) => {
    const { token, user } = useAuth();
    const { refresh: refreshNotifications } = useNotificationState();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    // Ref to avoid stale closures
    const tokenRef = useRef(token);
    useEffect(() => { tokenRef.current = token; }, [token]);

    const fetchDetail = useCallback(async (isBackground = false) => {
        const currentToken = tokenRef.current;
        if (!currentToken || !id) {
            setLoading(false);
            return;
        }

        if (!isBackground) setLoading(true);
        setError(null);

        try {
            const data = await api.get(`/appointments/${id}?_t=${Date.now()}`, currentToken);
            setAppointment(data.appointment || data);
        } catch (err) {
            if (!isBackground) setError(err.message || 'Could not load appointment details.');
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    // --- Dual-Sync Subscription ---
    useEffect(() => {
        if (!user?.id || !id) return;

        const channel = supabase
            .channel(`apt-det-${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                    filter: `id=eq.${id}`,
                },
                (payload) => {
                    console.log(`[useAppointmentDetail] ⚡ direct update: ${payload.new?.status}`);
                    setTimeout(() => fetchDetail(true), 300);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('[useAppointmentDetail] 🔔 notification trigger → refreshing');
                    setTimeout(() => fetchDetail(true), 500);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, id, fetchDetail]);

    const cancelAppointment = useCallback(
        async (reason = '') => {
            const currentToken = tokenRef.current;
            setCancelling(true);
            setCancelError(null);
            try {
                await api.patch(`/appointments/${id}/cancel`, { reason }, currentToken);
                await fetchDetail();
                // Proactively refresh the notification header badge
                refreshNotifications();
                return { success: true };
            } catch (err) {
                const msg = err.message || 'Cancellation failed.';
                setCancelError(msg);
                return { success: false, error: msg };
            } finally {
                setCancelling(false);
            }
        },
        [id, fetchDetail],
    );

    return {
        appointment,
        loading,
        error,
        cancelling,
        cancelError,
        cancelAppointment,
        refresh: () => fetchDetail(true),
    };
};

export default useAppointmentDetail;
