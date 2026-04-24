import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon, CheckSquare, AlertCircle, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Modal, Button, Input, Badge } from '../../../ui';
import { format, addMinutes, isSameDay } from 'date-fns';
import { useDoctors } from '../../../../hooks/useDoctors';

const BlockTimeModal = ({ isOpen, onClose, events = [], doctor, timeBounds = { minStart: 8, maxEnd: 18 }, onSave }) => {
    const { addDoctorBlock, deleteDoctorBlock } = useDoctors(false);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [slotGap, setSlotGap] = useState(30); // 30 or 60
    const [blockModalMode, setBlockModalMode] = useState('block'); // 'block' or 'unblock'
    const [draftBlockedSlots, setDraftBlockedSlots] = useState(new Set());
    const [draftUnblockedSlots, setDraftUnblockedSlots] = useState(new Set());
    const [blockReason, setBlockReason] = useState('leave');
    const [otherReason, setOtherReason] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Generate Dynamic Times based on bounds
    const TIMES = [];
    for (let h = timeBounds.minStart; h < timeBounds.maxEnd; h++) {
        const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const ampm = h >= 12 ? 'PM' : 'AM';
        
        TIMES.push(`${hour}:00 ${ampm}`);
        if (slotGap === 30) {
            TIMES.push(`${hour}:30 ${ampm}`);
        }
    }

    const toggleSlot = (time) => {
        const rawTime = convertTo24h(time);
        if (blockModalMode === 'block') {
            if (isSlotOccupied(rawTime)) return;
            const newSlots = new Set(draftBlockedSlots);
            if (newSlots.has(time)) newSlots.delete(time);
            else newSlots.add(time);
            setDraftBlockedSlots(newSlots);
        } else {
            if (!isSlotOccupied(rawTime)) return;
            const newSlots = new Set(draftUnblockedSlots);
            if (newSlots.has(time)) newSlots.delete(time);
            else newSlots.add(time);
            setDraftUnblockedSlots(newSlots);
        }
    };

    const convertTo24h = (timeStr) => {
        const [time, ampm] = timeStr.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const isSlotOccupied = (time24h) => {
        return events.find(event => {
            if (event.date !== selectedDate) return false;
            const [eh, em] = event.start.split(':').map(Number);
            const eventStart = eh * 60 + em;
            const eventEnd = eventStart + event.duration;
            const [th, tm] = time24h.split(':').map(Number);
            const slotStart = th * 60 + tm;
            const slotEnd = slotStart + slotGap;
            const isOverlap = slotStart < eventEnd && eventStart < slotEnd;
            return isOverlap;
        });
    };

    const handleSave = async () => {
        if (!doctor?.id) return;
        setIsSaving(true);
        try {
            const reasonText = blockReason === 'other' ? otherReason : 
                             blockReason === 'leave' ? 'Vacation / Leave' :
                             blockReason === 'emergency' ? 'Emergency Closure' :
                             'Personal Reasons';

            if (blockModalMode === 'block') {
                // Group contiguous slots
                const sortedSlots = Array.from(draftBlockedSlots).sort((a, b) => {
                    return convertTo24h(a).localeCompare(convertTo24h(b));
                });

                const groups = [];
                if (sortedSlots.length > 0) {
                    let currentGroup = { start: sortedSlots[0], end: sortedSlots[0] };
                    for (let i = 1; i < sortedSlots.length; i++) {
                        const prevEnd24 = convertTo24h(currentGroup.end);
                        const [ph, pm] = prevEnd24.split(':').map(Number);
                        const expectedNext = format(addMinutes(new Date().setHours(ph, pm, 0, 0), slotGap), 'HH:mm');
                        
                        if (convertTo24h(sortedSlots[i]) === expectedNext) {
                            currentGroup.end = sortedSlots[i];
                        } else {
                            groups.push(currentGroup);
                            currentGroup = { start: sortedSlots[i], end: sortedSlots[i] };
                        }
                    }
                    groups.push(currentGroup);
                }

                // Call API for each group
                await Promise.all(groups.map(group => {
                    const start24 = convertTo24h(group.start);
                    const [eh, em] = convertTo24h(group.end).split(':').map(Number);
                    const end24 = format(addMinutes(new Date().setHours(eh, em, 0, 0), slotGap), 'HH:mm');

                    return addDoctorBlock(doctor.id, {
                        block_date: selectedDate,
                        start_time: start24,
                        end_time: end24,
                        reason: reasonText,
                        cancel_appointments: false
                    });
                }));
            } else {
                // Unblock logic: Find blocks spanning these slots
                const blockIdsToDelete = new Set();
                draftUnblockedSlots.forEach(slotTime => {
                    const slot24 = convertTo24h(slotTime);
                    const [sh, sm] = slot24.split(':').map(Number);
                    const slotStartMin = sh * 60 + sm;
                    const slotEndMin = slotStartMin + slotGap;

                    events.forEach(event => {
                        if (event.type === 'blocked' && event.date === selectedDate) {
                            const [eh, em] = event.start.split(':').map(Number);
                            const eventStart = eh * 60 + em;
                            const eventEnd = eventStart + (event.duration || 30);
                            
                            if (slotStartMin < eventEnd && eventStart < slotEndMin) {
                                blockIdsToDelete.add(event.id);
                            }
                        }
                    });
                });

                if (blockIdsToDelete.size > 0) {
                    await Promise.all(Array.from(blockIdsToDelete).map(id => deleteDoctorBlock(doctor.id, id)));
                }
            }

            if (onSave) onSave();
            onClose();
            setDraftBlockedSlots(new Set());
            setDraftUnblockedSlots(new Set());
        } catch (err) {
            console.error('Failed to update blocks:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => !isSaving && onClose()} className="max-w-[1000px] w-[95%] sm:w-full m-auto">
            <div className="no-scrollbar relative w-full overflow-y-auto rounded-xl bg-white dark:bg-gray-900 p-6 sm:p-8 max-h-[90vh] flex flex-col shadow-2xl">
                
                <div className='mb-6 shrink-0'>
                    <h4 className='text-[clamp(18px,2.5vw,22px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                        Manage Blocked Times
                    </h4>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        Manage granular availability for {format(new Date(selectedDate), 'MMMM d, yyyy')}.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 flex-grow">
                    
                    {/* LEFT COLUMN: Selector & Grid */}
                    <div className="flex-grow md:w-[60%] flex flex-col">
                        <div className='-mx-5 sm:mx-0 border-y sm:border border-gray-200 dark:border-gray-800 sm:rounded-xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.01]'>
                            <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Select Date</label>
                                    <input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full h-11 px-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Interval Gap</label>
                                    <select 
                                        value={slotGap}
                                        onChange={(e) => {
                                            setSlotGap(Number(e.target.value));
                                            setDraftBlockedSlots(new Set());
                                            setDraftUnblockedSlots(new Set());
                                        }}
                                        className="w-full h-11 px-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-gray-900 dark:text-white"
                                    >
                                        <option value={30}>30 Minutes</option>
                                        <option value={60}>1 Hour</option>
                                    </select>
                                </div>
                            </div>

                            <div className="max-h-[40vh] sm:max-h-[420px] overflow-y-auto no-scrollbar p-6">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {TIMES.map(time => {
                                        const occupiedEvent = isSlotOccupied(convertTo24h(time));
                                        const occupied = !!occupiedEvent;
                                        const isAppointment = occupied && occupiedEvent.type === 'appointment';
                                        const isPendingBlock = draftBlockedSlots.has(time);
                                        const isPendingUnblock = draftUnblockedSlots.has(time);
                                        
                                        let pillClass = "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-brand-500 hover:shadow-sm";
                                        let dotClass = "bg-gray-200 dark:bg-gray-700";

                                        if (occupied) {
                                            if (blockModalMode === 'unblock') {
                                                if (isPendingUnblock) {
                                                    pillClass = "bg-white dark:bg-gray-900 border-dashed border-brand-200 dark:border-gray-700 text-gray-400";
                                                    dotClass = "bg-brand-200 dark:bg-brand-800";
                                                } else {
                                                    pillClass = "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400";
                                                    dotClass = "bg-red-500";
                                                }
                                            } else {
                                                pillClass = isAppointment 
                                                    ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-200 cursor-not-allowed"
                                                    : "bg-gray-50 dark:bg-white/[0.02] border-transparent opacity-40 cursor-not-allowed text-gray-400";
                                                dotClass = isAppointment ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600";
                                            }
                                        } else if (isPendingBlock) {
                                            pillClass = "bg-brand-50 dark:bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-400 shadow-sm";
                                            dotClass = "bg-brand-500";
                                        }

                                        return (
                                            <button
                                                key={time}
                                                onClick={() => toggleSlot(time)}
                                                className={`h-11 rounded-xl border px-3 flex items-center justify-between transition-all active:scale-95 ${pillClass}`}
                                            >
                                                <div className='flex flex-col items-start min-w-0'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} strokeWidth={0} />
                                                        <span className="text-[10px] font-black tabular-nums whitespace-nowrap uppercase">{time}</span>
                                                    </div>
                                                    {isAppointment && (
                                                        <span className="text-[8px] font-bold truncate w-full mt-0.5 opacity-80 uppercase tracking-tighter text-left">
                                                            {occupiedEvent.patient}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className='flex items-center justify-center shrink-0 ml-1'>
                                                    {occupied ? (
                                                        blockModalMode === 'unblock' ? (
                                                            <input type="checkbox" readOnly checked={!isPendingUnblock} className="w-3 h-3 accent-red-500 translate-y-[-0.5px]" />
                                                        ) : (
                                                            <span className={`text-[7px] font-black uppercase tracking-tighter ${isAppointment ? 'text-blue-500' : 'text-red-500/60'}`}>
                                                                {isAppointment ? 'BOOKED' : 'BLOCKED'}
                                                            </span>
                                                        )
                                                    ) : isPendingBlock ? (
                                                        <input type="checkbox" readOnly checked className="w-3 h-3 accent-brand-500 translate-y-[-0.5px]" />
                                                    ) : (
                                                        <input type="checkbox" readOnly checked={false} className="w-3 h-3 opacity-10" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Management (Standardized) */}
                    <div className="md:w-[40%] flex flex-col gap-6 md:pl-2 bg-white dark:bg-gray-900">
                        <div className="shrink-0">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 block uppercase tracking-widest">Action Mode</label>
                            <div className="flex flex-col gap-2">
                                <Button 
                                    variant={blockModalMode === 'block' ? 'primary' : 'outline'} 
                                    className="justify-between w-full h-11 font-bold font-outfit"
                                    onClick={() => {
                                        setBlockModalMode('block');
                                        setDraftUnblockedSlots(new Set());
                                    }}
                                >
                                    <span>Add Blocked Time</span>
                                    {blockModalMode === 'block' && <CheckSquare size={16} />}
                                </Button>
                                <Button 
                                    variant={blockModalMode === 'unblock' ? 'primary' : 'outline'} 
                                    className={`justify-between w-full h-11 font-bold font-outfit ${blockModalMode === 'unblock' ? '!bg-red-500 hover:!bg-red-600' : ''}`}
                                    onClick={() => {
                                        setBlockModalMode('unblock');
                                        setDraftBlockedSlots(new Set());
                                    }}
                                >
                                    <span>Remove Blocked Time</span>
                                    {blockModalMode === 'unblock' && <CheckSquare size={16} />}
                                </Button>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 flex-grow flex flex-col ${blockModalMode === 'block' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 block uppercase tracking-widest shrink-0">Block Reason</label>
                            <select 
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                className="w-full h-11 shrink-0 px-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-bold focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-gray-900 dark:text-white"
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

                        <div className="mt-auto shrink-0">
                            <span className="text-[11px] uppercase tracking-widest font-black text-gray-400 mb-3 block text-right">
                                {(draftBlockedSlots.size > 0 || draftUnblockedSlots.size > 0) ? `${draftBlockedSlots.size > 0 ? `+${draftBlockedSlots.size} To Block` : ''} ${draftUnblockedSlots.size > 0 ? `-${draftUnblockedSlots.size} To Remove` : ''}` : 'No Pending Changes'}
                            </span>
                            <div className="flex items-center gap-3 w-full">
                                <Button variant="outline" type="button" onClick={onClose} disabled={isSaving} className="flex-1 h-11 font-bold">Cancel</Button>
                                <Button 
                                    variant='primary'
                                    onClick={handleSave} 
                                    disabled={isSaving || (draftBlockedSlots.size === 0 && draftUnblockedSlots.size === 0)}
                                    className="flex-[1.5] h-11 font-bold min-w-[130px]"
                                >
                                    {isSaving ? 'Saving...' : 'Apply Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:hidden">
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={16} className="text-gray-500" /></button>
                </div>
            </div>
        </Modal>
    );
};

export default BlockTimeModal;
