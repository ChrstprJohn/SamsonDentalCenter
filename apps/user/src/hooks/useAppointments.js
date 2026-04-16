import { useMemo, useState, useCallback, useEffect } from 'react';
import { useAppointmentState } from '../context/AppointmentContext';

export const STATUS_LABEL = {
    CONFIRMED: 'Approved',
    PENDING: 'Pending',
    IN_PROGRESS: 'Seated',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    LATE_CANCEL: 'Late Cancel',
    NO_SHOW: 'Missed',
    WAITLISTED: 'Waitlisted',
    RESCHEDULED: 'Rescheduled',
};

// Semantic keys for Badge component and general consistency
export const STATUS_COLOR = {
    Approved: 'success',
    Pending: 'warning',
    Seated: 'info',
    Completed: 'light',
    Cancelled: 'error',
    'Late Cancel': 'error',
    Missed: 'error',
    Waitlisted: 'primary',
    Rejected: 'light',
    Rescheduled: 'light',  // neutral — it's a clean handoff, not a problem
};

export const getDisplayStatus = (status, approvalStatus) => {
    // Terminal statuses always win — a cancelled appointment is cancelled
    // regardless of what approval_status says (can be 'approved' after a reschedule)
    const TERMINAL = ['CANCELLED', 'LATE_CANCEL', 'NO_SHOW', 'COMPLETED', 'IN_PROGRESS', 'RESCHEDULED'];
    if (TERMINAL.includes((status || '').toUpperCase())) {
        const label = STATUS_LABEL[status] || status;
        return { label, color: STATUS_COLOR[label] || 'light' };
    }

    // For non-terminal appointments, approval_status drives the badge
    const appStatus = (approvalStatus || '').toLowerCase();
    if (appStatus === 'approved') {
        return { label: 'Approved', color: STATUS_COLOR.Approved };
    }
    if (appStatus === 'rejected') {
        return { label: 'Rejected', color: STATUS_COLOR.Rejected };
    }

    // Fallback to primary status
    const label = STATUS_LABEL[status] || status;
    return {
        label,
        color: STATUS_COLOR[label] || 'light'
    };
};

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
};

export const formatFullDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};

// Alias for convenience
export const formatDateTime = formatFullDateTime;

export const useAppointments = ({ status = 'all', sort = 'desc', limit = 10 } = {}) => {
    const { 
        appointments: allAppointments = [], 
        loading, 
        error, 
        stats, 
        refresh 
    } = useAppointmentState();

    const [page, setPage] = useState(1);

    // Reset page when status changes
    useEffect(() => {
        setPage(1);
    }, [status]);

    const filtered = useMemo(() => {
        let result = allAppointments;

        if (status && status !== 'all') {
            const now = new Date();
            const today = now.toISOString().split('T')[0];

            if (status === 'upcoming' || status === 'confirmed') {
                result = result.filter(a => {
                    const statusStr = (a.status || '').toUpperCase();
                    const appStatusStr = (a.approval_status || '').toLowerCase();
                    const isApproved = appStatusStr === 'approved' || statusStr === 'CONFIRMED';
                    
                    return isApproved && 
                           statusStr !== 'CANCELLED' && 
                           statusStr !== 'LATE_CANCEL' && 
                           statusStr !== 'NO_SHOW' &&
                           statusStr !== 'RESCHEDULED';
                });
            } else if (status === 'pending') {
                result = result.filter(a => {
                    const statusStr = (a.status || '').toUpperCase();
                    const appStatusStr = (a.approval_status || '').toLowerCase();
                    return statusStr === 'PENDING' && 
                           appStatusStr !== 'approved' && 
                           appStatusStr !== 'rejected';
                });
            } else if (status === 'missed') {
                result = result.filter(a => (a.status || '').toUpperCase() === 'NO_SHOW');
            } else if (status === 'cancel') {
                result = result.filter(a => ['CANCELLED', 'LATE_CANCEL'].includes((a.status || '').toUpperCase()) && (a.approval_status || '').toLowerCase() !== 'rejected');
            } else if (status === 'decline') {
                result = result.filter(a => (a.approval_status || '').toLowerCase() === 'rejected');
            } else if (status === 'completed') {
                result = result.filter(a => (a.status || '').toUpperCase() === 'COMPLETED');
            } else if (status === 'rescheduled') {
                result = result.filter(a => (a.status || '').toUpperCase() === 'RESCHEDULED');
            }
        }

        // Client-side sort
        return [...result].sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.start_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.start_time}`);
            return sort === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [allAppointments, status, sort]);

    // Client-side pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    const paginated = useMemo(() => {
        const start = (page - 1) * limit;
        return filtered.slice(start, start + limit);
    }, [filtered, page, limit]);

    // Live counts for all categories
    const counts = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return {
            all: allAppointments.filter(a => !['CANCELLED', 'LATE_CANCEL', 'NO_SHOW', 'RESCHEDULED'].includes((a.status || '').toUpperCase())).length,
            upcoming: allAppointments.filter(a => {
                const statusStr = (a.status || '').toUpperCase();
                const appStatusStr = (a.approval_status || '').toLowerCase();
                return (appStatusStr === 'approved' || statusStr === 'CONFIRMED') && 
                       !['CANCELLED', 'LATE_CANCEL', 'NO_SHOW', 'RESCHEDULED'].includes(statusStr);
            }).length,
            pending: allAppointments.filter(a => {
                const statusStr = (a.status || '').toUpperCase();
                const appStatusStr = (a.approval_status || '').toLowerCase();
                return statusStr === 'PENDING' && 
                       appStatusStr !== 'approved' && 
                       appStatusStr !== 'rejected';
            }).length,
            missed: allAppointments.filter(a => (a.status || '').toUpperCase() === 'NO_SHOW').length,
            cancel: allAppointments.filter(a => ['CANCELLED', 'LATE_CANCEL'].includes((a.status || '').toUpperCase()) && (a.approval_status || '').toLowerCase() !== 'rejected').length,
            decline: allAppointments.filter(a => (a.approval_status || '').toLowerCase() === 'rejected').length,
            completed: allAppointments.filter(a => (a.status || '').toUpperCase() === 'COMPLETED').length,
            rescheduled: allAppointments.filter(a => (a.status || '').toUpperCase() === 'RESCHEDULED').length,
        };
    }, [allAppointments]);

    const goToPage = useCallback((p) => setPage(p), []);
    const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
    const nextPage = useCallback((p) => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

    return {
        appointments: paginated,
        total: filtered.length,
        stats,
        counts,
        loading,
        error,
        page,
        totalPages,
        goToPage,
        prevPage,
        nextPage,
        refresh
    };
};

export default useAppointments;
