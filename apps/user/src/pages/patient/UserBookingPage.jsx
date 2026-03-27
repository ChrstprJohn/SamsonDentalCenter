import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import useUserBooking from '../../hooks/useUserBooking';
import UserBookingWizard from '../../components/user-booking/UserBookingWizard';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const UserBookingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, loading } = useAuth();

    // Deep link awareness
    const serviceId = searchParams.get('service');
    const serviceName = decodeURIComponent(searchParams.get('service_name') || '');

    // Pass pre-selected service to hook
    const booking = useUserBooking(serviceId, serviceName);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login?redirect=/patient/book');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (serviceId && booking.step === 0 && booking.formData.service_id) {
            booking.nextStep();
        }
    }, [serviceId, booking.step, booking.formData.service_id]);

    if (loading) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
                <div className='w-12 h-12 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin' />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className='min-h-screen bg-white py-12 px-6'>
            <div className='max-w-3xl mx-auto'>
                {/* Exit Navigation */}
                <div className="mb-12">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all duration-300 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Exit
                    </Link>
                </div>

                <div className='bg-white rounded-[40px] border border-slate-50 p-10 md:p-14 shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-6 duration-700'>
                    <UserBookingWizard booking={booking} />
                </div>
            </div>
        </div>
    );
};

export default UserBookingPage;
