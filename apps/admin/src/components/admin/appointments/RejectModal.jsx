import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const REJECTION_REASONS = [
    { id: 'CONFLICT', label: 'Scheduling Conflict' },
    { id: 'PROVIDER_UNAVAILABLE', label: 'Provider Unavailable' },
    { id: 'INVALID_INFO', label: 'Invalid Information' },
    { id: 'OUTSIDE_SCOPE', label: 'Service Outside Scope' },
    { id: 'OTHER', label: 'Other (Custom reason)' }
];

const RejectModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
    const [selectedReason, setSelectedReason] = useState('CONFLICT');
    const [customReason, setCustomReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        const finalReason = selectedReason === 'OTHER' ? customReason : REJECTION_REASONS.find(r => r.id === selectedReason)?.label;
        onConfirm(finalReason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Reject Appointment</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl">
                        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-tight mb-1">Important Action</p>
                            <p className="text-[11px] text-amber-700 dark:text-amber-500/80 leading-relaxed font-medium">
                                Rejecting this request will cancel the appointment and notify the patient. This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Reason for Rejection</label>
                        <div className="grid gap-2">
                            {REJECTION_REASONS.map((reason) => (
                                <button
                                    key={reason.id}
                                    onClick={() => setSelectedReason(reason.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                                        selectedReason === reason.id
                                            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm'
                                            : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                                    }`}
                                >
                                    {reason.label}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Custom Field */}
                        {selectedReason === 'OTHER' && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <textarea
                                    autoFocus
                                    placeholder="Enter custom rejection reason..."
                                    className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/30">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-3 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                        Keep Pending
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting || (selectedReason === 'OTHER' && !customReason.trim())}
                        className="flex-1 py-3 text-xs font-black text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/20 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : 'Confirm Rejection'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;
