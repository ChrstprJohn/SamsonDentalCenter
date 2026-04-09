import React from 'react';
import { Smile, BellRing, CalendarSearch, BellPlus } from 'lucide-react';

const WaitlistEmptyState = () => {
    return (
        <div className='relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm transition-all hover:border-gray-200 dark:hover:border-gray-700'>
            <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
                {/* Left Side: Illustration and Text */}
                <div className='flex items-start gap-4 flex-grow'>
                    <div className='relative shrink-0'>
                        <div className='w-14 h-14 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center text-gray-400'>
                            <CalendarSearch size={28} />
                        </div>
                        <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-900 shadow-sm'>
                            <Smile size={14} />
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                            <h3 className='text-lg font-bold text-gray-800 dark:text-white font-outfit'>
                                You're on the list!
                            </h3>
                            <div className='inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg text-[9px] font-bold uppercase tracking-wider animate-pulse'>
                                <BellRing size={10} />
                                Active Monitoring
                            </div>
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed'>
                            Currently, there are no earlier slots available. Don't worry—we're monitoring for cancellations and we'll notify you as soon as a spot opens up! 😊
                        </p>
                    </div>
                </div>

                {/* Right Side: Action Button */}
                <div className='flex flex-col sm:flex-row items-center gap-4 shrink-0'>
                    <button 
                        className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-theme-xs w-full sm:w-auto'
                        onClick={() => alert('Notifications enabled! (Sample action)')}
                    >
                        <BellPlus size={18} className='text-brand-500' />
                        Allow Notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaitlistEmptyState;
