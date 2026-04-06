import { Calendar, Clock, User, Mail, Phone, Stethoscope, ShieldCheck, MailWarning, Edit2, ArrowRight } from 'lucide-react';

const ConfirmStep = ({ formData, onSubmit, onBack, onEdit, submitting, error }) => {

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

    const ReviewSection = ({ title, children, onEditClick }) => (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800/80 lg:mb-6 lg:pb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {title}
                </h4>
                <button
                    onClick={onEditClick}
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[13px] sm:text-sm font-semibold text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors shrink-0"
                >
                    <svg
                        className="fill-current w-4 h-4"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill=""
                        />
                    </svg>
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
                    Please carefully review your appointment details before submitting for approval.
                </p>
            </div>

            {error && (
                <div className='bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-700 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-bold mb-8 flex gap-3 items-center animate-in shake duration-500'>
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <Info size={16} />
                    </div>
                    {error}
                </div>
            )}

            <div className='w-full space-y-6'>
                {/* 1. Service Selection */}
                <ReviewSection title="Service Selection" onEditClick={() => onEdit(0)}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Selected Treatment
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formData.service_name || 'No service selected'}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Duration
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formData.service_duration ? `${formData.service_duration} mins` : '-'}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                {/* 2. Date & Time */}
                <ReviewSection title="Date & Time" onEditClick={() => onEdit(1)}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Appointment Date
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formatDate(formData.date)}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Selected Timeslot
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formatTime(formData.time)}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                {/* 3. Your Information */}
                <ReviewSection title="Your Information" onEditClick={() => onEdit(2)}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Full Name
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formData.full_name}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Email Address
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white truncate">
                                {formData.email}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Phone Number
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formData.phone}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                {/* Verification Email Highlight Banner */}
                <div className='bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-500'>
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                            <MailWarning size={24} />
                        </div>
                        <div className="grow w-full">
                            <h4 className="text-[15px] sm:text-base md:text-lg font-black text-gray-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-tight">Action Required: Verify Your Appointment</h4>
                            <div className='space-y-4 text-[13px] sm:text-[14px] md:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                                <p>A verification link has been sent to <strong className="text-brand-600 dark:text-brand-400 border-b-2 border-brand-500/10 break-all">{formData.email}</strong>.</p>
                                
                                <div>
                                    <strong className="text-gray-900 dark:text-white font-black block mb-0.5">What you need to do:</strong>
                                    <p>Click the email link within 15 minutes to confirm your request, or it will expire.</p>
                                </div>

                                <div>
                                    <strong className="text-gray-900 dark:text-white font-black block mb-0.5">Next Steps:</strong>
                                    <p>Once verified, our staff will review your request. You'll receive an email as soon as it's approved.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Navigation Controls */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-800'>
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className='w-full sm:w-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[13px] sm:text-sm px-6 py-3 sm:px-8 sm:py-3 transition-colors disabled:opacity-30 uppercase tracking-widest'
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className='w-full sm:w-auto group bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black
                               px-6 py-3.5 sm:px-12 sm:py-4.5 rounded-2xl transition-all shadow-theme-lg
                               disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-[14px] sm:text-base uppercase tracking-widest'
                >
                    {submitting ? (
                        <>
                            <div className='w-4 h-4 sm:w-5 sm:h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin' />
                            Finalizing...
                        </>
                    ) : (
                        <>
                            Confirm Booking
                            <ShieldCheck size={20} className="sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ConfirmStep;
