import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DashboardStats from '../../components/patient/dashboard/DashboardStats';
import DashboardNotifications from '../../components/patient/dashboard/DashboardNotifications';
import DashboardAppointments from '../../components/patient/dashboard/DashboardAppointments';
import WaitlistOfferCard from '../../components/patient/waitlist/WaitlistOfferCard';
import ClaimSlotModal from '../../components/patient/waitlist/ClaimSlotModal';
import useWaitlist from '../../hooks/useWaitlist';
import { useAppointmentState } from '../../context/AppointmentContext';
import ErrorState from '../../components/common/ErrorState';

const PatientDashboard = () => {
    const { entries, offers, loading: waitlistLoading, error: waitlistError, confirmOffer } = useWaitlist();
    const { appointments, total: totalAppointments, loading: apptsLoading, error: apptsError } = useAppointmentState();
    const error = waitlistError || apptsError;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleClaimClick = (slot) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const handleConfirmClaim = async (id) => {
        try {
            await confirmOffer(id);
            setIsModalOpen(false);
            setSelectedSlot(null);
        } catch (err) {
            console.error('Failed to confirm offer:', err);
        }
    };

    return (
        <>
            <PageBreadcrumb pageTitle='Dashboard' />
            
            <div className='space-y-6'>
                {error ? (
                    <ErrorState 
                        error={error} 
                        onRetry={() => window.location.reload()} 
                        title="Unable to load Dashboard"
                    />
                ) : (
                    <>
                        {/* Active Waitlist Offers */}
                        {offers.length > 0 && (
                            <div className='space-y-4'>
                                {offers.map(offer => (
                                    <WaitlistOfferCard 
                                        key={offer.id} 
                                        offer={offer} 
                                        onClaim={() => handleClaimClick(offer)} 
                                    />
                                ))}
                            </div>
                        )}

                        {/* Welcome Section */}
                        <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm'>
                            <h2 className='text-xl font-bold text-gray-800 dark:text-white/90 font-outfit uppercase tracking-tight'>
                                Welcome back!
                            </h2>
                            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium'>
                                Here's an overview of your dental health and upcoming appointments.
                            </p>
                        </div>

                        {/* Metrics Grid */}
                        <DashboardStats 
                            entries={entries} 
                            appointments={appointments}
                            totalAppointments={totalAppointments}
                            loading={waitlistLoading || apptsLoading}
                        />

                        {/* Main Content: Notifications (Left) & Appointments (Right) */}
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                            {/* Notifications section (1 column on large screens) */}
                            <div className='lg:col-span-1'>
                                <DashboardNotifications />
                            </div>

                            {/* Appointments Table section (2 columns on large screens) */}
                            <div className='lg:col-span-2'>
                                <DashboardAppointments />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ClaimSlotModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                slot={selectedSlot}
                onConfirm={handleConfirmClaim}
                loading={waitlistLoading}
            />
        </>
    );
};

export default PatientDashboard;
