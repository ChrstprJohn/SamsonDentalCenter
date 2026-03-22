import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

const UserBookingSuccess = ({ result, onReset }) => {
    const navigate = useNavigate();
    const isPending = result?.status === 'PENDING' || result?.requires_approval;
    const Icon = isPending ? Clock : CheckCircle;
    const iconColor = isPending ? 'text-amber-500' : 'text-emerald-500';

    return (
        <div className='text-center py-12'>
            <Icon
                size={56}
                className={`${iconColor} mx-auto mb-4`}
            />
            <h2 className='text-2xl font-bold text-slate-900 mb-2'>
                {isPending ? 'Request Submitted!' : 'Appointment Confirmed!'}
            </h2>
            <p className='text-slate-500 max-w-md mx-auto mb-6'>
                {isPending
                    ? 'Your appointment request has been submitted. The clinic will review and confirm your schedule within 24 hours.'
                    : "Your appointment has been successfully booked and confirmed. You'll receive a reminder email before your appointment date."}
            </p>

            {isPending && (
                <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6'>
                    <p className='text-sm text-amber-800'>
                        <span className='font-semibold'>⏳ Pending Approval</span>
                        <br />
                        <span className='text-xs'>
                            This is a specialized service and requires clinic approval.
                        </span>
                    </p>
                </div>
            )}

            {result?.appointment?.id && (
                <div className='inline-block bg-slate-50 rounded-xl px-4 py-2 mb-6'>
                    <span className='text-xs text-slate-400'>Appointment ID: </span>
                    <span className='text-sm font-mono text-slate-700'>
                        {result.appointment.id.slice(0, 8).toUpperCase()}
                    </span>
                </div>
            )}

            <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                <button
                    onClick={() => navigate('/dashboard')}
                    className='border border-slate-200 text-slate-700 font-medium px-6 py-2.5 rounded-xl
                               hover:bg-slate-50 transition-colors'
                >
                    Go to Dashboard
                </button>
                <button
                    onClick={() => {
                        onReset();
                        navigate('/dashboard/book');
                    }}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2.5 rounded-xl
                               transition-colors shadow-lg shadow-sky-500/25'
                >
                    Book Another Appointment
                </button>
            </div>
        </div>
    );
};

export default UserBookingSuccess;
