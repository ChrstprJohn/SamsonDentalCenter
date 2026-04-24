import React from 'react';
import { CalendarPlus, Phone } from 'lucide-react';

const DashboardWelcomeBanner = ({ firstName, onBookAppointment, onContactClinic }) => {
    return (
        <div className="relative overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-[clamp(1.25rem,4vw+1rem,2.25rem)] font-bold tracking-tight text-gray-800 dark:text-white/90 font-outfit leading-tight">
                        Welcome back, {firstName}! 👋
                    </h2>
                    <p className="mt-1 text-gray-500 dark:text-gray-400 text-[clamp(0.875rem,2vw+0.5rem,1rem)] leading-relaxed">
                        Here is an overview of your oral health, upcoming appointments, and recent activities.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                    <button 
                        onClick={onBookAppointment}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-brand-500 px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-sm font-bold text-white transition-all hover:bg-brand-600 shadow-sm active:scale-95"
                    >
                        <CalendarPlus size={18} className="shrink-0" />
                        <span>Book Appointment</span>
                    </button>
                    
                    <button 
                        onClick={onContactClinic}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-sm font-bold text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white active:scale-95 shadow-sm"
                    >
                        <Phone size={18} className="shrink-0" />
                        <span>Contact Clinic</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardWelcomeBanner;
