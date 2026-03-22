import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const useSlots = (date, serviceId) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Manual refetch function
    const refetch = useCallback(async () => {
        if (!date || !serviceId) {
            setSlots([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Use public endpoint for guests (no auth required)
            // API_BASE already includes /api/v1, so just use the endpoint path
            const data = await api.get(
                `/slots/available/public?date=${date}&service_id=${serviceId}`,
            );
            // Issue #5: Normalize time slot format (HH:MM)
            const normalized = (data.available_slots || []).map((slot) => {
                const [h, m] = slot.split(':');
                return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            });
            setSlots(normalized);
        } catch (err) {
            setError(err.message);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    }, [date, serviceId]);

    // Auto-fetch when date or serviceId changes
    useEffect(() => {
        refetch();
    }, [refetch]);

    return { slots, loading, error, refetch };
};

export default useSlots;
