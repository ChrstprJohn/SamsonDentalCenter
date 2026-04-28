import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'brand' }) => {
    const colorClasses = {
        brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
        success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
        warning: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
        gray: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };

    return (
        <div className='relative rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex items-center gap-4 sm:gap-5 p-4 sm:p-5 min-h-[90px] sm:min-h-[100px] h-full transition-all hover:shadow-sm'>
            {/* Icon */}
            <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 ${colorClasses[color] || colorClasses.brand}`}>
                {Icon && <Icon size={22} className="sm:w-[26px] sm:h-[26px]" />}
            </div>

            {/* Content */}
            <div className='flex-grow min-w-0 flex flex-col justify-center'>
                <span className='text-[12px] sm:text-[13px] text-gray-500 dark:text-gray-400 font-medium truncate mb-0.5'>
                    {title}
                </span>
                <h4 className='text-[clamp(1.5rem,2vw+1rem,2rem)] font-bold text-gray-900 dark:text-white truncate leading-tight tabular-nums tracking-tight font-outfit'>
                    {value}
                </h4>
            </div>
        </div>
    );
};

export default StatCard;
