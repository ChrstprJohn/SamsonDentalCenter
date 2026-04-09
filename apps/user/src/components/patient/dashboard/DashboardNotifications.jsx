import React from 'react';
import { Bell, CheckCircle2, Info, AlertCircle } from 'lucide-react';

const NOTIFICATIONS = [
    {
        id: 1,
        title: 'Appointment Approved',
        message: 'Your dental cleaning with Dr. Smith has been approved for Oct 24.',
        type: 'success',
        time: '2 hours ago',
    },
    {
        id: 2,
        title: 'New Policy Update',
        message: 'Please review our new cancellation policy in your profile settings.',
        type: 'info',
        time: '1 day ago',
    },
    {
        id: 3,
        title: 'Reminder: 48h Check-in',
        message: 'Dont forget to confirm your upcoming visit 48 hours in advance.',
        type: 'warning',
        time: '3 days ago',
    },
];

const DashboardNotifications = () => {
    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={18} className='text-success-500' />;
            case 'warning': return <AlertCircle size={18} className='text-warning-500' />;
            case 'info': return <Info size={18} className='text-blue-500' />;
            default: return <Bell size={18} className='text-gray-400' />;
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
                {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className='flex items-start gap-4'>
                        <div className='mt-0.5 shrink-0'>
                            {getIcon(n.type)}
                        </div>
                        <div className='flex-grow'>
                            <h4 className='text-sm font-medium text-gray-800 dark:text-white/90 leading-none mb-1.5'>
                                {n.title}
                            </h4>
                            <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5'>
                                {n.message}
                            </p>
                            <span className='text-[10px] text-gray-400 dark:text-gray-500'>
                                {n.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className='mt-6 w-full py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors'>
                Clear All
            </button>
        </div>
    );
};

export default DashboardNotifications;
