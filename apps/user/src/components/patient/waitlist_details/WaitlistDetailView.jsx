import React, { useState } from 'react';
import { ChevronLeft, Zap, Trash2, Calendar, Clock, MapPin, AlertTriangle, X, CheckCircle2, Info, CalendarDays, ArrowRight } from 'lucide-react';
import { Badge } from '../../ui';

const STATUS_MAP = {
    'WAITING': { label: 'Waiting', color: 'info' },
    'OFFER_PENDING': { label: 'Offer Received', color: 'warning' },
    'CONFIRMED': { label: 'Claimed & Swapped', color: 'success' },
    'EXPIRED': { label: 'Expired', color: 'error' },
    'CANCELLED': { label: 'Cancelled', color: 'neutral' }
};

/**
 * Split-View Detail Pane for Waitlist
 * Overhauled with state-specific messaging and premium UX
 */
const WaitlistDetailView = ({ item, onBack, onClaim, onCancel }) => {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    if (!item) return null;

    const status = STATUS_MAP[item.status] || { label: item.status, color: 'neutral' };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatShortDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return 'Anytime';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    const handleCancelClick = () => {
        if (item.backup_appointment_id) {
            setIsCancelModalOpen(true);
        } else {
            onCancel(item.id, {});
        }
    };

    // UI Render Helpers
    const renderStatusBanner = () => {
        switch (item.status) {
            case 'OFFER_PENDING':
                return (
                    <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-400/[0.03] border border-amber-500/20 animate-pulse">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-amber-600 dark:text-amber-500 uppercase tracking-tight leading-none">Slot Available!</h4>
                                <p className="text-sm text-amber-900/70 dark:text-amber-400/80 font-bold leading-relaxed">
                                    We found an earlier opening for you. Claim it now to move your appointment to this earlier time.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'CONFIRMED':
                return (
                    <div className="p-6 rounded-[2rem] bg-success-50 dark:bg-success-400/[0.03] border border-success-500/20">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-success-500 text-white shadow-lg shadow-success-500/20">
                                <CheckCircle2 size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-success-600 dark:text-success-500 uppercase tracking-tight leading-none">Success!</h4>
                                <p className="text-sm text-success-900/70 dark:text-success-400/80 font-bold leading-relaxed">
                                    Your appointment has been successfully moved to this earlier slot. We've notified the team of your update.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'CANCELLED':
                return (
                    <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                        <div className="flex items-start gap-4 opacity-60">
                            <div className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-500">
                                <X size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-gray-500 uppercase tracking-tight leading-none">Request Cancelled</h4>
                                <p className="text-sm text-gray-400 font-bold leading-relaxed">
                                    This waitlist entry is no longer active. Your Primary Appointment (if any) remains secured.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'EXPIRED':
                return (
                    <div className="p-6 rounded-[2rem] bg-red-50 dark:bg-red-400/[0.03] border border-red-500/20">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20">
                                <Clock size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-red-600 dark:text-red-500 uppercase tracking-tight leading-none">Offer Expired</h4>
                                <p className="text-sm text-red-900/70 dark:text-red-400/80 font-bold leading-relaxed">
                                    The claim window for this offer has closed. You remain on the waitlist for future openings!
                                </p>
                            </div>
                        </div>
                    </div>
                );
            default: // WAITING
                return (
                    <div className="p-6 rounded-[2rem] bg-brand-50 dark:bg-brand-400/[0.03] border border-brand-500/10">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                                <Info size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-brand-600 dark:text-brand-500 uppercase tracking-tight leading-none">Watching for Slots</h4>
                                <p className="text-sm text-brand-900/70 dark:text-brand-400/80 font-bold leading-relaxed">
                                    We're monitoring for cancellations. If a slot opens up, we'll notify you here. Claiming an offer will auto-swap your primary appointment.
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className='flex-grow flex flex-col h-full bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
            {/* Action Bar */}
            <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                <button 
                    onClick={onBack}
                    className='p-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors'
                >
                    <ChevronLeft size={20} />
                </button>
                
                <div className='flex items-center gap-2'>
                    {item.status === 'WAITING' && (
                        <button 
                            className='p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
                            onClick={handleCancelClick}
                            title="Cancel Request"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                    <Badge color={status.color}>{status.label}</Badge>
                </div>
            </div>

            {/* Content Area */}
            <div className='p-5 sm:p-8 md:p-10 overflow-y-auto grow no-scrollbar pb-24 sm:pb-8 md:pb-10'>
                <div className='space-y-6 sm:space-y-8'>
                    {/* Header */}
                    <div className='space-y-6'>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                                <Zap size={24} fill="white" />
                            </div>
                            <div>
                                <h2 className='text-[22px] sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-outfit leading-tight tracking-tight uppercase'>
                                    {item.service_name}
                                </h2>
                                <p className="text-[11px] font-black text-brand-500 uppercase tracking-widest">Entry #{item.id.slice(0,8)}</p>
                            </div>
                        </div>

                        {/* Status Messaging Section */}
                        {renderStatusBanner()}

                        <div className='flex items-center gap-6 border-b border-gray-100/50 dark:border-gray-800 pb-8'>
                            {(item.status === 'WAITING' || item.status === 'OFFER_PENDING') && (
                                <div className='flex flex-col'>
                                    <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1'>Current Position</span>
                                    <span className='text-lg font-black text-gray-900 dark:text-white'>
                                        {item.status === 'OFFER_PENDING' ? '#1' : `#${item.position || '?'}`} 
                                        <span className="text-xs text-gray-400 font-bold ml-1">in line</span>
                                    </span>
                                </div>
                            )}
                            <div className='flex flex-col'>
                                <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1'>Joined On</span>
                                <span className='text-lg font-black text-gray-900 dark:text-white'>{formatShortDate(item.joined_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Details Cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-500/10 text-sky-600">
                                    <CalendarDays size={18} />
                                </div>
                                <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Requested waitlist timeslot</span>
                            </div>
                            <p className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                                {formatDate(item.preferred_date)}
                            </p>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600">
                                    <Clock size={18} />
                                </div>
                                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Time Window</span>
                            </div>
                            <p className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                                {formatTime(item.preferred_time)}
                            </p>
                        </div>
                    </div>

                    {/* Primary Appointment Context */}
                    {item.backup_appointment && (
                        <div className={`p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 ${
                            item.status === 'CONFIRMED' 
                            ? 'bg-success-500/[0.04] border-2 border-success-500/20'
                            : 'bg-brand-50 dark:bg-brand-500/[0.02] border-2 border-dashed border-brand-200 dark:border-brand-500/20'
                        }`}>
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Calendar size={80} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="flex items-center gap-2">
                                    <Badge color={item.status === 'CONFIRMED' ? 'success' : 'warning'} className="text-[9px] px-3 py-1 font-black">
                                        {item.status === 'CONFIRMED' ? 'New Swap Confirmed' : 'Primary Appointment Secured'}
                                    </Badge>
                                </div>

                                {item.status === 'CONFIRMED' ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Was booked for</span>
                                                <span className="text-sm font-bold text-slate-500 line-through decoration-red-500/50 opacity-60">
                                                    {formatShortDate(item.backup_appointment.appointment_date)} @ {formatTime(item.backup_appointment.start_time)}
                                                </span>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-300 mt-4" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-success-500 uppercase tracking-widest">Now moved to</span>
                                                <span className="text-sm font-black text-success-600 dark:text-success-400">
                                                    {formatShortDate(item.preferred_date)} @ {formatTime(item.preferred_time)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed border-t border-success-500/10 pt-4">
                                            Success! Since you claimed this opening, your Primary Appointment was automatically swapped to the earlier slot.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                                            You currently have a Primary Appointment for <span className="text-brand-600">{formatShortDate(item.backup_appointment.appointment_date)}</span> at <span className="text-brand-600">{formatTime(item.backup_appointment.start_time)}</span>.
                                        </p>
                                        
                                        {item.status !== 'CANCELLED' && item.status !== 'EXPIRED' && (
                                            <p className="text-[11px] text-slate-400 bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-white/5 font-medium leading-relaxed italic">
                                                <span className="font-bold text-slate-500 dark:text-slate-300 not-italic">Swap Rule:</span> If you claim an earlier slot, this existing appointment will be automatically cancelled to free up space for others.
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Quick Actions Footer */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-20 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none'>
                <div className='flex items-center gap-3 w-full'>
                    <div className='hidden sm:block sm:w-1/2'></div>
                    <div className='flex flex-1 gap-3 sm:justify-end'>
                        {item.status === 'OFFER_PENDING' ? (
                            <button 
                                onClick={() => onClaim(item)}
                                className='flex-1 sm:flex-none sm:min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20 active:scale-95'
                            >
                                <Zap size={18} fill="currentColor" />
                                Claim Slot
                            </button>
                        ) : item.status === 'WAITING' ? (
                            <button 
                                onClick={handleCancelClick}
                                className='flex-1 sm:flex-none sm:min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 dark:bg-white/[0.05] text-red-500 text-[12px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all'
                            >
                                <Trash2 size={18} />
                                Cancel Request
                            </button>
                        ) : (
                            <div className="flex-1 text-center py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Status: {status.label}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Local Cancel Modal */}
            {isCancelModalOpen && (
                <div className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
                    <div className='w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300'>
                        <div className='text-center space-y-2'>
                            <div className='w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-4'>
                                <AlertTriangle size={32} className='text-amber-500' />
                            </div>
                            <h3 className='text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>
                                Partial or Full Removal?
                            </h3>
                            <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium'>
                                You have a Primary Appointment secured. What should happen to it?
                            </p>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <button
                                onClick={() => {
                                    onCancel(item.id, { removeBackup: true });
                                    setIsCancelModalOpen(false);
                                }}
                                className='w-full py-5 px-4 rounded-2xl bg-red-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20'
                            >
                                Cancel Both
                            </button>
                            <button
                                onClick={() => {
                                    onCancel(item.id, { removeBackup: false });
                                    setIsCancelModalOpen(false);
                                }}
                                className='w-full py-5 px-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all'
                            >
                                Only Remove Waitlist
                            </button>
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className='w-full py-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors'
                            >
                                Nevermind
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaitlistDetailView;
