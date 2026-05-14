import React from 'react';
import { ShieldCheck, OctagonAlert, Check, X } from 'lucide-react';

const SchedulingVerification = ({ isConflict, busySlots, slotPosition, timeStr }) => {
    return (
        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 p-4 sm:p-8 shadow-theme-xs space-y-6'>
            <div className="flex items-center justify-between px-2">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scheduling Verification</span>
                    <p className="text-[9px] font-bold text-gray-400 opacity-60">Visualizing 8:00 AM - 5:00 PM clinical shift</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${isConflict ? 'bg-error-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-success-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isConflict ? 'text-error-500' : 'text-success-500'}`}>
                        {isConflict ? 'Schedule Conflict' : 'Clear Availability'}
                    </span>
                </div>
            </div>

            <div className={`flex items-center justify-center gap-3 p-4 border rounded-2xl transition-all duration-500 ${
                isConflict 
                    ? 'bg-error-50 dark:bg-error-500/10 border-error-100 dark:border-error-500/20 shadow-sm' 
                    : 'bg-success-50 dark:bg-success-500/10 border-success-100 dark:border-success-500/20'
            }`}>
                {isConflict ? (
                    <>
                        <X className="size-5 text-error-600 shrink-0" />
                        <span className="text-sm font-bold text-error-700 dark:text-error-400">Conflict detected! Dentist has an existing commitment at this time.</span>
                    </>
                ) : (
                    <>
                        <Check className="size-5 text-success-600 shrink-0" />
                        <span className="text-sm font-bold text-success-700 dark:text-success-400">No scheduling conflict detected. Ready for administrative approval.</span>
                    </>
                )}
            </div>

            {/* Interactive Schedule Bar */}
            <div className="relative h-14 bg-white dark:bg-gray-950 rounded-2xl flex items-center overflow-visible border border-gray-200 dark:border-gray-700 shadow-inner px-6 mt-2">
                {busySlots.map((pos, idx) => {
                    const isSlotConflict = Math.abs(pos - slotPosition) < 8;
                    return (
                        <div 
                            key={`busy-${idx}`}
                            className={`absolute h-full top-0 w-[8%] border-x flex items-center justify-center transition-colors ${
                                isSlotConflict 
                                    ? 'bg-error-500/20 dark:bg-error-500/30 border-error-500/50 z-10 animate-pulse' 
                                    : 'bg-gray-100/60 dark:bg-gray-800/40 border-white/5 dark:border-gray-700/10 grayscale hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                            }`}
                            style={{ left: `${pos}%` }}
                        >
                            <span className={`text-[6px] font-black uppercase tracking-tighter hidden sm:block ${isSlotConflict ? 'text-error-600 dark:text-error-400' : 'text-gray-300'}`}>
                                {isSlotConflict ? 'Conflict' : 'Busy'}
                            </span>
                        </div>
                    );
                })}
                {slotPosition >= 0 && slotPosition <= 95 && (
                    <div 
                        className={`absolute h-[120%] top-[-10%] w-[12%] rounded-xl flex flex-col items-center justify-center shadow-theme-lg z-20 border-2 border-white dark:border-gray-900 transition-all duration-500 ${
                            isConflict 
                                ? 'bg-error-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-brand-500 text-white'
                        }`}
                        style={{ left: `${slotPosition}%` }}
                    >
                        <span className="text-[8px] font-black tabular-nums tracking-tighter leading-none">{timeStr}</span>
                        <span className="text-[6px] font-black uppercase opacity-60 mt-0.5 hidden sm:block">Req</span>
                    </div>
                )}
                <div className="absolute -bottom-5 left-0 w-full flex justify-between px-4">
                    {[9,11,1,3,5].map(h => (
                        <span key={h} className="text-[8px] font-bold text-gray-300 tracking-tighter tabular-nums uppercase">
                            {h}{h > 8 && h < 12 ? 'am' : 'pm'}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchedulingVerification;
