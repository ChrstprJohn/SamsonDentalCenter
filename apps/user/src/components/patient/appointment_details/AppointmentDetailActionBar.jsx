import React from 'react';
import { ChevronLeft } from 'lucide-react';

const AppointmentDetailActionBar = ({ onBack }) => {
    return (
        <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
            <button 
                onClick={onBack}
                className='p-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors'
            >
                <ChevronLeft size={20} />
            </button>
            {/* Future expansion: Action icons on the right (like Star, Menu, etc.) could go here */}
        </div>
    );
};

export default AppointmentDetailActionBar;
