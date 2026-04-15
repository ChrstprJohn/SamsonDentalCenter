import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';

const useSlots = (date, serviceId, includeFullSlots = false, sessionId = null, dentistId = null, excludeAppointmentId = null) => {
    const [slots, setSlots] = useState([]);
    const [nextAvailableDate, setNextAvailableDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Ref for coordinating requests and debouncing
    const fetchTimeoutRef = useRef(null);
    const isFetchingRef = useRef(false);

    // Helper: Convert 24-hour time to 12-hour AM/PM format
    const formatTimeToAMPM = (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Core fetch logic (wrapped in useCallback for external use)
    const performFetch = useCallback(async () => {
        if (!date || !serviceId) {
            setSlots([]);
            setNextAvailableDate(null);
            setIsPending(false);
            return;
        }

        // Prevent overlapping requests
        if (isFetchingRef.current) return;

        setLoading(true);
        setIsPending(false); // ✅ Transition from pending (debounce) to active loading
        setError(null);
        isFetchingRef.current = true;

        try {
            // Include session_id so backend doesn't show our OWN hold as locked
            let url = `/slots/available/public?date=${date}&service_id=${serviceId}`;
            if (sessionId) {
                url += `&session_id=${sessionId}`;
            }
            if (dentistId) {
                url += `&dentist_id=${dentistId}`;
            }
            if (excludeAppointmentId) {
                url += `&exclude_appointment_id=${excludeAppointmentId}`;
            }

            const data = await api.get(url);
            const allSlots = data.all_slots || [];
            const filtered = allSlots.filter((slot) => includeFullSlots || slot.available > 0);

            const normalized = filtered.map((slot) => ({
                time: slot.time,
                rawTime: slot.time,
                displayTime: formatTimeToAMPM(slot.time),
                available: slot.available,
            }));

            setSlots(normalized);
            setNextAvailableDate(data.next_available_date || null);
        } catch (err) {
            setError(err.message);
            setSlots([]);
            setNextAvailableDate(null);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [date, serviceId, includeFullSlots, sessionId, dentistId, excludeAppointmentId]);

    // Manual immediate refetch (e.g. for "Refresh" button)
    const refetch = useCallback(() => {
        // Clear any pending debounced fetch
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }
        performFetch();
    }, [performFetch]);

    // Auto-fetch with DEBOUNCE when date/service changes
    useEffect(() => {
        // ✅ Exit early if no date/service, but ensure pending is false
        if (!date || !serviceId) {
            setIsPending(false);
            return;
        }

        // Clear previous timeout
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }

        // ✅ Immediate pending state for debounce period
        setIsPending(true);

        // Set new timeout (300ms)
        fetchTimeoutRef.current = setTimeout(() => {
            performFetch();
        }, 300);

        // Cleanup on unmount or deps change
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
            setIsPending(false); // ✅ Clear on cleanup
        };
    }, [performFetch, date, serviceId]);

    return { slots, nextAvailableDate, loading, isPending, error, refetch };
};

export default useSlots;
