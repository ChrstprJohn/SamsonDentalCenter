import React from 'react';
import { ChevronLeft } from 'lucide-react';

const AppointmentDetailActionBar = ({ onBack }) => {
    return (
        <div className='px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-30 shrink-0'>
            <button 
                onClick={onBack}
                className='group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-theme-sm hover:shadow-theme-md active:scale-95 z-10'
            >
                <ChevronLeft size={18} className='text-gray-400 dark:text-gray-500 group-hover:-translate-x-0.5 transition-transform duration-300' />
                <span className='text-xs sm:text-sm font-bold'>Back</span>
            </button>
            
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <span className='text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest'>Request Details</span>
            </div>
        </div>
    );
};

export default AppointmentDetailActionBar;
