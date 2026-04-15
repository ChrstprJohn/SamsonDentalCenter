import React from 'react';
import { Search, Filter, Mail, Archive, Star, Clock, XCircle, Inbox } from 'lucide-react';
import NotificationRow from './NotificationRow';
import Pagination from '../../common/Pagination';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Mail },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'general', label: 'General', icon: Inbox },
    { id: 'waitlist', label: 'Waitlist', icon: Clock },
    { id: 'cancellation', label: 'Cancellation', icon: XCircle },
];

const NotificationInbox = ({
    notifications,
    totalCount,
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
    onNotificationClick,
}) => {
    return (
        <div className='grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden'>
            {/* Header / Search Area */}
            <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4'>
                <div className='relative'>
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
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
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
