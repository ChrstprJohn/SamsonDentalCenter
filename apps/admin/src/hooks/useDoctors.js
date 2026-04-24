import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for managing doctor details and list in the admin portal.
 */
export const useDoctors = (fetchOnMount = true) => {
    const { token } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDoctors = useCallback(async () => {
        try {
            if (!token) return;
            setLoading(true);
            setError(null);
            
            // Assuming /admin/dentists returns { dentists: [...] }
            const response = await api.get('/admin/dentists', token);
            
            // Re-shape logic is handled backend-side in the updated getDentists controller.
            // The object matches frontend expectations: id, full_name, email, phone, tier, etc.
            setDoctors(response.dentists || []);
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
            setError(err.message || 'Failed to load doctors');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (fetchOnMount && token) {
            fetchDoctors();
        }
    }, [fetchDoctors, fetchOnMount, token]);

    // Update Profile (bio, photo, active status, name parts)
    const updateDoctorProfile = async (id, profileData) => {
        try {
            const response = await api.patch(`/admin/dentists/${id}/profile`, profileData, token);
            // Re-fetch to guarantee sync with DB
            await fetchDoctors();
            return response.doctor;
        } catch (err) {
            console.error('Failed to update doctor profile:', err);
            throw err;
        }
    };

    // Update Contact is just a subset of profile updating
    const updateDoctorContact = async (id, contactData) => {
        return updateDoctorProfile(id, contactData);
    };

    // Update Services (replace all assigned services)
    const updateDoctorServices = async (id, serviceIds) => {
        try {
            const response = await api.patch(`/admin/dentists/${id}/services`, {
                service_ids: serviceIds,
            }, token);
            await fetchDoctors();
            return response.doctor;
        } catch (err) {
            console.error('Failed to update doctor services:', err);
            throw err;
        }
    };

    // Refresh exactly one doctor (useful if we don't want to reload the whole list)
    const fetchSingleDoctor = async (id) => {
        try {
            const response = await api.get(`/admin/dentists/${id}`, token);
            const updatedDoctor = response.doctor;
            
            setDoctors(current => current.map(d => d.id === id ? updatedDoctor : d));
            return updatedDoctor;
        } catch (err) {
            console.error(`Failed to fetch doctor ${id}:`, err);
            throw err;
        }
    };

    return {
        doctors,
        loading,
        error,
        refresh: fetchDoctors,
        updateDoctorProfile,
        updateDoctorContact,
        updateDoctorServices,
        fetchSingleDoctor
    };
};
