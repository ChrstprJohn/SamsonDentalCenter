import React from 'react';
import { ChevronLeft } from 'lucide-react';

const AppointmentDetailActionBar = ({ onBack }) => {
    return (
        <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-20'>
            <button 
                onClick={onBack}
                className='p-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors shadow-theme-xs'
            >
                <ChevronLeft size={20} />
            </button>
        </div>
    );
};

export default AppointmentDetailActionBar;
