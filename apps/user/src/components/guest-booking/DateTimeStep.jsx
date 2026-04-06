import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Lock, Calendar as CalendarIcon, Clock as ClockIcon, Info, ArrowRight, MousePointer2, Loader2, Hourglass, Plus } from 'lucide-react';
import useSlots from '../../hooks/useSlots';

const DateTimeStep = ({
    serviceId,
    selectedDate,
    selectedTime,
    onUpdate,
    onNext,
    onBack,
    sessionId,
    slotHold,
}) => {
    const { activeHold, holdSlot, releaseHold, formattedTime, holdLoading, holdError, timeRemaining } = slotHold;
    const [pendingSlot, setPendingSlot] = useState(null);
    
    // VISIBILITY LIMIT: 3 columns * 6 rows = 18 slots
    const INITIAL_VISIBLE_COUNT = 18;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const MAX_BOOKING_DAYS_AHEAD = 90;
    const maxDate = useMemo(
        () => new Date(today.getTime() + MAX_BOOKING_DAYS_AHEAD * 24 * 60 * 60 * 1000),
        [today],
    );

    const [viewDate, setViewDate] = useState(() => {
        if (selectedDate) return new Date(selectedDate);
        const d = new Date(today);
        d.setDate(1);
        return d;
    });

    const navigateMonth = (direction) => {
        setViewDate((prev) => {
            const next = new Date(prev);
            next.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return next;
        });
    };

    const formatDateKey = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const {
        slots,
        nextAvailableDate,
        loading: slotsLoading,
        refetch: refetchSlots,
    } = useSlots(selectedDate || null, serviceId || null, true, sessionId);

    const handleDateClick = (date) => {
        const key = formatDateKey(date);
        // Toggle Logic: If clicking the SAME date that's already selected, clear it
        if (selectedDate === key) {
            releaseHold();
            onUpdate({ date: '', time: '' });
        } else {
            onUpdate({ date: key, time: '' });
        }
        setVisibleCount(INITIAL_VISIBLE_COUNT); // RESET visibility when date changes or toggles
    };

    const handleTimeClick = async (slotData) => {
        if (!serviceId || !selectedDate) return;
        const isCurrentlySelected = selectedTime === slotData.rawTime;
        setPendingSlot(slotData.rawTime);
        try {
            if (isCurrentlySelected) {
                await releaseHold();
                onUpdate({ time: '' });
            } else {
                const holdResult = await holdSlot(serviceId, selectedDate, slotData.rawTime);
                if (holdResult?.success) {
                    onUpdate({ time: slotData.rawTime });
                }
            }
        } finally {
            setPendingSlot(null);
        }
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Calculation for Progress Bar
    const holdProgress = useMemo(() => {
        if (!activeHold || timeRemaining === null) return 0;
        const totalDurationSeconds = (activeHold.expires_in_minutes || 15) * 60;
        return Math.min(100, Math.max(0, (timeRemaining / totalDurationSeconds) * 100));
    }, [activeHold, timeRemaining]);

    const formatHoldDetail = () => {
        if (!activeHold) return '';
        const date = new Date(activeHold.date);
        const dayName = dayNames[date.getDay()];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${dayName}, ${monthNames[date.getMonth()]} ${date.getDate()} at ${activeHold.time}`;
    };

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startOfGrid = new Date(firstDayOfMonth);
        startOfGrid.setDate(1 - firstDayOfMonth.getDay());
        const totalCells = Math.ceil((lastDayOfMonth.getDate() + firstDayOfMonth.getDay()) / 7) * 7;
        const days = [];
        for (let i = 0; i < totalCells; i++) {
            const d = new Date(startOfGrid);
            d.setDate(startOfGrid.getDate() + i);
            d.setHours(0,0,0,0);
            days.push(d);
        }
        return days;
    }, [viewDate]);

    const canGoPrev = viewDate.getMonth() > today.getMonth() || viewDate.getFullYear() > today.getFullYear();
    const canGoNext = viewDate < maxDate;

    // Filtered Slots for "Load More"
    const visibleSlots = useMemo(() => {
        if (!slots) return [];
        return slots
            .filter(slot => {
                const isHeldByMe = activeHold?.time === slot.rawTime && selectedDate === activeHold.date;
                return slot.available > 0 || isHeldByMe;
            })
            .slice(0, visibleCount);
    }, [slots, visibleCount, activeHold, selectedDate]);

    const hasMoreSlots = slots && slots.filter(slot => {
        const isHeldByMe = activeHold?.time === slot.rawTime && selectedDate === activeHold.date;
        return slot.available > 0 || isHeldByMe;
    }).length > visibleCount;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase'>
                    Pick Date & Time
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed'>
                    Choose your preferred appointment date and available time slot from the calendar.
                </p>
            </div>

            {/* ERROR Messages */}
            {holdError && (
                <div className='mb-5 p-3.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex gap-3'>
                    <Info size={16} className='text-red-500 shrink-0' />
                    <p className='text-xs text-red-700 dark:text-red-400 font-bold'>{holdError}</p>
                </div>
            )}

            {/* SIDE-BY-SIDE Layout */}
            <div className='grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 mb-10'>
                
                {/* Left Column: Calendar Grid */}
                <div className='bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-theme-sm h-fit'>
                    <div className='flex items-center justify-between mb-5'>
                        <h3 className='text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase'><CalendarIcon size={16} className='text-brand-500' />{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                        <div className='flex gap-1.5'>
                            <button onClick={() => navigateMonth('prev')} disabled={!canGoPrev} className='p-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all disabled:opacity-30 hover:shadow-theme-xs'><ChevronLeft size={18} className='text-gray-600 dark:text-gray-400' /></button>
                            <button onClick={() => navigateMonth('next')} disabled={!canGoNext} className='p-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all disabled:opacity-30 hover:shadow-theme-xs'><ChevronRight size={18} className='text-gray-600 dark:text-gray-400' /></button>
                        </div>
                    </div>
                    <div className='grid grid-cols-7 gap-1 mb-2'>
                        {dayNames.map(day => (<div key={day} className='text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center py-2'>{day}</div>))}
                    </div>
                    <div className='grid grid-cols-7 gap-1.5'>
                        {calendarDays.map((date, idx) => {
                            const key = formatDateKey(date);
                            const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                            const isPast = date < today;
                            const isToday = date.getTime() === today.getTime();
                            const isSelected = key === selectedDate;
                            const isDisabled = isPast || isToday || date.getDay() === 0 || date > maxDate;
                            if (!isCurrentMonth) return <div key={idx} className="aspect-square" />;
                            return (
                                <button key={idx} onClick={() => !isDisabled && handleDateClick(date)} disabled={isDisabled} className={`relative flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-300 ${isSelected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105 z-10' : isDisabled ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-30 shadow-none bg-transparent' : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-500/50 text-gray-700 dark:text-gray-300 shadow-theme-xs'}`}>
                                    <span className={`text-[13px] sm:text-sm font-bold ${isSelected ? 'text-white' : ''}`}>{date.getDate()}</span>
                                    {isToday && !isSelected && <div className="absolute bottom-1 sm:bottom-1.5 w-1 h-1 rounded-full bg-brand-500" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Time Selection / Empty State */}
                <div className='flex flex-col min-h-[380px]'>
                    {!selectedDate ? (
                        <div className='flex-grow bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500'>
                            <div className='bg-white dark:bg-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center shadow-theme-sm mb-5'><MousePointer2 size={28} className='text-brand-500' /></div>
                            <h4 className='text-base font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight uppercase'>Pick a Date</h4>
                            <p className='text-[12px] text-gray-500 dark:text-gray-400 max-w-[220px] leading-relaxed font-bold'>Select an available day from the calendar to see slots.</p>
                        </div>
                    ) : (
                        <div className='animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col'>
                            
                            <div className='flex items-center justify-between mb-5'>
                                <h3 className='text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase'><ClockIcon size={18} className='text-brand-500' />Available Times</h3>
                                <button onClick={refetchSlots} disabled={slotsLoading} className='flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-100 dark:border-gray-700 shadow-theme-xs transition-all disabled:opacity-50'><RefreshCw size={14} className={slotsLoading ? 'animate-spin' : ''} />Refresh</button>
                            </div>

                            {slotsLoading ? (
                                <div className='grid grid-cols-2 xsm:grid-cols-3 gap-3'>{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className='h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl' />)}</div>
                            ) : visibleSlots && visibleSlots.length > 0 ? (
                                <>
                                    <div className='grid grid-cols-2 xsm:grid-cols-3 gap-3 mb-6'>
                                        {visibleSlots.map((slot) => {
                                            const isHeldByMe = activeHold?.time === slot.rawTime && selectedDate === activeHold.date;
                                            const isSelected = selectedTime === slot.rawTime && !pendingSlot;
                                            const isPending = pendingSlot === slot.rawTime;
                                            return (
                                                <button key={slot.rawTime} onClick={() => handleTimeClick(slot)} disabled={holdLoading} title={`${slot.available} slots available`} className={`py-3 rounded-xl text-[12px] font-bold transition-all relative flex items-center justify-center ${isSelected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 ring-4 ring-brand-500/10' : isHeldByMe ? 'bg-brand-50 dark:bg-brand-500/10 border-2 border-brand-200 text-brand-700 dark:text-brand-400' : 'bg-white dark:bg-white/[0.03] border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-500/50 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-theme-sm'}`}>
                                                    {isPending ? <Loader2 size={16} className="animate-spin text-brand-500" /> : <>{slot.displayTime}{isHeldByMe && <Lock size={10} className='absolute top-2 right-2' />}</>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* LOAD MORE Button */}
                                    {hasMoreSlots && (
                                        <button 
                                            onClick={() => setVisibleCount(prev => prev + 18)}
                                            className='mb-8 w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-[11px] font-black text-gray-500 hover:text-brand-500 hover:border-brand-200 dark:hover:border-brand-500/50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/30'
                                        >
                                            <Plus size={14} />
                                            Show More Times
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className='p-8 bg-gray-50 dark:bg-white/[0.02] rounded-2xl text-center border-2 border-dashed border-gray-200 dark:border-gray-800 flex-grow flex flex-col items-center justify-center leading-relaxed'><p className='text-gray-500 text-[14px] font-bold mb-2'>No available slots for this date.</p>{nextAvailableDate && <button onClick={() => {const d = new Date(nextAvailableDate);setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));handleDateClick(d);}} className='text-brand-500 text-[13px] font-black hover:underline underline-offset-4'>Try {new Date(nextAvailableDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}</button>}</div>
                            )}

                            {/* DYNAMIC HOLD Status Indicator */}
                            {activeHold && selectedDate === activeHold.date && (
                                <div className='mt-auto p-4 bg-brand-50/50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl animate-in slide-in-from-bottom duration-500'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-theme-xs shrink-0'><Hourglass size={18} className='text-brand-500 animate-pulse' /></div>
                                        <div className='grow'>
                                            <p className='text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight'>Hold Active</p>
                                            <p className='text-[12px] text-gray-600 dark:text-gray-400 font-bold mt-0.5 leading-snug'>
                                                We're holding <span className="text-gray-900 dark:text-white">{formatHoldDetail()}</span> for you. Please complete in <span className="text-brand-600 dark:text-brand-400">{formattedTime}</span>.
                                            </p>
                                            <div className='flex items-center gap-2 mt-2.5'>
                                                <div className='h-1.5 flex-1 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden'>
                                                    <div className='h-full bg-brand-500 transition-all duration-1000 ease-linear' style={{ width: `${holdProgress}%` }} />
                                                </div>
                                                <span className='text-[10px] font-black text-brand-500 whitespace-nowrap uppercase italic'>
                                                    {Math.ceil(holdProgress)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-700'>
                <button onClick={onBack} className='w-full sm:w-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[13px] sm:text-sm px-6 py-3 sm:px-8 transition-colors uppercase tracking-widest'>Back</button>
                <button onClick={onNext} disabled={!selectedDate || !selectedTime} className='w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl transition-all shadow-theme-md disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-2.5 text-[14px] sm:text-base uppercase tracking-widest'>Continue to Your Info<ArrowRight size={20} className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            </div>
        </div>
    );
};

export default DateTimeStep;
