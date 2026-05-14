import React from 'react';
import { ListChecks, Clock, Zap, AlertCircle } from 'lucide-react';

const StatCard = ({ label, value, color, icon: Icon }) => {
    const colorClasses = {
        brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
        success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
        warning: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
        error: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
        info: 'bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400',
    };

    return (
        <div className='relative rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex items-center gap-3 sm:gap-4 px-4 py-3.5 min-h-[70px] sm:min-h-[90px] h-full transition-all hover:shadow-md flex-shrink-0 w-[240px] sm:flex-1'>
            {/* Icon */}
            <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 ${colorClasses[color] || colorClasses.brand}`}>
                {Icon && <Icon size={18} className="sm:w-[22px] sm:h-[22px]" />}
            </div>

            {/* Content */}
            <div className='flex-grow min-w-0 flex flex-col justify-center'>
                <span className='text-[12px] sm:text-[13px] text-gray-700 dark:text-gray-400 font-medium truncate mb-0.5'>
                    {label}
                </span>
                <div className='flex items-center justify-between gap-1'>
                    <h4 className='text-xl sm:text-2xl lg:text-[26px] font-medium text-gray-900 dark:text-white truncate leading-tight tabular-nums tracking-tight'>
                        {value}
                    </h4>
                </div>
            </div>
        </div>
    );
};

const ApprovalHeader = ({ totalPending, urgentCount, newCount, staleCount }) => {
    return (
        <div className="mb-5 sm:mb-10">
            <div className="flex flex-nowrap sm:flex-wrap gap-4 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                <StatCard 
                    label="Total Requests" 
                    value={totalPending} 
                    color="brand" 
                    icon={ListChecks}
                />
                <StatCard 
                    label="Urgent" 
                    value={urgentCount} 
                    color="error" 
                    icon={Zap}
                />
                <StatCard 
                    label="New Requests" 
                    value={newCount} 
                    color="warning" 
                    icon={AlertCircle}
                />
                <StatCard 
                    label="Needs Attention" 
                    value={staleCount} 
                    color="info" 
                    icon={Clock}
                />
            </div>
        </div>
    );
};

export default ApprovalHeader;
