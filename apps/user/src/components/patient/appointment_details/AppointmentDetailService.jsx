import React from 'react';

const AppointmentDetailService = ({
    dateFormatted,
    timeFormatted,
    duration,
    patientLabel,
    isRepresentativeBooking,
    price,
}) => {
    return (
        <div className='mb-12 sm:mb-16'>
            <div className='flex items-center gap-4 mb-8 sm:mb-10'>
                <h2 className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest'>
                    Appointment Overview
                </h2>
                <div className='h-px grow bg-gray-200 dark:bg-gray-800'></div>
            </div>

            <div className='bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 space-y-8 sm:space-y-10'>
                {/* Date & Time */}
                <div className='flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-16'>
                    <div className='sm:w-40 shrink-0'>
                        <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold'>
                            Date & Time
                        </span>
                    </div>
                    <div className='flex flex-wrap items-baseline gap-3'>
                        <span className='text-lg sm:text-xl text-gray-900 dark:text-white font-bold tracking-tight'>
                            {dateFormatted}
                        </span>
                        <span className='text-gray-300 dark:text-gray-700'>|</span>
                        <span className='text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium'>
                            {timeFormatted}
                        </span>
                        {duration && (
                            <span className='ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium'>
                                ({duration})
                            </span>
                        )}
                    </div>
                </div>

                {/* Patient */}
                <div className='flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-16'>
                    <div className='sm:w-40 shrink-0'>
                        <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold'>
                            Patient
                        </span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className='text-lg sm:text-xl text-gray-900 dark:text-white font-bold tracking-tight'>
                            {patientLabel}
                        </span>
                        {isRepresentativeBooking && (
                            <span className='px-2 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded uppercase tracking-wider'>
                                Representative
                            </span>
                        )}
                    </div>
                </div>

                {/* Estimate Cost */}
                {price != null && (
                    <div className='flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-16 pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-800/60'>
                        <div className='sm:w-40 shrink-0'>
                            <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold'>
                                Est. Cost
                            </span>
                        </div>
                        <span className='text-2xl sm:text-3xl text-gray-900 dark:text-white font-bold tracking-tighter font-mono'>
                            ₱{Number(price).toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailService;
