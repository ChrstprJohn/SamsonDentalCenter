import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Stethoscope, ShieldCheck, MailWarning, Edit2, ArrowRight, Info } from 'lucide-react';

const ConfirmStep = ({ formData, onSubmit, onBack, onEdit, submitting, error }) => {
    // Auto-scroll to top on error
    useEffect(() => {
        if (error) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error]);

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
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-6 overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800/80 lg:mb-6 lg:pb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate min-w-0">
                    {title}
                </h4>
                <button
                    onClick={onEditClick}
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[13px] sm:text-sm font-semibold text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors shrink-0"
                >
                    <Edit2 size={14} className="text-gray-500" />
                    Edit
                </button>
            </div>
            <div className="w-full min-w-0">
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
                        <div className="min-w-0">
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                                Full Name
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white truncate">
                                {formData.first_name ? `${formData.last_name}, ${formData.first_name} ${formData.middle_name || ''} ${formData.suffix_name || ''}`.replace(/\s+/g, ' ').trim() : (formData.full_name || '—')}
                            </p>
                        </div>
                        <div className="min-w-0">
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                                Email Address
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white break-all leading-tight">
                                {formData.email}
                            </p>
                        </div>
                        <div className="min-w-0">
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                                Phone Number
                            </p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formData.phone}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                {/* Verification Email Highlight Banner */}
                <div className='bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-500 overflow-hidden'>
                    <div className="flex flex-col gap-5">
                        {/* Title Bar: Icon + Title */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                                <MailWarning size={22} className="sm:w-6 sm:h-6" />
                            </div>
                            <h4 className="text-[15px] sm:text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                                Action Required: Verify Your Appointment
                            </h4>
                        </div>
                        
                        {/* Detailed Information: Flows Underneath */}
                        <div className='space-y-4 text-[13px] sm:text-[14px] md:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium min-w-0'>
                            <p className="min-w-0 break-words">To secure your booking as a guest, please complete the following verification steps:</p>
                            
                            <ul className="space-y-3 pt-2">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                    <p>A verification link has been sent to <strong className="text-brand-600 dark:text-brand-400 break-all">{formData.email}</strong>.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                    <p>Click the link within **15 minutes** to confirm your request, or it will expire automatically.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                    <p>Once verified, our specialists will review your request. You'll receive a final approval email within 24 hours.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Navigation Controls */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 mt-8 sm:mt-12 pt-4 sm:pt-6'>
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
