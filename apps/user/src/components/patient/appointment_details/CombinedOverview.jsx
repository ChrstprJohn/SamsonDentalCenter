import React from 'react';
import { Calendar, Clock, User, Timer } from 'lucide-react';

const CombinedOverview = ({
    dentistName,
    specialization,
    dateFormatted,
    timeFormatted,
    duration,
    patientLabel,
    isRepresentativeBooking,
}) => {
    return (
        <div className='mb-12 sm:mb-16'>
            <div className='flex items-center gap-4 mb-8 sm:mb-10'>
                <h2 className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest'>
                    Appointment Overview
                </h2>
                <div className='h-px grow bg-gray-200 dark:bg-gray-800'></div>
            </div>

            <div className='bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row gap-6 sm:gap-8 relative overflow-hidden'>
                {/* Visual accent left line */}
                <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500 rounded-l-3xl opacity-80'></div>

                {/* Left Side: Doctor */}
                <div className='md:w-[40%] shrink-0 flex flex-col items-start'>
                    <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-4'>
                        Assigned Doctor
                    </span>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg shadow-sm border border-brand-100/50 dark:border-brand-500/20'>
                            {dentistName
                                .replace(/^Dr\.\s*/i, '')
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                        <div>
                            <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-1'>
                                {dentistName}
                            </h3>
                            <p className='text-[13px] text-brand-600 dark:text-brand-400 font-medium'>
                                {specialization || 'General Dentistry'}
                            </p>
                        </div>
                    </div>
                    <p className='mt-5 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium max-w-sm'>
                        Experience exceptional care with your assigned doctor, dedicated to ensuring
                        a comfortable and professional environment.
                    </p>
                </div>

                <div className='hidden md:block w-px bg-gray-200/80 dark:bg-gray-800/80'></div>
                <div className='block md:hidden h-px bg-gray-200/80 dark:bg-gray-800/80 w-full my-1'></div>

                {/* Right Side: Appointment Details */}
                <div className='flex-1 flex flex-col space-y-5 sm:space-y-6'>
                    <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>
                        Appointment Detail
                    </span>

                    {/* Date & Time */}
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
                        <div className='sm:w-24 shrink-0 flex items-center gap-2'>
                            <Calendar className='w-4 h-4 text-gray-400' />
                            <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>
                                Date & Time
                            </span>
                        </div>
                        <div className='flex flex-wrap items-center gap-2 text-[14px] sm:text-[15px]'>
                            <span className='text-gray-900 dark:text-white font-bold tracking-tight'>
                                {dateFormatted}
                            </span>
                            <span className='text-gray-300 dark:text-gray-700 mx-0.5'>|</span>
                            <span className='text-gray-800 dark:text-gray-200 font-medium flex items-center gap-1.5'>
                                <Clock className='w-3.5 h-3.5 text-gray-400 hidden sm:inline-block' />
                                {timeFormatted}
                            </span>
                        </div>
                    </div>

                    {/* Duration */}
                    {duration && (
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
                            <div className='sm:w-24 shrink-0 flex items-center gap-2'>
                                <Timer className='w-4 h-4 text-gray-400' />
                                <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>
                                    Duration
                                </span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <span className='text-[14px] sm:text-[15px] text-gray-900 dark:text-white font-bold tracking-tight'>
                                    {duration}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Patient */}
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
                        <div className='sm:w-24 shrink-0 flex items-center gap-2'>
                            <User className='w-4 h-4 text-gray-400' />
                            <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>
                                Patient
                            </span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <span className='text-[14px] sm:text-[15px] text-gray-900 dark:text-white font-bold tracking-tight'>
                                {patientLabel}
                            </span>
                            {isRepresentativeBooking && (
                                <span className='px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded uppercase tracking-widest'>
                                    Representative
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CombinedOverview;
