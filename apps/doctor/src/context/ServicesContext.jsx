import { createContext, useContext, useState } from 'react';

const ServicesContext = createContext();

const MOCK_SERVICES = [
    { id: 'mock-service-1', name: 'Tooth Extraction', price: 1500 },
    { id: 'mock-service-2', name: 'General Consultation', price: 500 },
    { id: 'mock-service-3', name: 'Dental Cleaning', price: 1000 },
    { id: 'mock-service-4', name: 'Root Canal', price: 8000 },
    { id: 'mock-service-5', name: 'Braces Adjustment', price: 2000 },
];

export const ServicesProvider = ({ children }) => {
    // SIMULATION MODE: All data is mock and API calls are disabled.
    const [services] = useState(MOCK_SERVICES);
    const [loading] = useState(false);
    const [error] = useState(null);

    const value = {
        services,
        loading,
        error,
        refetch: () => console.log('Simulation: Refetching mock services...'),
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
