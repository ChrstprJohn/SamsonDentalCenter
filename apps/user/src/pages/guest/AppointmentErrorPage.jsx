import React from 'react';
import { useSearchParams } from 'react-router-dom';

const AppointmentErrorPage = () => {
    const [searchParams] = useSearchParams();
    const message =
        searchParams.get('message') || 'An error occurred while processing your appointment.';

    return (
        <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-red-50 to-pink-100'>
            <div className='text-center max-w-md'>
                <div className='mb-4'>
                    <svg
                        className='w-16 h-16 text-red-500 mx-auto'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                </div>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'>Error</h1>
                <p className='text-gray-600 mb-6'>{decodeURIComponent(message)}</p>
                <div className='space-y-3'>
                    <a
                        href='/'
                        className='block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition'
                    >
                        Return Home
                    </a>
                    <a
                        href='/book-appointment'
                        className='block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition'
                    >
                        Book Another Appointment
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AppointmentErrorPage;
