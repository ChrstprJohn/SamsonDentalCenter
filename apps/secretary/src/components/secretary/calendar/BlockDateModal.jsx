import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckSquare, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Modal, Button } from '../../ui';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { useDoctors } from '../../../hooks/useDoctors';

const BlockDateModal = ({ isOpen, onClose, doctor, blocks = [], onSave }) => {
    const { addDoctorBlock, deleteDoctorBlock } = useDoctors(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState(new Set());
    const [actionMode, setActionMode] = useState('add'); // 'add' or 'remove'
    const [reason, setReason] = useState('leave');
    const [otherReason, setOtherReason] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const toggleDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const newSelected = new Set(selectedDates);
        if (newSelected.has(dateStr)) newSelected.delete(dateStr);
        else newSelected.add(dateStr);
        setSelectedDates(newSelected);
    };

    const handleSave = async () => {
        if (!doctor?.id || selectedDates.size === 0) return;
        setIsSaving(true);
        try {
            const reasonText = reason === 'other' ? otherReason : 
                             reason === 'leave' ? 'Vacation / Leave' :
                             reason === 'emergency' ? 'Emergency Closure' :
                             'Personal Reasons';

            if (actionMode === 'add') {
                await Promise.all(Array.from(selectedDates).map(dateStr => {
                    return addDoctorBlock(doctor.id, {
                        block_date: dateStr,
                        start_time: '00:00',
                        end_time: '23:59',
                        reason: reasonText,
                        overwrite: true
                    });
                }));
            } else {
                // Find block IDs for selected dates
                const blockIdsToDelete = blocks
                    .filter(b => selectedDates.has(b.block_date))
                    .map(b => b.id);
                
                if (blockIdsToDelete.length > 0) {
                    await Promise.all(blockIdsToDelete.map(id => deleteDoctorBlock(doctor.id, id)));
                }
            }

            if (onSave) onSave();
            onClose();
            setSelectedDates(new Set());
        } catch (err) {
            console.error('Failed to update blocked dates:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Calendar logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <Modal isOpen={isOpen} onClose={() => !isSaving && onClose()} className="max-w-[1000px] w-full">
            <div className="no-scrollbar relative w-full overflow-y-auto rounded-xl bg-white dark:bg-gray-900 p-6 sm:p-8 max-h-[90vh] flex flex-col min-h-[540px] shadow-2xl">
                
                <div className="mb-6 shrink-0">
                    <h4 className="text-[clamp(18px,2.5vw,22px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight">
                        Manage Blocked Dates
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        View current overrides, add new blocks, or remove existing ones.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 flex-grow">
                    
                    {/* LEFT COLUMN: Calendar */}
                    <div className="flex-grow md:w-[60%] flex flex-col">
                        <div className="-mx-5 sm:mx-0 border-y sm:border border-gray-200 dark:border-gray-800 sm:rounded-xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.01]">
                            <div className="flex items-center justify-between px-5 sm:px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                    {format(currentMonth, 'MMMM yyyy')}
                                </h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                    <div key={day} className="py-2 text-center text-[10px] font-bold uppercase text-gray-400">{day}</div>
                                ))}
                            </div>

                            <div className="max-h-[40vh] sm:max-h-[340px] overflow-y-auto no-scrollbar bg-gray-200 dark:bg-gray-800">
                                <div className="grid grid-cols-7 gap-[1px]">
                                    {calendarDays.map((day, i) => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const isSelected = selectedDates.has(dateStr);
                                        const isCurrentMonth = isSameMonth(day, monthStart);
                                        const isBlocked = blocks.some(b => b.block_date === dateStr);
                                        const isToday = isSameDay(day, new Date());

                                        let btnClass = "aspect-square p-1 flex flex-col items-center justify-center transition-all ";
                                        if (!isCurrentMonth) btnClass += "bg-gray-50 dark:bg-gray-900 opacity-20 ";
                                        else btnClass += "bg-white dark:bg-gray-900 ";

                                        if (isSelected) btnClass += "ring-2 ring-inset ring-brand-500 z-10 ";

                                        return (
                                            <button 
                                                key={i}
                                                onClick={() => toggleDate(day)}
                                                className={btnClass}
                                            >
                                                <div className="flex-grow flex items-center justify-center w-full relative">
                                                    <span className={`text-sm font-bold ${isToday ? 'text-brand-500' : isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                        {format(day, 'd')}
                                                    </span>
                                                    {isBlocked && (
                                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                    )}
                                                </div>
                                                <div className="h-4 flex items-center justify-center pb-1">
                                                    {isSelected && <div className="w-1 h-1 rounded-full bg-brand-500"></div>}
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
                                    <span>Add Blocked Date</span>
                                    {actionMode === 'add' && <CheckSquare size={16} />}
                                </Button>
                                <Button 
                                    variant={actionMode === 'remove' ? 'primary' : 'outline'} 
                                    className={`justify-between w-full h-11 font-bold font-outfit ${actionMode === 'remove' ? '!bg-red-500 hover:!bg-red-600' : ''}`}
                                    onClick={() => setActionMode('remove')}
                                >
                                    <span>Remove Blocked Date</span>
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
                                {selectedDates.size > 0 ? `${selectedDates.size} dates selected` : 'No Pending Changes'}
                            </span>
                            <div className="flex items-center gap-3 w-full">
                                <Button variant="outline" type="button" onClick={onClose} disabled={isSaving} className="flex-1 h-11 font-bold">Cancel</Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleSave} 
                                    disabled={isSaving || selectedDates.size === 0}
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

export default BlockDateModal;
