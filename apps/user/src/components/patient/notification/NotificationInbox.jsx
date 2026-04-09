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
        <div className='flex flex-col h-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-theme-sm overflow-hidden'>
            {/* Header / Search Area */}
            <div className='px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4'>
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
            <div className='overflow-y-auto grow'>
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
            {notifications.length > 0 && (
                <div className='px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider'>
                    <span>Showing {notifications.length} results</span>
                    <div className='flex items-center gap-4'>
                        <button className='hover:text-gray-600 transition-colors'>Older</button>
                        <button className='hover:text-gray-600 transition-colors'>Newer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationInbox;
