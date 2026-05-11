import { useNavigate } from 'react-router-dom';
import { 
    Clock, 
    Calendar, 
    ShieldCheck, 
    Info, 
    ArrowRight,
    LayoutDashboard,
    Stethoscope,
    CheckCircle2
} from 'lucide-react';

const UserBookingSuccess = ({ result, onReset }) => {
    const navigate = useNavigate();

    const bookingResult = result?.bookingData || (result?.booked ? result : null);
    const hasBooking = !!bookingResult?.booked || !!bookingResult?.id || !!bookingResult?.appointment;
    const isPending = bookingResult?.status === 'PENDING' || bookingResult?.requires_approval || bookingResult?.approval_status === 'pending';

    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            const parts = timeString.split(':');
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedHour = h % 12 || 12;
            const formattedMinute = m < 10 ? `0${m}` : m;
            return `${formattedHour}:${formattedMinute} ${ampm}`;
        } catch (e) { return timeString; }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 pb-[60px] sm:pb-0">
            <div className='mb-10 text-center sm:text-left'>
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-6">
                    <CheckCircle2 size={44} className="text-emerald-500" />
                </div>
                <h2 className='text-lg sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 sm:mb-3'>
                    Thank you for choosing Us!
                </h2>
                <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-medium mx-auto sm:mx-0'>
                    Your appointment request has been successfully submitted and is currently being reviewed by our clinical team.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-10">
                <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-theme-xs">
                    <div className="px-8 py-5 border-b border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-transparent flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-brand-500" />
                            <h3 className="text-[14px] sm:text-lg font-bold text-gray-900 dark:text-white">Request Summary</h3>
                        </div>
                        {bookingResult?.id && (
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                                Ref: {bookingResult.id.slice(0, 8).toUpperCase()}
                            </span>
                        )}
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Service</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {bookingResult?.appointment?.service?.name || bookingResult?.service_name || 'Treatment'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Patient</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {bookingResult?.appointment?.last_name 
                                    ? `${bookingResult.appointment.last_name}, ${bookingResult.appointment.first_name}`.trim()
                                    : bookingResult?.booked_for_name || 'Self'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Date</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Calendar size={18} className="text-brand-500" />
                                {bookingResult?.appointment?.appointment_date || bookingResult?.date}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Time</p>
                            <p className="text-lg font-black text-brand-500 flex items-center gap-2">
                                <Clock size={18} />
                                {formatTime(bookingResult?.appointment?.start_time || bookingResult?.time)}
                            </p>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-black text-gray-400 leading-none">Current Status</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Clock size={12} />
                            Awaiting Approval
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-brand-50/30 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-[2rem] p-8 mb-10'>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <Info size={24} />
                    </div>
                    <h4 className="text-[14px] sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">What happens now?</h4>
                </div>
                <ul className='space-y-4'>
                    <li className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                        <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium"><strong>Clinical Review:</strong> Our administrative team will review your request against the clinical schedule (usually within 24 hours).</p>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                        <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium"><strong>Notification:</strong> You will receive an email and a push notification once your appointment is confirmed or if any changes are needed.</p>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                        <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium"><strong>Manage Online:</strong> You can check your appointment status, reschedule, or cancel anytime through your dashboard.</p>
                    </li>
                </ul>
            </div>

            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 pt-8 border-t border-slate-100 dark:border-gray-800'>
                <button
                    onClick={() => { onReset(); navigate('/'); }}
                    className='w-full sm:w-auto text-slate-500 hover:text-slate-900 font-black text-[11px] px-8 py-4 uppercase tracking-widest transition-colors'
                >
                    Back to Home
                </button>
                <button
                    onClick={() => { onReset(); navigate('/patient'); }}
                    className='w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-10 py-4.5 rounded-2xl transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-3 text-xs uppercase tracking-widest group'
                >
                    <LayoutDashboard size={18} />
                    View Dashboard
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default UserBookingSuccess;
