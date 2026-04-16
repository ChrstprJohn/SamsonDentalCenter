import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabase';

const AppointmentContext = createContext();

const FETCH_LIMIT = 50;

export const AppointmentProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState({ upcoming: 0, pending: 0, rejected: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refs to avoid stale closures in realtime callbacks
    const tokenRef = useRef(token);
    useEffect(() => { tokenRef.current = token; }, [token]);

    const fetchAppointments = useCallback(async (isBackground = false) => {
        const currentToken = tokenRef.current;
        if (!currentToken) {
            setLoading(false);
            return;
        }

        if (!isBackground) setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                page: 1,
                limit: FETCH_LIMIT,
                sort: 'desc',
                _t: Date.now(),
            });
            const data = await api.get(`/appointments/my?${queryParams}`, currentToken);

            console.log(`[AppointmentContext] ${isBackground ? 'BG' : 'Initial'} fetch done. Records:`, data.appointments?.length);

            setAppointments(data.appointments || []);
            setTotal(data.total || 0);
            if (data.stats) setStats(data.stats);
        } catch (err) {
            if (!isBackground) setError(err.message || 'Failed to load appointments.');
            console.error('[AppointmentContext] Fetch error:', err.message);
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, []); // Stable — uses tokenRef

    // Initial Load
    useEffect(() => {
        if (token) {
            fetchAppointments(false);
        } else {
            setAppointments([]);
            setTotal(0);
            setLoading(false);
        }
    }, [token, fetchAppointments]);

    // ── Supabase Realtime: Listen to BOTH tables ──
    // Strategy: Primary = appointments table, Fallback = notifications table
    // The notifications subscription is PROVEN to work, so we piggyback on it
    useEffect(() => {
        if (!user?.id) return;

        console.log('[AppointmentContext] Setting up dual subscriptions for:', user.id);

        const channel = supabase
            .channel(`appt-sync-${user.id}`)
            // 1. Direct: Listen to appointments table changes
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                    filter: `patient_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('[AppointmentContext] ⚡ appointments table event:', payload.eventType);
                    fetchAppointments(true);
                }
            )
            // 2. Fallback: Listen to notifications table inserts
            // Every approval/rejection/booking creates a notification
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('[AppointmentContext] 🔔 notification INSERT → refreshing appointments');
                    fetchAppointments(true);
                }
            )
            .subscribe((status) => {
                console.log('[AppointmentContext] Subscription status:', status);
            });

        return () => {
            console.log('[AppointmentContext] Cleaning up subscriptions');
            supabase.removeChannel(channel);
        };
    }, [user?.id, fetchAppointments]);

    // Sync on tab focus
    useEffect(() => {
        const handleFocus = () => {
            if (tokenRef.current) {
                fetchAppointments(true);
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchAppointments]);

    return (
        <AppointmentContext.Provider
            value={{
                appointments,
                total,
                stats,
                loading,
                error,
                refresh: () => fetchAppointments(true),
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointmentState = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointmentState must be used within an AppointmentProvider');
    }
    return context;
};
