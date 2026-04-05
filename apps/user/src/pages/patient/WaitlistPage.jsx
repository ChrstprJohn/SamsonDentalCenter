import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const WaitlistPage = () => {
    return (
        <>
            <PageBreadcrumb pageTitle='Waitlist' />
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
                                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                            />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-gray-800 dark:text-white/90 mb-2'>
                        Waitlist Feature Coming Soon
                    </h2>
                    <p className='text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
                        Easily join the waitlist for your preferred dentist and time slot. We'll notify you as soon as a spot becomes available.
                    </p>
                </div>
            </div>
        </>
    );
};

export default WaitlistPage;
