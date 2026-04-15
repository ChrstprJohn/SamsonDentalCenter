import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import useSlotHold from './useSlotHold';

const STEPS = ['service', 'datetime', 'info', 'review'];

// Session ID management (use sessionStorage so it clears when tab closes)
const STORAGE_KEY = 'guest_session_id';

const generateSessionId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const getOrCreateSessionId = () => {
    let sessionId = sessionStorage.getItem(STORAGE_KEY);
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem(STORAGE_KEY, sessionId);
    }
    return sessionId;
};

/**
 * Manages guest booking wizard state and submission.
 *
 * Features:
 * - Session ID generation/persistence in sessionStorage
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
    const [sessionId, setSessionId] = useState(null);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        service_id: initialServiceId || '',
        service_name: initialServiceName || '',
        service_duration: '',
        date: '',
        time: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix_name: '',
        email: '',
        phone: '',
        dentist_id: '',
        service_tier: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    // ✅ Initialize slot hold hook at the wizard level to survive step changes
    const slotHold = useSlotHold(sessionId);

    // ✅ Generate session ID on component mount
    useEffect(() => {
        const id = getOrCreateSessionId();
        setSessionId(id);
    }, []);

    // ✅ Auto-release hold if user goes back and changes the service
    // This handles the case where a user already picked a time, then goes back to Step 1
    useEffect(() => {
        if (slotHold.activeHold && slotHold.activeHold.service_id !== formData.service_id) {
            console.log('Service changed, releasing previous hold...');
            slotHold.releaseHold();
        }
    }, [formData.service_id, slotHold]);

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
        if (step > 0) {
            const nextIdx = step - 1;
            // ✅ Reset states when going back to Service step
            if (nextIdx === 0) {
                slotHold.releaseHold();
                setFormData(prev => ({
                    ...prev,
                    date: '',
                    time: '',
                    first_name: '',
                    last_name: '',
                    middle_name: '',
                    suffix_name: '',
                    email: '',
                    phone: '',
                    dentist_id: '',
                    service_tier: prev.service_tier, // Keep tier for DateTimeStep usage
                }));
            }
            setStep(nextIdx);
        }
    };

    // Issue #3: Only allow going back to completed steps
    const goToStep = (index) => {
        if (index < step) {
            // ✅ Reset states when navigating back to Service step via breadcrumbs
            if (index === 0) {
                slotHold.releaseHold();
                setFormData(prev => ({
                    ...prev,
                    date: '',
                    time: '',
                    first_name: '',
                    last_name: '',
                    middle_name: '',
                    suffix_name: '',
                    email: '',
                    phone: '',
                    dentist_id: '',
                    service_tier: prev.service_tier, // Keep tier
                }));
            }
            setStep(index);
        }
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
                guestNameParts: {
                    first: formData.first_name,
                    last: formData.last_name,
                    middle: formData.middle_name,
                    suffix: formData.suffix_name,
                },
                user_session_id: sessionId,
            };

            const data = await api.post('/appointments/book-guest', body);

            clearTimeout(timeoutId);

            if (data.booked) {
                setResult(data);
                setSubmitting(false); // ✅ Clear submitting state on success
                // Clean up the hold
                slotHold.clearHold();
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

    const resendVerification = async (appointmentId, email) => {
        try {
            await api.post('/appointments/resend-confirmation', {
                appointment_id: appointmentId,
                email: email,
            });
            return { success: true, message: 'Verification email resent!' };
        } catch (err) {
            console.error('Resend error:', err);
            return {
                success: false,
                message: err.message || 'Failed to resend. Please try again later.',
            };
        }
    };

    const reset = () => {
        setStep(0);
        setFormData({
            service_id: '',
            service_name: '',
            service_duration: '',
            date: '',
            time: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            suffix_name: '',
            email: '',
            phone: '',
            service_tier: '', // Total reset
        });
        setError(null);
        setSubmitting(false); // ✅ Safety reset
        setResult(null);

        // ✅ Rotate session ID to ensure "Book Another" starts fresh
        const newId = generateSessionId();
        sessionStorage.setItem(STORAGE_KEY, newId);
        setSessionId(newId);

        slotHold.clearHold();
    };

    return {
        // State
        sessionId,
        step,
        currentStep,
        steps: STEPS,
        formData,
        submitting,
        error,
        result,
        slotHold, // pass the hold hook to children
        // Actions
        updateField,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        submit,
        resendVerification,
        reset,
    };
};

export default useGuestBooking;
