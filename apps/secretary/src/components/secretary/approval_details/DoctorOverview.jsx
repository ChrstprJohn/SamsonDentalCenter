import React from 'react';
import { UserCheck } from 'lucide-react';

const DoctorOverview = ({
    dentistName,
    specialization
}) => {
    return (
        <div className="flex items-center gap-4 sm:gap-8 animate-[fadeIn_0.2s_ease-out] group">
            {/* Avatar Placeholder/Icon */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                <UserCheck className="text-gray-300 dark:text-gray-600" size={40} strokeWidth={1.5} />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-1 sm:space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest text-brand-500 dark:text-brand-400">
                        Assigned Clinician
                    </span>
                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                </div>
                
                <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-outfit tracking-tight leading-tight">
                        {dentistName}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 opacity-80 uppercase tracking-widest">
                        {specialization}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DoctorOverview;
