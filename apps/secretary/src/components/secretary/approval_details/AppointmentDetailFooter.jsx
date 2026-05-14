import React from 'react';
import { X, Check } from 'lucide-react';

const AppointmentDetailFooter = ({ onApprove, onReject }) => {
    return (
        <div className='fixed bottom-0 left-0 right-0 sm:relative z-20 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none sm:bg-transparent sm:border-t-0 sm:px-0 sm:py-8'>
            <div className='flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 max-w-4xl mx-auto w-full'>
                <button 
                    onClick={() => onReject()} 
                    className="order-2 sm:order-1 flex-1 sm:flex-none px-8 py-4 sm:py-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold text-sm rounded-2xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 flex items-center justify-center gap-2"
                >
                    <X size={18} />
                    Reject Request
                </button>
                <button 
                    onClick={onApprove} 
                    className="order-1 sm:order-2 flex-1 sm:flex-none px-12 py-4 sm:py-3 bg-success-500 text-white font-bold text-sm rounded-2xl shadow-theme-lg active:scale-95 hover:bg-success-600 transition-all flex items-center justify-center gap-2"
                >
                    <Check size={18} />
                    Approve Request
                </button>
            </div>
        </div>
    );
};

export default AppointmentDetailFooter;
