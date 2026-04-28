import React, { useState, useEffect } from 'react';
import { X, Clock, CheckSquare, Loader2 } from 'lucide-react';
import { Modal, Button } from '../../ui';
import { format, addMinutes } from 'date-fns';
import { useDoctors } from '../../../hooks/useDoctors';

const BlockTimeModal = ({ isOpen, onClose, doctor, appointments = [], blocks = [], onSave }) => {
    const { addDoctorBlock, deleteDoctorBlock } = useDoctors(false);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [intervalGap, setIntervalGap] = useState(30);
    const [draftBlockedSlots, setDraftBlockedSlots] = useState(new Set());
    const [draftUnblockedSlots, setDraftUnblockedSlots] = useState(new Set());
    const [actionMode, setActionMode] = useState('add'); // 'add' or 'remove'
    const [reason, setReason] = useState('leave');
    const [otherReason, setOtherReason] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Reset drafts when date or mode changes
    useEffect(() => {
        setDraftBlockedSlots(new Set());
        setDraftUnblockedSlots(new Set());
    }, [selectedDate, actionMode, intervalGap]);

    // Generate Dynamic Times based on interval
    const TIMES = [];
    for (let h = 8; h < 18; h++) {
        const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const ampm = h >= 12 ? 'PM' : 'AM';
        
        TIMES.push(`${hour}:00 ${ampm}`);
        if (intervalGap === 30) {
            TIMES.push(`${hour}:30 ${ampm}`);
        }
    }

    const convertTo24h = (timeStr) => {
        const [time, ampm] = timeStr.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const isSlotBlocked = (timeStr) => {
        const time24 = convertTo24h(timeStr);
        return blocks.some(b => b.block_date === selectedDate && b.start_time <= time24 && b.end_time > time24);
    };

    const toggleSlot = (time) => {
        if (actionMode === 'add') {
            const newSlots = new Set(draftBlockedSlots);
            if (newSlots.has(time)) newSlots.delete(time);
            else newSlots.add(time);
            setDraftBlockedSlots(newSlots);
        } else {
            const newSlots = new Set(draftUnblockedSlots);
            if (newSlots.has(time)) newSlots.delete(time);
            else newSlots.add(time);
            setDraftUnblockedSlots(newSlots);
        }
    };

    const handleSave = async () => {
        if (!doctor?.id) return;
        setIsSaving(true);
        try {
            const reasonText = reason === 'other' ? otherReason : 
                             reason === 'leave' ? 'Vacation / Leave' :
                             reason === 'emergency' ? 'Emergency Closure' :
                             'Personal Reasons';

            if (actionMode === 'add') {
                await Promise.all(Array.from(draftBlockedSlots).map(slot => {
                    const startTime = convertTo24h(slot);
                    const [h, m] = startTime.split(':').map(Number);
                    const endTime = format(addMinutes(new Date().setHours(h, m, 0, 0), intervalGap), 'HH:mm');

                    return addDoctorBlock(doctor.id, {
                        block_date: selectedDate,
                        start_time: startTime,
                        end_time: endTime,
                        reason: reasonText,
                        overwrite: true
                    });
                }));
            } else {
                // Find block IDs for unblocked slots
                const blockIdsToDelete = new Set();
                Array.from(draftUnblockedSlots).forEach(slot => {
                    const time24 = convertTo24h(slot);
                    const block = blocks.find(b => b.block_date === selectedDate && b.start_time <= time24 && b.end_time > time24);
                    if (block) blockIdsToDelete.add(block.id);
                });

                if (blockIdsToDelete.size > 0) {
                    await Promise.all(Array.from(blockIdsToDelete).map(id => deleteDoctorBlock(doctor.id, id)));
                }
            }

            if (onSave) onSave();
            onClose();
        } catch (err) {
            console.error('Failed to update blocked times:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => !isSaving && onClose()} className="max-w-[1000px] w-full">
            <div className="no-scrollbar relative w-full overflow-y-auto rounded-xl bg-white dark:bg-gray-900 p-6 sm:p-8 max-h-[90vh] flex flex-col shadow-2xl">
                
                <div className="mb-6 shrink-0">
                    <h4 className="text-[clamp(18px,2.5vw,22px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight">
                        Manage Blocked Times
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage granular availability for {format(new Date(selectedDate), 'MMMM d, yyyy')}.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 flex-grow">
                    
                    {/* LEFT COLUMN: Slots Grid */}
                    <div className="flex-grow md:w-[60%] flex flex-col">
                        <div className="-mx-5 sm:mx-0 border-y sm:border border-gray-200 dark:border-gray-800 sm:rounded-xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.01]">
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
                                        value={intervalGap}
                                        onChange={(e) => setIntervalGap(Number(e.target.value))}
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
                                        const isBlocked = isSlotBlocked(time);
                                        const isDraftBlocked = draftBlockedSlots.has(time);
                                        const isDraftUnblocked = draftUnblockedSlots.has(time);
                                        
                                        let btnClass = "h-11 rounded-xl border px-3 flex items-center justify-between transition-all active:scale-95 ";
                                        let dotClass = "w-2 h-2 rounded-full shrink-0 ";

                                        if (actionMode === 'add') {
                                            if (isBlocked) {
                                                btnClass += "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 opacity-60 cursor-not-allowed ";
                                                dotClass += "bg-red-500 ";
                                            } else if (isDraftBlocked) {
                                                btnClass += "bg-brand-50 dark:bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-400 shadow-sm ";
                                                dotClass += "bg-brand-500 ";
                                            } else {
                                                btnClass += "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-brand-500 ";
                                                dotClass += "bg-gray-200 dark:bg-gray-700 ";
                                            }
                                        } else {
                                            // Remove Mode
                                            if (isBlocked) {
                                                if (isDraftUnblocked) {
                                                    btnClass += "bg-white dark:bg-gray-900 border-dashed border-brand-200 dark:border-gray-700 text-gray-400 ";
                                                    dotClass += "bg-brand-200 dark:bg-brand-800 ";
                                                } else {
                                                    btnClass += "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 shadow-theme-xs ";
                                                    dotClass += "bg-red-500 ";
                                                }
                                            } else {
                                                btnClass += "bg-gray-50 dark:bg-white/[0.02] border-transparent opacity-40 cursor-not-allowed text-gray-400 ";
                                                dotClass += "bg-gray-200 dark:bg-gray-700 ";
                                            }
                                        }

                                        return (
                                            <button
                                                key={time}
                                                onClick={() => toggleSlot(time)}
                                                className={btnClass}
                                                disabled={actionMode === 'add' ? isBlocked : !isBlocked}
                                            >
                                                <div className="flex flex-col items-start min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className={dotClass} strokeWidth={0} />
                                                        <span className="text-[10px] font-black tabular-nums whitespace-nowrap uppercase">{time}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center shrink-0 ml-1">
                                                    {(isDraftBlocked || (isBlocked && !isDraftUnblocked)) ? (
                                                        <input type="checkbox" readOnly checked className="w-3 h-3 accent-brand-500" />
                                                    ) : (
                                                        <span className="opacity-0 w-3 h-3"></span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Controls */}
                    <div className="md:w-[40%] flex flex-col gap-6 md:pl-2 bg-white dark:bg-gray-900">
                        <div className="shrink-0">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 block uppercase tracking-widest">Action Mode</label>
                            <div className="flex flex-col gap-2">
                                <Button 
                                    variant={actionMode === 'add' ? 'primary' : 'outline'} 
                                    className="justify-between w-full h-11 font-bold font-outfit"
                                    onClick={() => setActionMode('add')}
                                >
                                    <span>Add Blocked Time</span>
                                    {actionMode === 'add' && <CheckSquare size={16} />}
                                </Button>
                                <Button 
                                    variant={actionMode === 'remove' ? 'primary' : 'outline'} 
                                    className={`justify-between w-full h-11 font-bold font-outfit ${actionMode === 'remove' ? '!bg-red-500 hover:!bg-red-600' : ''}`}
                                    onClick={() => setActionMode('remove')}
                                >
                                    <span>Remove Blocked Time</span>
                                    {actionMode === 'remove' && <CheckSquare size={16} />}
                                </Button>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 flex-grow flex flex-col ${actionMode === 'add' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 block uppercase tracking-widest shrink-0">Block Reason</label>
                            <select 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full h-11 shrink-0 px-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-bold focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-gray-900 dark:text-white"
                            >
                                <option value="leave">Vacation / Leave</option>
                                <option value="emergency">Emergency Closure</option>
                                <option value="personal">Personal Reasons</option>
                                <option value="other">Other (Specify)</option>
                            </select>
                            {reason === 'other' && (
                                <div className="mt-2 flex-grow flex flex-col min-h-[60px]">
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
                                    variant="primary" 
                                    onClick={handleSave} 
                                    disabled={isSaving || (draftBlockedSlots.size === 0 && draftUnblockedSlots.size === 0)}
                                    className={`flex-[1.5] h-11 font-bold min-w-[130px] ${actionMode === 'remove' ? '!bg-red-500 hover:!bg-red-600' : ''}`}
                                >
                                    {isSaving ? 'Saving...' : 'Apply Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 md:hidden p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-white/10">
                    <X size={16} className="text-gray-500" />
                </button>
            </div>
        </Modal>
    );
};

export default BlockTimeModal;
