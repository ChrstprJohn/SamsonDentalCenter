import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useSlots from '../../hooks/useSlots';
import JoinWaitlistModal from '../user-booking/JoinWaitlistModal';

const DateTimeStep = ({
    serviceId,
    selectedDate,
    selectedTime,
    onUpdate,
    onNext,
    onBack,
    serviceName,
    joinWaitlist,
}) => {
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);

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

            // Issue #1: Only allow forward if within max booking range
            // Only allow backward if not already on the week containing today
            if (direction === 'next' && next > maxDate) {
                return prev;
            }
            if (direction === 'prev' && next < today) {
                return prev;
            }

            return next;
        });
    };

    const formatDateKey = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch slots for the selected date
    const { slots, loading: slotsLoading } = useSlots(selectedDate, serviceId);

    const handleDateClick = (date) => {
        const key = formatDateKey(date);
        onUpdate({ date: key, time: '' }); // Reset time when date changes
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Issue #3: Check if week navigation buttons should be disabled
    const canGoPrev = weekStart > today;
    const canGoNext = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) <= maxDate;

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Pick Date & Time</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Choose your preferred appointment date and available time slot.
            </p>

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
                    const isSelected = key === selectedDate;
                    const isSunday = date.getDay() === 0;
                    const isBeyondMax = date > maxDate;
                    const isDisabled = isPast || isSunday || isBeyondMax;

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
                                isSunday
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
                    <h3 className='text-sm font-semibold text-slate-700 mb-3'>Available Times</h3>
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
                            {slots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => {
                                        onUpdate({ time });
                                    }}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                        time === selectedTime
                                            ? 'bg-sky-500 text-white ring-2 ring-sky-500/20'
                                            : 'bg-white border border-slate-100 text-slate-700 hover:border-sky-200'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className='text-sm text-slate-400 py-4 bg-slate-50 rounded-xl px-4'>
                            No available slots for this date. Try another day.
                        </div>
                    )}
                </div>
            )}

            {/* ✅ IMPROVEMENT #1: Show waitlist option only after loading complete
                Check: !slotsLoading && slots !== null && slots.length === 0
                This prevents flicker of the Join Waitlist button during initial load */}
            {selectedDate &&
                selectedTime &&
                !slotsLoading &&
                slots !== null &&
                slots.length === 0 &&
                joinWaitlist && (
                    <div className='bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6'>
                        <p className='text-orange-800 text-sm mb-4'>
                            ❌ This time slot appears to be fully booked.
                        </p>
                        <div className='flex gap-3'>
                            <button
                                onClick={() => {
                                    onUpdate({ time: '' });
                                }}
                                className='border border-slate-300 text-slate-700 px-4 py-2 rounded-lg
                                       hover:bg-slate-50 font-medium text-sm transition-colors'
                            >
                                No, Pick Another Time
                            </button>
                            <button
                                onClick={() => setShowWaitlistModal(true)}
                                className='bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg
                                       font-medium text-sm transition-colors shadow-lg shadow-sky-500/25'
                            >
                                Join Waitlist
                            </button>
                        </div>
                    </div>
                )}

            {/* Waitlist modal */}
            {showWaitlistModal && (
                <JoinWaitlistModal
                    serviceId={serviceId}
                    date={selectedDate}
                    time={selectedTime}
                    serviceName={serviceName}
                    onSuccess={() => {
                        setShowWaitlistModal(false);
                        // Clear selections after joining waitlist
                        onUpdate({ date: '', time: '' });
                    }}
                    onClose={() => setShowWaitlistModal(false)}
                />
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
