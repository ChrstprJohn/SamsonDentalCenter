import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Loader2, MailWarning, Clock, Hash } from 'lucide-react';

const GuestBookingSuccess = ({ result, onReset, booking }) => {
    const navigate = useNavigate();
    const [resending, setResending] = useState(false);
    const [resendStatus, setResendStatus] = useState(null);
    const [cooldown, setCooldown] = useState(0);

    // Countdown effect for the resend button
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleResend = async () => {
        if (!booking?.resendVerification || cooldown > 0) return;
        setResending(true);
        setResendStatus(null);
        
        const res = await booking.resendVerification(
            result.appointment.id,
            result.appointment.guest_email || booking.formData.email
        );
        
        setResending(false);
        
        if (res?.success) {
            setResendStatus({ success: true, message: "Verification email resent!" });
            setCooldown(300); // 5 minutes block
        } else {
            setResendStatus(res);
        }
        
        // Remove status message after 10 seconds to keep UI clean
        setTimeout(() => setResendStatus(null), 10000);
    };

    return (
        <div className="w-full max-w-[500px] mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[28px] p-5 sm:p-8 shadow-theme-lg overflow-hidden relative">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"></div>

                {/* Header Section */}
                <div className='mb-5 sm:mb-6 text-center'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-brand-100 dark:border-brand-500/20 shadow-inner'>
                        <CheckCircle className='w-6 h-6 sm:w-8 sm:h-8 text-brand-500' />
                    </div>
                    <h2 className='text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-1.5 sm:mb-2'>
                        Request Submitted
                    </h2>
                    <p className='text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium px-2 sm:px-4'>
                        Your booking has been recorded. Follow the instructions to finalize.
                    </p>
                </div>

                {/* Verification Alert Banner */}
                <div className='bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-2xl p-3.5 sm:p-5 mb-5 sm:mb-6 text-left'>
                    <div className="flex gap-3 sm:gap-4 items-start">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                            <MailWarning size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="grow">
                            <h4 className="text-[12px] sm:text-[14px] font-black text-gray-900 dark:text-white mb-1.5 uppercase tracking-wide">Action Required</h4>
                            <div className='space-y-1.5 text-[11px] sm:text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                                <p>Please open the email you just received and <strong className="text-brand-600 dark:text-brand-400">click the verification link</strong>.</p>
                                <p><strong className="text-gray-900 dark:text-white font-black">What's Next:</strong> Once verified, we will review your booking and get back to you with final approval.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reference Details */}
                {result?.appointment?.id && (
                    <div className="flex flex-row justify-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                        <div className="flex-1 p-2 sm:p-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-theme-xs">
                            <div className="text-gray-500 dark:text-gray-400 hidden sm:block">
                                <Hash size={16} />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 leading-none mb-1">Ref ID</p>
                                <p className="text-[11px] sm:text-[14px] font-black text-gray-900 dark:text-white font-mono tracking-wider leading-none">
                                    #{result.appointment.id.slice(0, 8).toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 p-2 sm:p-3.5 border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-theme-xs">
                            <div className="text-amber-500 hidden sm:block">
                                <Clock size={16} />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-600/80 dark:text-amber-500/80 leading-none mb-1 flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5">
                                    <span className='relative flex h-1 w-1 sm:h-1.5 sm:w-1.5'>
                                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75'></span>
                                        <span className='relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-amber-500'></span>
                                    </span>
                                    Validity
                                </p>
                                <p className="text-[11px] sm:text-[14px] font-black text-amber-700 dark:text-amber-400 tracking-tight leading-none">
                                    15 Mins
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resend Action */}
                <div className='mb-5 sm:mb-8 text-center'>
                    <button
                        onClick={handleResend}
                        disabled={resending || cooldown > 0}
                        className='inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-[13px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors disabled:opacity-50 tracking-wide uppercase'
                    >
                        {resending ? (
                            <Loader2 className='w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin' />
                        ) : cooldown > 0 ? (
                            <Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
                        ) : (
                            <Mail className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
                        )}
                        {cooldown > 0 
                            ? `Resend again in ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, '0')}`
                            : "Didn't get the email? Resend"}
                    </button>
                    
                    {resendStatus && (
                        <p className={`mt-2 text-[10px] sm:text-[12px] font-black tracking-wide uppercase ${
                            resendStatus.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                        }`}>
                            {resendStatus.message}
                        </p>
                    )}
                </div>

                {/* Navigation Footer */}
                <div className='flex flex-row items-center justify-between gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700/50'>
                    <button
                        onClick={() => navigate('/')}
                        className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[10px] sm:text-[13px] px-3 py-2 sm:px-6 sm:py-3 transition-colors uppercase tracking-widest'
                    >
                        Home
                    </button>
                    <button
                        onClick={onReset}
                        className='bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all shadow-theme-sm sm:shadow-theme-md text-[10px] sm:text-[13px] uppercase tracking-widest'
                    >
                        Book Another
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestBookingSuccess;
