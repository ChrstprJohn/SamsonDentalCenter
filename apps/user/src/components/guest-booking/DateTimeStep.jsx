import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Lock } from 'lucide-react';
import useSlots from '../../hooks/useSlots';

const DateTimeStep = ({
    serviceId,
    selectedDate,
    selectedTime,
    onUpdate,
    onNext,
    onBack,
    serviceName,
    sessionId,
    slotHold,
}) => {
    // ✅ Initialize slot hold hook with session ID
    const { activeHold, holdSlot, releaseHold, formattedTime, holdLoading, holdError } = slotHold;

    // Simple date picker state — starts from today
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // Issue #1: Fixed week navigation bounds
    // Max booking days ahead (90 days is reasonable, adjust as needed)
    const MAX_BOOKING_DAYS_AHEAD = 90;
    const maxDate = useMemo(
        () => new Date(today.getTime() + MAX_BOOKING_DAYS_AHEAD * 24 * 60 * 60 * 1000),
        [today],
    );

    const [weekStart, setWeekStart] = useState(() => {
        const d = new Date(today);
        d.setDate(d.getDate() - d.getDay()); // Start of current week (Sunday)
        return d;
    });

    // Generate 7 days for the visible week
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [weekStart]);

    const navigateWeek = (direction) => {
        setWeekStart((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + (direction === 'next' ? 7 : -7));

            // ✅ FIXED: Only allow forward if within max booking range
            // ✅ FIXED: Only allow backward if the week end date (Saturday) would be before today
            if (direction === 'next' && next > maxDate) {
                return prev;
            }
            // Calculate end of week (Saturday) for backward navigation check
            const nextWeekEnd = new Date(next);
            nextWeekEnd.setDate(nextWeekEnd.getDate() + 6); // Saturday of that week

            if (direction === 'prev' && nextWeekEnd < today) {
                return prev;
            }

            return next;
        });
    };

    // ✅ FIX: Use local date parts to avoid timezone shifting (e.g. UTC-8 or UTC+8 issues)
    const formatDateKey = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ✅ Guest booking: Fetch ALL slots (available + full) so we can see OUR own holds
    // Filter out other full slots in the render logic below
    // Only fetch if both date and serviceId are valid
    const {
        slots,
        nextAvailableDate,
        loading: slotsLoading,
        refetch: refetchSlots,
    } = useSlots(selectedDate || null, serviceId || null, true, sessionId);

    const handleDateClick = (date) => {
        // Create a copy and normalize to midnight local time
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);

        const key = formatDateKey(d);

        // ✅ Ensure the calendar jumps to the week of the selected date
        const newWeekStart = new Date(d);
        newWeekStart.setDate(d.getDate() - d.getDay()); // Sunday of that week
        newWeekStart.setHours(0, 0, 0, 0);
        setWeekStart(newWeekStart);

        onUpdate({ date: key, time: '' }); // Reset time when date changes
    };

    // ✅ Handle time slot click with auto-switch and toggle-off logic
    const handleTimeClick = async (slotData) => {
        if (!serviceId || !selectedDate) return;

        // ✅ NEW: Added toggle behavior (click again to release)
        const isCurrentlySelected = selectedTime === slotData.rawTime;

        if (isCurrentlySelected) {
            // ✅ Toggle OFF: Click again to remove the hold on backend
            await releaseHold();
            onUpdate({ time: '' });
            return;
        }

        // Call backend to hold slot - auto-switch if already has hold on different time
        const holdResult = await holdSlot(serviceId, selectedDate, slotData.rawTime);

        if (holdResult?.success) {
            // ✅ Update time only after hold is confirmed
            onUpdate({ time: slotData.rawTime });
        } else if (holdResult?.error === 'SLOT_TAKEN') {
            // ✅ FIX: Show user-friendly error when slot was taken by someone else
            // holdError is already set by holdSlot, so it will show in the error banner
            return;
        }
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Issue #3: Check if week navigation buttons should be disabled
    const canGoPrev = weekStart > today;
    const canGoNext = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) <= maxDate;

    // ✅ Format date and time for display in hold indicator
    const formatHoldDateTime = () => {
        if (!activeHold) return '';
        const date = new Date(activeHold.date);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        const dayName = dayNames[date.getDay()];
        const monthName = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        // Format time from activeHold.time (HH:MM to 12-hour format)
        const [hours, minutes] = activeHold.time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const timeDisplay = `${displayHour}:${minutes} ${ampm}`;

        return `${dayName} ${monthName} ${day}, ${year} at ${timeDisplay}`;
    };

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Pick Date & Time</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Choose your preferred appointment date and available time slot.
            </p>

            {/* ✅ Hold Status Indicator with Date & Time */}
            {/* ✅ FIX: Only show if selected date matches held date (not on different dates) */}
            {activeHold && selectedDate === activeHold.date && (
                <div className='mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                    <div className='flex items-start gap-2'>
                        <Lock
                            size={16}
                            className='text-amber-600 mt-1 shrink-0'
                        />
                        <div className='grow'>
                            <p className='text-sm font-medium text-amber-900'>
                                📅 {formatHoldDateTime()}
                            </p>
                            <p className='text-sm font-medium text-amber-900 mt-1'>
                                Reserved for {activeHold.expires_in_minutes} minutes
                            </p>
                            <p className='text-xs text-amber-700 mt-1'>
                                Time remaining: <strong>{formattedTime}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Hold Error */}
            {holdError && (
                <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-sm text-red-700'>{holdError}</p>
                </div>
            )}

            {/* Week navigation */}
            <div className='flex items-center justify-between mb-4'>
                <button
                    onClick={() => navigateWeek('prev')}
                    disabled={!canGoPrev}
                    className='p-2 hover:bg-slate-100 rounded-lg transition-colors
                               disabled:opacity-30 disabled:cursor-not-allowed'
                    title='Previous week'
                >
                    <ChevronLeft size={18} />
                </button>
                <span className='text-sm font-medium text-slate-700'>
                    {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className='relative group'>
                    <button
                        onClick={() => navigateWeek('next')}
                        disabled={!canGoNext}
                        aria-label={
                            !canGoNext
                                ? `You can only book up to ${MAX_BOOKING_DAYS_AHEAD} days in advance`
                                : 'Go to next week'
                        }
                        className='p-2 hover:bg-slate-100 rounded-lg transition-colors
                                   disabled:opacity-30 disabled:cursor-not-allowed'
                        title={
                            !canGoNext
                                ? `You can only book up to ${MAX_BOOKING_DAYS_AHEAD} days in advance`
                                : 'Next week'
                        }
                    >
                        <ChevronRight size={18} />
                    </button>
                    {/* ✅ Visual tooltip for disabled state */}
                    {!canGoNext && (
                        <div className='absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                            Max {MAX_BOOKING_DAYS_AHEAD} days ahead
                            <div className='absolute top-full right-3 w-2 h-2 bg-slate-900 rotate-45 -mt-1'></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Day buttons */}
            <div className='grid grid-cols-7 gap-2 mb-6'>
                {weekDays.map((date) => {
                    const key = formatDateKey(date);
                    const isPast = date < today;
                    const isSameDay = date.getTime() === today.getTime(); // ✅ NEW: Disable same-day bookings
                    const isSelected = key === selectedDate;
                    const isSunday = date.getDay() === 0;
                    const isBeyondMax = date > maxDate;
                    const isDisabled = isPast || isSunday || isBeyondMax || isSameDay; // ✅ NEW: Added isSameDay

                    return (
                        <button
                            key={key}
                            onClick={() => !isDisabled && handleDateClick(date)}
                            disabled={isDisabled}
                            className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${
                                isSelected
                                    ? 'bg-sky-500 text-white ring-2 ring-sky-500/20'
                                    : isDisabled
                                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                      : 'bg-white border border-slate-100 hover:border-sky-200 text-slate-700 cursor-pointer'
                            }`}
                            title={
                                isSameDay
                                    ? 'Cannot book on the same day'
                                    : isSunday
                                      ? 'Clinic closed on Sundays'
                                      : isPast
                                        ? 'Date has passed'
                                        : undefined
                            }
                        >
                            <span className='font-medium'>{dayNames[date.getDay()]}</span>
                            <span className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                                {date.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Time slots */}
            {selectedDate && (
                <div className='mb-8'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-sm font-semibold text-slate-700'>Available Times</h3>
                        {/* ✅ Refresh button to see updated availability */}
                        <button
                            onClick={refetchSlots}
                            disabled={slotsLoading}
                            title='Refresh to see latest availability'
                            className='flex items-center gap-1 px-3 py-1 text-xs bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <RefreshCw
                                size={14}
                                className={slotsLoading ? 'animate-spin' : ''}
                            />
                            Refresh
                        </button>
                    </div>
                    {slotsLoading ? (
                        // ✅ IMPROVEMENT #2: Visual loading continuity with spinner
                        <div className='flex items-center justify-center py-8'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className='w-5 h-5 border-3 border-slate-200 border-t-sky-500 rounded-full animate-spin' />
                                <p className='text-sm text-slate-400'>Checking availability...</p>
                            </div>
                        </div>
                    ) : slots && slots.length > 0 ? (
                        <div className='grid grid-cols-3 sm:grid-cols-5 gap-2'>
                            {slots.map((slot) => {
                                // ✅ Guest booking shows only available slots
                                // Each slot has: {time, rawTime, displayTime, available}
                                const isHeldByMe =
                                    activeHold?.time === slot.rawTime &&
                                    selectedDate === activeHold.date;

                                // ✅ NEW: If I hold it, it's effectively available to ME
                                const effectiveAvailable = slot.available + (isHeldByMe ? 1 : 0);
                                const isAvailable = effectiveAvailable > 0;

                                const isSelected = selectedTime === slot.rawTime;
                                const isActuallyHeldByMe = isHeldByMe; // same thing, just for clarity below

                                // Skip if not available AND not held by me (since guest only shows available slots)
                                if (!isAvailable) return null;

                                return (
                                    <button
                                        key={slot.rawTime}
                                        onClick={() => handleTimeClick(slot)}
                                        disabled={holdLoading}
                                        title={`Available (${slot.available} dentist${slot.available > 1 ? 's' : ''})`}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                                            isSelected
                                                ? 'bg-sky-500 text-white ring-2 ring-sky-500/20'
                                                : isHeldByMe
                                                  ? 'bg-amber-100 border border-amber-300 text-amber-900'
                                                  : 'bg-white border border-slate-100 text-slate-700 hover:border-sky-200 hover:shadow-md disabled:opacity-50'
                                        }`}
                                    >
                                        {slot.displayTime}
                                        {/* ✅ Show hold lock icon */}
                                        {isHeldByMe && (
                                            <Lock
                                                size={12}
                                                className='absolute top-1 right-1'
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='text-sm text-slate-500 py-4 bg-slate-50 rounded-xl px-4 flex flex-col gap-2'>
                            <p>No available slots for this date.</p>
                            {/* ✅ NEW: Suggest next available date if provided by backend */}
                            {nextAvailableDate && (
                                <p className='text-sky-600 font-medium text-sm'>
                                    Next available date:{' '}
                                    <button
                                        onClick={() =>
                                            handleDateClick(new Date(nextAvailableDate))
                                        }
                                        className='underline hover:text-sky-700 transition-colors'
                                    >
                                        {new Date(nextAvailableDate).toLocaleDateString(
                                            'en-US',
                                            {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            },
                                        )}
                                    </button>
                                </p>
                            )}
                            {!nextAvailableDate && <p>Try another day.</p>}
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            <div className='flex justify-between'>
                <button
                    onClick={onBack}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5'
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedDate || !selectedTime}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold
                               px-6 py-2.5 rounded-xl transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    Next: Your Info →
                </button>
            </div>
        </div>
    );
};

export default DateTimeStep;
