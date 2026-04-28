import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const useDisplacedAppointments = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDisplaced = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch all cancelled appointments and filter manually to bypass complex query-string parsing if unavailable
            const response = await api.get('/admin/appointments?status=CANCELLED&limit=1000', token);
            const allCancelled = response.appointments || [];
            const displaced = allCancelled.filter(a => a.cancellation_reason === 'SYSTEM_DISPLACED');
            
            // Sort by appointment date
            displaced.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            setAppointments(displaced);
        } catch (err) {
            setError(err.message || 'Failed to fetch displaced appointments.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const markAsHandled = useCallback(async (appointmentId) => {
        try {
            await api.patch(`/admin/appointments/${appointmentId}/displaced-handle`, {}, token);
            await fetchDisplaced(); // Refresh list automatically
        } catch (err) {
            throw err;
        }
    }, [token, fetchDisplaced]);

    return { appointments, loading, error, fetchDisplaced, markAsHandled };
};
