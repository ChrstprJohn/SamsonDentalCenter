import React from 'react';
import { format, isSameDay, startOfDay } from 'date-fns';
import CalendarEvent from './CalendarEvent';

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM (17:00)

const CalendarGrid = ({ viewMode, dates, dentists, appointments }) => {
    // Helper to get appointments for a specific date and dentist
    const getEvents = (date, dentistId) => {
        return appointments.filter(app =>
            isSameDay(app.start, date) &&
            app.dentistId === dentistId
        );
    };

    // Grid columns configuration
    // 1 (Time Gutter) + (Days * Dentists if Day view else Days)
    const numDays = dates.length;
    const numDentists = dentists.length;

    // In Week View: 1 (Gutter) + 7 (Days)
    // In Day View: 1 (Gutter) + N (Dentists)
    const gridCols = viewMode === 'week' ? 7 : numDentists;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950 select-none">
            {/* 1. HEADER TIER (Fixed at top) */}
            <div className="grid border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 z-[40]"
                style={{ gridTemplateColumns: `80px repeat(${gridCols}, 1fr)` }}>
                
                {/* Top-Left Corner Spacer */}
                <div className="border-r border-gray-100 dark:border-gray-800" />

                {/* Day Headers */}
                {viewMode === 'week' ? (
                    dates.map((date, i) => (
                        <div key={`header-${i}`} className="flex flex-col items-center justify-center p-3 border-r border-gray-100 dark:border-gray-800 last:border-r-0">
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${isSameDay(date, new Date()) ? 'text-brand-500' : 'text-gray-400'}`}>
                                {format(date, 'EEE')}
                            </span>
                            <span className={`mt-1 flex items-center justify-center w-9 h-9 rounded-full text-lg font-bold transition-all ${isSameDay(date, new Date())
                                ? 'bg-brand-500 text-white shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                                }`}>
                                {format(date, 'd')}
                            </span>
                        </div>
                    ))
                ) : (
                    dentists.map((dentist, i) => (
                        <div key={`header-dentist-${i}`} className="flex flex-col items-center justify-center p-3 border-r border-gray-100 dark:border-gray-800 last:border-r-0">
                            <div className="w-2.5 h-2.5 rounded-full mb-1.5 shadow-sm" style={{ backgroundColor: dentist.color }} />
                            <span className="text-[12px] font-bold tracking-tight text-gray-700 dark:text-gray-200">
                                {dentist.name}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="grid relative"
                    style={{ 
                        gridTemplateColumns: `80px repeat(${gridCols}, 1fr)`,
                        // Top Space (20px) + 9 Data Slots (80px each) + Bottom Space (100px)
                        gridTemplateRows: `20px repeat(${HOURS.length - 1}, 80px) 100px`
                    }}>
                    
                    {/* A. TIME GUTTER (Column 1) */}
                    <div className="grid border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950" 
                         style={{ gridColumn: 1, gridRow: `1 / span ${HOURS.length + 1}` }}>
                        
                        {/* 8 AM to 4 PM labels */}
                        {HOURS.slice(0, -1).map((hour, i) => (
                            <div key={`time-${i}`} 
                                 className="flex justify-center items-start"
                                 style={{ gridRow: i + 2 }}>
                                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tabular-nums transform -translate-y-1/2">
                                    {format(new Date().setHours(hour, 0), 'h a')}
                                </span>
                            </div>
                        ))}

                        {/* 5 PM label (centered on the line between last slot and bottom spacer) */}
                        <div className="flex justify-center items-start"
                             style={{ gridRow: HOURS.length + 1 }}>
                            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tabular-nums transform -translate-y-1/2">
                                {format(new Date().setHours(HOURS[HOURS.length-1], 0), 'h a')}
                            </span>
                        </div>
                    </div>

                    {/* Top Divider Line (Bottom of row 1 is the 8 AM line) */}
                    {Array.from({ length: gridCols }).map((_, colIndex) => (
                        <div key={`top-div-${colIndex}`}
                            className="border-b border-gray-100/60 dark:border-gray-800/40"
                            style={{ gridRow: 1, gridColumn: colIndex + 2 }} />
                    ))}

                    {/* B. GRID DATA (Rows 2..10 are the hour slots) */}
                    {HOURS.slice(0, -1).map((_, rowIndex) => (
                        Array.from({ length: gridCols }).map((_, colIndex) => (
                            <div key={`cell-${rowIndex}-${colIndex}`}
                                className="border-b border-r border-gray-100/60 dark:border-gray-800/40 last:border-r-0"
                                style={{ gridRow: rowIndex + 2, gridColumn: colIndex + 2 }} />
                        ))
                    ))}

                    {/* C. APPOINTMENTS OVERLAY (Starts at Row 2, fitting between 8 AM and 5 PM lines) */}
                    <div className="pointer-events-none"
                        style={{ gridRow: `2 / span ${HOURS.length - 1}`, gridColumn: `2 / span ${gridCols}`, position: 'relative' }}>
                        <div className="absolute inset-0 pointer-events-auto">
                            {Array.from({ length: gridCols }).map((_, colIndex) => (
                                <div key={`events-col-${colIndex}`}
                                    className="absolute inset-y-0"
                                    style={{
                                        left: `${(colIndex / gridCols) * 100}%`,
                                        width: `${100 / gridCols}%`
                                    }}>
                                    {viewMode === 'week' ? (
                                        dentists.map(dentist =>
                                            getEvents(dates[colIndex], dentist.id).map(event => (
                                                <CalendarEvent
                                                    key={event.id}
                                                    event={event}
                                                    color={dentist.color}
                                                    width={100 / dentists.length}
                                                    left={dentists.indexOf(dentist) * (100 / dentists.length)}
                                                />
                                            ))
                                        )
                                    ) : (
                                        getEvents(dates[0], dentists[colIndex].id).map(event => (
                                            <CalendarEvent
                                                key={event.id}
                                                event={event}
                                                color={dentists[colIndex].color}
                                                width={100}
                                                left={0}
                                            />
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Spacer Row visibility (100px) */}
                    <div style={{ gridRow: HOURS.length + 1, gridColumn: `2 / span ${gridCols}` }} className="border-r border-gray-100/60 dark:border-gray-800/40 last:border-r-0" />
                </div>
            </div>
        </div>
    );
};

export default CalendarGrid;
