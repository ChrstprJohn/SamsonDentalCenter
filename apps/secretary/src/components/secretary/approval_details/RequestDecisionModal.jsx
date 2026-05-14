import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../ui/Modal';
import Button from '../../ui/Button';
import { CheckCircle2, XCircle, MessageSquare, AlertCircle } from 'lucide-react';

const APPROVAL_REASONS = [
    "Clinical priority confirmed",
    "Schedule optimization",
    "Consultation slot verified",
    "Emergency fit-in authorized",
    "Dentist availability confirmed",
    "Other"
];

const REJECTION_REASONS = [
    "Dentist unavailable at this time",
    "Slot already occupied",
    "Invalid clinical request data",
    "Service requires referral/specialist",
    "Patient history requires manual booking",
    "Outside clinical operating hours",
    "Other"
];

const RequestDecisionModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    mode = 'approve', // 'approve' or 'reject'
    isProcessing = false,
    serviceName = ''
}) => {
    const [reasonType, setReasonType] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [showOthers, setShowOthers] = useState(false);

    const reasons = mode === 'approve' ? APPROVAL_REASONS : REJECTION_REASONS;
    const isApprove = mode === 'approve';

    useEffect(() => {
        if (isOpen) {
            setReasonType("");
            setCustomReason("");
            setShowOthers(false);
        }
    }, [isOpen]);

    const handleTypeChange = (e) => {
        const val = e.target.value;
        setReasonType(val);
        if (val === "Other") {
            setShowOthers(true);
            setCustomReason("");
        } else {
            setShowOthers(false);
            setCustomReason(val);
        }
    };

    const isReady = reasonType !== "" && (!showOthers || (showOthers && customReason.trim().length > 2));

    const title = isApprove ? "Approve Request?" : "Reject Request?";
    const description = isApprove 
        ? `This will confirm the ${serviceName} appointment and notify the patient.`
        : `This will decline the ${serviceName} request. The patient will be notified of the reason.`;

    const confirmLabel = isApprove ? "Confirm Approval" : "Confirm Rejection";
    const Icon = isApprove ? CheckCircle2 : XCircle;
    const themeColor = isApprove ? 'success' : 'error';

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            isBottomSheet={true} 
            className='sm:max-w-[500px] w-full' 
            showCloseButton={false}
        >
            <ModalHeader 
                title={title}
                description={description}
                onClose={onClose}
            />

            <ModalBody>
                <div className='space-y-6'>
                    {/* Visual Indicator */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                        isApprove 
                            ? 'bg-success-50 dark:bg-success-500/10 border-success-100 dark:border-success-500/20' 
                            : 'bg-error-50 dark:bg-error-500/10 border-error-100 dark:border-error-500/20'
                    }`}>
                        <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border ${
                            isApprove ? 'border-success-100 dark:border-success-500/10' : 'border-error-100 dark:border-error-500/10'
                        }`}>
                            <Icon size={18} className={isApprove ? 'text-success-500' : 'text-error-500'} />
                        </div>
                        <p className={`text-[12px] font-bold ${isApprove ? 'text-success-700 dark:text-success-400' : 'text-error-700 dark:text-error-400'}`}>
                            {isApprove 
                                ? "Administrative approval will activate this slot in the clinical calendar."
                                : "Rejection will release the slot and archive this request."}
                        </p>
                    </div>

                    {/* Reason Selection */}
                    <div className='space-y-3'>
                        <label className='text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block px-1'>
                            {isApprove ? "Approval Reason" : "Rejection Reason"}
                        </label>
                        
                        <div className='relative group'>
                            <select
                                value={reasonType}
                                onChange={handleTypeChange}
                                disabled={isProcessing}
                                className={`w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent text-gray-900 dark:text-white px-4 py-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-${themeColor}-500 transition-all appearance-none outline-none shadow-theme-sm ${
                                    !reasonType ? 'text-gray-400 dark:text-gray-600' : ''
                                }`}
                            >
                                <option value="" disabled>Select a {mode}al reason...</option>
                                {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>

                        {(showOthers || (reasonType && !reasons.includes(reasonType))) && (
                            <div className='space-y-2 animate-[fadeIn_0.2s_ease-out] mt-4'>
                                <div className='flex items-center justify-between px-1'>
                                    <label className='flex items-center gap-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest'>
                                        <MessageSquare size={14} />
                                        Administrative Note
                                    </label>
                                    <span className='text-[10px] text-gray-400 font-bold'>{customReason.length}/300</span>
                                </div>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    disabled={isProcessing}
                                    placeholder={isApprove ? 'Add a private note for approval...' : 'Explain why this was rejected...'}
                                    rows={3}
                                    maxLength={300}
                                    className='w-full px-5 py-3 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none transition-all shadow-theme-sm'
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
                    disabled={isProcessing}
                    className="flex-1 h-11 px-6 rounded-xl font-black text-[11px] sm:text-sm"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={() => onConfirm(customReason)}
                    disabled={isProcessing || !isReady}
                    className={`flex-1 h-11 text-white rounded-xl font-black text-[11px] sm:text-sm shadow-lg transition-all ${
                        isApprove 
                            ? 'bg-success-500 hover:bg-success-600 shadow-success-500/20' 
                            : 'bg-error-500 hover:bg-error-600 shadow-error-500/20'
                    }`}
                >
                    {isProcessing ? (
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    ) : (
                        confirmLabel
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default RequestDecisionModal;
