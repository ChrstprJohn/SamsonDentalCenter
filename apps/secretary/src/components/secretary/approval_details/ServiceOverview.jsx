import React from 'react';
import { Calendar, Clock, User, Timer, Check } from 'lucide-react';

const ServiceOverview = ({
    service,
    requestedDate,
    requestedTime,
    dentist,
    busySlots = [], // Change from busySlotPosition to array
    slotPosition,
    timeStr
}) => {
    return (
        <div className='flex-1 flex flex-col space-y-6'>
            <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>
                Request Information
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
                        {new Date(requestedDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                    <span className='text-gray-300 dark:text-gray-700 mx-0.5'>|</span>
                    <span className='text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1.5'>
                        <Clock className='w-3.5 h-3.5 text-brand-500 hidden sm:inline-block' />
                        {requestedTime}
                    </span>
                </div>
            </div>

            {/* Service */}
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
                <div className='sm:w-24 shrink-0 flex items-center gap-2'>
                    <Timer className='w-4 h-4 text-gray-400' />
                    <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>
                        Service
                    </span>
                </div>
                <div className='flex items-center gap-3'>
                    <span className='text-[14px] sm:text-[15px] text-gray-900 dark:text-white font-bold tracking-tight'>
                        {service}
                    </span>
                </div>
            </div>

            {/* Dentist Availability Block */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <User className="size-4" />
                        Dentist Availability
                    </h3>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Assigned Doctor</span>
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 border border-brand-100 dark:border-brand-500/20 shadow-sm rounded-lg">{dentist}</span>
                    </div>
                </div>
                
                <div className="relative h-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center overflow-visible border border-gray-200 dark:border-gray-700 shadow-inner px-6 mx-2 mb-10">
                    {/* Busy Blocks */}
                    {busySlots.map((pos, idx) => (
                        <div 
                            key={`busy-${idx}`}
                            className="absolute h-full top-0 w-[10%] bg-gray-200/60 dark:bg-gray-800/80 border-x border-white/20 dark:border-gray-700/50 flex items-center justify-center grayscale"
                            style={{ left: `${pos}%` }}
                        >
                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Busy</span>
                        </div>
                    ))}

                    {/* Requested Ghost Block */}
                    {slotPosition >= 0 && slotPosition <= 95 && (
                        <div 
                            className="absolute h-[130%] top-[-15%] w-[12%] bg-brand-50 dark:bg-brand-900 border-2 border-brand-500 rounded-xl flex flex-col items-center justify-center shadow-lg z-20 transition-all duration-500 ease-out"
                            style={{ left: `${slotPosition}%` }}
                        >
                            <span className="text-[9px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-tighter">Req</span>
                            <span className="text-xs font-black text-brand-700 dark:text-brand-300 mt-0.5">{timeStr}</span>
                        </div>
                    )}

                    {/* Time markers */}
                    <div className="absolute -bottom-6 left-0 w-full flex justify-between px-2">
                        {[9,11,1,3,5].map(h => (
                            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-tighter">
                                {h}:00{h > 8 && h < 12 ? 'AM' : 'PM'}
                            </span>
                        ))}
                    </div>
                </div>
                
                {busySlots.some(pos => Math.abs(pos - slotPosition) < 8) ? (
                    <p className="text-sm text-error-600 dark:text-error-400 text-center bg-error-50 dark:bg-error-500/10 py-3 rounded-xl border border-error-100 dark:border-error-500/20 font-bold tracking-tight animate-pulse">
                        ⚠️ Conflict detected! Dentist is busy at this time.
                    </p>
                ) : (
                    <p className="text-sm text-success-600 dark:text-success-500 text-center bg-success-50 dark:bg-success-500/10 py-3 rounded-xl border border-success-100 dark:border-success-500/20 font-medium tracking-tight">
                        <Check className="inline-block size-4 mr-1.5" />
                        No scheduling conflict detected.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ServiceOverview;
