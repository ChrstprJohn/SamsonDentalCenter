import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import useSlotHold from './useSlotHold';

const STEPS = ['service', 'datetime', 'other_info', 'review', 'confirm'];

// Session ID management
const STORAGE_KEY = 'user_session_id'; // CHANGED

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
    const [sessionId, setSessionId] = useState(null);
    const [book_for_others, setBookForOthers] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        service_id: initialServiceId || '', // ✅ Pre-populate from URL param
        service_name: initialServiceName || '', // ✅ Pre-populate from URL param
        date: '',
        time: '',
        booked_for_name: '', // Empty string = booking for self
        dentist_id: '', // ✅ NEW: Preferred dentist (null = any available)
        // ✅ NEW: Deferred Waitlist Fields
        waitlist_date: '', // Selected full slot date
        waitlist_time: '', // Selected full slot time
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    // ✅ Track submission timestamp to prevent rapid resubmissions
    const [lastSubmissionTime, setLastSubmissionTime] = useState(null);

    // ✅ Initialize slot hold hook at the wizard level to survive step changes
    const slotHold = useSlotHold(sessionId);

    // ✅ Generate session ID on component mount
    useEffect(() => {
        const id = getOrCreateSessionId();
        setSessionId(id);
    }, []);

    // ✅ Auto-release hold if user goes back and changes the service
    useEffect(() => {
        if (slotHold.activeHold && slotHold.activeHold.service_id !== formData.service_id) {
            slotHold.releaseHold();
        }
    }, [formData.service_id, slotHold]);

    // Dynamically choose steps based on booking preference
    const steps = STEPS;
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

    // Submit booking to API with unified atomic endpoint
    const submit = async () => {
        // ✅ Implement client-side rate limiting (minimum 1 second between submissions)
        const now = Date.now();
        if (lastSubmissionTime && now - lastSubmissionTime < 1000) {
            setError('Please wait a moment before trying again.');
            return;
        }

        setSubmitting(true);
        setError(null);
        setLastSubmissionTime(now);

        // 15 second timeout
        const timeoutId = setTimeout(() => {
            setSubmitting(false);
            setError('Request timed out. Please try again.');
        }, 15000);

        try {
            // ✅ Unified Atomic Body
            const body = {
                service_id: formData.service_id,
                booking: formData.time ? {
                    date: formData.date,
                    time: formData.time,
                    dentist_id: formData.dentist_id || null, // ✅ NEW: Preferred dentist
                    booked_for_name: book_for_others && formData.booked_for_name.trim() 
                        ? formData.booked_for_name.trim() 
                        : null,
                    user_session_id: sessionId,
                } : null,
                waitlist: formData.waitlist_time ? {
                    date: formData.waitlist_date,
                    time: formData.waitlist_time,
                    priority: 0,
                    dentist_id: formData.dentist_id || null,
                    booked_for_name: book_for_others && formData.booked_for_name.trim() 
                        ? formData.booked_for_name.trim() 
                        : null,
                } : null
            };

            const response = await api.post('/appointments/submit-wizard', body, token);
            
            clearTimeout(timeoutId);

            // Clean up the active hold after processing results
            slotHold.clearHold();

            const { booking, waitlist } = response;

            // Handle results based on what was requested and what succeeded
            const bookingSuccess = !!booking?.booked;
            const waitlistSuccess = !!waitlist?.success;

            // ✅ NEW: More resilient success handling
            const hasRequestedBooking = !!formData.time;
            const hasRequestedWaitlist = !!formData.waitlist_time;

            if (bookingSuccess || waitlistSuccess) {
                setResult({
                    success: true,
                    booked: bookingSuccess,
                    waitlisted: waitlistSuccess,
                    bookingData: booking,
                    waitlistData: waitlist,
                    message: (bookingSuccess && waitlistSuccess) 
                        ? 'Both booking and waitlist confirmed!' 
                        : bookingSuccess 
                            ? 'Appointment confirmed!' 
                            : 'Waitlist confirmed!',
                });
            }
            // ✅ SCENARIO 4: Total Failure (Neither requested action succeeded) ❌
            else {
                setResult(null);
                setError(booking?.message || waitlist?.message || 'The selected slot is no longer available. Please try another time.');
                // Go back to datetime step so they can try again
                setStep(STEPS.indexOf('datetime'));
            }

            setSubmitting(false);
        } catch (err) {
            clearTimeout(timeoutId);
            setSubmitting(false);

            // Backend returns specific error stage if one fails
            const prefix = err.stage ? `[${err.stage}] ` : '';
            setError(`${prefix}${err.message || 'Submission failed. Please try again.'}`);
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
            dentist_id: '',
            // ✅ Clear waitlist fields on reset
            waitlist_date: '',
            waitlist_time: '',
        });
        setError(null);
        setSubmitting(false); // ✅ Safety reset
        setResult(null);
        setBookForOthers(false);

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
        steps,
        book_for_others,
        formData,
        submitting,
        error,
        result,
        slotHold, // pass the hold hook to children
        // Actions
        updateField,
        updateFields,
        setBookForOthersMode,
        nextStep,
        prevStep,
        goToStep,
        submit,
        reset,
    };
};

export default useUserBooking;
