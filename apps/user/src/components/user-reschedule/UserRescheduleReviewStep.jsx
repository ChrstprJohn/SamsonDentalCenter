import { ArrowLeft, ArrowRight, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate, formatTime } from '../../hooks/useAppointments';

const UserRescheduleReviewStep = ({ formData, appointment, onSubmit, onBack, submitting, error }) => {
    // Helper to extract appointment values
    const serviceName = appointment?.service?.name || appointment?.service || '—';
    
    // Formatting new selections
    const newDateStr = formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';
    const newTimeStr = formData.time ? formatTime(formData.time) : '—';
    
    // Formatting old selections
    const oldDateStr = appointment?.appointment_date ? new Date(appointment.appointment_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';
    const oldTimeStr = appointment?.start_time ? formatTime(appointment.start_time) : '—';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-display uppercase tracking-tight">
                    Review Changes
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Please review your new appointment time.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-theme-sm mb-8 space-y-6">
                <div>
                    <h3 className="text-xs font-black text-slate-400 dark:text-gray-500 mb-2 uppercase tracking-widest">Service</h3>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{serviceName}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Current Appointment</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <Calendar size={18} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Date</p>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{oldDateStr}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <Clock size={18} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Time</p>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{oldTimeStr}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-brand-50/50 dark:bg-brand-500/5 rounded-2xl border border-brand-100 dark:border-brand-500/20 relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center z-10 hidden md:flex">
                            <ArrowRight size={12} className="text-brand-500" />
                        </div>
                        <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 mb-4 uppercase tracking-wider">New Appointment</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <Calendar size={18} className="text-brand-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Date</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{newDateStr}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <Clock size={18} className="text-brand-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Time</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{newTimeStr}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className="w-full sm:w-auto text-gray-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white font-black text-[11px] px-8 py-4 transition-colors uppercase tracking-[0.2em] disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-10 py-4.5 rounded-2xl transition-all shadow-xl shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm uppercase tracking-[0.1em]"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Confirming...
                        </>
                    ) : (
                        'Confirm Reschedule'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserRescheduleReviewStep;
