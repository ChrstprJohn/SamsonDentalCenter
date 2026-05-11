import { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    Stethoscope, 
    ShieldCheck, 
    AlertCircle, 
    RefreshCw,
    Edit2,
    MessageSquare,
    CheckCircle2,
    Users,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserReviewStep = ({ formData, book_for_others, onSubmit, onBack, onEdit, submitting, error }) => {
    const { user } = useAuth();
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        if (error) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not selected';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) { return dateString; }
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
        } catch (e) { return timeString; }
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        try { await onSubmit(); } finally { setIsRetrying(false); }
    };

    const ReviewSection = ({ title, children, onEditClick, icon: Icon }) => (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-theme-xs mb-6">
            <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-brand-500" />}
                    <h3 className="text-[14px] sm:text-lg font-bold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>
                <button
                    onClick={onEditClick}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white dark:bg-gray-800 px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/[0.03] transition-all shadow-theme-xs active:scale-95 shrink-0"
                >
                    <Edit2 size={11} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
                    Edit
                </button>
            </div>
            <div className="p-6 sm:p-8">
                {children}
            </div>
        </div>
    );

    const getPatientName = () => {
        if (formData.booked_for_first_name) {
            return `${formData.booked_for_last_name}, ${formData.booked_for_first_name} ${formData.booked_for_middle_name || ''} ${formData.booked_for_suffix_name || ''}`.replace(/\s+/g, ' ').trim();
        }
        return user?.first_name ? `${user.last_name}, ${user.first_name}` : user?.full_name || 'Patient';
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-[60px] sm:pb-6">
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight'>
                    Review Your Appointment Details
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium'>
                    Please double-check your appointment schedule and information before submitting your request for approval.
                </p>
            </div>

            {error && (
                <div className='bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/20 text-red-700 dark:text-red-400 p-5 rounded-3xl mb-8 animate-in shake duration-500'>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-1">Submission Error</h4>
                            <p className="text-sm font-bold leading-relaxed">{error}</p>
                            <button onClick={handleRetry} disabled={submitting || isRetrying} className='mt-3 flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-[11px] font-black rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest'>
                                {submitting || isRetrying ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='space-y-6'>
                <ReviewSection title="Treatment" onEditClick={() => onEdit(0)} icon={Stethoscope}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Service</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{formData.service_name}</p>
                        </div>
                        {formData.service_duration && (
                            <div className="sm:text-right">
                                <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Duration</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">{formData.service_duration} Minutes</p>
                            </div>
                        )}
                    </div>
                </ReviewSection>

                <ReviewSection title="Schedule" onEditClick={() => onEdit(1)} icon={Calendar}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Date</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                {formatDate(formData.date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Time</p>
                            <p className="text-lg font-black text-brand-500 flex items-center gap-2">
                                <Clock size={20} />
                                {formatTime(formData.time)}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                <ReviewSection title="Patient Info" onEditClick={() => onEdit(2)} icon={User}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="sm:col-span-2">
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Patient Name</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white truncate">{getPatientName()}</p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Relationship</p>
                            <p className="text-base font-bold text-gray-700 dark:text-gray-300">{formData.booked_for_relationship || 'Self'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Sex</p>
                            <p className="text-base font-bold text-gray-700 dark:text-gray-300">{formData.booked_for_sex === 'M' ? 'Male' : formData.booked_for_sex === 'F' ? 'Female' : 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Contact Email</p>
                            <p className="text-base font-bold text-gray-700 dark:text-gray-300 break-all">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-[11px] sm:text-xs font-black text-gray-400 mb-1 leading-none">Contact Phone</p>
                            <p className="text-base font-bold text-gray-700 dark:text-gray-300">{formData.booked_for_phone || user?.phone}</p>
                        </div>
                        {formData.patient_note && (
                            <div className="sm:col-span-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <MessageSquare size={12} /> Patient Note
                                </p>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 italic leading-relaxed">"{formData.patient_note}"</p>
                            </div>
                        )}
                    </div>
                </ReviewSection>
            </div>

            <div className='fixed bottom-0 left-0 right-0 sm:relative z-40 px-6 py-4 sm:px-0 sm:py-0 sm:mt-10 sm:pt-6 bg-white/95 dark:bg-gray-900/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-gray-100 dark:border-gray-800 sm:border-t-0 shadow-theme-md sm:shadow-none transition-all'>
                <div className='flex items-center gap-3 w-full sm:justify-between'>
                    <button 
                        onClick={onBack} 
                        disabled={submitting} 
                        className='flex-1 sm:flex-none sm:min-w-[120px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[11px] sm:text-sm px-6 py-3.5 sm:px-8 transition-colors bg-gray-50 dark:bg-gray-800 sm:bg-transparent rounded-2xl border border-transparent shadow-theme-xs disabled:opacity-30'
                    >
                        Back to Info
                    </button>
                    <button 
                        onClick={onSubmit} 
                        disabled={submitting} 
                        className='flex-[2] sm:flex-none sm:min-w-[240px] group bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-6 py-3.5 sm:px-10 sm:py-4.5 rounded-2xl transition-all shadow-theme-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-3 text-[11px] sm:text-base'
                    >
                        {submitting ? (
                            <><Loader2 size={20} className="animate-spin" /> Confirming...</>
                        ) : (
                            <>
                                Confirm Appointment 
                                <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserReviewStep;
