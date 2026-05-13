import { useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to manage dependents for the authenticated patient.
 */
export const useDependents = () => {
    const { token } = useAuth();
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDependents = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.get('/profiles', token);
            setDependents(data.profiles || []);
        } catch (err) {
            console.error('Failed to fetch dependents:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const addDependent = async (profileData) => {
        try {
            const data = await api.post('/profiles', profileData, token);
            setDependents(prev => [...prev, data.profile]);
            return data.profile;
        } catch (err) {
            console.error('Failed to add dependent:', err);
            throw err;
        }
    };

    const updateDependent = async (id, profileData) => {
        try {
            const data = await api.patch(`/profiles/${id}`, profileData, token);
            setDependents(prev => prev.map(p => p.id === id ? data.profile : p));
            return data.profile;
        } catch (err) {
            console.error('Failed to update dependent:', err);
            throw err;
        }
    };

    const deleteDependent = async (id) => {
        try {
            await api.delete(`/profiles/${id}`, token);
            setDependents(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to delete dependent:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchDependents();
    }, [fetchDependents]);

    return {
        dependents,
        loading,
        error,
        refresh: fetchDependents,
        addDependent,
        updateDependent,
        deleteDependent
    };
};
