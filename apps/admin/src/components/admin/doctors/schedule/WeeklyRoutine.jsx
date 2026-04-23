import React, { useState } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarOff, CheckSquare } from 'lucide-react';
import { Switch, Input, Button, Modal } from '../../../ui';
import { useToast } from '../../../../context/ToastContext.jsx';

const WeeklyRoutine = ({ externalBlockModalOpen, setExternalBlockModalOpen }) => {
    const { showToast } = useToast();
    const initialDays = [
        { id: 'Monday', isWorking: true, start: '08:00', end: '17:00' },
        { id: 'Tuesday', isWorking: true, start: '08:00', end: '17:00' },
        { id: 'Wednesday', isWorking: true, start: '08:00', end: '17:00' },
        { id: 'Thursday', isWorking: true, start: '08:00', end: '17:00' },
        { id: 'Friday', isWorking: true, start: '08:00', end: '17:00' },
        { id: 'Saturday', isWorking: false, start: '08:00', end: '12:00' },
        { id: 'Sunday', isWorking: false, start: '08:00', end: '12:00' }
    ];

    const [schedule, setSchedule] = useState(initialDays);
    const [draftSchedule, setDraftSchedule] = useState(initialDays);
    const [isSaving, setIsSaving] = useState(false);
    
    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Internal fallback if no external state is provided (for backward compat)
    const [_isBlockModalOpen, _setIsBlockModalOpen] = useState(false);
    const isBlockModalOpen = externalBlockModalOpen !== undefined ? externalBlockModalOpen : _isBlockModalOpen;
    const setIsBlockModalOpen = setExternalBlockModalOpen !== undefined ? setExternalBlockModalOpen : _setIsBlockModalOpen;

    const [blockModalMode, setBlockModalMode] = useState('view');

    // Blocked Dates State (YYYY-MM-DD format)
    const [blockedDates, setBlockedDates] = useState(new Set());
    const [draftBlockedDates, setDraftBlockedDates] = useState(new Set());
    const [draftUnblockedDates, setDraftUnblockedDates] = useState(new Set());
    
    // Reason States
    const [blockReason, setBlockReason] = useState('leave');
    const [otherReason, setOtherReason] = useState('');

    // Main Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    // Block Modal Calendar State
    const [blockCalDate, setBlockCalDate] = useState(new Date());

    const navMonth = (setter, date, offset) => {
        setter(new Date(date.getFullYear(), date.getMonth() + offset, 1));
    };

    const goThisMonth = () => setCurrentDate(new Date());

    // Calendar Generation Logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // Sunday is 0

    // Format YYYY-MM-DD
    const formatDateKey = (y, m, d) => {
        return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    };

    const jsDayToScheduleIndex = (jsDay) => jsDay === 0 ? 6 : jsDay - 1;

    // --- Weekly Edit Actions ---
    const handleToggle = (index) => {
        const newSchedule = [...draftSchedule];
        newSchedule[index].isWorking = !newSchedule[index].isWorking;
        setDraftSchedule(newSchedule);
    };

    const handleTimeChange = (index, field, value) => {
        const newSchedule = [...draftSchedule];
        newSchedule[index][field] = value;
        setDraftSchedule(newSchedule);
    };

    const applyToAll = () => {
        const monday = draftSchedule[0];
        const newSchedule = draftSchedule.map((day, i) => {
            if (i === 0 || !day.isWorking) return day; 
            return { ...day, start: monday.start, end: monday.end };
        });
        setDraftSchedule(newSchedule);
        showToast('Monday\'s hours applied to all working days.', 'success');
    };

    const saveWeekly = () => {
        setIsSaving(true);
        setTimeout(() => {
            setSchedule([...draftSchedule]);
            setIsSaving(false);
            setIsEditModalOpen(false);
            showToast('Weekly routine updated.', 'success');
        }, 800);
    };

    // --- Block Date Actions ---
    const toggleBlockDate = (dateKey) => {
        if (blockedDates.has(dateKey)) {
            const newUnblocks = new Set(draftUnblockedDates);
            if (newUnblocks.has(dateKey)) newUnblocks.delete(dateKey);
            else newUnblocks.add(dateKey);
            setDraftUnblockedDates(newUnblocks);
        } else {
            const newDrafts = new Set(draftBlockedDates);
            if (newDrafts.has(dateKey)) newDrafts.delete(dateKey);
            else newDrafts.add(dateKey);
            setDraftBlockedDates(newDrafts);
        }
    };

    const saveBlocks = () => {
        setIsSaving(true);
        setTimeout(() => {
            setBlockedDates(prev => {
                const next = new Set(prev);
                draftUnblockedDates.forEach(d => next.delete(d));
                draftBlockedDates.forEach(d => next.add(d));
                return next;
            });
            setIsSaving(false);
            setIsBlockModalOpen(false);
            showToast('Blocked dates updated.', 'success');
        }, 800);
    };

    const openEditModal = () => {
        setDraftSchedule([...schedule]);
        setIsEditModalOpen(true);
    };

    const openBlockModal = () => {
        setDraftBlockedDates(new Set()); // Only track *new* selections in this session
        setDraftUnblockedDates(new Set());
        setBlockReason('leave');
        setOtherReason('');
        setBlockCalDate(new Date()); // reset to current month
        setIsBlockModalOpen(true);
    };

    const formatTimeToAMPM = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'pm' : 'am';
        const h12 = h % 12 || 12;
        const mins = minutes === '00' ? '' : `:${minutes}`;
        return `${h12}${mins} ${ampm}`;
    };

    // Main calendar vars
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startingDay = getFirstDayOfMonth(year, month);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    // Block modal calendar vars
    const blockYear = blockCalDate.getFullYear();
    const blockMonth = blockCalDate.getMonth();
    const blockDaysInMonth = getDaysInMonth(blockYear, blockMonth);
    const blockStartingDay = getFirstDayOfMonth(blockYear, blockMonth);
    const blockMonthName = blockCalDate.toLocaleString('default', { month: 'long' });

    return (
        <div className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-white/[0.03] overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h4 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                        Weekly Routine & Blocks
                    </h4>
                    <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mt-1'>
                        Manage recurring availability and specific date exceptions.
                    </p>
                </div>
                <div className='hidden sm:flex items-center gap-3'>
                    <Button 
                        variant="soft" 
                        onClick={openBlockModal}
                        className="text-sm font-bold h-10 px-4 flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                        <CalendarOff size={16} />
                        Block Date
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={openEditModal}
                        className="text-sm font-bold h-10 px-4 flex items-center gap-2"
                    >
                        <CalendarIcon size={16} />
                        Edit Weekly Sched
                    </Button>
                </div>
            </div>

            {/* Main Read-only Display view: Full Calendar */}
            <div className='overflow-hidden bg-white dark:bg-transparent'>
                <div className='flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.01] gap-2'>
                    <div>
                        <h3 className='text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none'>{monthName} {year}</h3>
                    </div>
                    <div className='flex items-center gap-1.5 sm:gap-2'>
                        <Button variant="outline" size="sm" onClick={goThisMonth} className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 h-7 sm:h-8 border-gray-200 dark:border-gray-700">Today</Button>
                        <div className='flex items-center gap-1 ml-1 sm:ml-2'>
                            <button onClick={() => navMonth(setCurrentDate, currentDate, -1)} className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-500 transition-all'>
                                <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button onClick={() => navMonth(setCurrentDate, currentDate, 1)} className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-500 transition-all'>
                                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className='py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400'>{day}</div>
                    ))}
                </div>

                {/* Day grid */}
                <div className='grid grid-cols-7 w-full border-t border-l border-gray-200 dark:border-gray-700'>
                    {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} className='bg-gray-50/50 dark:bg-gray-800/10 border-r border-b border-gray-100 dark:border-gray-800 aspect-square' />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dateNum = i + 1;
                        const dateObj = new Date(year, month, dateNum);
                        const jsDay = dateObj.getDay();
                        const scheduleIndex = jsDayToScheduleIndex(jsDay);
                        const dayConfig = schedule[scheduleIndex];
                        const dateKey = formatDateKey(year, month, dateNum);
                        
                        const isBlocked = blockedDates.has(dateKey);
                        const isEffectivelyWorking = dayConfig.isWorking && !isBlocked;

                        const isSelected = isSameDay(dateObj, currentDate);
                        const isToday = isSameDay(dateObj, new Date());

                        return (
                            <div 
                                key={dateNum} 
                                onClick={() => setCurrentDate(dateObj)}
                                className={`
                                    relative aspect-square p-1.5 sm:p-3 flex flex-col transition-all cursor-pointer group
                                    border-r border-b border-gray-200 dark:border-gray-700
                                    ${!isEffectivelyWorking ? 'bg-gray-50/30 dark:bg-white/[0.01]' : 'bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/[0.02]'}
                                `}
                            >
                                <div className="flex items-center justify-between mb-auto">
                                    <span className={`text-xs sm:text-lg font-black ${!isEffectivelyWorking ? 'text-gray-400' : isToday ? 'text-brand-500' : 'text-gray-900 dark:text-white'}`}>
                                        {dateNum}
                                    </span>
                                    {isToday && <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                                </div>

                                <div className='flex flex-col justify-end min-w-0 w-full mt-auto'>
                                    {isEffectivelyWorking ? (
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-1 text-[8px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300 leading-[1.1] sm:leading-normal truncate'>
                                            {(() => {
                                                const f = (t) => {
                                                    const [h, m] = t.split(':').map(Number);
                                                    const d = new Date().setHours(h, m);
                                                    return format(d, m === 0 ? 'ha' : 'h:mma').toLowerCase();
                                                };
                                                return (
                                                    <>
                                                        <span>{f(dayConfig.start)}</span>
                                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                                            <span className="opacity-40 sm:hidden">/</span>
                                                            <span className="opacity-40 hidden sm:inline">-</span>
                                                            <span>{f(dayConfig.end)}</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div className='w-full flex items-center gap-1 opacity-60'>
                                            {isBlocked && <CalendarOff size={10} className="text-red-500" />}
                                            <span className='text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate'>
                                                {isBlocked ? 'Blocked' : 'Closed'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {Array.from({ length: (7 - ((startingDay + daysInMonth) % 7)) % 7 }).map((_, i) => <div key={`empty-end-${i}`} className='bg-gray-50/50 dark:bg-gray-800/10 border-r border-b border-gray-100 dark:border-gray-800 aspect-square' />)}
                </div>
            </div>

            {/* Mobile Action Buttons (Under Calendar) */}
            <div className='flex sm:hidden flex-col items-stretch gap-3 mt-6 px-5 pb-6'>
                <Button 
                    variant="soft" 
                    onClick={openBlockModal}
                    className="text-[13px] w-full font-bold h-11 px-4 flex items-center justify-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent dark:border-red-900/30"
                >
                    <CalendarOff size={16} />
                    Block Date
                </Button>
                <Button 
                    variant="outline" 
                    onClick={openEditModal}
                    className="text-[13px] w-full font-bold h-11 px-4 flex items-center justify-center gap-2"
                >
                    <CalendarIcon size={16} />
                    Edit Weekly Sched
                </Button>
            </div>

            {/* 1. Edit Weekly Schedule Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => !isSaving && setIsEditModalOpen(false)} className='max-w-[720px] w-[95%] sm:w-full m-auto'>
                <div className='no-scrollbar relative w-full overflow-y-auto rounded-xl bg-white p-5 dark:bg-gray-900 sm:p-10 max-h-[90vh] flex flex-col'>
                    <div className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                        <div>
                            <h4 className='text-[clamp(18px,2.5vw,22px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                                Edit Weekly Schedule
                            </h4>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                Set default availability and working hours.
                            </p>
                        </div>
                        <Button variant="outline" onClick={applyToAll} type="button" className="text-xs font-bold h-9 px-3 flex items-center gap-2 whitespace-nowrap">
                            <Clock size={14} /> Apply Monday to All
                        </Button>
                    </div>

                    <div className='overflow-x-auto no-scrollbar flex-grow mb-6'>
                        <table className='w-full text-left'>
                            <thead>
                                <tr className='text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800'>
                                    <th className='pb-4'>Day</th>
                                    <th className='pb-4'>Status</th>
                                    <th className='pb-4'>Working Hours</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                                {draftSchedule.map((day, index) => (
                                    <tr key={day.id} className='group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors'>
                                        <td className='py-4 text-sm font-semibold text-gray-800 dark:text-white w-24'>{day.id}</td>
                                        <td className='py-4 w-32'>
                                            <div className='flex items-center gap-2'>
                                                <Switch checked={day.isWorking} onChange={() => handleToggle(index)} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${day.isWorking ? 'text-brand-500' : 'text-gray-400'}`}>
                                                    {day.isWorking ? 'Working' : 'Off'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='py-4'>
                                            {day.isWorking ? (
                                                <div className='flex items-center gap-2'>
                                                    <Input type="time" value={day.start} onChange={(e) => handleTimeChange(index, 'start', e.target.value)} className="w-32 h-9 text-xs font-bold bg-white dark:bg-gray-900" />
                                                    <span className='text-gray-400 font-bold text-xs'>to</span>
                                                    <Input type="time" value={day.end} onChange={(e) => handleTimeChange(index, 'end', e.target.value)} className="w-32 h-9 text-xs font-bold bg-white dark:bg-gray-900" />
                                                </div>
                                            ) : (
                                                <span className='text-xs font-medium text-gray-400 italic block py-1.5'>Closed for routing</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 sm:justify-end'>
                        <Button variant='outline' type="button" onClick={() => setIsEditModalOpen(false)} disabled={isSaving} className='flex-1 sm:flex-none px-6 py-3.5 h-11 rounded-lg text-[14px] font-black'>Cancel</Button>
                        <Button onClick={saveWeekly} disabled={isSaving} className='flex-1 sm:flex-none px-8 py-3.5 h-11 rounded-lg text-[14px] font-black bg-gray-900 text-white min-w-[170px] dark:bg-white dark:text-gray-900 shadow-theme-xs hover:bg-gray-800 active:scale-95 transition-all'>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 2. Block Date Multi-Select Modal */}
            <Modal isOpen={isBlockModalOpen} onClose={() => !isSaving && setIsBlockModalOpen(false)} className='max-w-[760px] w-[95%] sm:w-full m-auto'>
                <div className='no-scrollbar relative w-full overflow-y-auto rounded-xl bg-white dark:bg-gray-900 p-6 sm:p-8 max-h-[90vh] flex flex-col min-h-[540px]'>
                    <div className='mb-6 shrink-0'>
                        <h4 className='text-[clamp(18px,2.5vw,22px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                            Manage Blocked Dates
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            View current overrides, add new blocks, or remove existing ones.
                        </p>
                    </div>

                    <div className='flex flex-col md:flex-row gap-8 flex-grow'>
                        {/* LEFT PANE: Calendar */}
                        <div className='flex-grow md:w-[60%] flex flex-col'>
                            <div className='-mx-5 sm:mx-0 border-y sm:border border-gray-200 dark:border-gray-800 sm:rounded-xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.01]'>
                                <div className='flex items-center justify-between px-5 sm:px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
                                    <h3 className='text-base font-bold text-gray-900 dark:text-white'>{blockMonthName} {blockYear}</h3>
                                    <div className='flex items-center gap-1'>
                                        <button onClick={() => navMonth(setBlockCalDate, blockCalDate, -1)} className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500'><ChevronLeft size={16} /></button>
                                        <button onClick={() => navMonth(setBlockCalDate, blockCalDate, 1)} className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500'><ChevronRight size={16} /></button>
                                    </div>
                                </div>
                                
                                <div className='grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                        <div key={idx} className='py-2 text-center text-[10px] font-bold uppercase text-gray-400'>{day}</div>
                                    ))}
                                </div>

                                <div className='max-h-[40vh] sm:max-h-[340px] overflow-y-auto no-scrollbar bg-gray-200 dark:bg-gray-800'>
                                    <div className='grid grid-cols-7 gap-[1px]'>
                                        {Array.from({ length: blockStartingDay }).map((_, i) => <div key={`bem-${i}`} className='bg-white dark:bg-gray-900 aspect-square' />)}
                                        
                                        {Array.from({ length: blockDaysInMonth }).map((_, i) => {
                                            const d = i + 1;
                                            const dKey = formatDateKey(blockYear, blockMonth, d);
                                            const isPendingUnblock = draftUnblockedDates.has(dKey);
                                            const isSavedBlocked = blockedDates.has(dKey);
                                            const isPendingBlock = draftBlockedDates.has(dKey);
                                            const jsDow = (blockStartingDay + i) % 7;
                                            
                                            // Check if the day is closed based on standard weekly routine
                                            const scheduleIdx = jsDayToScheduleIndex(jsDow);
                                            const isRoutineClosed = !schedule[scheduleIdx]?.isWorking;
                                            
                                            let cellClass = 'bg-white dark:bg-gray-900 border-transparent text-gray-700 dark:text-gray-300';
                                            let isDisabled = true;
                                            let renderCheck = null;

                                            if (blockModalMode === 'block') {
                                                if (isRoutineClosed) {
                                                    cellClass = 'bg-gray-50 dark:bg-gray-800/20 border-transparent opacity-40 cursor-not-allowed text-gray-400';
                                                } else if (isSavedBlocked) {
                                                    cellClass = 'bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 opacity-90 cursor-not-allowed';
                                                    renderCheck = <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-tight sm:tracking-widest text-red-500 opacity-80 mix-blend-multiply dark:mix-blend-lighten">Blocked</span>;
                                                } else {
                                                    isDisabled = false;
                                                    if (isPendingBlock) {
                                                        cellClass = 'bg-brand-50 dark:bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-400 shadow-sm z-10';
                                                        renderCheck = <input type="checkbox" readOnly checked className="w-3.5 h-3.5 accent-brand-500 cursor-pointer pointer-events-none" />;
                                                    } else {
                                                        cellClass = 'hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer';
                                                        renderCheck = <input type="checkbox" readOnly checked={false} className="w-3.5 h-3.5 accent-brand-500 cursor-pointer pointer-events-none opacity-20" />;
                                                    }
                                                }
                                            } else if (blockModalMode === 'unblock') {
                                                if (isSavedBlocked) {
                                                    isDisabled = false;
                                                    if (isPendingUnblock) {
                                                        cellClass = 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 opacity-80 cursor-pointer border border-dashed border-gray-300 dark:border-gray-700'; 
                                                        renderCheck = <input type="checkbox" readOnly checked={false} className="w-3.5 h-3.5 cursor-pointer pointer-events-none opacity-20" />;
                                                    } else {
                                                        cellClass = 'bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 cursor-pointer shadow-theme-xs z-10';
                                                        renderCheck = <input type="checkbox" readOnly checked className="w-3.5 h-3.5 accent-red-500 cursor-pointer pointer-events-none opacity-90" />;
                                                    }
                                                } else {
                                                    cellClass = 'bg-gray-50 dark:bg-gray-800 border-transparent opacity-40 cursor-not-allowed text-gray-400';
                                                }
                                            } else {
                                                // VIEW MODE
                                                if (isRoutineClosed) {
                                                    cellClass = 'bg-gray-50 dark:bg-gray-800/20 border-transparent opacity-40 cursor-not-allowed text-gray-400';
                                                } else if (isSavedBlocked) {
                                                    cellClass = 'bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 opacity-90 cursor-not-allowed shadow-theme-xs';
                                                    renderCheck = <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-tight sm:tracking-widest text-red-500 opacity-80 mix-blend-multiply dark:mix-blend-lighten">Blocked</span>;
                                                } else {
                                                    cellClass = 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 cursor-not-allowed opacity-60';
                                                }
                                            }

                                            return (
                                                <button 
                                                    key={d} 
                                                    onClick={() => !isDisabled && toggleBlockDate(dKey)}
                                                    disabled={isDisabled}
                                                    className={`aspect-square p-1 flex flex-col items-center justify-center transition-all border rounded ${cellClass}`}
                                                >
                                                    <div className='flex-grow flex items-center justify-center w-full'>
                                                        <span className='text-sm font-bold'>{d}</span>
                                                    </div>
                                                    <div className='h-4 flex items-center justify-center pb-1'>
                                                        {renderCheck}
                                                    </div>
                                                </button>
                                            );
                                        })}

                                        {Array.from({ length: (7 - ((blockStartingDay + blockDaysInMonth) % 7)) % 7 }).map((_, i) => <div key={`bee-${i}`} className='bg-white dark:bg-gray-900 aspect-square' />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANE: Actions */}
                        <div className='md:w-[40%] flex flex-col gap-6 md:pl-2 bg-white dark:bg-gray-900'>
                            <div className='shrink-0'>
                                <label className='text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 block uppercase tracking-widest'>Action Mode</label>
                                <div className='flex flex-col gap-2'>
                                    <Button 
                                        variant={blockModalMode === 'block' ? 'primary' : 'outline'} 
                                        className="justify-between w-full h-11 font-bold font-outfit"
                                        onClick={() => {
                                            if (blockModalMode === 'block') setBlockModalMode('view');
                                            else {
                                                setBlockModalMode('block');
                                                setDraftUnblockedDates(new Set()); // Reset conflicting state
                                                showToast('Edit mode active. Click dates to block them.', 'notice', 'Notice');
                                            }
                                        }}
                                    >
                                        <span>Add Blocked Date</span>
                                        {blockModalMode === 'block' && <CheckSquare size={16} />}
                                    </Button>
                                    <Button 
                                        variant={blockModalMode === 'unblock' ? 'primary' : 'outline'} 
                                        className={`justify-between w-full h-11 font-bold font-outfit ${blockModalMode === 'unblock' ? '!bg-red-500 hover:!bg-red-600' : ''}`}
                                        onClick={() => {
                                            if (blockModalMode === 'unblock') setBlockModalMode('view');
                                            else {
                                                setBlockModalMode('unblock');
                                                setDraftBlockedDates(new Set()); // Reset conflicting state
                                                showToast('Edit mode active. Click blocked dates to remove them.', 'notice', 'Notice');
                                            }
                                        }}
                                    >
                                        <span>Remove Blocked Date</span>
                                        {blockModalMode === 'unblock' && <CheckSquare size={16} />}
                                    </Button>
                                </div>
                            </div>

                            {/* Reason details only when actively blocking */}
                            <div className={`transition-all duration-300 flex-grow flex flex-col ${blockModalMode === 'block' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                <label className='text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 block uppercase tracking-widest shrink-0'>Block Reason</label>
                                <select 
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    className='w-full h-11 shrink-0 px-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-bold focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-gray-900 dark:text-white'
                                >
                                    <option value="leave">Vacation / Leave</option>
                                    <option value="emergency">Emergency Closure</option>
                                    <option value="personal">Personal Reasons</option>
                                    <option value="other">Other (Specify)</option>
                                </select>
                                
                                {blockReason === 'other' && (
                                    <div className="mt-2 animate-fade-in flex-grow flex flex-col min-h-[60px]">
                                        <textarea 
                                            placeholder="Type custom reason..." 
                                            value={otherReason}
                                            onChange={(e) => setOtherReason(e.target.value)}
                                            className="w-full h-full flex-grow text-sm font-bold bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none" 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className='mt-auto shrink-0'>
                                <span className='text-[11px] uppercase tracking-widest font-black text-gray-400 mb-3 block text-right'>
                                    {(draftBlockedDates.size > 0 || draftUnblockedDates.size > 0) ? `${draftBlockedDates.size > 0 ? `+${draftBlockedDates.size} To Block` : ''} ${draftUnblockedDates.size > 0 ? `-${draftUnblockedDates.size} To Remove` : ''}` : 'No Pending Changes'}
                                </span>
                                <div className='flex items-center gap-3 w-full'>
                                    <Button variant='outline' type="button" onClick={() => setIsBlockModalOpen(false)} disabled={isSaving} className='flex-1 h-11 font-bold'>Cancel</Button>
                                    <Button variant='primary' onClick={saveBlocks} disabled={isSaving || (draftBlockedDates.size === 0 && draftUnblockedDates.size === 0)} className='flex-[1.5] h-11 font-bold min-w-[130px]'>
                                        {isSaving ? 'Saving...' : 'Apply Changes'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WeeklyRoutine;
