import { Clock, AlertCircle, X } from 'lucide-react';

/**
 * ✅ NEW: Dumb UI component for joining waitlist
 *
 * Does NOT make API calls - only handles UI and passes data up to parent
 * Parent (DateTimeStep) is responsible for updating form state
 * Actual API submission happens during final form submission (Confirm step)
 */
const JoinWaitlistModal = ({ serviceId, date, time, serviceName, onSuccess, onClose }) => {
    const handleJoinClick = () => {
        // ✅ Simply call onSuccess with the date and time
        // Parent component will handle form state update
        onSuccess({ date, time });
    };

    return (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6'>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-slate-400 hover:text-slate-600'
                    aria-label='Close'
                >
                    <X size={20} />
                </button>

                <h3 className='text-lg font-bold text-slate-900 mb-4 flex items-center gap-2'>
                    <Clock
                        size={20}
                        className='text-sky-500'
                    />
                    Join Waitlist?
                </h3>

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
                        className='flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-lg
                                   hover:bg-slate-50 font-medium transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleJoinClick}
                        className='flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg
                                   font-semibold transition-colors shadow-lg shadow-sky-500/25'
                    >
                        Join Waitlist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinWaitlistModal;
