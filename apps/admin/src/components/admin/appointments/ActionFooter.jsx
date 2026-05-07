import React from 'react';
import { Check, X } from 'lucide-react';

const ActionFooter = ({ onApprove, onReject, isSubmitting, isClear }) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-10 flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="hidden sm:block">
                {!isClear && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-tight">Conflicts Detected</span>
                    </div>
                )}
                {isClear && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg">
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-500 uppercase tracking-tight">Clear to Book</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                    onClick={onReject}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50"
                >
                    <X size={16} />
                    Reject
                </button>
                <button
                    onClick={onApprove}
                    disabled={isSubmitting}
                    className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Check size={16} className="group-hover:scale-110 transition-transform" />
                    )}
                    {isSubmitting ? 'Processing...' : 'Approve Appointment'}
                </button>
            </div>
        </div>
    );
};

export default ActionFooter;
