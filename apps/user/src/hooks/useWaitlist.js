import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Manages waitlist operations: fetch, join, leave, accept offers
 * Used in WaitlistManagementPage for viewing and managing waitlist entries
 */
const useWaitlist = () => {
    const { token } = useAuth();
    const [waitlist, setWaitlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWaitlist = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const data = await api.get('/waitlist/my', token);
            setWaitlist(data.waitlist || []);
        } catch (err) {
            setError(err.message);
            setWaitlist([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchWaitlist();
    }, [fetchWaitlist]);

    const leaveWaitlist = useCallback(
        async (waitlistId) => {
            try {
                await api.delete(`/waitlist/${waitlistId}`, token);
                setWaitlist(waitlist.filter((item) => item.id !== waitlistId));
            } catch (err) {
                throw err;
            }
        },
        [token, waitlist],
    );

    const acceptOffer = useCallback(
        async (waitlistId, accept = true) => {
            try {
                const data = await api.post(`/waitlist/${waitlistId}/confirm`, { accept }, token);
                if (accept && data.appointment) {
                    // Remove from waitlist if accepted
                    setWaitlist(waitlist.filter((item) => item.id !== waitlistId));
                    return { success: true, appointment: data.appointment };
                }
                return { success: true };
            } catch (err) {
                throw err;
            }
        },
        [token, waitlist],
    );

    const declineOffer = useCallback(
        async (waitlistId) => {
            try {
                const data = await api.post(
                    `/waitlist/${waitlistId}/confirm`,
                    { accept: false },
                    token,
                );
                // Mark as declined but keep in list
                setWaitlist(
                    waitlist.map((item) =>
                        item.id === waitlistId ? { ...item, status: 'DECLINED' } : item,
                    ),
                );
                return { success: true };
            } catch (err) {
                throw err;
            }
        },
        [token, waitlist],
    );

    return {
        waitlist,
        loading,
        error,
        fetchWaitlist,
        leaveWaitlist,
        acceptOffer,
        declineOffer,
    };
};

export default useWaitlist;
