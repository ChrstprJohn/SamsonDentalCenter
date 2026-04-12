import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import useAppointmentDetail from '../../hooks/useAppointmentDetail';
import { STATUS_LABEL, STATUS_COLOR, formatDate, formatTime } from '../../hooks/useAppointments';

// Subcomponents
import AppointmentDetailActionBar from '../../components/patient/appointment_details/AppointmentDetailActionBar';
import AppointmentDetailStatus from '../../components/patient/appointment_details/AppointmentDetailStatus';
import AppointmentDetailTabs from '../../components/patient/appointment_details/AppointmentDetailTabs';
import AppointmentDetailFooter from '../../components/patient/appointment_details/AppointmentDetailFooter';
import AppointmentCancelModal from '../../components/patient/appointment_details/AppointmentCancelModal';
import CombinedOverview from '../../components/patient/appointment_details/CombinedOverview';

// ---------------------------------------------------------------------------
// Compute a human-readable duration
// ---------------------------------------------------------------------------
const getDuration = (start, end) => {
    if (!start || !end) return null;
    const toMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    const diff = toMinutes(end) - toMinutes(start);
    if (diff <= 0) return null;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h && m) return `${h}h ${m}min`;
    if (h) return `${h} Hour${h > 1 ? 's' : ''}`;
    return `${m} min`;
};

// ---------------------------------------------------------------------------
// Skeleton placeholder
// ---------------------------------------------------------------------------
const Skeleton = ({ className = '' }) => (
    <div className={`bg-gray-100 dark:bg-white/[0.06] rounded animate-pulse ${className}`} />
);

// ---------------------------------------------------------------------------
// Main Wrapper
// ---------------------------------------------------------------------------
const AppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        appointment: raw,
        loading,
        error,
        cancelling,
        cancelError,
        cancelAppointment,
    } = useAppointmentDetail(id);

    const [activeTab, setActiveTab] = useState('description');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // --- Loading ---
    if (loading) {
        return (
            <>
                <PageBreadcrumb
                    pageTitle='Appointment Details'
                    parentName='My Appointments'
                    parentPath='/patient/appointments'
                />
                <div className='flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden p-6 gap-6'>
                    <div className='flex items-center gap-4'>
                        <Skeleton className='w-16 h-16 rounded-full' />
                        <div className='space-y-2 flex-1'>
                            <Skeleton className='h-5 w-48' />
                            <Skeleton className='h-4 w-32' />
                        </div>
                    </div>
                    <Skeleton className='h-48 flex-1 rounded-2xl' />
                </div>
            </>
        );
    }

    // --- Error / Not found ---
    if (error || !raw) {
        return (
            <>
                <PageBreadcrumb
                    pageTitle='Appointment Details'
                    parentName='My Appointments'
                    parentPath='/patient/appointments'
                />
                <div className='flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm p-8 text-center items-center justify-center'>
                    <p className='text-error-500 text-sm font-medium'>
                        {error || 'Appointment not found.'}
                    </p>
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className='mt-4 px-4 py-2 bg-gray-50 dark:bg-white/[0.05] rounded-xl text-brand-500 hover:text-brand-600 text-sm font-bold transition-colors'
                    >
                        ← Back to My Appointments
                    </button>
                </div>
            </>
        );
    }

    // --- Derive data ---
    const dentistName = raw?.dentist?.profile?.full_name || raw?.dentist || 'TBD';
    const specialization = raw?.dentist?.specialization || null;
    const serviceName = raw?.service?.name || raw?.service || '—';
    const displayStatus = raw ? STATUS_LABEL[raw.status] || raw.status : '';
    const badgeColor = STATUS_COLOR[displayStatus] || 'primary';
    const duration = raw ? getDuration(raw.start_time, raw.end_time) : null;
    const patientLabel = raw?.booked_for_name
        ? raw.booked_for_name
        : raw?.patient_id
          ? 'Yourself'
          : raw?.guest_name || '—';
    const isRepresentativeBooking = !!raw?.booked_for_name;
    const isCancellable = !['CANCELLED', 'LATE_CANCEL', 'COMPLETED', 'NO_SHOW'].includes(
        raw.status,
    );

    const handleCancel = async () => {
        const result = await cancelAppointment(
            cancelReason.trim() || 'Patient requested cancellation.',
        );
        if (result.success) {
            setShowCancelModal(false);
            setCancelReason('');
        }
    };

    return (
        <>
            <PageBreadcrumb
                pageTitle='Appointment Details'
                parentName='My Appointments'
                parentPath='/patient/appointments'
            />

            <div className='flex-grow min-h-0 relative sm:mx-0'>
                <div className='flex-grow flex flex-col h-full bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
                    <AppointmentDetailActionBar onBack={() => navigate('/patient/appointments')} />

                    {/* Content Area */}
                    <div className='p-6 sm:p-8 md:p-10 overflow-y-auto grow no-scrollbar pb-28 sm:pb-8 md:pb-10 bg-white/50 dark:bg-transparent'>
                        <div className='max-w-4xl mx-auto space-y-10 sm:space-y-12'>
                            {/* Main Title - Matching Notification Detail Style */}
                            <div className='space-y-4'>
                                <div className='flex flex-col items-start gap-4'>
                                    <h2 className='text-[22px] sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-outfit leading-tight tracking-tight'>
                                        {serviceName}
                                    </h2>
                                    <span
                                        className={`px-2.5 py-1 text-[11px] sm:text-xs font-extrabold rounded uppercase tracking-widest ${
                                            badgeColor === 'success'
                                                ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                                                : badgeColor === 'warning'
                                                  ? 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400'
                                                  : badgeColor === 'error'
                                                    ? 'bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400'
                                                    : badgeColor === 'info'
                                                      ? 'bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400'
                                                      : 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                                        }`}
                                    >
                                        {displayStatus}
                                    </span>
                                </div>

                                <AppointmentDetailStatus
                                    displayStatus={displayStatus}
                                    originalStatus={raw.status}
                                    createdAt={raw.created_at}
                                    updatedAt={raw.updated_at}
                                    rawId={raw.id}
                                    cancellationReason={raw.cancellation_reason}
                                    rejectionReason={raw.rejection_reason}
                                />
                            </div>

                            <CombinedOverview
                                dentistName={dentistName}
                                specialization={specialization}
                                dateFormatted={formatDate(raw.appointment_date)}
                                timeFormatted={`${formatTime(raw.start_time)} – ${formatTime(raw.end_time)}`}
                                duration={duration}
                                patientLabel={patientLabel}
                                isRepresentativeBooking={isRepresentativeBooking}
                            />

                            <AppointmentDetailTabs
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                notes={raw.notes}
                                originalStatus={raw.status}
                            />
                        </div>
                    </div>

                    <AppointmentDetailFooter
                        isCancellable={isCancellable}
                        onCancelClick={() => setShowCancelModal(true)}
                        onRescheduleClick={() => {
                            /* Handle reschedule */
                        }}
                    />
                </div>
            </div>

            <AppointmentCancelModal
                show={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                }}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                rawId={raw.id}
                cancelling={cancelling}
                handleCancel={handleCancel}
            />
        </>
    );
};

export default AppointmentDetails;
