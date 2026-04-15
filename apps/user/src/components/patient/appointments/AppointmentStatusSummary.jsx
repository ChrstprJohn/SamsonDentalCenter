import React from 'react';
import { Calendar, Clock, XCircle, CheckCircle } from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, iconColor }) => (
    <div className="flex-shrink-0 w-[155px] sm:w-auto sm:flex-1 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center shrink-0">
                <Icon size={20} className={iconColor} />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate">{count}</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-none mt-1 truncate">{title}</span>
            </div>
        </div>
    </div>
);

const AppointmentStatusSummary = ({ stats }) => {
    const items = [
        { 
            title: 'Upcoming', 
            count: stats?.upcoming || 0, 
            icon: Calendar, 
            iconColor: 'text-green-600 dark:text-green-400'
        },
        { 
            title: 'Pending', 
            count: stats?.pending || 0, 
            icon: Clock, 
            iconColor: 'text-amber-600 dark:text-amber-400'
        },
        { 
            title: 'Rejected', 
            count: stats?.rejected || 0, 
            icon: XCircle, 
            iconColor: 'text-red-600 dark:text-red-400'
        },
        { 
            title: 'Completed', 
            count: stats?.completed || 0, 
            icon: CheckCircle, 
            iconColor: 'text-blue-600 dark:text-blue-400'
        }
    ];

    return (
        <div className="w-full px-4 sm:px-0 mt-2 mb-2 sm:mt-0 sm:mb-6">
            <h3 className="text-sm font-black text-gray-700 dark:text-white uppercase tracking-tight mb-4 sm:hidden">
                My Appointments
            </h3>
            <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 sm:pb-0 sm:grid sm:grid-cols-4 snap-x snap-mandatory">
                {items.map((item, idx) => (
                    <div key={idx} className="snap-start snap-always">
                        <StatCard {...item} />
                    </div>
                ))}
                {/* Spacer for mobile to help with the "peek" effect if needed, 
                    though fixed width + gap usually handles it */}
                <div className="flex-shrink-0 w-1 sm:hidden" />
            </div>
        </div>
    );
};

export default AppointmentStatusSummary;
