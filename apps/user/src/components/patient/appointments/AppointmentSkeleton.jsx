const AppointmentSkeleton = ({ rows = 5 }) => {
    return (
        <div className='flex flex-col'>
            {[...Array(rows)].map((_, index) => (
                <div key={index} className='flex p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 gap-4'>
                    <div className='shrink-0 w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-white/[0.06] animate-pulse' />
                    <div className='flex-grow flex flex-col justify-center gap-2 mt-1'>
                        <div className='w-full sm:w-1/3 h-4 bg-gray-100 dark:bg-white/[0.06] rounded animate-pulse' />
                        <div className='w-2/3 sm:hidden h-3 bg-gray-100 dark:bg-white/[0.06] rounded animate-pulse' />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AppointmentSkeleton;
