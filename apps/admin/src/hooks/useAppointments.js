import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Fetches the current admin's appointments from the backend.
 *
 * Backend endpoint: GET /api/v1/appointments/my
 * Query params: status, page, limit, sort
 *
 * Status map (backend â†’ display):
 *   CONFIRMED     â†’ Approved
 *   PENDING       â†’ Pending
 *   CANCELLED     â†’ Cancelled
 *   LATE_CANCEL   â†’ Cancelled
 *   COMPLETED     â†’ Completed
 *   NO_SHOW       â†’ Missed
 */

// --- Utility helpers ---

export const STATUS_LABEL = {
    CONFIRMED: 'Upcoming',
    PENDING: 'Pending',
    CANCELLED: 'Cancelled',
    LATE_CANCEL: 'Cancelled',
    COMPLETED: 'Completed',
    NO_SHOW: 'Missed',
    IN_PROGRESS: 'In Progress',
    WAITLISTED: 'Waitlisted',
    DISPLACED: 'Displaced',
};

export const STATUS_COLOR = {
    Upcoming: 'info',
    Pending: 'warning',
    Cancelled: 'error',
    Completed: 'success',
    Missed: 'error',
    'In Progress': 'warning',
    Waitlisted: 'warning',
    Displaced: 'secondary',
};

/**
 * Format a date string 'YYYY-MM-DD' â†’ 'Oct 24, 2024'
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Parse as local date to avoid UTC offset shifting the day
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Format a time string 'HH:MM:SS' or 'HH:MM' â†’ '10:00 AM'
 */
export const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const period = hour >= 12 ? 'PM' : 'AM';
    const display = hour % 12 || 12;
    return `${display}:${minute} ${period}`;
};

/**
 * Format an ISO timestamp string â†’ 'Oct 24, 2024, 10:00 AM'
 */
export const formatFullDateTime = (isoStr) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
};

// --- Hook ---

const DEFAULT_LIMIT = 5;

const useAppointments = ({ status = '', sort = 'desc', limit = DEFAULT_LIMIT } = {}) => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const fetch = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page, limit, sort });
            if (status) params.set('status', status);

            const data = await api.get(`/appointments/my?${params}`, token);

            setAppointments(data.appointments || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err.message || 'Failed to load appointments.');
        } finally {
            setLoading(false);
        }
    }, [token, status, sort, page, limit]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const goToPage = useCallback((p) => setPage(p), []);
    const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
    const nextPage = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);
    const refresh = useCallback(() => fetch(), [fetch]);

    return {
        appointments,
        total,
        page,
        totalPages,
        loading,
        error,
        goToPage,
        prevPage,
        nextPage,
        refresh,
    };
};

export default useAppointments;




