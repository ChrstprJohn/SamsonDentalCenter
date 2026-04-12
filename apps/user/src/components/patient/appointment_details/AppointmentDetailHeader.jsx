import React from 'react';

const AppointmentDetailHeader = ({ dentistName, specialization }) => {
    return (
        <div className='mb-12 sm:mb-16'>
            <h2 className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-6 sm:mb-8'>
                Assigned Provider
            </h2>

            <div className='flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10'>
                {/* Left: Avatar + Title */}
                <div className='flex items-center gap-5'>
                    <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xl sm:text-2xl'>
                        {dentistName
                            .replace(/^Dr\.\s*/i, '')
                            .charAt(0)
                            .toUpperCase()}
                    </div>
                    <div>
                        <h3 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1'>
                            {dentistName}
                        </h3>
                        <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium'>
                            {specialization || 'General Dentistry'}
                        </p>
                    </div>
                </div>

                <div className='hidden sm:block w-px h-12 bg-gray-200 dark:bg-gray-800'></div>

                {/* Right: Description without containment */}
                <div className='max-w-md'>
                    <p className='text-[13px] sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed'>
                        Experience exceptional care with your assigned provider, dedicated to
                        ensuring a comfortable and professional environment during your entire
                        visit.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailHeader;
