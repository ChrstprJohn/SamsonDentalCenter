import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for managing specialized appointment approvals.
 */
export const useAdminApprovals = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetches dynamic aggregated context for an approval request.
     */
    const fetchApprovalDetail = useCallback(async (appointmentId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/admin/appointments-approval/${appointmentId}/detail`, token);
            return response;
        } catch (err) {
            console.error('Failed to fetch approval details:', err);
            setError(err.message || 'Failed to load request details.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Approves a specialized request.
     */
    const approveAppointment = useCallback(async (appointmentId, dentistId = null) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.patch(`/admin/appointments-approval/${appointmentId}/approve`, {
                dentist_id: dentistId
            }, token);
            return response;
        } catch (err) {
            console.error('Approve mutation failed:', err);
            setError(err.message || 'Approval failed.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Rejects a specialized request with a reason.
     */
    const rejectAppointment = useCallback(async (appointmentId, reason) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.patch(`/admin/appointments-approval/${appointmentId}/reject`, {
                reason
            }, token);
            return response;
        } catch (err) {
            console.error('Reject mutation failed:', err);
            setError(err.message || 'Rejection failed.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    return {
        loading,
        error,
        fetchApprovalDetail,
        approveAppointment,
        rejectAppointment
    };
};
