import { useState } from 'react';
import { api } from '../utils/api';

const STEPS = ['service', 'datetime', 'info', 'review'];

/**
 * Manages guest booking wizard state and submission.
 *
 * Features:
 * - Step navigation with validation
 * - Form data management with field updates
 * - API submission with timeout handling
 * - Error clearing on user interaction
 *
 * @param {string} initialServiceId - Pre-select service from ?service=uuid
 * @param {string} initialServiceName - Pre-select service name
 * @returns {object} booking state and actions
 */
const useGuestBooking = (initialServiceId = null, initialServiceName = null) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        service_id: initialServiceId || '',
        service_name: initialServiceName || '',
        date: '',
        time: '',
        full_name: '',
        email: '',
        phone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const currentStep = STEPS[step];

    // Issue #8: Clear error when user makes changes
    const updateField = (field, value) => {
        setError(null);
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateFields = (fields) => {
        setError(null);
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    const nextStep = () => {
        if (step < STEPS.length - 1) setStep((s) => s + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep((s) => s - 1);
    };

    // Issue #3: Only allow going back to completed steps
    const goToStep = (index) => {
        if (index < step) setStep(index);
    };

    // Issue #7: Add timeout handling and network error detection
    const submit = async () => {
        setSubmitting(true);
        setError(null);

        // 15 second timeout for slow networks
        const timeoutId = setTimeout(() => {
            setSubmitting(false);
            setError('Request timed out. Your internet may be slow. Please try again.');
        }, 15000);

        try {
            const body = {
                service_id: formData.service_id,
                date: formData.date,
                time: formData.time,
                email: formData.email,
                phone: formData.phone.replace(/\D/g, ''), // ✅ Sanitize: remove non-digits
                full_name: formData.full_name,
            };

            const data = await api.post('/appointments/book-guest', body);

            clearTimeout(timeoutId);

            if (data.booked) {
                setResult(data);
            } else {
                setSubmitting(false);
                setError(
                    data.error ||
                        'Booking failed. The slot may no longer be available. Please try a different time.',
                );
            }
        } catch (err) {
            clearTimeout(timeoutId);
            setSubmitting(false);

            // Provide specific error messages
            if (err.status === 409) {
                setError(
                    'This slot was just booked by someone else. Please choose a different time.',
                );
            } else if (err.status === 400) {
                setError('Please check your information and try again.');
            } else if (err.status === 503) {
                setError('Server is temporarily unavailable. Please try again later.');
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        }
    };

    const reset = () => {
        setStep(0);
        setFormData({
            service_id: '',
            service_name: '',
            date: '',
            time: '',
            full_name: '',
            email: '',
            phone: '',
        });
        setError(null);
        setResult(null);
    };

    return {
        // State
        step,
        currentStep,
        steps: STEPS,
        formData,
        submitting,
        error,
        result,
        // Actions
        updateField,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        submit,
        reset,
    };
};

export default useGuestBooking;
