import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Fetches a single appointment by ID.
 * Backend endpoint: GET /api/v1/appointments/:id
 *
 * Also exposes cancelAppointment() action.
 */
const useAppointmentDetail = (id) => {
    const { token } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    const fetchDetail = useCallback(async () => {
        if (!token || !id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Backend returns the raw appointment row + joined service + dentist
            const data = await api.get(`/appointments/${id}`, token);
            // Controller returns { appointment: {...} }
            setAppointment(data.appointment || data);
        } catch (err) {
            setError(err.message || 'Could not load appointment details.');
        } finally {
            setLoading(false);
        }
    }, [token, id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    /**
     * Cancel the appointment. Calls PATCH /appointments/:id/cancel
     * @param {string} reason - Optional reason text
     */
    const cancelAppointment = useCallback(
        async (reason = '') => {
            setCancelling(true);
            setCancelError(null);
            try {
                await api.patch(`/appointments/${id}/cancel`, { reason }, token);
                // Re-fetch to get updated status
                await fetchDetail();
                return { success: true };
            } catch (err) {
                const msg = err.message || 'Cancellation failed.';
                setCancelError(msg);
                return { success: false, error: msg };
            } finally {
                setCancelling(false);
            }
        },
        [id, token, fetchDetail],
    );

    return {
        appointment,
        loading,
        error,
        cancelling,
        cancelError,
        cancelAppointment,
        refresh: fetchDetail,
    };
};

export default useAppointmentDetail;
