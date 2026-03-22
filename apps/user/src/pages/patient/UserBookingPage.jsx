import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useUserBooking from '../../hooks/useUserBooking';
import UserBookingWizard from '../../components/user-booking/UserBookingWizard';
import { useAuth } from '../../context/AuthContext';

const UserBookingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, loading } = useAuth();

    // ✅ IMPROVEMENT #4: Deep link awareness - capture service from URL
    const serviceId = searchParams.get('service');
    const serviceName = decodeURIComponent(searchParams.get('service_name') || '');

    // Pass pre-selected service to hook
    const booking = useUserBooking(serviceId, serviceName);

    useEffect(() => {
        // Only redirect if loading is complete and user is not authenticated
        if (!loading && !user) {
            navigate('/login?redirect=/dashboard/book');
        }
    }, [user, loading, navigate]);

    // ✅ IMPROVEMENT #4: Auto-advance to datetime step if service is pre-selected
    useEffect(() => {
        if (serviceId && booking.step === 0 && booking.formData.service_id) {
            // Service is pre-selected and we're on step 0, advance to step 1 (datetime)
            booking.nextStep();
        }
    }, [serviceId, booking.step, booking.formData.service_id]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-slate-600'>Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated (after loading completes)
    if (!user) {
        return null;
    }

    return (
        <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4'>
            <div className='max-w-2xl mx-auto'>
                <div className='bg-white rounded-2xl shadow-xl p-8'>
                    <UserBookingWizard booking={booking} />
                </div>
            </div>
        </div>
    );
};

export default UserBookingPage;
