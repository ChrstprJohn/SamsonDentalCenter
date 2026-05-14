import React from 'react';
import { Shield, OctagonAlert, CalendarX, User } from 'lucide-react';

const PatientHistory = ({ displayHistory, completedCount, noShowCount, cancellationCount }) => {
    return (
        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 p-4 sm:p-8 shadow-theme-xs'>
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Appointment History</h3>
                    {displayHistory.length === 0 && (
                        <span className="text-[8px] text-amber-500 font-bold uppercase tracking-tighter">No previous records found</span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <div title={`${completedCount} Completed`} className="p-1.5 rounded-lg bg-success-50 text-success-600 border border-success-100 flex items-center gap-1">
                        <Shield size={12} />
                        <span className="text-[10px] font-bold">{completedCount}</span>
                    </div>
                    <div title={`${noShowCount} No-Shows`} className="p-1.5 rounded-lg bg-error-50 text-error-600 border border-error-100 flex items-center gap-1">
                        <OctagonAlert size={12} />
                        <span className="text-[10px] font-bold">{noShowCount}</span>
                    </div>
                    <div title={`${cancellationCount} Cancellations`} className="p-1.5 rounded-lg bg-gray-50 text-gray-500 flex items-center gap-1">
                        <CalendarX size={12} />
                        <span className="text-[10px] font-bold">{cancellationCount}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {displayHistory.map((apt, idx) => {
                    const isFiller = apt.id?.toString().startsWith('f');
                    return (
                        <div key={apt.id} className={`flex flex-col bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-500 ${isFiller ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
                            <div className="flex flex-row h-full">
                                <div className="flex flex-col w-[70px] bg-gray-50/50 dark:bg-gray-800/20 border-r border-gray-100 dark:border-gray-800 shrink-0 text-center">
                                    <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                                        <span className="text-[7px] font-bold uppercase text-gray-400 block">Start</span>
                                        <span className="text-[10px] font-bold text-gray-900 dark:text-white tabular-nums">{apt.startTime}</span>
                                    </div>
                                    <div className="py-2">
                                        <span className="text-[7px] font-bold uppercase text-gray-400 block">End</span>
                                        <span className="text-[10px] font-medium text-gray-500 tabular-nums">{apt.endTime}</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-3 min-w-0">
                                    <div className="flex items-center justify-between mb-1 gap-2">
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest tabular-nums truncate">{apt.date}</span>
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase shrink-0 ${apt.status === 'COMPLETED' ? 'text-success-600 bg-success-50' : 'text-gray-500 bg-gray-100'}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{apt.service}</span>
                                        <span className="text-[7px] font-black uppercase text-brand-500 border border-brand-100 dark:border-brand-500/20 px-1 rounded-sm">{apt.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] text-gray-500 truncate">
                                        <User size={10} className="text-brand-500 shrink-0" />
                                        <span className="truncate">{apt.doctor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PatientHistory;
