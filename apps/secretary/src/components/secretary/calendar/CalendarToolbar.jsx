import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Plus } from 'lucide-react';
import { format, addDays, subDays, addWeeks, subWeeks } from 'date-fns';

const CalendarToolbar = ({ 
    viewMode, 
    setViewMode, 
    selectedDate, 
    setSelectedDate,
    dentists,
    visibleDentists,
    toggleDentist
}) => {
    const handlePrev = () => {
        setSelectedDate(viewMode === 'week' ? subWeeks(selectedDate, 1) : subDays(selectedDate, 1));
    };

    const handleNext = () => {
        setSelectedDate(viewMode === 'week' ? addWeeks(selectedDate, 1) : addDays(selectedDate, 1));
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    return (
        <div className="flex flex-col gap-4 p-4 lg:p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-white/[0.02]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Date Navigation */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-gray-800 shadow-theme-sm">
                        <button 
                            onClick={handlePrev}
                            className="p-2 hover:bg-white dark:hover:bg-white/10 hover:shadow-theme-xs rounded-xl transition-all text-gray-500 hover:text-brand-500"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="px-6 py-2 flex flex-col items-center min-w-[160px]">
                            <span className="text-[10px] uppercase font-bold text-brand-500 tracking-[0.2em] leading-tight">
                                {format(selectedDate, 'yyyy')}
                            </span>
                            <span className="text-sm font-extrabold text-gray-800 dark:text-white/90 font-outfit leading-tight mt-0.5">
                                {viewMode === 'week' 
                                    ? `${format(selectedDate, 'MMM d')} - ${format(addDays(selectedDate, 6), 'MMM d')}`
                                    : format(selectedDate, 'MMMM d')}
                            </span>
                        </div>

                        <button 
                            onClick={handleNext}
                            className="p-2 hover:bg-white dark:hover:bg-white/10 hover:shadow-theme-xs rounded-xl transition-all text-gray-500 hover:text-brand-500"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    
                    {/* Month Label indicator */}
                    <div className="hidden lg:flex flex-col">
                        <span className="text-xl font-bold text-gray-800 dark:text-white/90 font-outfit">
                            {format(selectedDate, 'MMMM')}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5">
                            Master View
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-gray-800">
                        <button 
                            onClick={() => setViewMode('day')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${
                                viewMode === 'day' 
                                ? 'bg-white dark:bg-white/10 text-brand-500 shadow-theme-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Day
                        </button>
                        <button 
                            onClick={() => setViewMode('week')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${
                                viewMode === 'week' 
                                ? 'bg-white dark:bg-white/10 text-brand-500 shadow-theme-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Week
                        </button>
                    </div>

                    <button className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-all shadow-theme-md group">
                        <Plus size={18} className="sm:mr-2" />
                        <span className="hidden sm:inline uppercase tracking-widest text-[10px]">Block Time</span>
                    </button>
                </div>
            </div>

            {/* Bottom: Dentist Filters */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 -my-2">
                <div className="flex items-center gap-2 text-gray-400 mr-2 flex-shrink-0">
                    <Filter size={14} className="text-brand-400" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Schedules:</span>
                </div>
                <div className="flex items-center gap-2">
                    {dentists.map((dentist) => (
                        <button
                            key={dentist.id}
                            onClick={() => toggleDentist(dentist.id)}
                            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300 flex-shrink-0 ${
                                visibleDentists.has(dentist.id)
                                ? 'bg-white border-gray-200 dark:bg-white/5 dark:border-white/10 shadow-theme-sm ring-1 ring-black/[0.02]'
                                : 'bg-transparent border-transparent opacity-30 grayscale hover:opacity-50'
                            }`}
                        >
                            <div 
                                className="w-2.5 h-2.5 rounded-full ring-4 ring-opacity-20 transition-all" 
                                style={{ 
                                    backgroundColor: dentist.color, 
                                    boxShadow: visibleDentists.has(dentist.id) ? `0 0 0 4px ${dentist.color}20` : 'none' 
                                }}
                            />
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                                visibleDentists.has(dentist.id) ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'
                            }`}>
                                {dentist.name.replace('Dr. ', '')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarToolbar;
