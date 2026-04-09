import React from 'react';
import { Modal } from '../../ui/Modal';
import { ArrowRight, Calendar, Clock, AlertTriangle } from 'lucide-react';

const ClaimSlotModal = ({ isOpen, onClose, slot }) => {
    if (!slot) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className='max-w-[600px]'>
            <div className='p-6 sm:p-8 space-y-8'>
                <div className='text-center space-y-2'>
                    <h3 className='text-2xl font-bold font-outfit text-gray-800 dark:text-white'>
                        Review Slot Claim
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Confirming this will update your appointment schedule.
                    </p>
                </div>

                {/* Comparison Card */}
                <div className='grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6'>
                    {/* Current Slot */}
                    <div className='p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 text-center opacity-70'>
                        <span className='inline-block px-2 py-0.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-3'>
                            Current Slot
                        </span>
                        <div className='space-y-1.5'>
                            <p className='text-sm font-bold text-gray-800 dark:text-white'>Nov 12, 2024</p>
                            <p className='text-xs text-gray-500'>09:00 AM</p>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className='flex justify-center'>
                        <div className='w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 dark:bg-brand-500/10 rotate-90 md:rotate-0'>
                            <ArrowRight size={20} />
                        </div>
                    </div>

                    {/* New Slot */}
                    <div className='p-5 rounded-2xl border-2 border-brand-500 bg-brand-50/10 dark:bg-brand-500/5 text-center shadow-lg shadow-brand-500/10'>
                        <span className='inline-block px-2 py-0.5 rounded-lg bg-brand-500 text-[9px] font-bold text-white uppercase mb-3'>
                            New Slot
                        </span>
                        <div className='space-y-1.5'>
                            <p className='text-sm font-bold text-gray-800 dark:text-white'>Oct 15, 2024</p>
                            <p className='text-xs text-gray-500'>10:00 AM</p>
                        </div>
                    </div>
                </div>

                <div className='flex items-start gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20'>
                    <AlertTriangle className='text-amber-600 shrink-0' size={20} />
                    <p className='text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium'>
                        By claiming this, your original appointment will be automatically rescheduled to the new time. This action is final.
                    </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <button 
                        onClick={onClose}
                        className='px-6 py-3.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-2xl'
                    >
                        Cancel
                    </button>
                    <button 
                        className='px-6 py-3.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors rounded-2xl shadow-lg shadow-brand-500/20'
                        onClick={() => {
                            alert('Claimed successfully! (Sample action)');
                            onClose();
                        }}
                    >
                        Confirm Claim
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ClaimSlotModal;
