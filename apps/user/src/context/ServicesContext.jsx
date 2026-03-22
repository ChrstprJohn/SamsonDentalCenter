import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCached, setIsCached] = useState(false);

    useEffect(() => {
        // Only fetch once (on mount)
        if (!isCached) {
            fetchServices();
        }
    }, [isCached]);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get('/services');
            setServices(data.services || []);
            setIsCached(true);
        } catch (err) {
            setError(err.message);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        services,
        loading,
        error,
        refetch: fetchServices,
    };

    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServicesContext = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServicesContext must be used within ServicesProvider');
    }
    return context;
};
