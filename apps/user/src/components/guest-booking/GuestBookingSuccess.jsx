import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Loader2, MailWarning, Clock, Hash, ShieldCheck, ArrowRight, Home as HomeIcon, CalendarPlus } from 'lucide-react';

const GuestBookingSuccess = ({ result, onReset, booking }) => {
    const navigate = useNavigate();
    const [resending, setResending] = useState(false);
    const [resendStatus, setResendStatus] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [password, setPassword] = useState('');
    const [upgrading, setUpgrading] = useState(false);
    const [upgradeResult, setUpgradeResult] = useState(null);
    const [upgradeError, setUpgradeError] = useState(null);

    // Countdown effect for the resend button
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // Auto-scroll to top when success screen mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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

    const handleUpgrade = async (e) => {
        e.preventDefault();
        setUpgrading(true);
        setUpgradeError(null);
        
        try {
            const res = await booking.upgradeToUser(password);
            if (res.success) {
                setUpgradeResult(true);
            } else {
                setUpgradeError(res.message);
            }
        } catch (err) {
            setUpgradeError("An unexpected error occurred.");
        } finally {
            setUpgrading(false);
        }
    };

    return (
        <div className="w-full max-w-[550px] mx-auto animate-in fade-in zoom-in-95 duration-700">
            {/* Success Card */}
            <div className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-[40px] p-6 sm:p-10 shadow-theme-xl overflow-hidden relative">
                {/* Celebratory Gradient Header */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"></div>

                {/* Header Section */}
                <div className='mb-8 text-center'>
                    <div className='w-20 h-20 bg-brand-50 dark:bg-brand-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-100 dark:border-brand-500/20 shadow-theme-sm rotate-3 animate-bounce-subtle'>
                        <CheckCircle className='w-10 h-10 text-brand-500' />
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-3'>
                        Great, you're all set!
                    </h2>
                    <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium px-4'>
                        Your booking request has been received. Check your email for confirmation details.
                    </p>
                </div>

                {/* Status Badge */}
                <div className='bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-3xl p-5 mb-8'>
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="grow">
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">Identity Verified</h4>
                            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium'>
                                Your request is now being reviewed by our clinic staff.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Confirmation Footer Information */}
                <div className='bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 text-center border border-gray-100 dark:border-gray-800'>
                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed'>
                        We've sent a detailed confirmation to your email. Please present the booking ID at the clinic if requested.
                    </p>
                </div>

                {/* Primary Action */}
                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={onReset}
                        className='w-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-brand-500/20 text-[10px] sm:text-base uppercase tracking-widest flex items-center justify-center gap-3'
                    >
                        <CalendarPlus size={20} />
                        Book Another Appointment
                    </button>
                </div>
            </div>

            {/* Secondary Navigation (Outside the card) */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => navigate('/')}
                    className='group flex items-center gap-3 px-8 py-3 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-theme-md'
                >
                    <HomeIcon size={18} className="transition-transform group-hover:-translate-y-0.5" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Return to Home</span>
                </button>
            </div>
        </div>
    );
};

export default GuestBookingSuccess;

