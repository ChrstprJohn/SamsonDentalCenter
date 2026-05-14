import { Search, Clock, RotateCcw, History, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { PlusIcon } from './AppointmentIcons';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MAIN_TABS = [
    { id: 'upcoming', label: 'Upcoming', key: 'upcoming' },
    { id: 'history', label: 'History', key: 'history' },
];

const SUB_FILTERS = {
    history: [
        { id: 'cancel', label: 'Cancelled', key: 'cancel', icon: XCircle },
        { id: 'completed', label: 'Completed', key: 'completed', icon: CheckCircle2 },
    ],
};

const AppointmentFilters = ({ search, onSearchChange, statusFilter, onStatusChange, counts = {} }) => {
    const [localSearch, setLocalSearch] = useState(search);

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearch);
        }, 500); // 500ms delay for stability

        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange]);

    // Derive active main tab from statusFilter
    const getActiveMainTab = () => {
        if (statusFilter === 'history' || ['completed', 'cancel', 'rescheduled'].includes(statusFilter)) return 'history';
        return 'upcoming'; // default
    };

    const activeMainTab = getActiveMainTab();
    const currentSubFilters = SUB_FILTERS[activeMainTab] || [];

    const handleMainTabChange = (tabId) => {
        onStatusChange(tabId);
    };

    return (
        <div className='border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent'>
            {/* Search and Action Row */}
            <div className='px-4 sm:px-6 pt-5 pb-0 sm:pt-5 sm:pb-3 flex items-center gap-3 sm:gap-4'>
                <div className='relative flex-grow'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                        <Search size={18} />
                    </span>
                    <input
                        type='text'
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder='Search service, dentist...'
                        className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-white/10 transition-[ring] outline-none font-medium'
                    />
                </div>
                <Link
                    to='/patient/book'
                    className='hidden sm:inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-[transform] active:scale-95'
                >
                    <PlusIcon size={16} />
                    <span className='whitespace-nowrap'>New Appointment</span>
                </Link>
            </div>

            {/* Main Tabs (Google Classroom / Material Style) */}
            <div className='flex w-full'>
                {MAIN_TABS.map((tab) => {
                    const isActive = activeMainTab === tab.id;
                    const count = counts[tab.key] || 0;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleMainTabChange(tab.id)}
                            className={`flex-1 relative flex items-center justify-center gap-2 py-4 text-sm font-bold ${
                                isActive 
                                ? 'text-brand-600 dark:text-brand-400' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                                isActive 
                                ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' 
                                : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                            }`}>
                                {count}
                            </span>
                            
                            {/* Underline Indicator */}
                            {isActive && (
                                <div className='absolute bottom-0 left-0 right-0 h-[3px] bg-brand-600 dark:bg-brand-500 rounded-t-full' />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Sub-Navigation (Pills) */}
            {currentSubFilters.length > 0 && (
                <div className='px-4 sm:px-6 py-4 bg-gray-50/30 dark:bg-white/[0.02] border-t border-gray-50 dark:border-gray-800/50 flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar'>
                    {currentSubFilters.map((sub) => {
                        const isSubActive = statusFilter === sub.id;
                        const count = counts[sub.key] || 0;

                        return (
                            <button
                                key={sub.id}
                                onClick={() => {
                                    if (isSubActive) {
                                        onStatusChange(activeMainTab);
                                    } else {
                                        onStatusChange(sub.id);
                                    }
                                }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                    isSubActive 
                                    ? 'bg-brand-500 text-white' 
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                            >
                                {sub.icon && <sub.icon size={14} />}
                                <span>{sub.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                                    isSubActive 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-gray-200 dark:bg-white/10 text-gray-400'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AppointmentFilters;
