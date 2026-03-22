import { useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Modal to join waitlist when a slot is full during booking flow
 * Appears inline in DateTimeStep when user selects a full time slot
 */
const JoinWaitlistModal = ({ serviceId, date, time, serviceName, onSuccess, onClose }) => {
    const { token } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleJoin = async () => {
        setSubmitting(true);
        setError(null);

        try {
            const data = await api.post(
                '/waitlist/join',
                {
                    service_id: serviceId,
                    preferred_date: date,
                    preferred_time: time,
                },
                token,
            );

            if (data.success) {
                // Show success message
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                setError(data.message || 'Failed to join waitlist');
                setSubmitting(false);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4'>
                <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center'>
                    <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Clock
                            size={24}
                            className='text-emerald-600'
                        />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 mb-2'>Added to Waitlist!</h3>
                    <p className='text-slate-600 text-sm mb-6'>
                        You've been added to the waitlist. We'll notify you when this slot becomes
                        available.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6'>
                <h3 className='text-lg font-bold text-slate-900 mb-4 flex items-center gap-2'>
                    <Clock
                        size={20}
                        className='text-sky-500'
                    />
                    Join Waitlist?
                </h3>

                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4'>
                        {error}
                    </div>
                )}

                <div className='bg-slate-50 rounded-lg p-4 mb-6 space-y-2'>
                    <div className='text-sm'>
                        <span className='text-slate-500'>Service: </span>
                        <span className='font-semibold text-slate-900'>{serviceName}</span>
                    </div>
                    <div className='text-sm'>
                        <span className='text-slate-500'>Date: </span>
                        <span className='font-semibold text-slate-900'>{date}</span>
                    </div>
                    <div className='text-sm'>
                        <span className='text-slate-500'>Time: </span>
                        <span className='font-semibold text-slate-900'>{time}</span>
                    </div>
                </div>

                <div className='bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 flex gap-2'>
                    <AlertCircle
                        size={16}
                        className='text-blue-600 shrink-0 mt-0.5'
                    />
                    <p className='text-sm text-blue-800'>
                        You'll be notified when this slot opens up. We'll send you a message with a
                        25-minute window to confirm.
                    </p>
                </div>

                <div className='flex gap-3'>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className='flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-lg
                                   hover:bg-slate-50 font-medium transition-colors disabled:opacity-50'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleJoin}
                        disabled={submitting}
                        className='flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg
                                   font-semibold transition-colors shadow-lg shadow-sky-500/25 disabled:opacity-50
                                   flex items-center justify-center gap-2'
                    >
                        {submitting ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                Joining...
                            </>
                        ) : (
                            'Join Waitlist'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinWaitlistModal;
