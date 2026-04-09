import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'brand' }) => {
    const colorClasses = {
        brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
        success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
        warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
        info: 'bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400',
    };

    return (
        <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-theme-sm'>
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses[color] || colorClasses.brand}`}>
                {Icon && <Icon size={24} />}
            </div>

            <div className='flex items-end justify-between mt-5'>
                <div>
                    <span className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
                        {title}
                    </span>
                    <h4 className='mt-2 text-2xl font-bold text-gray-800 dark:text-white/90 font-outfit'>
                        {value}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
