import { Search, Calendar, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { PlusIcon } from './AppointmentIcons';
import { Link } from 'react-router-dom';

const CATEGORIES = [
    { id: '', label: 'All', icon: Calendar },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
    { id: 'pending', label: 'Pending', icon: RotateCcw },
    { id: 'cancel', label: 'Cancelled', icon: XCircle },
    { id: 'decline', label: 'Rejected', icon: XCircle },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const AppointmentFilters = ({ search, onSearchChange, statusFilter, onStatusChange }) => {
    return (
        <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4'>
            {/* Search and Action */}
            <div className='flex gap-2 sm:gap-4'>
                <div className='relative flex-grow'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                        <Search size={18} />
                    </span>
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder='Search service, dentist...'
                        className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none'
                    />
                </div>
                <Link
                    to='/patient/book'
                    className='hidden sm:inline-flex shrink-0 items-center justify-center gap-2 px-4 sm:px-5 py-3 text-sm font-bold text-white bg-brand-500 rounded-2xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20'
                >
                    <PlusIcon size={16} />
                    <span className='whitespace-nowrap'>New Appointment</span>
                </Link>
            </div>

            {/* Categories */}
            <div className='flex items-center gap-2 overflow-x-auto no-scrollbar'>
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = statusFilter === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onStatusChange(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                isActive 
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                                : 'bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]'
                            }`}
                        >
                            <Icon size={14} />
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AppointmentFilters;
