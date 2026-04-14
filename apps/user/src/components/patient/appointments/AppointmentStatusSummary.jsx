import React from 'react';
import { Calendar, Clock, XCircle, CheckCircle } from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, colorClass, borderClass }) => (
    <div className={`flex-shrink-0 w-[140px] sm:w-auto sm:flex-1 p-4 rounded-2xl border ${borderClass} bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md`}>
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${colorClass}`}>
                <Icon size={18} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{title}</span>
                <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{count}</span>
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
            colorClass: 'bg-green-50 dark:bg-green-500/10 text-green-600',
            borderClass: 'border-green-100 dark:border-green-500/10'
        },
        { 
            title: 'Pending', 
            count: stats?.pending || 0, 
            icon: Clock, 
            colorClass: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600',
            borderClass: 'border-amber-100 dark:border-amber-500/10'
        },
        { 
            title: 'Rejected', 
            count: stats?.rejected || 0, 
            icon: XCircle, 
            colorClass: 'bg-red-50 dark:bg-red-500/10 text-red-600',
            borderClass: 'border-red-100 dark:border-red-500/10'
        },
        { 
            title: 'Completed', 
            count: stats?.completed || 0, 
            icon: CheckCircle, 
            colorClass: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600',
            borderClass: 'border-blue-100 dark:border-blue-500/10'
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
