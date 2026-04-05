import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const PatientDashboard = () => {
    return (
        <>
            <PageBreadcrumb pageTitle='Dashboard' />
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
                                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-gray-800 dark:text-white/90 mb-2'>
                        Dashboard Coming Soon
                    </h2>
                    <p className='text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
                        We are working hard to bring you a comprehensive overview of your dental health and upcoming activities.
                    </p>
                </div>
            </div>
        </>
    );
};

export default PatientDashboard;
