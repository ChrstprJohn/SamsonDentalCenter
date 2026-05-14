import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate } from '../../../hooks/useAppointments';

const AppointmentLogistics = ({
    date,
    time,
    duration,
    patientName
}) => {
    return (
        <div className="space-y-6 sm:space-y-10 animate-[fadeIn_0.2s_ease-out]">
            {/* Grid Layout for Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                
                {/* 1. Date Card */}
                <div className="flex items-start gap-4 sm:gap-6 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="text-brand-600 dark:text-brand-400" size={20} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Scheduled Date
                        </span>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {formatDate(date)}
                        </p>
                    </div>
                </div>

                {/* 2. Time Card */}
                <div className="flex items-start gap-4 sm:gap-6 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-info-50 dark:bg-info-500/10 flex items-center justify-center shrink-0 border border-info-100 dark:border-info-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="text-info-600 dark:text-info-400" size={20} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Time & Duration
                        </span>
                        <div className="flex flex-col">
                            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {time}
                            </p>
                            {duration && (
                                <p className="text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 opacity-80 mt-0.5">
                                    {duration} Estimated
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Patient Card */}
                <div className="flex items-start gap-4 sm:gap-6 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success-50 dark:bg-success-500/10 flex items-center justify-center shrink-0 border border-success-100 dark:border-success-500/20 group-hover:scale-110 transition-transform duration-300">
                        <User className="text-success-600 dark:text-success-400" size={20} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Appointment For
                        </span>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {patientName}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AppointmentLogistics;
