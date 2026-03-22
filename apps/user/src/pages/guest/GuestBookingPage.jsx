import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
        <section className='py-12 sm:py-16 bg-white min-h-screen'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
                <GuestBookingWizard booking={booking} />
            </div>
        </section>
    );
};

export default GuestBookingPage;
