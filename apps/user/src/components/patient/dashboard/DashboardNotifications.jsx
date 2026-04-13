import React from 'react';
import { Bell, CheckCircle2, Info, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import useNotifications from '../../../hooks/useNotifications';
import { formatFullDateTime } from '../../../hooks/useAppointments';
import { Link } from 'react-router-dom';
import { renderNotification } from '../../../utils/notificationRenderer';

const DashboardNotifications = () => {
    const { notifications, loading, markAllRead } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'CONFIRMATION': return <CheckCircle2 size={18} className='text-success-500' />;
            case 'CANCELLATION': return <AlertCircle size={18} className='text-error-500' />;
            case 'REMINDER': return <Calendar size={18} className='text-warning-500' />;
            case 'WAITLIST': return <Bell size={18} className='text-brand-500' />;
            default: return <Info size={18} className='text-blue-500' />;
        }
    };

    return (
        <div className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm h-full flex flex-col'>
            <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit'>
                    Notifications
                </h3>
                <span className='px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-gray-400 rounded-lg uppercase tracking-wider'>
                    Latest
                </span>
            </div>

            <div className='space-y-5 grow'>
                {loading && notifications.length === 0 ? (
                    <div className='animate-pulse space-y-4'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='flex gap-4'>
                                <div className='h-8 w-8 bg-gray-100 rounded-full' />
                                <div className='space-y-2 grow'>
                                    <div className='h-3 w-24 bg-gray-100 rounded-full' />
                                    <div className='h-2 w-full bg-gray-50 rounded-full' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-10 opacity-40 grayscale'>
                        <Bell size={32} className='mb-2' />
                        <p className='text-xs'>No notifications yet</p>
                    </div>
                ) : (
                    notifications.slice(0, 4).map((n) => {
                        const rendered = renderNotification(n);
                        return (
                            <Link key={n.id} to={`/patient/notifications?id=${n.id}`} className='flex items-start gap-4 hover:bg-gray-50/50 p-1 -m-1 rounded-lg transition-colors'>
                                <div className='mt-0.5 shrink-0'>
                                    {getIcon(n.type)}
                                </div>
                                <div className='flex-grow min-w-0'>
                                    <h4 className={`text-sm font-medium leading-none mb-1.5 truncate ${!n.is_read ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                                        {rendered.title}
                                    </h4>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1.5'>
                                        {rendered.message}
                                    </p>
                                    <span className='text-[10px] text-gray-400 dark:text-gray-500'>
                                        {n.sent_at ? formatFullDateTime(n.sent_at) : ''}
                                    </span>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
            
            <div className='mt-6 grid grid-cols-2 gap-3'>
                <button 
                    onClick={markAllRead}
                    disabled={notifications.length === 0}
                    className='py-2.5 text-[11px] font-medium text-gray-600 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50'
                >
                    Mark all read
                </button>
                <Link 
                    to='/patient/notifications'
                    className='py-2.5 text-[11px] font-medium text-center text-brand-600 border border-brand-50 bg-brand-50/30 rounded-xl hover:bg-brand-50 transition-colors'
                >
                    View all
                </Link>
            </div>
        </div>
    );
};

export default DashboardNotifications;
