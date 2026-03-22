import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const GuestBookingSuccess = ({ result, onReset }) => {
    const navigate = useNavigate();

    return (
        <div className='text-center py-12'>
            <CheckCircle
                size={56}
                className='text-emerald-500 mx-auto mb-4'
            />
            <h2 className='text-2xl font-bold text-slate-900 mb-2'>Booking Submitted!</h2>
            <p className='text-slate-500 max-w-md mx-auto mb-6'>
                Your appointment request has been received. Please check your email and click the
                confirmation link to secure your appointment.
            </p>

            {result?.appointment?.id && (
                <div className='inline-block bg-slate-50 rounded-xl px-4 py-2 mb-6'>
                    <span className='text-xs text-slate-400'>Reference: </span>
                    <span className='text-sm font-mono text-slate-700'>
                        {result.appointment.id.slice(0, 8).toUpperCase()}
                    </span>
                </div>
            )}

            <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                <button
                    onClick={() => navigate('/')}
                    className='border border-slate-200 text-slate-700 font-medium
                               px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm'
                >
                    Back to Home
                </button>
                <button
                    onClick={onReset}
                    className='text-sky-500 hover:text-sky-600 font-medium text-sm px-6 py-2.5'
                >
                    Book Another Appointment
                </button>
            </div>
        </div>
    );
};

export default GuestBookingSuccess;
