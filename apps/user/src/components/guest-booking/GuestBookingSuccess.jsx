import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Loader2 } from 'lucide-react';

const GuestBookingSuccess = ({ result, onReset, booking }) => {
    const navigate = useNavigate();
    const [resending, setResending] = useState(false);
    const [resendStatus, setResendStatus] = useState(null); // { success, message }

    const handleResend = async () => {
        if (!booking?.resendVerification) return;
        setResending(true);
        setResendStatus(null);
        
        const res = await booking.resendVerification(
            result.appointment.id,
            result.appointment.guest_email || booking.formData.email
        );
        
        setResending(false);
        setResendStatus(res);
        
        // Clear status after 5 seconds
        setTimeout(() => setResendStatus(null), 5000);
    };

    return (
        <div className='text-center py-12'>
            <CheckCircle
                size={56}
                className='text-emerald-500 mx-auto mb-4'
            />
            <h2 className='text-2xl font-bold text-slate-900 mb-2'>Request Submitted!</h2>
            <p className='text-slate-500 max-w-md mx-auto mb-6 leading-relaxed'>
                Your booking request has been received! Before we can process it, 
                <strong> please check your email and verify your request</strong> by clicking the link we sent. 
                Once verified, our team will review and approve your appointment.
            </p>

            {result?.appointment?.id && (
                <div className='flex flex-col items-center gap-2 mb-8'>
                    <div className='inline-block bg-slate-50 rounded-xl px-4 py-2 border border-slate-100'>
                        <span className='text-xs text-slate-400 font-medium uppercase tracking-wider'>
                            Reference:{' '}
                        </span>
                        <span className='text-sm font-mono text-slate-700 font-bold'>
                            {result.appointment.id.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                    <p className='text-xs text-amber-600 font-medium flex items-center gap-1.5'>
                        <span className='inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse' />
                        Verification expires in 24 hours
                    </p>
                </div>
            )}

            <div className='mb-10'>
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className='inline-flex items-center gap-2 text-sm font-semibold text-sky-600 
                               hover:text-sky-700 transition-colors disabled:opacity-50'
                >
                    {resending ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                        <Mail className='w-4 h-4' />
                    )}
                    Didn't get the email? Resend verification
                </button>
                
                {resendStatus && (
                    <p className={`mt-2 text-xs font-medium ${
                        resendStatus.success ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                        {resendStatus.message}
                    </p>
                )}
            </div>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                <button
                    onClick={() => navigate('/')}
                    className='flex-1 lg:flex-none inline-flex items-center justify-center font-bold text-sm bg-white text-slate-700 hover:bg-slate-50 transition-all duration-300 ring-1 ring-slate-200 px-8 py-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300'
                >
                    Back to Home
                </button>
                <button
                    onClick={onReset}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-sky-500/25 active:scale-95'
                >
                    Book Another Appointment
                </button>
            </div>
        </div>
    );
};

export default GuestBookingSuccess;
