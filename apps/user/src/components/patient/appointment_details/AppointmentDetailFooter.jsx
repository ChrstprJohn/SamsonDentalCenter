import React from 'react';

const AppointmentDetailFooter = ({ isCancellable, onCancelClick, onRescheduleClick }) => {
    // Hide the footer entirety if the appointment is already completed or cancelled
    if (!isCancellable) return null;

    return (
        <div className='fixed bottom-0 left-0 right-0 sm:relative z-20 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none'>
            <div className='flex items-center gap-3 w-full justify-between'>
                <div className='hidden sm:block sm:flex-1'></div>
                <div className='flex flex-1 sm:flex-none gap-3 sm:justify-end w-full'>
                    <button
                        onClick={onCancelClick}
                        className='flex-1 sm:flex-none sm:min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-error-500/10 text-error-600 dark:text-error-500 text-[13px] sm:text-[15px] font-bold rounded-xl hover:bg-error-100 dark:hover:bg-error-500/20 transition-all border border-transparent dark:border-error-500/20 shadow-theme-xs'
                    >
                        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M18 6L6 18' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                            <path d='M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        Cancel
                    </button>
                    <button
                        onClick={onRescheduleClick}
                        className='flex-1 sm:flex-none sm:min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-brand-500 text-white text-[13px] sm:text-[15px] font-bold rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20'
                    >
                        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                            <path d='M3 3v5h5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                        </svg>
                        Reschedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailFooter;
