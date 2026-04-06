import { useNavigate } from 'react-router-dom';
import { 
    Clock, 
    Calendar, 
    ShieldCheck, 
    Info, 
    ArrowRight,
    LayoutDashboard,
    Stethoscope
} from 'lucide-react';

const UserBookingSuccess = ({ result, onReset }) => {
    const navigate = useNavigate();

    // Determine success type based on result payload
    const bookingResult = result?.bookingData || (result?.booked ? result : null);
    const waitlistResult = result?.waitlistData?.waitlist_entry || result?.waitlistData;
    
    const hasBooking = !!bookingResult?.booked || !!bookingResult?.id || !!bookingResult?.appointment;
    const hasWaitlist = !!waitlistResult;
    const isPending = bookingResult?.status === 'PENDING' || bookingResult?.requires_approval || bookingResult?.approval_status === 'pending';
    const isDualSelection = hasBooking && hasWaitlist;

    // Time Formatting Helper (e.g. 09:00:00 -> 9:00 AM)
    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            // Remove seconds if present
            const parts = timeString.split(':');
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedHour = h % 12 || 12;
            const formattedMinute = m < 10 ? `0${m}` : m;
            return `${formattedHour}:${formattedMinute} ${ampm}`;
        } catch (e) {
            return timeString;
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
            {/* Header Section: Fluid & Responsive */}
            <div className='mb-8 sm:mb-10 text-left'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase leading-tight'>
                    Booking Request Received!
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-medium'>
                    Your request is under review. Please wait at least 24 hours while we notify you of your status.
                </p>
            </div>

            {/* Request Detail Cards: Optimized Grid - Full width for single, Side-by-Side for Dual */}
            <div className={`grid ${isDualSelection ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-1 w-full'} gap-3 sm:gap-6 mb-8`}>
                {/* Primary Request Card */}
                {hasBooking && (
                    <div className="p-4 sm:p-6 border border-gray-200 rounded-[1.5rem] sm:rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800/80">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <Stethoscope size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <h3 className="text-[11px] sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                    Primary Request
                                </h3>
                            </div>
                            {(bookingResult.appointment?.id || bookingResult.id) && (
                                <span className='hidden sm:block px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[10px] sm:text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest'>
                                    ID: {(bookingResult.appointment?.id || bookingResult.id).slice(0, 8).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 sm:space-y-5 flex-grow">
                            <div>
                                <p className="mb-1 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Service
                                </p>
                                <p className="text-[12px] sm:text-[14px] md:text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate sm:whitespace-normal">
                                    {bookingResult.appointment?.service?.name || bookingResult.appointment?.service || bookingResult.service?.name || bookingResult.service_name || 'Treatment'}
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="mb-1 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Requested Date
                                    </p>
                                    <div className='flex items-center gap-1.5 text-gray-900 dark:text-white'>
                                        <Calendar size={13} className="text-brand-500 shrink-0" />
                                        <p className="text-[11px] sm:text-[13px] md:text-[14px] font-bold whitespace-nowrap">
                                            {bookingResult.appointment?.appointment_date || bookingResult.appointment?.date || bookingResult.date}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Requested Time
                                    </p>
                                    <div className='flex items-center gap-1.5 text-gray-900 dark:text-white'>
                                        <Clock size={13} className="text-brand-500 shrink-0" />
                                        <p className="text-[11px] sm:text-[13px] md:text-[14px] font-bold">
                                            {formatTime(bookingResult.appointment?.start_time || bookingResult.appointment?.time || bookingResult.time)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-5 pt-4 border-t border-gray-50 dark:border-gray-800/50'>
                            <p className={`text-[9px] sm:text-[11px] font-black uppercase tracking-widest ${isPending ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {isPending ? '⏳ Awaiting Approval' : '✅ Confirmed'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Waitlist Request Card */}
                {hasWaitlist && (
                    <div className="p-4 sm:p-6 border border-gray-200 rounded-[1.5rem] sm:rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800/80">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Clock size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <h3 className="text-[11px] sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                    Waitlist Request
                                </h3>
                            </div>
                            {waitlistResult.id && (
                                <span className='hidden sm:block px-3 py-1 bg-blue-50/50 dark:bg-blue-500/10 rounded-lg text-[10px] sm:text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest'>
                                    WID: {waitlistResult.id.slice(0, 8).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 sm:space-y-5 flex-grow">
                            <div>
                                <p className="mb-1 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Service
                                </p>
                                <p className="text-[12px] sm:text-[14px] md:text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate sm:whitespace-normal">
                                    {waitlistResult.service_name || waitlistResult.service || 'Treatment'}
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="mb-1 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Preferred Date
                                    </p>
                                    <div className='flex items-center gap-1.5 text-gray-900 dark:text-white'>
                                        <Calendar size={13} className="text-blue-500 shrink-0" />
                                        <p className="text-[11px] sm:text-[13px] md:text-[14px] font-bold whitespace-nowrap">
                                            {waitlistResult.preferred_date || waitlistResult.date}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Preferred Time
                                    </p>
                                    <div className='flex items-center gap-1.5 text-gray-900 dark:text-white'>
                                        <Clock size={13} className="text-blue-500 shrink-0" />
                                        <p className="text-[11px] sm:text-[13px] md:text-[14px] font-bold">
                                            {formatTime(waitlistResult.preferred_time || waitlistResult.time)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-5 pt-4 border-t border-gray-50 dark:border-gray-800/50'>
                            <p className='text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-blue-600'>
                                ⏳ Position #{waitlistResult.position || result.waitlistData?.position || '1'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Informational Bulleted Pathway (Keeps its own section) */}
            <div className='bg-brand-50/30 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-2xl p-6 sm:p-8 mb-10 overflow-hidden'>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                            <Info size={22} className="sm:w-6 sm:h-6" />
                        </div>
                        <h4 className="text-[15px] sm:text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                            What Happens Next?
                        </h4>
                    </div>
                    
                    <ul className='space-y-4 text-[13px] sm:text-[14px] md:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium min-w-0'>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2.5 shrink-0" />
                            <p><strong>Clinic Approval:</strong> Our team will review your primary appointment request (usually within 24 hours).</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2.5 shrink-0" />
                            <p><strong>Waitlist Updates:</strong> We will email you immediately if your waitlisted time slot becomes available.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2.5 shrink-0" />
                            <p><strong>Manage Your Booking:</strong> You can visit your dashboard anytime to check your status, view details, reschedule, or cancel. </p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Responsive Navigation Footer */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 pt-8 border-t border-gray-100 dark:border-gray-800'>
                <button
                    onClick={() => {
                        onReset();
                        navigate('/');
                    }}
                    className='w-full sm:w-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[13px] sm:text-sm px-6 py-4 transition-colors uppercase tracking-widest'
                >
                    Go to Home
                </button>
                <button
                    onClick={() => {
                        onReset();
                        navigate('/patient/dashboard');
                    }}
                    className='w-full sm:w-auto group bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black
                               px-10 py-4.5 rounded-2xl transition-all shadow-theme-lg
                               flex items-center justify-center gap-3 text-[14px] sm:text-base uppercase tracking-widest'
                >
                    <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                    Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default UserBookingSuccess;
