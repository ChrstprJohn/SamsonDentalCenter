import { Search, Mail, Star, Clock, Calendar, Bell } from 'lucide-react';
import NotificationRow from './NotificationRow';
import Pagination from '../../common/Pagination';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Mail, key: 'all' },
    { id: 'unread', label: 'Unread', icon: Bell, key: 'unread' },
    { id: 'starred', label: 'Starred', icon: Star, key: 'starred' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, key: 'appointments' },
    { id: 'waitlist', label: 'Waitlist', icon: Clock, key: 'waitlist' },
];

const NotificationInbox = ({
    notifications,
    totalCount,
    stats = {},
    currentPage,
    totalPages,
    onPageChange,
    activeFilter,
    onFilterChange,
    searchQuery,
    onSearchChange,
    onToggleStar,
    onToggleRead,
    onToggleArchive,
    onMarkAllRead,
    onNotificationClick,
}) => {
    // Helper to get count for category
    const getCount = (key) => {
        if (key === 'all') return totalCount || 0;
        if (key === 'unread') return stats.unread || 0;
        if (key === 'starred') return stats.starred || 0;
        if (key === 'waitlist') return stats.waitlist || 0;
        if (key === 'appointments') {
            // Sum all appointment-related types
            return (
                (stats.general || 0) + 
                (stats.confirmation || 0) + 
                (stats.reminder || 0) + 
                (stats.cancellation || 0) + 
                (stats.reschedule || 0) + 
                (stats.no_show || 0) + 
                (stats.delay || 0) + 
                (stats.follow_up || 0) + 
                (stats.approval || 0) + 
                (stats.rejection || 0)
            );
        }
        return 0;
    };

    return (
        <div className='grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden'>
            {/* Header / Search Area */}
            <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='relative flex-grow'>
                        <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                            <Search size={18} />
                        </span>
                        <input
                            type='text'
                            placeholder='Search notifications...'
                            className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/3 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none'
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    {stats.unread > 0 && (
                        <button 
                            onClick={onMarkAllRead}
                            className='hidden sm:block text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors'
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className='flex items-center gap-2 overflow-x-auto no-scrollbar pb-1'>
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeFilter === cat.id;
                        const count = getCount(cat.key);
                        
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all group ${
                                    isActive
                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                            >
                                <Icon size={14} />
                                <span>{cat.label}</span>
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] leading-none transition-all ${
                                    isActive 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-white/20'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List Area */}
            <div className='grow flex flex-col'>
                <div className='flex flex-col grow min-h-120 md:min-h-140 overflow-y-auto pb-14 sm:pb-0'>
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <NotificationRow
                                key={n.id}
                                notification={n}
                                onToggleStar={onToggleStar}
                                onToggleRead={onToggleRead}
                                onToggleArchive={onToggleArchive}
                                onClick={onNotificationClick}
                            />
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center py-20 text-center'>
                            <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4'>
                                <Mail size={32} />
                            </div>
                            <h4 className='text-lg font-bold text-gray-800 dark:text-white mb-1'>
                                No notifications found
                            </h4>
                            <p className='text-sm text-gray-500'>Your inbox is looking clean!</p>
                        </div>
                    )}
                </div>

                {/* Footer / Pagination Area */}
                <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-5 border-t border-gray-100 dark:border-gray-800 shadow-[0_-12px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-12px_30px_rgba(0,0,0,0.3)] sm:shadow-none'>
                    <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
                        {/* Pagination Component - Main Focus */}
                        <div className='flex justify-center'>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationInbox;
