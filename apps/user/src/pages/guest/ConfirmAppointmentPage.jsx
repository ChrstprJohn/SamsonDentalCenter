import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ConfirmAppointmentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const confirmAppointment = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setError('No confirmation token provided.');
                setLoading(false);
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(
                    `${apiUrl}/api/appointments/confirm-email?token=${token}`,
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Failed to confirm appointment.');
                    setLoading(false);
                    return;
                }

                if (data.confirmed) {
                    navigate(`/email/confirmed?id=${data.appointment.id}`);
                } else {
                    navigate('/email/already-confirmed');
                }
            } catch (err) {
                console.error('Confirmation error:', err);
                setError(err.message || 'An error occurred while confirming your appointment.');
                setLoading(false);
            }
        };

        confirmAppointment();
    }, [searchParams]);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100'>
                <div className='text-center'>
                    <div className='mb-4'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
                    </div>
                    <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                        Confirming Your Appointment
                    </h1>
                    <p className='text-gray-600'>Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
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
                    <h1 className='text-2xl font-bold text-gray-800 mb-2'>Confirmation Failed</h1>
                    <p className='text-gray-600 mb-6'>{error}</p>
                    <a
                        href='/'
                        className='inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition'
                    >
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    return null;
};

export default ConfirmAppointmentPage;
