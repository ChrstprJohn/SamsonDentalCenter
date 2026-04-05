import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, X, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../utils/api';
import useSlots from '../../hooks/useSlots';
import JoinWaitlistModal from './JoinWaitlistModal';

const DateTimeStep = ({
    serviceId,
    selectedDate,
    selectedTime,
    // ✅ NEW: Accept full formData for waitlist state
    formData,
    onUpdate,
    onNext,
    onBack,
    serviceName,
    serviceTier, // ✅ NEW: Tier to decide whether to show specialist selection
    sessionId,
    slotHold,
}) => {
    const [specialists, setSpecialists] = useState([]);
    const [specialistsLoading, setSpecialistsLoading] = useState(false);
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);
    const [waitlistSlot, setWaitlistSlot] = useState(null);
    // ✅ NEW: Add validation error state
    const [validationError, setValidationError] = useState(null);

    // ✅ Slot holding for user booking (passed from parent)
    const { activeHold, holdSlot, releaseHold, formattedTime, holdLoading, holdError } = slotHold;

    // Simple date picker state — starts from today
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

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

    // ✅ Fetch specialists if service is specialized
    useEffect(() => {
        if (serviceTier === 'specialized' && serviceId) {
            const fetchSpecialists = async () => {
                setSpecialistsLoading(true);
                try {
                    const response = await api.get(`/services/${serviceId}/specialists`);
                    setSpecialists(response.specialists || []);
                } catch (err) {
                    console.error('Failed to fetch specialists:', err);
                } finally {
                    setSpecialistsLoading(false);
                }
            };
            fetchSpecialists();
        } else {
            setSpecialists([]);
        }
    }, [serviceId, serviceTier]);

    // ✅ FIX: Use local date parts to avoid timezone shifting (e.g. UTC-8 or UTC+8 issues)
    const formatDateKey = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ✅ User Booking: Fetch ALL slots (available + full) for waitlist option
    // Hook returns: {time, rawTime, displayTime, available}
    // Only fetch if both date and serviceId are valid
    const {
        slots,
        nextAvailableDate,
        loading: slotsLoading,
        refetch: refetchSlots,
    } = useSlots(
        selectedDate || null,
        serviceId || null,
        true,
        sessionId,
        formData?.dentist_id || null, // 🎯 Pass selected dentist to filter slots
    );

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

        handleTimeUpdate({ date: key, time: '' }); // Reset time when date changes
    };

    // ✅ Handle both available and full slot clicks
    // ✅ UPDATED: Added toggle behavior + slot holding
    const handleTimeClick = async (slotData) => {
        const isAvailable = slotData.available > 0;

        if (isAvailable) {
            // Available slot - toggle behavior
            const isCurrentlySelected = selectedTime === slotData.rawTime;

            if (isCurrentlySelected) {
                // ✅ Toggle OFF: Click again to remove booking
                // ✅ NEW: Call releaseHold on backend
                await releaseHold();
                handleTimeUpdate({
                    time: '',
                    // Keep waitlist selection if it exists
                });
            } else {
                // ✅ Toggle ON: Select this available slot for booking
                // ✅ NEW: Call holdSlot to create a 5-minute hold on backend
                if (!serviceId || !selectedDate) return;

                const holdResult = await holdSlot(serviceId, selectedDate, slotData.rawTime, formData?.dentist_id);

                if (holdResult?.success) {
                    // ✅ Update time only after hold is confirmed
                    handleTimeUpdate({
                        time: slotData.rawTime,
                        // Keep waitlist selection if it exists - do NOT clear it
                    });
                } else if (holdResult?.error === 'SLOT_TAKEN') {
                    // ✅ Slot was taken — auto-refresh so user sees updated availability
                    refetchSlots();
                    return;
                }
            }
        } else {
            // Full slot — show waitlist modal (don't call API yet)
            setWaitlistSlot(slotData);
            setShowWaitlistModal(true);
        }
    };

    // ✅ Handle modal success - defer API call, just update form state
    // ✅ UPDATED: Do NOT clear time - allow user to have both booking AND waitlist!
    // ✅ FIXED: Support toggle behavior - clicking same slot in modal removes it
    const handleWaitlistModalSuccess = ({ date, time }) => {
        // Check if this is the same slot being toggled OFF
        const isCurrentlySelected = formData?.waitlist_time === time;

        if (isCurrentlySelected) {
            // ✅ Toggle OFF: Remove waitlist selection
            handleTimeUpdate({
                waitlist_date: '',
                waitlist_time: '',
                // Keep booking selection if it exists
            });
        } else {
            // ✅ Toggle ON: Add/change waitlist selection
            // Update form with waitlist selection, DO NOT clear time
            // ✅ DEFERRED: API call will happen during final submit
            // ✅ NEW: User can now have BOTH booking and waitlist selections
            handleTimeUpdate({
                // time is NOT cleared - keep booking selection if it exists!
                waitlist_date: date,
                waitlist_time: time,
            });
        }
        setShowWaitlistModal(false);
        setWaitlistSlot(null);
    };

    // ✅ Clear waitlist selection (user can clear independently)
    const handleClearWaitlist = () => {
        handleTimeUpdate({
            waitlist_date: '',
            waitlist_time: '',
        });
    };

    // ✅ NEW: Clear booking selection (user can clear independently)
    const handleClearBooking = async () => {
        // ✅ NEW: Call releaseHold on backend
        await releaseHold();
        handleTimeUpdate({
            time: '',
        });
    };

    // ✅ NEW: Validation function (GAP-1 fix)
    const isValidSelection = () => {
        const hasBooking = formData?.time;
        const hasWaitlist = formData?.waitlist_time;
        return hasBooking || hasWaitlist;
    };

    // ✅ NEW: Handle Next button with validation
    const handleNext = () => {
        if (!selectedDate) {
            setValidationError('Please select a date first');
            return;
        }

        if (!isValidSelection()) {
            setValidationError('Please select at least one time slot (either booking or waitlist)');
            return;
        }

        setValidationError(null);
        onNext();
    };

    // ✅ NEW: Clear validation error when user makes changes
    const handleTimeUpdate = (updates) => {
        setValidationError(null);
        onUpdate(updates);
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Check if week navigation buttons should be disabled
    const canGoPrev = weekStart > today;
    const canGoNext = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) <= maxDate;

    // ✅ NEW: Handle specialist change (reset time and release hold)
    const handleSpecialistChange = async (dentistId) => {
        setValidationError(null);
        if (formData.time) {
            await releaseHold();
        }
        onUpdate({
            dentist_id: dentistId,
            time: '',
            waitlist_time: '',
        });
    };

    // Specialist list Component
    const SpecialistSidebar = () => (
        <div className='flex flex-col gap-3 min-w-[200px]'>
            <h3 className='text-sm font-semibold text-slate-700 mb-1'>Select Specialist</h3>
            <button
                onClick={() => handleSpecialistChange('')}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    !formData?.dentist_id
                        ? 'border-sky-500 bg-sky-50 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-sky-200'
                }`}
            >
                <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                    ✨
                </div>
                <div>
                    <p className='text-sm font-bold text-slate-900'>Any Specialist</p>
                    <p className='text-xs text-slate-500'>Pick for best availability</p>
                </div>
            </button>

            {specialistsLoading ? (
                <div className='p-4 text-center text-xs text-slate-400'>Loading dentists...</div>
            ) : (
                specialists.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => handleSpecialistChange(s.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                            formData?.dentist_id === s.id
                                ? 'border-sky-500 bg-sky-50 shadow-sm'
                                : 'border-slate-100 bg-white hover:border-sky-200'
                        }`}
                    >
                        {s.photo_url ? (
                            <img
                                src={s.photo_url}
                                alt={s.profile?.full_name}
                                className='w-10 h-10 rounded-full object-cover border border-slate-200'
                            />
                        ) : (
                            <div className='w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold'>
                                {s.profile?.full_name?.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className='text-sm font-bold text-slate-900'>Dr. {s.profile?.full_name}</p>
                            <p className='text-xs text-slate-500 capitalize'>{s.tier} Specialist</p>
                        </div>
                    </button>
                ))
            )}
        </div>
    );

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Pick Date & Time</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Choose your preferred appointment date and time. {serviceTier === 'specialized' && 'Select a specific dentist or "Any Specialist" to see availability.'}
            </p>

            <div className={`flex flex-col ${serviceTier === 'specialized' ? 'md:flex-row' : ''} gap-8`}>
                {/* 🎯 Specialist Sidebar (Only for specialized) */}
                {serviceTier === 'specialized' && <SpecialistSidebar />}

                {/* Main Content (Calendar + Slots) */}
                <div className='flex-grow'>
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
                    {/* Visual tooltip for disabled state */}
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
                        <h3 className='text-sm font-semibold text-slate-700'>
                            Available Times for{' '}
                            <span className='font-bold text-slate-900'>
                                {new Date(selectedDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </h3>
                        {/* ✅ Refresh Button */}
                        <button
                            onClick={refetchSlots}
                            disabled={slotsLoading}
                            className='flex items-center gap-1 px-3 py-1 text-xs bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <RefreshCw
                                size={14}
                                className={slotsLoading ? 'animate-spin' : ''}
                            />
                            Refresh
                        </button>
                    </div>

                    {/* ✅ NEW: Hold Indicator with Countdown */}
                    {activeHold && selectedDate === activeHold.date && (
                        <div className='mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                            <div className='flex items-start gap-2'>
                                <Lock
                                    size={16}
                                    className='text-amber-600 mt-1 shrink-0'
                                />
                                <div className='grow'>
                                    <p className='text-sm font-medium text-amber-900'>
                                        🔒 Slot Reserved: {selectedDate} @ {activeHold.time}
                                    </p>
                                    <p className='text-xs text-amber-700 mt-1'>
                                        Time remaining: <strong>{formattedTime}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ✅ NEW: Hold Error Banner */}
                    {holdError && (
                        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                            <div className='flex items-start gap-2'>
                                <AlertCircle
                                    size={16}
                                    className='text-red-600 mt-0.5 shrink-0'
                                />
                                <p className='text-sm text-red-700'>{holdError}</p>
                            </div>
                        </div>
                    )}

                    {/* ✅ NEW: Validation Error Banner */}
                    {validationError && (
                        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                            <div className='flex items-start gap-2'>
                                <AlertCircle
                                    size={16}
                                    className='text-red-600 mt-0.5 shrink-0'
                                />
                                <p className='text-sm text-red-700'>{validationError}</p>
                            </div>
                        </div>
                    )}

                    {slotsLoading ? (
                        // Visual loading continuity with spinner
                        <div className='flex items-center justify-center py-8'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className='w-5 h-5 border-3 border-slate-200 border-t-sky-500 rounded-full animate-spin' />
                                <p className='text-sm text-slate-400'>Checking availability...</p>
                            </div>
                        </div>
                    ) : slots && slots.length > 0 ? (
                        <div className='grid grid-cols-3 sm:grid-cols-5 gap-2'>
                            {slots.map((slot) => {
                                // ✅ Each slot object has: {time, rawTime, displayTime, available}
                                // Available: available > 0 (show as clickable, blue border)
                                // Full: available === 0 (show as clickable, gray, lock icon, opens waitlist modal)
                                // ✅ NEW: Check if this slot is held by ME (this session)
                                const isHeldByMe =
                                    activeHold?.time === slot.rawTime &&
                                    selectedDate === activeHold.date;

                                // ✅ NEW: Effective availability: if I'm holding it, it's still available to me
                                const effectiveAvailable = slot.available + (isHeldByMe ? 1 : 0);
                                const isAvailable = effectiveAvailable > 0;

                                const isSelectedForBooking = selectedTime === slot.rawTime;
                                const isSelectedForWaitlist =
                                    formData?.waitlist_time === slot.rawTime;

                                return (
                                    <button
                                        key={slot.rawTime}
                                        onClick={() => handleTimeClick(slot)}
                                        title={
                                            isAvailable
                                                ? `${isSelectedForBooking ? 'Click to remove' : 'Click to book'} (${slot.available} dentist${slot.available > 1 ? 's' : ''})`
                                                : isSelectedForWaitlist
                                                  ? 'Click to remove from waitlist'
                                                  : 'Full - Click to join waitlist'
                                        }
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                                            // ✅ NEW: Separate styling for booking vs waitlist selection
                                            isSelectedForBooking && isAvailable
                                                ? 'bg-sky-500 text-white ring-2 ring-sky-500/20'
                                                : isSelectedForWaitlist && !isAvailable
                                                  ? 'bg-amber-400 text-white ring-2 ring-amber-400/20'
                                                  : isAvailable
                                                    ? 'bg-white border border-slate-100 text-slate-700 hover:border-sky-200 hover:shadow-md cursor-pointer'
                                                    : 'bg-slate-50 border border-slate-200 text-slate-600 opacity-60 hover:border-slate-300 cursor-pointer'
                                        }`}
                                    >
                                        {slot.displayTime}
                                        {/* Show lock icon for full slots */}
                                        {!isAvailable && (
                                            <Lock
                                                size={12}
                                                className={`absolute top-1 right-1 ${
                                                    isSelectedForWaitlist
                                                        ? 'text-white'
                                                        : 'text-slate-400'
                                                }`}
                                            />
                                        )}
                                        {/* Show checkmark for selected booking slots */}
                                        {isSelectedForBooking && isAvailable && (
                                            <span className='absolute top-1 right-1 text-white font-bold'>
                                                ✓
                                            </span>
                                        )}
                                        {/* Show clock icon for selected waitlist slots */}
                                        {isSelectedForWaitlist && !isAvailable && (
                                            <span className='absolute top-1 right-1 text-white text-xs'>
                                                ⏳
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='text-sm text-slate-500 py-4 bg-slate-50 rounded-xl px-4 flex flex-col gap-2'>
                            <p>No slots for this date.</p>
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

                    {/* Show info about full slots when they exist */}
                    {selectedDate && slots && slots.some((s) => s.available === 0) && (
                        <div className='mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200'>
                            <p className='text-xs text-slate-600 flex items-center gap-2'>
                                <Lock size={14} />
                                <span>
                                    <strong>Full slots</strong> (🔒) can't be booked directly, but
                                    you can <strong>click to join the waitlist</strong> to be
                                    notified when they open.
                                </span>
                            </p>
                        </div>
                    )}

                    {/* ✅ UPDATED: Show both selections if they exist */}
                    {selectedTime && (
                        <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                            <p className='text-sm text-blue-900 flex items-center justify-between'>
                                <span>
                                    ✅ <strong>Booking:</strong> {selectedDate} at {selectedTime}
                                </span>
                                <button
                                    onClick={handleClearBooking}
                                    className='text-blue-600 hover:text-blue-700 font-medium text-xs'
                                    title='Clear booking selection'
                                >
                                    Clear
                                </button>
                            </p>
                        </div>
                    )}

                    {/* ✅ NEW: Waitlist status banner - shows if user selected a waitlist slot */}
                    {formData?.waitlist_time && (
                        <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                            <p className='text-sm text-amber-900 flex items-center justify-between'>
                                <span>
                                    ⏳ <strong>Waitlist:</strong> {formData.waitlist_date} at{' '}
                                    {formData.waitlist_time}
                                </span>
                                <button
                                    onClick={handleClearWaitlist}
                                    className='text-amber-600 hover:text-amber-700 font-medium text-xs'
                                    title='Clear waitlist selection'
                                >
                                    Clear
                                </button>
                            </p>
                        </div>
                    )}

                    {/* ✅ NEW: Comprehensive selection summary at bottom */}
                    {(selectedTime || formData?.waitlist_time) && (
                        <div className='mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg'>
                            <h4 className='font-semibold text-slate-900 text-sm mb-3'>
                                📋 Your Selections
                            </h4>
                            <div className='space-y-2 text-sm'>
                                {selectedTime && (
                                    <div className='flex items-center justify-between p-2 bg-blue-50 border border-blue-100 rounded'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-lg'>✅</span>
                                            <div>
                                                <div className='font-medium text-slate-900'>
                                                    Booking Appointment
                                                </div>
                                                <div className='text-xs text-slate-600'>
                                                    {selectedDate} @ {selectedTime}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleClearBooking}
                                            className='text-slate-400 hover:text-slate-600 transition-colors'
                                            title='Remove booking selection'
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                {formData?.waitlist_time && (
                                    <div className='flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-lg'>⏳</span>
                                            <div>
                                                <div className='font-medium text-slate-900'>
                                                    Waitlist
                                                </div>
                                                <div className='text-xs text-slate-600'>
                                                    {formData.waitlist_date} @{' '}
                                                    {formData.waitlist_time}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleClearWaitlist}
                                            className='text-slate-400 hover:text-slate-600 transition-colors'
                                            title='Remove waitlist selection'
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Tips based on selection */}
                            <div className='mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2'>
                                <span className='text-sm leading-none'>💡</span>
                                <div>
                                    {selectedTime && formData?.waitlist_time ? (
                                        <span>
                                            You have <strong>both options selected</strong>. You'll
                                            book the {selectedTime} slot and be added to the
                                            waitlist for {formData.waitlist_time}.
                                        </span>
                                    ) : selectedTime ? (
                                        <span>
                                            You can still <strong>click a full slot</strong> to add
                                            it to your waitlist options.
                                        </span>
                                    ) : formData?.waitlist_time ? (
                                        <span>
                                            You can still <strong>click an available slot</strong>{' '}
                                            to book an appointment and keep this waitlist selection.
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ✅ UPDATED: Waitlist modal - now dumb UI, no API calls */}
            {showWaitlistModal && waitlistSlot && (
                <JoinWaitlistModal
                    serviceId={serviceId}
                    date={selectedDate}
                    time={waitlistSlot.displayTime}
                    serviceName={serviceName}
                    onSuccess={handleWaitlistModalSuccess}
                    onClose={() => {
                        setShowWaitlistModal(false);
                        setWaitlistSlot(null);
                    }}
                />
            )}

            {/* ✅ NEW: Validation Error Banner (GAP-1) */}
            {validationError && (
                <div className='bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 flex items-start gap-3'>
                    <AlertCircle
                        size={20}
                        className='text-red-600 shrink-0 mt-0.5'
                    />
                    <div>
                        <p className='text-sm font-semibold text-red-900 mb-1'>
                            Selection Required
                        </p>
                        <p className='text-sm text-red-800'>{validationError}</p>
                    </div>
                </div>
            )}

                </div>
            </div>

            {/* Navigation */}
            <div className='flex justify-between'>
                <button
                    onClick={onBack}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5'
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    // ✅ UPDATED: Allow proceed if user has EITHER regular time OR waitlist time
                    disabled={!selectedDate || (!selectedTime && !formData?.waitlist_time)}
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
