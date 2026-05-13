import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../ui/Modal';
import Button from '../../ui/Button';
import { AlertCircle, MessageSquare } from 'lucide-react';

const CANCEL_REASONS = [
    "Schedule conflict",
    "Feeling unwell",
    "Personal emergency",
    "Transportation issues",
    "Other"
];

const AppointmentCancelModal = ({ show, onClose, cancelReason, setCancelReason, rawId, cancelling, handleCancel }) => {
    const [reasonType, setReasonType] = useState("");
    const [showOthers, setShowOthers] = useState(false);

    useEffect(() => {
        if (show) {
            setReasonType("");
            setShowOthers(false);
            setCancelReason("");
        }
    }, [show, setCancelReason]);

    const handleTypeChange = (e) => {
        const val = e.target.value;
        setReasonType(val);
        if (val === "Other") {
            setShowOthers(true);
            setCancelReason("");
        } else {
            setShowOthers(false);
            setCancelReason(val);
        }
    };

    const isReady = reasonType !== "" && (!showOthers || (showOthers && cancelReason.trim().length > 0));

    return (
        <Modal isOpen={show} onClose={onClose} isBottomSheet={true} className='sm:max-w-[480px] w-full' showCloseButton={false}>
            <div className='h-1.5 w-full bg-error-500 absolute top-0 left-0' />
            
            <ModalHeader 
                title="Are you sure?" 
                description="We're sorry you can't make it. You can always reschedule for a better time."
                onClose={onClose}
                icon={
                    <div className='w-12 h-12 rounded-xl bg-error-50 dark:bg-error-500/10 flex items-center justify-center text-error-500 mb-4'>
                        <AlertCircle size={24} />
                    </div>
                }
            />

            <ModalBody>
                <div className='space-y-6'>
                    {/* Reason Selection */}
                    <div className='space-y-3'>
                        <label className='text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block px-1'>
                            Cancellation Reason
                        </label>
                        
                        <div className='relative group'>
                            <select
                                value={reasonType}
                                onChange={handleTypeChange}
                                disabled={cancelling}
                                className={`w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent text-gray-900 dark:text-white px-4 py-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-error-500 transition-all appearance-none outline-none shadow-theme-sm ${
                                    !reasonType ? 'text-gray-400 dark:text-gray-600' : ''
                                }`}
                            >
                                <option value="" disabled>Choose a reason...</option>
                                {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>

                        {showOthers && (
                            <div className='space-y-2 animate-[fadeIn_0.2s_ease-out] mt-4'>
                                <div className='flex items-center justify-between px-1'>
                                    <label className='flex items-center gap-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest'>
                                        <MessageSquare size={14} />
                                        Please specify
                                    </label>
                                    <span className='text-[10px] text-gray-400 font-bold'>{cancelReason.length}/300</span>
                                </div>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    disabled={cancelling}
                                    placeholder='Briefly tell us why...'
                                    rows={3}
                                    maxLength={300}
                                    className='w-full px-5 py-3 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-error-500/50 resize-none transition-all shadow-theme-sm'
                                />
                            </div>
                        )}
                    </div>
                </div>
            </ModalBody>

            <ModalFooter>
                <Button 
                    variant='outline' 
                    onClick={onClose} 
                    disabled={cancelling}
                    className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-black text-[11px] sm:text-sm"
                >
                    Keep Appointment
                </Button>
                <Button 
                    onClick={handleCancel}
                    disabled={cancelling || !isReady || (showOthers && cancelReason.trim().length < 2)}
                    className="flex-1 sm:flex-none h-12 px-8 bg-error-500 hover:bg-error-600 text-white rounded-xl font-black text-[11px] sm:text-sm shadow-lg shadow-error-500/20"
                >
                    {cancelling ? (
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    ) : (
                        'Confirm Cancel'
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AppointmentCancelModal;
