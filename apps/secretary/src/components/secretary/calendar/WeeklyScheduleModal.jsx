import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, Loader2, Save, X } from 'lucide-react';
import { Modal, Button, Switch } from '../../ui';
import { useDoctors } from '../../../hooks/useDoctors';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyScheduleModal = ({ isOpen, onClose, doctor, schedule = [], onSave }) => {
    const { updateDoctorScheduleBulk } = useDoctors(false);
    const [localSchedule, setLocalSchedule] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [dailyBreak, setDailyBreak] = useState(false);

    useEffect(() => {
        if (isOpen && schedule.length > 0) {
            // Map the API schedule to our local state
            const mapped = DAYS.map(day => {
                const daySched = schedule.find(s => s.day_of_week === day);
                return {
                    day_of_week: day,
                    is_working: daySched ? daySched.is_working : false,
                    start_time: (daySched && daySched.start_time) ? daySched.start_time.substring(0, 5) : '08:00',
                    end_time: (daySched && daySched.end_time) ? daySched.end_time.substring(0, 5) : '17:00'
                };
            });
            setLocalSchedule(mapped);
        } else if (isOpen) {
            // Default empty schedule
            setLocalSchedule(DAYS.map(day => ({
                day_of_week: day,
                is_working: false,
                start_time: '08:00',
                end_time: '17:00'
            })));
        }
    }, [isOpen, schedule]);

    const handleToggleDay = (index, val) => {
        const newSched = [...localSchedule];
        newSched[index].is_working = val;
        setLocalSchedule(newSched);
    };

    const handleTimeChange = (index, field, val) => {
        const newSched = [...localSchedule];
        newSched[index][field] = val;
        setLocalSchedule(newSched);
    };

    const applyMondayToAll = () => {
        const monday = localSchedule[0];
        const newSched = localSchedule.map(day => ({
            ...day,
            is_working: monday.is_working,
            start_time: monday.start_time,
            end_time: monday.end_time
        }));
        setLocalSchedule(newSched);
    };

    const handleSave = async () => {
        if (!doctor?.id) return;
        setIsSaving(true);
        try {
            // Format for the bulk API: { schedules: [...] }
            const payload = localSchedule.map(s => ({
                day_of_week: s.day_of_week,
                is_working: s.is_working,
                start_time: s.start_time,
                end_time: s.end_time
            }));

            await updateDoctorScheduleBulk(doctor.id, payload, true);
            
            if (onSave) onSave();
            onClose();
        } catch (err) {
            console.error('Failed to update weekly schedule:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => !isSaving && onClose()} className="max-w-[1000px] w-full">
            <div className="no-scrollbar relative w-full overflow-y-auto rounded-xl bg-white p-5 dark:bg-gray-900 sm:p-10 max-h-[90vh] flex flex-col shadow-2xl">
                
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                    <div>
                        <h4 className="text-[clamp(18px,2.5vw,22px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight">
                            Edit Weekly Schedule
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Set default availability and working hours.
                        </p>
                    </div>
                    <button 
                        onClick={applyMondayToAll}
                        className="inline-flex items-center justify-center gap-2 rounded-lg transition text-xs font-bold h-9 px-5 py-3.5 bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 whitespace-nowrap"
                    >
                        <Clock size={14} className="text-gray-400" />
                        Apply Monday's Hours to All
                    </button>
                </div>

                <div className="overflow-y-auto no-scrollbar flex-grow mb-6 max-h-[60vh] pr-1">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                        
                        {/* Daily Break Card */}
                        <div className="p-2 sm:p-3 border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl flex flex-col transition-all shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                    <Clock size={12} className="text-gray-400" />
                                    Daily Break
                                </span>
                                <Switch checked={dailyBreak} onChange={setDailyBreak} />
                            </div>
                            <div className="flex-grow flex flex-col items-center justify-center py-2 bg-white/40 dark:bg-gray-900/40 rounded-lg mt-auto border border-dashed border-gray-200 dark:border-gray-800">
                                <CalendarIcon size={10} className="text-gray-300 mb-1" />
                                <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-widest">
                                    {dailyBreak ? '12:00 - 13:00' : 'No Break'}
                                </span>
                            </div>
                        </div>

                        {/* Days Grid */}
                        {localSchedule.map((day, idx) => (
                            <div 
                                key={day.day_of_week}
                                className={`p-2 sm:p-3 border rounded-xl flex flex-col transition-all duration-200 shadow-sm ${day.is_working ? 'border-brand-200 dark:border-brand-500/30 bg-brand-50/20 dark:bg-brand-500/5 opacity-100' : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 opacity-80 hover:opacity-100'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] sm:text-[12px] font-black uppercase tracking-widest ${day.is_working ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500'}`}>
                                        {day.day_of_week}
                                    </span>
                                    <Switch 
                                        checked={day.is_working} 
                                        onChange={(val) => handleToggleDay(idx, val)} 
                                    />
                                </div>
                                
                                {day.is_working ? (
                                    <div className="space-y-2 mt-auto">
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <div>
                                                <label className="text-[8px] font-black uppercase tracking-tighter text-gray-400 block mb-0.5">In</label>
                                                <input 
                                                    type="time" 
                                                    value={day.start_time}
                                                    onChange={(e) => handleTimeChange(idx, 'start_time', e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-7 px-1.5 text-[10px] font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[8px] font-black uppercase tracking-tighter text-gray-400 block mb-0.5">Out</label>
                                                <input 
                                                    type="time" 
                                                    value={day.end_time}
                                                    onChange={(e) => handleTimeChange(idx, 'end_time', e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-7 px-1.5 text-[10px] font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-grow flex flex-col items-center justify-center py-2 bg-white/50 dark:bg-gray-900/50 rounded-lg mt-auto border border-dashed border-gray-200 dark:border-gray-800 transition-all">
                                        <CalendarIcon size={10} className="text-gray-300 mb-1" />
                                        <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-widest text-center">Off Duty</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 sm:justify-end shrink-0">
                    <Button 
                        variant="outline" 
                        onClick={onClose} 
                        className="flex-1 sm:flex-none px-6 py-3.5 h-11 text-[14px] font-black"
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSave} 
                        className="flex-1 sm:flex-none px-8 py-3.5 h-11 text-[14px] font-black min-w-[170px]"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </div>
                        ) : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default WeeklyScheduleModal;
