import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import useSlotHold from './useSlotHold';
import { useAuth } from '../context/AuthContext';
import { useAppointmentState } from '../context/AppointmentContext';
import { useNotificationState } from '../context/NotificationContext';

const useUserReschedule = (appointmentId, originalAppointment) => {
    const { token } = useAuth();
    const { refresh: refreshAppts } = useAppointmentState();
    const { refresh: refreshNotifs } = useNotificationState();
    // Generate a unique session ID for slot holding
    const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10));
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        dentist_id: originalAppointment?.is_dentist_preferred ? (originalAppointment.dentist_id || '') : '',
    });

    // ✅ Sync formData when originalAppointment is loaded asynchronously
    useEffect(() => {
        if (originalAppointment && !formData.dentist_id) {
            if (originalAppointment.is_dentist_preferred) {
                setFormData(prev => ({
                    ...prev,
                    dentist_id: originalAppointment.dentist_id || ''
                }));
            }
        }
    }, [originalAppointment]);

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const slotHold = useSlotHold(sessionId);

    const steps = ['datetime', 'review', 'success'];
    const currentStep = steps[step - 1];

    const updateFields = (fields) => {
        setFormData((prev) => ({ ...prev, ...fields }));
        setError(null);
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, steps.length));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));
    const goToStep = (s) => setStep(s);

    const submit = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const { date, time } = formData;
            if (!date || !time) throw new Error('Please select a new date and time');

            const payload = { 
                date, 
                time,
                user_session_id: sessionId,
                dentist_id: formData.dentist_id,
            };
            
            const response = await api.patch(`/appointments/${appointmentId}/reschedule`, payload, token);
            
            if (response.rescheduled === false) {
                throw new Error(response.message || 'Slot is no longer available. Please choose another time.');
            }

            setResult({ success: true, data: response });

            // ✅ Proactively refresh application state to eliminate realtime latency
            if (typeof refreshAppts === 'function') refreshAppts();
            if (typeof refreshNotifs === 'function') refreshNotifs();

            nextStep(); // go to success
            
            // Release hold after successful reschedule
            if (slotHold.activeHold) {
                await slotHold.releaseHold();
            }
        } catch (err) {
            setError(err.message || 'Failed to reschedule appointment');
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        setStep(1);
        setFormData({
            date: '',
            time: '',
            dentist_id: originalAppointment?.is_dentist_preferred ? (originalAppointment.dentist_id || '') : '',
        });
        setError(null);
        setResult(null);
        if (slotHold?.releaseHold) {
            slotHold.releaseHold();
        }
    };

    return {
        sessionId,
        step,
        currentStep,
        formData,
        error,
        submitting,
        result,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        submit,
        reset,
        slotHold,
    };
};

export default useUserReschedule;
