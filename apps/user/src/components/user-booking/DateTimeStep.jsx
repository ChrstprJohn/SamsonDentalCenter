import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, X, AlertCircle, RefreshCw, Clock, Plus, ArrowRight, Hourglass, Calendar, MousePointer2, Loader2, CheckCircle2, CalendarDays } from 'lucide-react';
import { api } from '../../utils/api';
import useSlots from '../../hooks/useSlots';
import JoinWaitlistModal from './JoinWaitlistModal';
import WaitlistOnlyWarningModal from './WaitlistOnlyWarningModal';

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
    userWaitlist = [], // ✅ NEW: Prop from parent
}) => {
    const [specialists, setSpecialists] = useState([]);
    const [specialistsLoading, setSpecialistsLoading] = useState(false);
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);
    const [waitlistSlot, setWaitlistSlot] = useState(null);
    // ✅ NEW: Add validation error state
    const [validationError, setValidationError] = useState(null);
    const [pendingSlot, setPendingSlot] = useState(null);
    const [showWaitlistOnlyWarning, setShowWaitlistOnlyWarning] = useState(false);

    // ✅ Slot holding for user booking (passed from parent)
    const { activeHold, holdSlot, releaseHold, formattedTime, holdLoading, holdError, timeRemaining } = slotHold;

    // VISIBILITY LIMIT: 3 columns * 6 rows = 18 slots
    const INITIAL_VISIBLE_COUNT = 18;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

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
        const key = formatDateKey(date);
        // Toggle Logic: If clicking the SAME date that's already selected, clear it
        if (selectedDate === key) {
            releaseHold();
            handleTimeUpdate({ date: '', time: '' });
        } else {
            handleTimeUpdate({ date: key, time: '' });
        }
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    // ✅ Handle both available and full slot clicks
    // ✅ UPDATED: Added toggle behavior + slot holding
    const handleTimeClick = async (slotData) => {
        const isCurrentlyHeldByMe = activeHold?.time === slotData.rawTime && selectedDate === activeHold.date;
        const isAvailable = slotData.available > 0 || isCurrentlyHeldByMe;

        setPendingSlot(slotData.rawTime);
        try {
            if (isAvailable) {
                // Available slot - toggle behavior
                const isCurrentlySelected = selectedTime === slotData.rawTime;

                if (isCurrentlySelected || isCurrentlyHeldByMe) {
                    await releaseHold();
                    handleTimeUpdate({ time: '' });
                } else {
                    if (!serviceId || !selectedDate) return;
                    const holdResult = await holdSlot(serviceId, selectedDate, slotData.rawTime, formData?.dentist_id);
                    if (holdResult?.success) {
                        handleTimeUpdate({ time: slotData.rawTime });
                    } else if (holdResult?.error === 'SLOT_TAKEN') {
                        refetchSlots();
                        return;
                    }
                }
            } else {
                // Full slot — toggle or show waitlist modal
                const isSelectedForWaitlist = formData?.waitlist_time === slotData.rawTime;
                const isAlreadyInDB = isSlotWaitlisted(slotData.rawTime);

                if (isAlreadyInDB) {
                    // DO NOTHING - User is already on the waitlist for this slot
                    return;
                }

                if (isSelectedForWaitlist) {
                    // ✅ Toggle OFF: If already on waitlist for this slot, remove it
                    handleTimeUpdate({
                        waitlist_date: '',
                        waitlist_time: '',
                    });
                } else {
                    // ✅ Toggle ON: Show waitlist modal
                    setWaitlistSlot(slotData);
                    setShowWaitlistModal(true);
                }
            }
        } finally {
            setPendingSlot(null);
        }
    };

    // ✅ Handle modal success - defer API call, just update form state
    const handleWaitlistModalSuccess = ({ date, time }) => {
        // Just add/update the waitlist request
        handleTimeUpdate({
            waitlist_date: date,
            waitlist_time: time,
        });
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

    // ✅ NEW: Check if user is already waitlisted for this specific slot
    const isSlotWaitlisted = (time) => {
        if (!time || !selectedDate || !serviceId) return false;
        
        return (userWaitlist || []).some(
            (w) =>
                w.preferred_date === selectedDate &&
                String(w.service_id) === String(serviceId) &&
                w.preferred_time?.substring(0, 5) === time.substring(0, 5)
        );
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

    // ✅ NEW: Handle Next button with validation & warning
    const handleNext = () => {
        if (!selectedDate) {
            setValidationError('Please select a date first');
            return;
        }

        if (!isValidSelection()) {
            setValidationError('Please select at least one time slot (either booking or waitlist)');
            return;
        }

        // ✅ NEW: If ONLY waitlist is selected, show warning modal
        if (formData?.waitlist_time && !selectedTime) {
            setShowWaitlistOnlyWarning(true);
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

    // Helper to format time (e.g. 09:00:00 -> 9:00 AM)
    const formatTimeDisplay = (rawTime) => {
        if (!rawTime) return '';
        const [hours, minutes] = rawTime.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    // Helper to format date (e.g. 2026-04-11 -> Sat, Apr 11)
    const formatDateDisplay = (dateKey) => {
        if (!dateKey) return '';
        const d = new Date(dateKey + 'T00:00:00'); // Use ISO format to avoid timezone issues
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const canGoPrev = viewDate.getMonth() > today.getMonth() || viewDate.getFullYear() > today.getFullYear();
    const canGoNext = viewDate < maxDate;

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

    // Filtered Slots for "Load More"
    const visibleSlots = useMemo(() => {
        if (!slots) return [];
        return slots
            .filter(slot => {
                // Hide slots that the user is already waitlisted for
                const isWaitlisted = isSlotWaitlisted(slot.rawTime);
                if (isWaitlisted) return false;
                
                // For user booking, we show ALL slots (including full ones) because they can join waitlist
                return true; 
            })
            .slice(0, visibleCount);
    }, [slots, visibleCount, activeHold, selectedDate]);

    const hasMoreSlots = slots && slots.length > visibleCount;

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
                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-brand-200'
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
                                ? 'border-brand-500 bg-brand-50 shadow-sm'
                                : 'border-slate-100 bg-white hover:border-brand-200'
                        }`}
                    >
                        {s.photo_url ? (
                            <img
                                src={s.photo_url}
                                alt={s.profile?.first_name ? `${s.profile.last_name}, ${s.profile.first_name}` : s.profile?.full_name}
                                className='w-10 h-10 rounded-full object-cover border border-slate-200'
                            />
                        ) : (
                            <div className='w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold'>
                                {s.profile?.first_name ? s.profile.first_name[0] : (s.profile?.full_name?.charAt(0))}
                            </div>
                        )}
                        <div>
                            <p className='text-sm font-bold text-slate-900'>Dr. {s.profile?.first_name ? `${s.profile.last_name}, ${s.profile.first_name} ${s.profile.middle_name || ''} ${s.profile.suffix || ''}`.replace(/\s+/g, ' ').trim() : s.profile?.full_name}</p>
                            <p className='text-xs text-slate-500 capitalize'>{s.tier} Specialist</p>
                        </div>
                    </button>
                ))
            )}
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-3xl font-bold text-slate-900 dark:text-white mb-3 font-display tracking-tight uppercase'>
                    Pick Date & Time
                </h2>
                <p className='text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed'>
                    Choose your preferred appointment date and available time slot. {serviceTier === 'specialized' && 'Select a specific dentist or "Any Specialist" to see availability.'}
                </p>
            </div>

            {/* ERROR / INFO Banners */}
            {(holdError || validationError) && (
                <div className='mb-6 space-y-3'>
                    {holdError && (
                        <div className='p-3.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex gap-3'>
                            <AlertCircle size={16} className='text-red-500 shrink-0' />
                            <p className='text-xs text-red-700 dark:text-red-400 font-bold'>{holdError}</p>
                        </div>
                    )}
                    {validationError && (
                        <div className='p-3.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex gap-3'>
                            <AlertCircle size={16} className='text-amber-500 shrink-0' />
                            <p className='text-xs text-amber-700 dark:text-amber-400 font-bold'>{validationError}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Specialist Selection (If specialized) */}
            {serviceTier === 'specialized' && (
                <div className="mb-10">
                    <SpecialistSidebar />
                </div>
            )}

            {/* SIDE-BY-SIDE Layout */}
            <div className='grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 mb-10'>
                
                {/* Left Column: Calendar Grid */}
                <div className='bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-theme-sm h-fit'>
                    <div className='flex items-center justify-between mb-5'>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase'>
                            <div className='p-1.5 bg-brand-50 dark:bg-brand-500/10 rounded-lg'><Calendar size={14} className='text-brand-500' /></div>
                            {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
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
                                <button key={idx} onClick={() => !isDisabled && handleDateClick(date)} disabled={isDisabled} className={`relative flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-300 ${isSelected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105 z-10' : isDisabled ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-30 shadow-none bg-transparent border-2 border-slate-100/50 dark:border-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-500/50 text-gray-700 dark:text-gray-300 shadow-theme-xs'}`}>
                                    <span className={`text-[13px] sm:text-sm font-bold ${isSelected ? 'text-white' : ''}`}>{date.getDate()}</span>
                                    {isToday && !isSelected && <div className="absolute bottom-1 sm:bottom-1.5 w-1 h-1 rounded-full bg-brand-500" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Time Selection / Empty State */}
                <div className='flex flex-col min-h-[400px]'>
                    {!selectedDate ? (
                        <div className='flex-grow bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500'>
                            <div className='bg-white dark:bg-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center shadow-theme-sm mb-5'><MousePointer2 size={28} className='text-brand-500' /></div>
                            <h4 className='text-base font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight uppercase'>Pick a Date</h4>
                            <p className='text-[12px] text-gray-500 dark:text-gray-400 max-w-[220px] leading-relaxed font-bold'>Select an available day from the calendar to see slots.</p>
                        </div>
                    ) : (
                        <div className='animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col bg-gray-50/30 dark:bg-white/[0.01] border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl p-6'>
                            <div className='flex items-center justify-between mb-5'>
                                <h3 className='text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase'>
                                    <div className='p-1.5 bg-brand-50 dark:bg-brand-500/10 rounded-lg'><Clock size={16} className='text-brand-500' /></div>
                                    Available Times
                                </h3>
                                <button onClick={refetchSlots} disabled={slotsLoading} className='flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-100 dark:border-gray-700 shadow-theme-xs transition-all disabled:opacity-50'><RefreshCw size={14} className={slotsLoading ? 'animate-spin' : ''} />Refresh</button>
                            </div>

                            {slotsLoading ? (
                                <div className='grid grid-cols-2 xsm:grid-cols-3 gap-3'>{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className='h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl' />)}</div>
                            ) : visibleSlots && visibleSlots.length > 0 ? (
                                <>
                                    <div className='grid grid-cols-2 xsm:grid-cols-3 gap-3 mb-6'>
                                        {visibleSlots.map((slot) => {
                                            const isHeldByMe = activeHold?.time === slot.rawTime && selectedDate === activeHold.date;
                                            const isSelectedForBooking = selectedTime === slot.rawTime && !pendingSlot;
                                            const isSelectedForWaitlist = formData?.waitlist_time === slot.rawTime;
                                            const isAvailable = slot.available > 0 || isHeldByMe;

                                            return (
                                                <button 
                                                    key={slot.rawTime} 
                                                    onClick={() => handleTimeClick(slot)} 
                                                    disabled={holdLoading && !isSelectedForBooking}
                                                    title={slot.available > 0 ? `${slot.available} slots available` : 'Fully booked - Join waitlist'}
                                                    className={`py-3 rounded-xl text-[12px] font-bold transition-all relative flex items-center justify-center ${
                                                        isSelectedForBooking && isAvailable
                                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 ring-4 ring-brand-500/10' 
                                                        : isSelectedForWaitlist && !isAvailable
                                                        ? 'bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-400 text-amber-900 dark:text-amber-100 shadow-lg shadow-amber-400/10 ring-4 ring-amber-400/10 opacity-100 scale-105 z-10'
                                                        : isHeldByMe 
                                                        ? 'bg-brand-50 dark:bg-brand-500/10 border-2 border-brand-200 text-brand-700 dark:text-brand-400' 
                                                        : isAvailable
                                                        ? 'bg-white dark:bg-white/[0.03] border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-500/50 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-theme-sm'
                                                        : 'bg-transparent dark:bg-transparent border-2 border-slate-100 dark:border-gray-800 text-slate-400 dark:text-slate-600 opacity-60'
                                                    }`}
                                                >
                                                    {pendingSlot === slot.rawTime && (isAvailable || isSelectedForBooking) ? (
                                                        <Loader2 size={16} className={`animate-spin ${isSelectedForBooking ? 'text-white' : 'text-brand-500'}`} />
                                                    ) : (
                                                        <>
                                                            {slot.displayTime}
                                                            {!isAvailable && <Lock size={10} className={`absolute top-2 right-2 ${isSelectedForWaitlist ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />}
                                                            {isHeldByMe && !isSelectedForBooking && <Lock size={10} className='absolute top-2 right-2 text-brand-500' />}
                                                        </>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
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
                                <div className='p-8 bg-gray-50 dark:bg-white/[0.02] rounded-2xl text-center border-2 border-dashed border-gray-200 dark:border-gray-800 flex-grow flex flex-col items-center justify-center leading-relaxed'><p className='text-gray-500 text-[14px] font-bold mb-2'>No available slots.</p>{nextAvailableDate && <button onClick={() => {const d = new Date(nextAvailableDate);setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));handleDateClick(d);}} className='text-brand-500 text-[13px] font-black hover:underline underline-offset-4'>Try {new Date(nextAvailableDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}</button>}</div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* SELECTION SUMMARY (User-Specific) */}
            {(selectedTime || formData?.waitlist_time) && (
                <div className='mb-10 p-5 sm:p-7 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-theme-sm animate-in fade-in slide-in-from-bottom-4 duration-500'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                        <div className='flex items-center gap-2.5'>
                            <div className='w-1 h-5 bg-brand-500 rounded-full' />
                            <h4 className='text-[11px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest'>Your Selection Summary</h4>
                        </div>
                        
                        {/* HOLD ADVISORY & TIMER (Final Wording) */}
                        {activeHold && (
                            <div className='flex items-center gap-3 bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200 dark:border-gray-800 px-4 py-2 rounded-xl animate-in fade-in zoom-in duration-500'>
                                <div className='flex flex-col gap-0.5'>
                                    <p className='text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight'>
                                        We are holding this time for you.
                                    </p>
                                    <p className='text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500'>
                                        Please complete your request within: <span className="font-mono text-brand-500 font-black ml-1 text-sm sm:text-base tracking-tighter">{formattedTime}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'> 
                        {selectedTime && (
                           <div className='group flex items-center justify-between gap-5 pl-3.5 pr-2.5 py-2.5 bg-white dark:bg-transparent border border-brand-100/50 dark:border-brand-500/20 rounded-2xl transition-all hover:border-brand-300 shadow-theme-xs'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-9 h-9 rounded-xl bg-brand-50/50 dark:bg-brand-500/5 flex items-center justify-center text-brand-500 transition-transform group-hover:scale-105'>
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className='text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 leading-none'>Primary Request</p>
                                        <div className='flex items-center gap-1.5'>
                                            <p className='text-[13px] sm:text-[14px] font-black text-slate-900 dark:text-white'>{formatDateDisplay(selectedDate)}</p>
                                            <span className='w-1 h-1 rounded-full bg-slate-200 dark:bg-gray-700' />
                                            <p className='text-[13px] sm:text-[14px] font-black text-brand-500'>{formatTimeDisplay(selectedTime)}</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleClearBooking} 
                                    className='p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-300 hover:text-red-500 transition-all active:scale-90 flex items-center justify-center' 
                                    title="Remove"
                                >
                                    <X size={16} className="stroke-[2.5]" />
                                </button>
                           </div>
                        )}

                        {formData?.waitlist_time && (
                            <div className='group flex items-center justify-between gap-5 pl-3.5 pr-2.5 py-2.5 bg-white dark:bg-transparent border border-amber-100/50 dark:border-amber-500/20 rounded-2xl transition-all hover:border-amber-300 shadow-theme-xs'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-9 h-9 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 flex items-center justify-center text-amber-500 transition-transform group-hover:scale-105'>
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className='text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 leading-none'>Waitlist Choice</p>
                                        <div className='flex items-center gap-1.5'>
                                            <p className='text-[13px] sm:text-[14px] font-black text-slate-900 dark:text-white'>{formatDateDisplay(formData.waitlist_date)}</p>
                                            <span className='w-1 h-1 rounded-full bg-slate-200 dark:bg-gray-700' />
                                            <p className='text-[13px] sm:text-[14px] font-black text-amber-500'>{formatTimeDisplay(formData.waitlist_time)}</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleClearWaitlist} 
                                    className='p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-300 hover:text-red-500 transition-all active:scale-90 flex items-center justify-center' 
                                    title="Remove"
                                >
                                    <X size={16} className="stroke-[2.5]" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation Footer */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-700'>
                <button onClick={onBack} className='w-full sm:w-auto text-gray-400 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white font-black text-[11px] px-8 py-4 transition-colors uppercase tracking-[0.2em]'>Back</button>
                <button 
                    onClick={handleNext} 
                    disabled={!isValidSelection()} 
                    className='w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-10 py-4.5 rounded-2xl transition-all shadow-xl shadow-brand-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm uppercase tracking-[0.1em]'
                >
                    Continue to Info
                    <ArrowRight size={18} />
                </button>
            </div>

            {/* Waitlist Modal */}
            {showWaitlistModal && waitlistSlot && (
                <JoinWaitlistModal
                    serviceId={serviceId}
                    date={selectedDate}
                    time={waitlistSlot.displayTime}
                    rawTime={waitlistSlot.rawTime}
                    serviceName={serviceName}
                    onSuccess={handleWaitlistModalSuccess}
                    onClose={() => {
                        setShowWaitlistModal(false);
                        setWaitlistSlot(null);
                    }}
                />
            )}
            {/* Waitlist-Only Warning Modal */}
            {showWaitlistOnlyWarning && (
                <WaitlistOnlyWarningModal 
                    onConfirm={() => {
                        setShowWaitlistOnlyWarning(false);
                        onNext();
                    }}
                    onCancel={() => setShowWaitlistOnlyWarning(false)}
                />
            )}
        </div>
    );
};

export default DateTimeStep;
