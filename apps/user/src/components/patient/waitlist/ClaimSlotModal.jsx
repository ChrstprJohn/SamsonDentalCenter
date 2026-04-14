import React from 'react';
import { Modal } from '../../ui/Modal';
import { ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';

const ClaimSlotModal = ({ isOpen, onClose, slot, onConfirm, loading }) => {
    if (!slot) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    const hasPrimary = !!slot.backup_appointment;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className='max-w-[650px]'>
            <div className='p-6 sm:p-10 space-y-10'>
                <div className='text-center space-y-3'>
                    <h3 className='text-3xl font-black font-outfit text-gray-900 dark:text-white uppercase tracking-tight'>
                        Claim Your EARLIER Slot
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 font-medium max-w-[400px] mx-auto'>
                        You've been offered a premium slot for <strong>{slot.service_name}</strong>. Swap your time now!
                    </p>
                </div>

                {/* Comparison Row */}
                <div className='flex items-center justify-between gap-4 sm:gap-8'>
                    {/* 1. Primary Appointment (Left - Light) */}
                    <div className='flex-1 relative group'>
                        <div className={`p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all ${hasPrimary ? 'opacity-50 grayscale-[0.5]' : 'opacity-30'}`}>
                            <span className='absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-200 dark:bg-gray-800 text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest'>
                                Current Plan
                            </span>
                            {hasPrimary ? (
                                <div className='space-y-1 py-2'>
                                    <p className='text-base font-bold text-slate-600 dark:text-slate-300'>{formatDate(slot.backup_appointment.appointment_date)}</p>
                                    <p className='text-sm font-medium text-slate-400 uppercase tracking-tighter'>{formatTime(slot.backup_appointment.start_time)}</p>
                                </div>
                            ) : (
                                <p className='text-sm font-bold text-slate-400 py-4 italic'>No Primary Set</p>
                            )}
                        </div>
                    </div>

                    {/* 2. Transition Arrow (Middle) */}
                    <div className='shrink-0 flex flex-col items-center gap-2'>
                        <div className='w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 animate-pulse'>
                            <ArrowRight size={24} strokeWidth={3} />
                        </div>
                    </div>

                    {/* 3. New Slot (Right - Target) */}
                    <div className='flex-1 relative'>
                        <div className='p-6 rounded-[2.5rem] border-2 border-brand-500 bg-brand-500/[0.03] dark:bg-brand-500/[0.1] shadow-2xl shadow-brand-500/20 flex flex-col items-center justify-center text-center overflow-hidden animate-in zoom-in duration-500'>
                            {/* Shine effect */}
                            <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none' />
                            
                            <span className='absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-brand-500/30'>
                                New Earlier Slot
                            </span>
                            <div className='space-y-1 py-2'>
                                <p className='text-lg font-black text-gray-900 dark:text-white'>{formatDate(slot.preferred_date)}</p>
                                <p className='text-base font-black text-brand-500 uppercase tracking-wider'>{formatTime(slot.preferred_time)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Caution */}
                <div className='relative overflow-hidden p-6 rounded-[2rem] bg-amber-500/[0.03] border border-amber-500/20 group'>
                    <div className='relative z-10 flex items-start gap-4'>
                        <div className='p-2.5 rounded-xl bg-amber-500/10 text-amber-600'>
                            <AlertTriangle size={20} />
                        </div>
                        <div className='space-y-1'>
                            <p className='text-[10px] font-black uppercase tracking-widest text-amber-600/60'>Irreversible Action</p>
                            <p className='text-sm text-amber-900/80 dark:text-amber-400 font-bold leading-relaxed'>
                                Confirming this will permanently swap your {hasPrimary ? 'original appointment' : 'booking'} to the new earlier slot. This cannot be undone.
                            </p>
                        </div>
                    </div>
                    {/* Decoration bubble */}
                    <div className='absolute -bottom-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full' />
                </div>

                <div className='flex flex-col sm:flex-row gap-4'>
                    <button 
                        onClick={onClose}
                        disabled={loading}
                        className='flex-1 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all rounded-2xl disabled:opacity-50'
                    >
                        Maybe Later
                    </button>
                    <button 
                        disabled={loading}
                        className='flex-[1.5] flex items-center justify-center gap-3 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white bg-brand-500 hover:bg-brand-600 transition-all rounded-2xl shadow-[0_20px_40px_-15px_rgba(var(--brand-500-rgb),0.3)] active:scale-95 disabled:opacity-50'
                        onClick={() => onConfirm(slot.id)}
                    >
                        {loading ? <Loader2 className='animate-spin' size={20} /> : (
                            <>
                                Claim This slot
                                <ArrowRight size={20} strokeWidth={3} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ClaimSlotModal;
