import { useState } from 'react';
import { api } from '../utils/api';

const useInquiry = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitInquiry = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.post('/api/inquiries', formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
    };

    return { submitInquiry, loading, error, success, reset };
};

export default useInquiry;
