import { useState, useEffect } from 'react';
import { api } from '../utils/api';

const FALLBACK_SERVICES = {
    '724b41b1-8181-4500-80e1-a260941df2db': {
        id: '724b41b1-8181-4500-80e1-a260941df2db',
        name: 'Dental Checkup',
        description: 'Routine dental examination',
        duration_minutes: 30,
        price: 30,
    },
    '38011da2-32dd-44f1-bd18-62e05ba63899': {
        id: '38011da2-32dd-44f1-bd18-62e05ba63899',
        name: 'Dental Crown',
        description: 'Crown fitting and placement',
        duration_minutes: 60,
        price: 300,
    },
    'f034728f-59c2-4774-812b-97cee49f1fd9': {
        id: 'f034728f-59c2-4774-812b-97cee49f1fd9',
        name: 'Dental Filling',
        description: 'Cavity filling with composite material',
        duration_minutes: 45,
        price: 80,
    },
    '3d42a506-a9ed-4e7e-8ff4-13ae59900147': {
        id: '3d42a506-a9ed-4e7e-8ff4-13ae59900147',
        name: 'Dental X-Ray',
        description: 'Digital dental X-ray imaging',
        duration_minutes: 15,
        price: 25,
    },
    '08afb390-3aa3-46c9-bcd1-d65021e167b3': {
        id: '08afb390-3aa3-46c9-bcd1-d65021e167b3',
        name: 'Root Canal',
        description: 'Root canal treatment',
        duration_minutes: 60,
        price: 200,
    },
    'e84f51e5-ff12-4b38-9dc5-7f446aa87f87': {
        id: 'e84f51e5-ff12-4b38-9dc5-7f446aa87f87',
        name: 'Teeth Cleaning',
        description: 'Professional dental cleaning and polishing',
        duration_minutes: 30,
        price: 50,
    },
    '8739fedf-b89b-48fa-8c29-882a5adddc09': {
        id: '8739fedf-b89b-48fa-8c29-882a5adddc09',
        name: 'Teeth Whitening',
        description: 'Professional teeth whitening treatment',
        duration_minutes: 60,
        price: 150,
    },
    'd2dc21b9-baa7-4a1f-ba0f-e56de669afda': {
        id: 'd2dc21b9-baa7-4a1f-ba0f-e56de669afda',
        name: 'Tooth Extraction',
        description: 'Simple tooth extraction',
        duration_minutes: 30,
        price: 100,
    },
};

const useServiceDetail = (serviceId) => {
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!serviceId) {
            setLoading(false);
            setError('No service ID provided.');
            return;
        }

        const fetchService = async () => {
            try {
                const data = await api.get(`/api/services/${serviceId}`);
                setService(data.service || data);
            } catch (err) {
                setError(err.message);
                // Use fallback data if service exists in our fallback list
                if (FALLBACK_SERVICES[serviceId]) {
                    setService(FALLBACK_SERVICES[serviceId]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceId]);

    return { service, loading, error };
};

export default useServiceDetail;
