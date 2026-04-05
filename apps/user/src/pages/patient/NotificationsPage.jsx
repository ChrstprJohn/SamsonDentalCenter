import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const NotificationsPage = () => {
    return (
        <>
            <PageBreadcrumb pageTitle='Notifications' />
            <div className='rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm text-center'>
                <div className='flex flex-col items-center justify-center min-h-[300px]'>
                    <div className='w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-6'>
                        <svg
                            className='w-10 h-10'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                            />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-gray-800 dark:text-white/90 mb-2'>
                        Notifications Coming Soon
                    </h2>
                    <p className='text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
                        We're building an improved notification system to keep you updated on all your dental care status and reminders.
                    </p>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;
