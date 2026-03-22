import { useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STEPS = ['service', 'datetime', 'review', 'confirm'];
const STEPS_WITH_OTHER_INFO = ['service', 'datetime', 'other_info', 'review', 'confirm'];

/**
 * Manages user booking wizard state and submission.
 *
 * Features:
 * - 4 steps (service → datetime → review → confirm) for booking self
 * - 5 steps (service → datetime → other_info → review → confirm) for booking others
 * - Review step displays user details (read-only, no editing)
 * - No email input needed (uses account email from JWT)
 * - Two-tier system:
 *   - General services → CONFIRMED immediately
 *   - Specialized services → PENDING (awaiting approval)
 * - API submission with timeout handling
 * - Requires authentication token
 * - Optional booked_for_name field for booking on behalf of others
 * - Deep link support: Pre-select service from URL params (e.g., ?service=id&service_name=name)
 *
 * @param {string} initialServiceId - Pre-selected service ID from URL query param
 * @param {string} initialServiceName - Pre-selected service name from URL query param
 * @returns {object} booking state and actions
 */
const useUserBooking = (initialServiceId = null, initialServiceName = null) => {
    const { token } = useAuth();
    const [book_for_others, setBookForOthers] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        service_id: initialServiceId || '', // ✅ Pre-populate from URL param
        service_name: initialServiceName || '', // ✅ Pre-populate from URL param
        date: '',
        time: '',
        booked_for_name: '', // Empty string = booking for self
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    // Dynamically choose steps based on booking preference
    const steps = book_for_others ? STEPS_WITH_OTHER_INFO : STEPS;
    const currentStep = steps[step];

    // Clear error when user makes changes
    const updateField = (field, value) => {
        setError(null);
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateFields = (fields) => {
        setError(null);
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    const setBookForOthersMode = (enabled) => {
        setBookForOthers(enabled);
        // Reset to step 0 when toggling mode
        setStep(0);
        // ✅ IMPROVEMENT #3: Clear booked_for_name if switching to "book for self"
        if (!enabled) {
            setFormData((prev) => ({ ...prev, booked_for_name: '' }));
        }
    };

    const nextStep = () => {
        if (step < steps.length - 1) setStep((s) => s + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep((s) => s - 1);
    };

    // Only allow going back to completed steps
    const goToStep = (index) => {
        if (index < step) setStep(index);
    };

    // Submit booking to API
    const submit = async () => {
        setSubmitting(true);
        setError(null);

        // 15 second timeout
        const timeoutId = setTimeout(() => {
            setSubmitting(false);
            setError('Request timed out. Please try again.');
        }, 15000);

        try {
            const body = {
                service_id: formData.service_id,
                date: formData.date,
                time: formData.time,
            };

            // Only include booked_for_name if booking for someone else
            if (book_for_others && formData.booked_for_name.trim()) {
                body.booked_for_name = formData.booked_for_name.trim();
            }

            const data = await api.post('/appointments/book-user', body, token);

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

            if (err.status === 409) {
                setError('This slot was just booked. Please choose a different time.');
            } else if (err.status === 400) {
                setError('Invalid booking data. Please try again.');
            } else if (err.status === 503) {
                setError('Server is temporarily unavailable. Please try again later.');
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        }
    };

    // Join waitlist for a full slot
    const joinWaitlist = async (service_id, date, time) => {
        try {
            const data = await api.post(
                '/waitlist/join',
                {
                    service_id,
                    preferred_date: date,
                    preferred_time: time,
                },
                token,
            );

            if (data.success) {
                // User successfully joined waitlist
                // They can continue booking for another time OR go to dashboard
                return { success: true, position: data.waitlist_entry.position };
            }
        } catch (err) {
            throw new Error(err.message || 'Failed to join waitlist');
        }
    };

    const reset = () => {
        setStep(0);
        setFormData({
            service_id: '',
            service_name: '',
            date: '',
            time: '',
            booked_for_name: '',
        });
        setError(null);
        setResult(null);
        setBookForOthers(false);
    };

    return {
        // State
        step,
        currentStep,
        steps,
        book_for_others,
        formData,
        submitting,
        error,
        result,
        // Actions
        updateField,
        updateFields,
        setBookForOthersMode,
        nextStep,
        prevStep,
        goToStep,
        submit,
        joinWaitlist,
        reset,
    };
};

export default useUserBooking;
