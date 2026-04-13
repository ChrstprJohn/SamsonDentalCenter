import React from 'react';
import { X, Check } from 'lucide-react';

const AppointmentDetailFooter = ({ onApprove, onRejectClick }) => {
    return (
        <div className='fixed bottom-0 left-0 right-0 sm:relative z-20 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none sm:bg-transparent sm:border-t-0 sm:px-0 sm:py-0'>
            <div className='flex items-center gap-3 w-full justify-between sm:justify-end'>
                <div className='flex flex-1 sm:flex-none gap-3 justify-end w-full'>
                    <button
                        onClick={onRejectClick}
                        className='flex-1 sm:flex-none sm:min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-error-500/10 text-error-600 dark:text-error-500 text-[13px] sm:text-[15px] font-bold rounded-xl hover:bg-error-100 dark:hover:bg-error-500/20 transition-all border border-transparent dark:border-error-500/20 shadow-theme-xs'
                    >
                        <X size={18} strokeWidth={2.5} />
                        Reject
                    </button>
                    <button
                        onClick={onApprove}
                        className='flex-1 sm:flex-none sm:min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-success-500 text-white text-[13px] sm:text-[15px] font-bold rounded-xl hover:bg-success-600 transition-all shadow-lg shadow-success-500/20'
                    >
                        <Check size={18} strokeWidth={2.5} />
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailFooter;
