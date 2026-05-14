import React from 'react';

const ApprovalDetailHeader = ({ serviceName, displayStatus, badgeColor, requestId }) => {
    return (
        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 px-4 py-5 sm:p-8 shadow-theme-xs'>
            <div className='flex flex-row items-center justify-between gap-4'>
                <div className='space-y-2'>
                    <h2 className='text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit leading-tight tracking-tight'>
                        {serviceName}
                    </h2>
                    <div className='flex items-center gap-2 text-[10px] sm:text-[12px] font-bold'>
                        <span className='uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500'>Request ID:</span>
                        <span className='font-mono text-brand-600 dark:text-brand-400 px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 rounded-lg'>
                            {requestId?.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className='shrink-0'>
                    <span
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl uppercase tracking-wider shadow-sm ${
                            badgeColor === 'success'
                                ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400 shadow-success-500/5'
                                : badgeColor === 'warning'
                                  ? 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400 shadow-warning-500/5'
                                  : badgeColor === 'error'
                                    ? 'bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400 shadow-error-500/5'
                                    : badgeColor === 'info'
                                      ? 'bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400 shadow-info-500/5'
                                      : 'bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400 shadow-error-500/5'
                        }`}
                    >
                        {displayStatus}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ApprovalDetailHeader;
