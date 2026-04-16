import { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    Stethoscope, 
    ShieldCheck, 
    Info, 
    AlertCircle, 
    RefreshCw,
    Edit2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserReviewStep = ({ formData, book_for_others, onSubmit, onBack, onEdit, submitting, error }) => {
    const { user } = useAuth();
    const [isRetrying, setIsRetrying] = useState(false);

    // Auto-scroll to top on error
    useEffect(() => {
        if (error) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error]);

    // Determine scenario
    const hasBooking = formData?.time;
    const hasWaitlist = formData?.waitlist_time;
    const isWaitlistOnly = hasWaitlist && !hasBooking;
    const isDualSelection = hasBooking && hasWaitlist;
    const isSpecialized = formData.service_tier === 'specialized';

    // Formatting for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Not selected';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Not selected';
        try {
            const [hours, minutes] = timeString.split(':');
            const h = parseInt(hours, 10);
            const m = parseInt(minutes, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedHour = h % 12 || 12;
            const formattedMinute = m < 10 ? `0${m}` : m;
            return `${formattedHour}:${formattedMinute} ${ampm}`;
        } catch (e) {
            return timeString;
        }
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await onSubmit();
        } finally {
            setIsRetrying(false);
        }
    };

    const ReviewSection = ({ title, children, onEditClick }) => (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800/80 lg:mb-6 lg:pb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {title}
                </h4>
                <button
                    onClick={onEditClick}
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[13px] sm:text-sm font-semibold text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-white/[0.03] dark:hover:text-white transition-colors shrink-0"
                >
                    <Edit2 size={14} className="text-gray-500 dark:text-gray-400" />
                    Edit
                </button>
            </div>
            <div className="w-full">
                {children}
            </div>
        </div>
    );

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase'>
                    Review Your Request
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-medium'>
                    Please carefully review your appointment details and patient information before final submission.
                </p>
            </div>

            {error && (
                <div className='bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/20 text-red-700 dark:text-red-400 p-5 rounded-3xl mb-8 animate-in shake duration-500'>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Submission Error</h4>
                            <p className="text-sm opacity-90 break-words leading-relaxed font-medium">
                                {error}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-3'>
                        <button
                            onClick={handleRetry}
                            disabled={submitting || isRetrying}
                            className='flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-bold rounded-xl transition-all shadow-theme-md disabled:cursor-not-allowed uppercase tracking-widest'
                        >
                            {submitting || isRetrying ? (
                                <>
                                    <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    Retrying...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={14} />
                                    Retry Submission
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => onEdit(1)} // Back to DateTime
                            disabled={submitting || isRetrying}
                            className='px-6 py-2.5 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold rounded-xl transition-all disabled:opacity-50 uppercase tracking-widest'
                        >
                            Change Selection
                        </button>
                    </div>
                </div>
            )}

            <div className='w-full space-y-6'>
                {/* 1. Service Selection */}
                <ReviewSection title="Service Selection" onEditClick={() => onEdit(0)}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Selected Treatment
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Stethoscope size={16} className="text-brand-500" />
                                {formData.service_name || 'No service selected'}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Duration
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formData.service_duration ? `${formData.service_duration} mins` : '-'}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                {/* 2. Date & Time (Conditional based on hasBooking, hasWaitlist) */}
                <ReviewSection title="Date & Time" onEditClick={() => onEdit(1)}>
                    {hasBooking && (
                        <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 ${isDualSelection ? 'pb-6 border-b border-gray-50 dark:border-gray-800/50 mb-6' : ''}`}>
                            <div className="lg:col-span-2">
                                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                                    Primary Appointment
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Appointment Date
                                </p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Calendar size={16} className="text-brand-500" />
                                    {formatDate(formData.date)}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Selected Timeslot
                                </p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock size={16} className="text-brand-500" />
                                    {formatTime(formData.time)}
                                </p>
                            </div>
                        </div>
                    )}

                    {hasWaitlist && (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
                            <div className="lg:col-span-2">
                                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Waitlist Preference
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Preferred Date
                                </p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 text-amber-700 dark:text-amber-400/90">
                                    <Calendar size={16} className="text-amber-500" />
                                    {formatDate(formData.waitlist_date)}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Preferred Timeslot
                                </p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 text-amber-700 dark:text-amber-400/90">
                                    <Clock size={16} className="text-amber-500" />
                                    {formatTime(formData.waitlist_time)}
                                </p>
                            </div>
                        </div>
                    )}
                </ReviewSection>

                {/* 3. Patient Details */}
                <ReviewSection title="Patient Details" onEditClick={() => onEdit(2)}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
                        <div className="min-w-0">
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Full Name
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
                                <User size={16} className="text-brand-500 shrink-0" />
                                <span className="truncate">
                                    {book_for_others 
                                        ? `${formData.booked_for_last_name || ''}, ${formData.booked_for_first_name || ''} ${formData.booked_for_middle_name || ''} ${formData.booked_for_suffix || formData.booked_for_suffix_name || ''}`.replace(/\s+/g, ' ').trim()
                                        : (user?.first_name ? `${user.last_name}, ${user.first_name} ${user.middle_name || ''} ${user.suffix || ''}`.replace(/\s+/g, ' ').trim() : (user?.full_name || 'Authorized User'))
                                    }
                                </span>
                            </p>
                        </div>
                        <div className='min-w-0'>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Contact Email <span className="opacity-40 font-normal italic text-[9px]">(primary)</span>
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white break-all flex items-center gap-2">
                                <Mail size={16} className="text-brand-500 shrink-0" />
                                {user?.email}
                            </p>
                        </div>
                        {book_for_others && formData.booked_for_phone && (
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Patient Phone
                                </p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Phone size={16} className="text-brand-500" />
                                    {formData.booked_for_phone}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Booking Mode
                            </p>
                            <p className="text-[13px] sm:text-[14px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mt-1">
                                {book_for_others ? 'Representative booking' : 'Direct Booking'}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                {/* Waitlist Only Banner */}
                {isWaitlistOnly && (
                    <div className='bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-500 overflow-hidden'>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                    <AlertCircle size={22} className="sm:w-6 sm:h-6" />
                                </div>
                                <h4 className="text-[15px] sm:text-base md:text-lg font-black text-amber-900 dark:text-white uppercase tracking-tight leading-tight">Waitlist Only Entry</h4>
                            </div>
                            
                            <div className='space-y-4 text-sm text-amber-800 dark:text-amber-100/80 leading-relaxed font-medium'>
                                <p>You are joining the waitlist for <strong className="text-amber-950 dark:text-white">{formatTime(formData.waitlist_time)}</strong>. No appointment is confirmed yet.</p>
                                
                                <ul className="space-y-3 pt-1">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <p>Viewing status: You can monitor your waitlist request and position directly in your patient dashboard.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <p>We'll notify you immediately via email at <strong className="break-all">{user?.email}</strong> if this slot becomes available.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {hasBooking && (
                    <div className={`bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-500 overflow-hidden ${isDualSelection ? 'border-dashed' : ''}`}>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                                    <ShieldCheck size={22} className="sm:w-6 sm:h-6" />
                                </div>
                                <h4 className="text-[15px] sm:text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                                    Clinical Approval Required
                                </h4>
                            </div>
                            
                            <div className='space-y-4 text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                                <p>To ensure the best care, online requests are reviewed by our specialists. We'll verify the schedule and confirm your appointment within 24 hours.</p>
                                
                                <ul className="space-y-3 pt-2">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                        <p>Confirmation sent to <strong className="text-brand-600 dark:text-brand-400 break-all">{user?.email}</strong> and to your account login to see it.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                        <p>Once approved, it will appear in your **Active Appointments**. You can view your active appointment request, see the status, and get updates directly in your patient dashboard.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                        <p>We'll also email you for any updates regarding your appoinments.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Final Navigation Footer */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 mt-8 sm:mt-12 pt-4 sm:pt-6'>
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className='w-full sm:w-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[13px] sm:text-sm px-6 py-3 sm:px-8 transition-colors disabled:opacity-30 uppercase tracking-widest'
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className='w-full sm:w-auto group bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black
                               px-6 py-3.5 sm:px-12 sm:py-4.5 rounded-2xl transition-all shadow-theme-lg
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-[14px] sm:text-base uppercase tracking-widest'
                >
                    {submitting ? (
                        <>
                            <div className='w-4 h-4 sm:w-5 sm:h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin' />
                            {isWaitlistOnly ? 'Adding to Waitlist...' : 'Submitting...'}
                        </>
                    ) : (
                        <>
                            {isWaitlistOnly ? 'Confirm Waitlist' : 'Confirm Booking'}
                            <ShieldCheck size={20} className="sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserReviewStep;
