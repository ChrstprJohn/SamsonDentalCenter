import React from 'react';
import { Search, Filter, Mail, Archive, Star, Clock } from 'lucide-react';
import NotificationRow from './NotificationRow';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Mail },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'waitlist', label: 'Waitlist', icon: Clock },
    { id: 'appointments', label: 'Appointments', icon: Archive },
];

const NotificationInbox = ({ 
    notifications, 
    activeFilter, 
    onFilterChange, 
    searchQuery, 
    onSearchChange,
    onToggleStar,
    onToggleRead,
    onDelete,
    onNotificationClick
}) => {
    return (
        <div className='flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden'>
            {/* Header / Search Area */}
            <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4'>
                <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                        <Search size={18} />
                    </span>
                    <input 
                        type='text' 
                        placeholder='Search notifications...'
                        className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none'
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className='flex items-center gap-2 overflow-x-auto no-scrollbar'>
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeFilter === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange(cat.id)}
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

            {/* List Area */}
            <div className='flex flex-col grow min-h-[400px] md:min-h-[285px] overflow-y-auto pb-14 sm:pb-0'>
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <NotificationRow 
                            key={n.id} 
                            notification={n} 
                            onToggleStar={onToggleStar}
                            onToggleRead={onToggleRead}
                            onDelete={onDelete}
                            onClick={onNotificationClick}
                        />
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4'>
                            <Mail size={32} />
                        </div>
                        <h4 className='text-lg font-bold text-gray-800 dark:text-white mb-1'>No notifications found</h4>
                        <p className='text-sm text-gray-500'>Your inbox is looking clean!</p>
                    </div>
                )}
            </div>
            
            {/* Footer / Pagination Placeholder */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.2)] sm:shadow-none'>
                <div className='flex flex-row items-center justify-between w-full gap-2 sm:gap-0'>
                    {/* Left: Results text */}
                    <div className='w-auto sm:w-1/3 text-left'>
                        <span className='text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap'>
                            Showing {notifications.length} results
                        </span>
                    </div>

                    {/* Center: Mock Pagination */}
                    <div className='flex items-center justify-end sm:justify-center w-auto sm:w-1/3'>
                        <div className='flex items-center gap-1 justify-center shrink-0'>
                            {notifications.length > 0 && (
                                <button className='w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors bg-brand-500 text-white shadow-md shadow-brand-500/20'>
                                    1
                                </button>
                            )}
                            {notifications.length > 5 && (
                                <button className='w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]'>
                                    2
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Empty spacer to ensure exact center alignment on desktop */}
                    <div className='hidden sm:block sm:w-1/3'></div>
                </div>
            </div>
        </div>
    );
};

export default NotificationInbox;
