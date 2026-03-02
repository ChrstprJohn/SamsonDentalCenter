import React from 'react';
import { useSearchParams } from 'react-router-dom';

const AppointmentConfirmedPage = () => {
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get('id');

    return (
        <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-emerald-100'>
            <div className='text-center max-w-md'>
                <div className='mb-4'>
                    <svg
                        className='w-16 h-16 text-green-500 mx-auto'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                </div>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Appointment Confirmed! ✅</h1>
                <p className='text-gray-600 mb-4'>
                    Your appointment has been successfully confirmed.
                </p>
                {appointmentId && (
                    <p className='text-sm text-gray-500 mb-6'>Appointment ID: {appointmentId}</p>
                )}
                <div className='bg-white rounded-lg p-6 mb-6 shadow-md'>
                    <p className='text-gray-700'>
                        You should receive a confirmation email shortly with all the details of your
                        appointment.
                    </p>
                </div>
                <div className='space-y-3'>
                    <a
                        href='/'
                        className='block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition'
                    >
                        Go Home
                    </a>
                    <a
                        href='/appointments'
                        className='block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition'
                    >
                        View My Appointments
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AppointmentConfirmedPage;
