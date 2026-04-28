import React from 'react';

const WeeklyRoutine = ({ schedule = [], blocks = [], onBlockDate, onEditSchedule, viewSwitcher }) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const getShiftForDay = (date) => {
        const dayName = daysOfWeek[date.getDay()];
        const dateStr = date.toLocaleDateString('en-CA');
        const isBlocked = blocks.some(b => b.block_date === dateStr);
        if (isBlocked) return { type: 'blocked', text: 'Blocked' };
        const shift = schedule.find(s => s.day_of_week === dayName && s.is_working);
        if (shift && shift.start_time && shift.end_time) return { type: 'working', text: `${shift.start_time.substring(0, 5)} - ${shift.end_time.substring(0, 5)}` };
        return { type: 'closed', text: 'Closed' };
    };

    return (
        <div className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-white/[0.03] overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">Weekly Routine &amp; Blocks</h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Manage recurring availability and specific date exceptions.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button 
                        onClick={onBlockDate}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg transition text-[11px] sm:text-sm font-bold h-9 sm:h-10 px-3 sm:px-5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent dark:border-red-900/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-off" aria-hidden="true"><path d="M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18"/><path d="M21 15.5V6a2 2 0 0 0-2-2H9.5"/><path d="M16 2v4"/><path d="M3 10h7"/><path d="M21 10h-5.5"/><path d="m2 2 20 20"/></svg>
                        <span className="truncate">Block Date</span>
                    </button>
                    <button 
                        onClick={onEditSchedule}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg transition text-[11px] sm:text-sm font-bold h-9 sm:h-10 px-3 sm:px-5 bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                        <span className="truncate">Edit</span>
                    </button>
                    <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                    <div className="w-full sm:w-auto">
                        {viewSwitcher}
                    </div>
                </div>
            </div>
            <div className="overflow-hidden bg-white dark:bg-transparent">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.01] gap-2">
                    <div><h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3></div>
                </div>
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 w-full border-t border-l border-gray-200 dark:border-gray-700">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`pad-${i}`} className="bg-gray-50/30 dark:bg-gray-800/5 border-r border-b border-gray-100 dark:border-gray-800 aspect-square"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(currentYear, currentMonth, day);
                        const shift = getShiftForDay(date);
                        const isToday = day === now.getDate() && currentMonth === now.getMonth();
                        return (
                            <div key={day} className={`relative aspect-square p-1.5 sm:p-3 flex flex-col border-r border-b border-gray-200 dark:border-gray-700 ${isToday ? 'bg-brand-50/20 dark:bg-brand-500/5' : 'bg-white dark:bg-transparent'}`}>
                                <span className={`text-xs sm:text-lg font-black ${isToday ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500'}`}>{day}</span>
                                <div className="mt-auto">
                                    <span className={`text-[7px] sm:text-[10px] font-bold uppercase tracking-tight truncate ${
                                        shift.type === 'working' ? 'text-success-600 dark:text-success-400' : 
                                        shift.type === 'blocked' ? 'text-red-500' : 'text-gray-400'
                                    }`}>
                                        {shift.text}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeeklyRoutine;
