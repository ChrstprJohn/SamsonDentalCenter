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

    const ReviewSection = ({ title, icon: Icon, children, onEditClick }) => (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-theme-xs mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                        <Icon size={16} />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">{title}</h3>
                </div>
                <button 
                    onClick={onEditClick}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-brand-500/80 hover:text-brand-500 uppercase tracking-wider transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/5"
                >
                    <Edit2 size={12} />
                    Edit
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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

            <div className='max-w-5xl space-y-6'>
                {/* 1. Service Selection */}
                <ReviewSection title="Service Selection" icon={Stethoscope} onEditClick={() => onEdit(0)}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-theme-xs">
                            <Stethoscope size={24} className="text-brand-500" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Selected Treatment</span>
                            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                                {formData.service_name || 'No service selected'}
                            </span>
                        </div>
                    </div>
                </ReviewSection>

                {/* 2. Date & Time */}
                <ReviewSection title="Date & Time" icon={Calendar} onEditClick={() => onEdit(1)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-theme-xs">
                                <Calendar size={22} className="text-brand-500" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Appointment Date</span>
                                <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                                    {formatDate(formData.date)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-theme-xs">
                                <Clock size={22} className="text-brand-500" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Selected Timeslot</span>
                                <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                                    {formData.time || 'Not selected'}
                                </span>
                            </div>
                        </div>
                    </div>
                </ReviewSection>

                {/* 3. Your Information */}
                <ReviewSection title="Your Information" icon={User} onEditClick={() => onEdit(2)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <User size={12} className="text-brand-500/70" />
                                Full Name
                            </div>
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white block uppercase tracking-tight">
                                {formData.full_name}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Mail size={12} className="text-brand-500/70" />
                                Email Address
                            </div>
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white block truncate uppercase tracking-tight">
                                {formData.email}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Phone size={12} className="text-brand-500/70" />
                                Phone Number
                            </div>
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white block uppercase tracking-tight">
                                {formData.phone}
                            </span>
                        </div>
                    </div>
                </ReviewSection>

                {/* Verification Email Highlight Banner */}
                <div className='bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-500'>
                    <div className="flex gap-5 items-start">
                        <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                            <MailWarning size={24} />
                        </div>
                        <div className="grow">
                            <h4 className="text-base font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Action Required: Verification Email</h4>
                            <p className='text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                                A verification email will be sent to <strong className="text-brand-600 dark:text-brand-400 border-b-2 border-brand-500/10">{formData.email}</strong>. 
                                You <strong className="text-gray-900 dark:text-white font-black">must click the link</strong> in that email to confirm your request. 
                                Verified requests are then reviewed by our clinic staff for final approval.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Navigation Controls */}
            <div className='flex justify-between items-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-800'>
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-sm px-8 py-3 transition-colors disabled:opacity-30 uppercase tracking-widest'
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className='group bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black
                               px-12 py-4.5 rounded-2xl transition-all shadow-theme-lg
                               disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 text-base uppercase tracking-widest'
                >
                    {submitting ? (
                        <>
                            <div className='w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin' />
                            Finalizing...
                        </>
                    ) : (
                        <>
                            Confirm Booking
                            <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ConfirmStep;
