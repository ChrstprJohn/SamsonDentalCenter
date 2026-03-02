import React from 'react';

const AppointmentAlreadyConfirmedPage = () => {
    return (
        <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-yellow-50 to-orange-100'>
            <div className='text-center max-w-md'>
                <div className='mb-4'>
                    <svg
                        className='w-16 h-16 text-yellow-500 mx-auto'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                </div>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'>Already Confirmed</h1>
                <p className='text-gray-600 mb-6'>
                    This appointment has already been confirmed. If you need to make changes, please
                    contact our clinic.
                </p>
                <div className='bg-white rounded-lg p-6 mb-6 shadow-md'>
                    <p className='text-gray-700 font-semibold mb-2'>📞 Need Help?</p>
                    <p className='text-gray-600 text-sm'>Contact us at: (555) 123-4567</p>
                </div>
                <div className='space-y-3'>
                    <a
                        href='/'
                        className='block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition'
                    >
                        Go Home
                    </a>
                    <a
                        href='/appointments'
                        className='block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition'
                    >
                        View My Appointments
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AppointmentAlreadyConfirmedPage;
