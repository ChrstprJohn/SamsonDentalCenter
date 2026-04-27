import React from 'react';

const UpcomingSchedule = ({ appointments = [], onBlockTime, viewSwitcher }) => {
    const today = new Date();
    const currentWeekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
    });

    const getTimePosition = (timeStr, duration) => {
        if (!timeStr) return { top: '0px', height: '0px' };
        const [hours, minutes] = timeStr.split(':').map(Number);
        const startMinutes = (hours * 60) + minutes;
        const gridStartMinutes = 8 * 60;
        const top = 20 + ((startMinutes - gridStartMinutes) / 30) * 56;
        const height = (duration / 30) * 56 - 4;
        return { top: `${top}px`, height: `${height}px` };
    };

    return (
        <div className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-white/[0.03]">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">Upcoming Schedule</h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Real-time timeline view of clinician appointments.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button 
                        onClick={onBlockTime}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg transition text-[11px] sm:text-sm font-bold h-9 sm:h-10 px-3 sm:px-5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent dark:border-red-900/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-off" aria-hidden="true"><path d="M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18"/><path d="M21 15.5V6a2 2 0 0 0-2-2H9.5"/><path d="M16 2v4"/><path d="M3 10h7"/><path d="M21 10h-5.5"/><path d="m2 2 20 20"/></svg>
                        <span className="truncate">Block Time</span>
                    </button>
                    <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                    <div className="w-full sm:w-auto">
                        {viewSwitcher}
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-auto overflow-x-auto no-scrollbar" style={{ "--gutter-width": "clamp(56px, 15vw, 90px)" }}>
                <div className="min-w-[600px] flex flex-col">
                <div className="grid border-b border-gray-300 dark:border-gray-700 bg-gray-50/20 dark:bg-transparent" style={{ gridTemplateColumns: "var(--gutter-width) repeat(7, 1fr)" }}>
                    <div className="border-r border-gray-300 dark:border-gray-700"></div>
                    {currentWeekDates.map((date, i) => (
                        <div key={i} className={`flex flex-col items-center sm:items-start p-1 sm:p-3 border-r border-gray-300 dark:border-gray-700 last:border-r-0 ${i === 0 ? 'bg-brand-50/30 dark:bg-brand-500/5' : ''}`}>
                            <span className={`text-[11px] sm:text-lg font-black ${i === 0 ? 'text-brand-500' : 'text-gray-900 dark:text-white'}`}>{date.getDate()}</span>
                            <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5 ${i === 0 ? 'text-brand-500 opacity-80' : 'text-gray-400'}`}>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</span>
                        </div>
                    ))}
                </div>
                <div className="no-scrollbar pb-10 overflow-y-auto" style={{ maxHeight: '800px' }}>
                    <div className="relative flex" style={{ height: "1140px" }}>
                        <div className="sticky left-0 z-20 flex-shrink-0 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/90 backdrop-blur-sm" style={{ width: "var(--gutter-width)" }}>
                            {Array.from({ length: 21 }).map((_, i) => {
                                const isHour = i % 2 === 0;
                                const hourValue = 8 + Math.floor(i / 2);
                                const label = isHour 
                                    ? (hourValue > 12 ? (hourValue - 12) + ' PM' : hourValue + (hourValue === 12 ? ' PM' : ' AM'))
                                    : (hourValue > 12 ? (hourValue - 12) : hourValue) + ':30';
                                
                                return (
                                    <span 
                                        key={i} 
                                        className={`absolute left-0 right-0 text-center text-[9px] sm:text-[13px] font-black tabular-nums -translate-y-1/2 select-none ${isHour ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}`} 
                                        style={{ top: `${20 + (i * 56)}px` }}
                                    >
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="flex-grow grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
                            {currentWeekDates.map((date, colIndex) => {
                                const dateStr = date.toLocaleDateString('en-CA');
                                const dayAppointments = appointments.filter(app => app.appointment_date === dateStr);
                                return (
                                    <div key={colIndex} className="relative border-r border-gray-300 dark:border-gray-700 last:border-r-0 bg-white dark:bg-transparent">
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <div key={i} className="absolute left-0 right-0 border-b border-gray-100 dark:border-gray-800/50" style={{ top: `${20 + (i * 56)}px`, height: "56px" }}></div>
                                        ))}
                                        {dayAppointments.map(app => {
                                            const { top, height } = getTimePosition(app.appointment_time, app.duration_minutes || 30);
                                            return (
                                                <div key={app.id} className="absolute left-1 right-1 rounded-lg border-l-4 border-brand-500 bg-brand-50/80 dark:bg-brand-500/10 p-2 shadow-theme-sm z-10" style={{ top, height }}>
                                                    <div className="font-black text-brand-700 dark:text-brand-400 uppercase text-[9px] truncate">{app.service_name}</div>
                                                    <div className="font-bold text-gray-900 dark:text-white truncate text-[10px]">{app.patient_name}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpcomingSchedule;
