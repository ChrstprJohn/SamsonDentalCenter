import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useGuestBooking from '../../hooks/useGuestBooking';
import GuestBookingWizard from '../../components/guest-booking/GuestBookingWizard';
import useServices from '../../hooks/useServices';

const GuestBookingPage = () => {
    const [searchParams] = useSearchParams();
    const initialServiceId = searchParams.get('service');
    const [initialServiceName, setInitialServiceName] = useState(null);

    const { services } = useServices();

    // Issue #4: Pre-populate service name from services list
    useEffect(() => {
        if (initialServiceId && services && services.length > 0) {
            // Note: Ensure types match (e.g., string vs number) when comparing IDs
            const service = services.find((s) => String(s.id) === String(initialServiceId));
            if (service) {
                setInitialServiceName(service.name);
            }
        }
    }, [initialServiceId, services]);

    const booking = useGuestBooking(initialServiceId, initialServiceName);

    return (
        <div className='min-h-screen bg-white py-12 px-6'>
            <div className='max-w-5xl mx-auto'>
                {/* Exit Navigation */}
                <div className='mb-12'>
                    <Link
                        to='/'
                        className='inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all duration-300 group'
                    >
                        <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
                        Exit
                    </Link>
                </div>

                <div className='bg-white rounded-[40px] border border-slate-50 p-10 md:p-14 shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-6 duration-700'>
                    <GuestBookingWizard booking={booking} />
                </div>
            </div>
        </div>
    );
};

export default GuestBookingPage;
