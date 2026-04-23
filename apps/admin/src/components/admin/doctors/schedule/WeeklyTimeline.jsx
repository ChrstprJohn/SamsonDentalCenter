import React, { useState } from 'react';
import { format, addDays, startOfDay, addMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarOff } from 'lucide-react';
import { Button } from '../../../ui';

// 8 AM to 6 PM in 30min intervals (20 slots total)
const TIMES = [];
for (let h = 8; h <= 17; h++) {
    TIMES.push(`${h}:00`, `${h}:30`);
}
TIMES.push(`18:00`);

const WeeklyTimeline = ({ doctor, onBlockClick }) => {
    const [startDate, setStartDate] = useState(startOfDay(new Date()));
    const [daysToShow, setDaysToShow] = useState(7);

    React.useEffect(() => {
        const handleResize = () => setDaysToShow(window.innerWidth < 640 ? 3 : 7);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dates = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i));

    // Sample Data: Dynamic relative to today
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const dayAfterStr = format(addDays(new Date(), 2), 'yyyy-MM-dd');

    const events = [
        { date: todayStr, start: '09:30', duration: 45, service: 'Dental Cleaning', patient: 'John Doe', type: 'appointment' },
        { date: todayStr, start: '12:00', duration: 60, service: 'Lunch Break', patient: 'Staff', type: 'blocked' },
        { date: tomorrowStr, start: '10:00', duration: 90, service: 'Root Canal', patient: 'Jane Smith', type: 'appointment' },
        { date: tomorrowStr, start: '14:00', duration: 45, service: 'Checkup', patient: 'Mike Ross', type: 'appointment' },
        { date: dayAfterStr, start: '08:00', duration: 120, service: 'Surgery Prep', patient: 'Clinical Staff', type: 'blocked' },
        { date: dayAfterStr, start: '11:00', duration: 30, service: 'Quick Consult', patient: 'Harvey Specter', type: 'appointment' },
    ];

    const formatTimeToAMPM = (time) => {
        const [h, m] = time.split(':').map(Number);
        return format(new Date().setHours(h, m), 'h:mm a');
    };

    const getTimeRange = (start, duration) => {
        const [h, m] = start.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(h, m, 0, 0);
        const endTime = addMinutes(startTime, duration);
        return `${format(startTime, 'h:mm')} - ${format(endTime, 'h:mm a')}`;
    };

    // Layout constants — all positioning math uses these same values
    const ROW_PX = daysToShow === 3 ? 56 : 80; // Compact 56px on mobile, spacious 80px on desktop
    const SPACER_PX = 20;
    const NUM_SLOTS = TIMES.length - 1; // 20 visible 30-min slots
    const GRID_HEIGHT = SPACER_PX + NUM_SLOTS * ROW_PX; // total px height

    const getEventStyles = (startTime, duration, isBlocked) => {
        const [hStr, mStr] = startTime.split(':');
        const h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        const startMinutes = (h - 8) * 60 + m;
        const top = SPACER_PX + (startMinutes / 30) * ROW_PX;
        const height = (duration / 30) * ROW_PX;
        return {
            top: `${top}px`,
            height: `${Math.max(height - 2, 20)}px`,
            backgroundColor: isBlocked ? '#fff1f2' : '#f0f9ff', // lighter red-50/blue-50
            borderColor: isBlocked ? '#fecaca #fca5a5 #fca5a5 #ef4444' : '#dbeafe #93c5fd #93c5fd #3b82f6', // top, right, bottom, left
            color: isBlocked ? '#991b1b' : '#1e40af',
            borderStyle: 'solid',
            borderWidth: '1px 1px 1px 4px', // Clean left-accent border
        };
    };

    const nav = (offset) => setStartDate(addDays(startDate, offset === 7 || offset === -7 ? (daysToShow === 3 ? (offset > 0 ? 3 : -3) : offset) : offset));
    const goToday = () => setStartDate(startOfDay(new Date()));

    return (
        <div className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-white/[0.03]">
            {/* Main Header: Title & Block Action (Matches WeeklyRoutine) */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {daysToShow === 3 ? '3-Day Schedule' : 'Upcoming Schedule'}
                    </h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                        {daysToShow === 3 ? 'Timeline view for the next 3 days.' : 'Timeline view of appointments and manual blocks for the next 7 days.'}
                    </p>
                </div>
                <div className='hidden sm:flex items-center gap-3'>
                    <Button variant="outline" size="sm" onClick={onBlockClick} className="gap-2">
                        <CalendarOff size={16} />
                        Block Time
                    </Button>
                </div>
            </div>

            {/* Grid Wrapper */}
            <div className="flex flex-col h-auto overflow-hidden" style={{ '--gutter-width': 'clamp(56px, 15vw, 90px)' }}>
                
                {/* Grid Header: Date Range & Nav (Matches WeeklyRoutine Month Nav) */}
                <div className='flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.01] gap-2'>
                    <div>
                        <h3 className='text-xs sm:text-lg font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none'>
                            {daysToShow === 3 
                                ? `${format(startDate, 'MMM d')} - ${format(addDays(startDate, 2), 'd, yyyy')}`
                                : `Week of ${format(startDate, 'MMMM d, yyyy')}`
                            }
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Button variant="outline" size="sm" onClick={goToday} className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-3 h-7 sm:h-8 border-gray-200 dark:border-gray-700">Today</Button>
                        <div className="flex items-center gap-0.5 sm:gap-1 ml-1 sm:ml-2">
                            <button onClick={() => nav(-7)} className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-500 transition-all">
                                <ChevronLeft size={12} className="sm:w-4 sm:h-4" />
                            </button>
                            <button onClick={() => nav(7)} className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-500 transition-all">
                                <ChevronRight size={12} className="sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Day Headers row - Fluid on mobile */}
                <div className="grid border-b border-gray-300 dark:border-gray-700 bg-gray-50/20 dark:bg-transparent"
                    style={{ gridTemplateColumns: `var(--gutter-width) repeat(${daysToShow}, 1fr)` }}>
                    <div className="border-r border-gray-300 dark:border-gray-700" />
                    {dates.map((date, i) => {
                        const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        return (
                            <div key={i} className={`flex flex-col items-center sm:items-start justify-center sm:justify-start p-1 sm:p-3 border-r border-gray-300 dark:border-gray-700 last:border-r-0 ${isToday ? 'bg-brand-50/30 dark:bg-brand-500/5' : ''}`}>
                                <span className={`text-[11px] sm:text-lg font-black ${isToday ? 'text-brand-500' : 'text-gray-900 dark:text-white'}`}>
                                    {format(date, 'd')}
                                </span>
                                <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-tight sm:tracking-widest mt-0.5 ${isToday ? 'text-brand-500 opacity-80' : 'text-gray-400'}`}>
                                    {format(date, 'EEE')}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Timeline Body - Fluid on mobile */}
                <div className="no-scrollbar pb-10">
                    {/* Single parent grid — both gutter labels and event pills use the same coordinate space */}
                    <div className="flex" style={{ height: `${GRID_HEIGHT}px` }}>

                        {/* Time Gutter — absolutely positioned labels sharing SPACER_PX + ROW_PX math */}
                        <div className="relative flex-shrink-0 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50"
                             style={{ width: 'var(--gutter-width)' }}>
                            {TIMES.map((time, i) => {
                                const [hStr, mStr] = time.split(':');
                                const h = parseInt(hStr, 10);
                                const m = parseInt(mStr, 10);
                                const isHalf = m !== 0;
                                const topPx = SPACER_PX + i * ROW_PX;
                                return (
                                    <span key={i}
                                          className={`absolute left-0 right-0 text-center text-[9px] sm:text-[13px] font-black tabular-nums -translate-y-1/2 select-none ${isHalf ? 'text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}
                                          style={{ top: `${topPx}px` }}>
                                        {format(new Date().setHours(h, m), isHalf ? 'h:mm' : 'h a')}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Data columns — one per visible day */}
                        {dates.map((date, colIndex) => (
                            <div key={colIndex}
                                 className="relative flex-1 border-r border-gray-300 dark:border-gray-700 last:border-r-0 bg-white dark:bg-transparent">

                                {/* Horizontal grid lines */}
                                {TIMES.slice(0, -1).map((_, rowIndex) => (
                                    <div key={rowIndex}
                                         className="absolute left-0 right-0 border-b border-gray-300 dark:border-gray-700"
                                         style={{ top: `${SPACER_PX + rowIndex * ROW_PX}px`, height: `${ROW_PX}px` }} />
                                ))}

                                {/* Event Pills Overlay */}
                                {events.filter(e => e.date === format(date, 'yyyy-MM-dd')).map((event, i) => {
                                    const isBlocked = event.type === 'blocked';
                                    const styles = getEventStyles(event.start, event.duration, isBlocked);
                                    
                                    // Clamp visibility to current grid height if it overflows (6 PM limit)
                                    return (
                                        <div 
                                            key={i}
                                            className={`absolute left-0.5 right-0.5 rounded-lg text-[10px] flex flex-row overflow-hidden shadow-sm transition-all hover:scale-[1.01] hover:shadow-md hover:z-20 box-border`}
                                            style={{
                                                ...styles,
                                                maxHeight: `calc(${GRID_HEIGHT}px - ${styles.top})`,
                                                zIndex: 10,
                                            }}
                                        >
                                            <div className="flex flex-col flex-1 p-1.5 sm:p-2.5 justify-center min-w-0">
                                                <div className='font-black truncate leading-none text-[9px] sm:text-[13px] mb-0.5 sm:mb-1 uppercase tracking-tight'>
                                                    {isBlocked ? 'Blocked: ' + event.service : event.service}
                                                </div>
                                                <div className='font-bold truncate opacity-90 text-[8px] sm:text-[12px] mb-1 sm:mb-1.5'>
                                                    {event.patient}
                                                </div>
                                                <div className='opacity-80 text-[7px] sm:text-[11px] font-bold flex items-center gap-1.5 sm:gap-2'>
                                                    <span className="whitespace-nowrap">{getTimeRange(event.start, event.duration)}</span>
                                                    <span className="opacity-40">•</span>
                                                    <span className="whitespace-nowrap">{event.duration}m</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyTimeline;
