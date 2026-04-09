import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Badge } from '../../components/ui';
import useAppointmentDetail from '../../hooks/useAppointmentDetail';
import { STATUS_LABEL, STATUS_COLOR, formatDate, formatTime, formatFullDateTime } from '../../hooks/useAppointments';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const CalendarIcon = () => (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='text-gray-400'>
        <rect x='3' y='4' width='18' height='18' rx='2' ry='2' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M16 2V6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M8 2V6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M3 10H21' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ClockIcon = () => (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='text-gray-400'>
        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 6V12L16 14' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

// ---------------------------------------------------------------------------
// Skeleton placeholder
// ---------------------------------------------------------------------------
const Skeleton = ({ className = '' }) => (
    <div className={`bg-gray-100 dark:bg-white/[0.06] rounded animate-pulse ${className}`} />
);

// ---------------------------------------------------------------------------
// Compute a human-readable duration from two HH:MM:SS strings
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
// Component
// ---------------------------------------------------------------------------
const AppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { appointment: raw, loading, error, cancelling, cancelError, cancelAppointment } =
        useAppointmentDetail(id);

    const [showStatusDetails, setShowStatusDetails] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('description');
    const [showCancelModal, setShowCancelModal] = React.useState(false);
    const [cancelReason, setCancelReason] = React.useState('');
    const statusRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusRef.current && !statusRef.current.contains(event.target)) {
                setShowStatusDetails(false);
            }
        };
        if (showStatusDetails) document.addEventListener('mousedown', handleClickOutside);
        else document.removeEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showStatusDetails]);

    // --- Derive display-friendly values from raw API data ---
    const dentistName = raw?.dentist?.profile?.full_name || raw?.dentist || 'TBD';
    const specialization = raw?.dentist?.specialization || null;
    const serviceName = raw?.service?.name || raw?.service || '—';
    const displayStatus = raw ? (STATUS_LABEL[raw.status] || raw.status) : '';
    const badgeColor = STATUS_COLOR[displayStatus] || 'primary';
    const duration = raw ? getDuration(raw.start_time, raw.end_time) : null;

    // Who is it booked for?
    const patientLabel = raw?.booked_for_name
        ? raw.booked_for_name
        : raw?.patient_id
        ? 'Yourself'
        : raw?.guest_name || '—';

    const isRepresentativeBooking = !!raw?.booked_for_name;

    const handleCancel = async () => {
        const result = await cancelAppointment(cancelReason.trim() || 'Patient requested cancellation.');
        if (result.success) {
            setShowCancelModal(false);
            setCancelReason('');
        }
    };

    // --- Loading ---
    if (loading) {
        return (
            <>
                <PageBreadcrumb pageTitle='Appointment Details' parentName='My Appointments' parentPath='/patient/appointments' />
                <div className='space-y-6'>
                    <div className='p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-theme-sm'>
                        <div className='flex items-center gap-4'>
                            <Skeleton className='w-20 h-20 rounded-full' />
                            <div className='space-y-2 flex-1'>
                                <Skeleton className='h-5 w-48' />
                                <Skeleton className='h-4 w-32' />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-6'>
                        <Skeleton className='h-48 flex-1 rounded-2xl' />
                        <Skeleton className='h-48 w-1/3 rounded-2xl' />
                    </div>
                </div>
            </>
        );
    }

    // --- Error / Not found ---
    if (error || !raw) {
        return (
            <>
                <PageBreadcrumb pageTitle='Appointment Details' parentName='My Appointments' parentPath='/patient/appointments' />
                <div className='p-8 text-center'>
                    <p className='text-error-500 text-sm font-medium'>{error || 'Appointment not found.'}</p>
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className='mt-4 text-brand-500 hover:text-brand-600 text-sm font-medium'
                    >
                        ← Back to My Appointments
                    </button>
                </div>
            </>
        );
    }

    const isCancellable = !['CANCELLED', 'LATE_CANCEL', 'COMPLETED', 'NO_SHOW'].includes(raw.status);

    return (
        <>
            <PageBreadcrumb
                pageTitle='Appointment Details'
                parentName='My Appointments'
                parentPath='/patient/appointments'
            />

            <div className='space-y-6'>
                {/* ── Header Card ── */}
                <div className='p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 shadow-theme-sm'>
                    <div className='flex flex-col items-center w-full gap-6 xl:flex-row xl:w-auto pb-6 xl:pb-0 border-b xl:border-b-0 border-gray-100 dark:border-gray-800'>
                        {/* Avatar */}
                        <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-brand-50 text-brand-600 font-bold text-2xl'>
                            {dentistName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase()}
                        </div>
                        <div className='text-center xl:text-left'>
                            <h4 className='mb-2 text-lg font-semibold text-gray-800 dark:text-white/90'>
                                {dentistName}
                            </h4>
                            <div className='flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                {specialization && (
                                    <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>{specialization}</p>
                                )}
                                {specialization && <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block' />}
                                <p className='text-sm text-gray-400'>ID: {raw.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status section */}
                    <div ref={statusRef} className='flex flex-col items-center xl:items-end gap-3 xl:justify-end xl:w-auto w-full pt-1 xl:pt-0 relative'>
                        <div
                            className='flex items-center justify-center xl:justify-end gap-2.5 mb-1.5 cursor-pointer select-none group'
                            onClick={() => setShowStatusDetails(!showStatusDetails)}
                        >
                            <span className='text-base font-semibold text-gray-700 dark:text-gray-300'>Appointment Status:</span>
                            <div className='scale-110 origin-left flex items-center gap-1.5'>
                                <Badge size='sm' color={badgeColor}>
                                    {displayStatus}
                                </Badge>
                                <div className='p-1 rounded bg-gray-100 dark:bg-white/[0.05] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors'>
                                    <svg
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${showStatusDetails ? 'rotate-180' : ''}`}
                                        fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2.5'
                                    >
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <p className='text-xs text-gray-400 mt-1 xl:text-right w-full'>
                            Booked on: {formatFullDateTime(raw.created_at)}
                        </p>

                        {/* Expandable status detail */}
                        {showStatusDetails && (
                            <div className='absolute top-full right-0 mt-3 w-full xl:w-max min-w-[280px] flex justify-center xl:justify-end origin-top z-20 shadow-lg rounded-xl animate-[fadeIn_0.15s_ease-out]'>
                                {raw.status === 'PENDING' && (
                                    <p className='text-sm font-medium text-warning-700 dark:text-warning-500 bg-warning-50 dark:bg-warning-500/10 px-4 py-3 rounded-xl border border-warning-100 dark:border-warning-500/20 text-center xl:text-right w-full'>
                                        This appointment is awaiting confirmation from the clinic. We will notify you once approved.
                                    </p>
                                )}
                                {(raw.status === 'CANCELLED' || raw.status === 'LATE_CANCEL') && (
                                    <p className='text-sm font-medium text-error-700 dark:text-error-500 bg-error-50 dark:bg-error-500/10 px-4 py-3 rounded-xl border border-error-100 dark:border-error-500/20 text-center xl:text-right w-full'>
                                        {raw.cancellation_reason
                                            ? `Cancellation Reason: ${raw.cancellation_reason}`
                                            : raw.rejection_reason
                                            ? `Rejection Reason: ${raw.rejection_reason}`
                                            : 'This appointment was cancelled.'}
                                    </p>
                                )}
                                {raw.status === 'CONFIRMED' && (
                                    <p className='text-sm font-medium text-success-700 dark:text-success-500 bg-success-50 dark:bg-success-500/10 px-4 py-3 rounded-xl border border-success-100 dark:border-success-500/20 text-center xl:text-right w-full'>
                                        Your appointment has been confirmed by the clinic.
                                    </p>
                                )}
                                {raw.status === 'COMPLETED' && (
                                    <p className='text-sm font-medium text-info-700 dark:text-info-500 bg-info-50 dark:bg-info-500/10 px-4 py-3 rounded-xl border border-info-100 dark:border-info-500/20 text-center xl:text-right w-full'>
                                        This appointment has been completed. Thank you for visiting us!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Main Content Grid ── */}
                <div className='flex flex-col xl:flex-row items-stretch gap-6'>
                    {/* Left: Service Overview */}
                    <div className='w-full xl:w-2/3 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] shadow-theme-sm flex flex-col'>
                        <h3 className='mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 font-outfit'>Service Overview</h3>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 grow items-center'>
                            <div className='space-y-6'>
                                {/* Date */}
                                <div className='flex items-start gap-4'>
                                    <div className='p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg'><CalendarIcon /></div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Date</p>
                                        <p className='mt-1 text-sm font-medium text-gray-800 dark:text-white/90'>{formatDate(raw.appointment_date)}</p>
                                    </div>
                                </div>
                                {/* Time */}
                                <div className='flex items-start gap-4'>
                                    <div className='p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg'><ClockIcon /></div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Time</p>
                                        <p className='mt-1 text-sm font-medium text-gray-800 dark:text-white/90'>
                                            {formatTime(raw.start_time)} – {formatTime(raw.end_time)}
                                        </p>
                                        {duration && (
                                            <p className='text-xs text-gray-400 mt-0.5'>Duration: {duration}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-6'>
                                {/* Patient */}
                                <div className='flex items-start gap-4'>
                                    <div className='p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-400'>
                                        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                            <circle cx='12' cy='7' r='4' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Patient</p>
                                        <p className='mt-1 text-sm font-medium text-gray-800 dark:text-white/90'>
                                            {patientLabel}
                                            {isRepresentativeBooking && (
                                                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg uppercase tracking-wider">
                                                    Representative Booking
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {/* Service */}
                                <div className='flex items-start gap-4'>
                                    <div className='p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500'>
                                        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M22 12h-4l-3 9L9 3l-3 9H2' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Service</p>
                                        <p className='mt-1 text-sm font-medium text-gray-800 dark:text-white/90'>{serviceName}</p>
                                        {raw.service?.price != null && (
                                            <p className='text-xs text-gray-400 mt-0.5'>₱ {Number(raw.service.price).toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Manage Appointment */}
                    <div className='w-full xl:w-1/3 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] shadow-theme-sm flex flex-col justify-between'>
                        <div>
                            <h3 className='mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 font-outfit'>Manage Appointment</h3>
                            <div className='flex flex-col gap-3'>
                                {isCancellable ? (
                                    <>
                                        {/* Reschedule — placeholder, no action yet */}
                                        <button
                                            className='w-full px-4 py-3 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors flex justify-center items-center gap-2 shadow-theme-xs'
                                        >
                                            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                                                <path d='M3 3v5h5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                                            </svg>
                                            Reschedule
                                        </button>

                                        {/* Cancel */}
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className='w-full px-4 py-3 bg-white dark:bg-transparent border border-error-200 dark:border-error-500/20 text-error-600 dark:text-error-500 rounded-lg text-sm font-medium hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors flex justify-center items-center gap-2 shadow-theme-xs'
                                        >
                                            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M18 6L6 18' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                                <path d='M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                            </svg>
                                            Cancel Appointment
                                        </button>
                                    </>
                                ) : (
                                    <div className='text-center p-5 rounded-xl border border-gray-100 bg-gray-50/50 dark:bg-white/[0.02] dark:border-white/[0.05]'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                                            {raw.status === 'COMPLETED'
                                                ? 'This appointment is completed.'
                                                : 'This appointment is cancelled.'}
                                            <br />
                                            You can{' '}
                                            <button
                                                className='text-brand-500 hover:text-brand-600 font-medium transition-colors'
                                                onClick={() => navigate('/patient/appointments')}
                                            >
                                                view all appointments
                                            </button>{' '}
                                            or{' '}
                                            <button
                                                className='text-brand-500 hover:text-brand-600 font-medium transition-colors'
                                                onClick={() => setActiveTab('contact')}
                                            >
                                                contact us
                                            </button>
                                            .
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className='p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] shadow-theme-sm'>
                    <div className='flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-6 relative overflow-x-auto whitespace-nowrap hide-scrollbar'>
                        {['description', 'notes', 'contact', 'faq'].map((tab) => {
                            const labels = { description: 'Description', notes: 'Pre-Treatment Notes', contact: 'Contact Clinic', faq: 'FAQ' };
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                                        activeTab === tab
                                            ? 'text-brand-600 dark:text-brand-500'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {labels[tab]}
                                    {activeTab === tab && (
                                        <span className='absolute bottom-0 left-0 w-full h-[2px] bg-brand-500 rounded-t-sm' />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className='min-h-[80px]'>
                        {activeTab === 'description' && (
                            <div className='animate-[fadeIn_0.2s_ease-out]'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl'>
                                    {raw.notes || 'No additional notes for this appointment.'}
                                </p>
                            </div>
                        )}
                        {activeTab === 'notes' && (
                            <div className='animate-[fadeIn_0.2s_ease-out]'>
                                <ul className='list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                                    <li>Please arrive 10 minutes early to fill out any necessary forms.</li>
                                    <li>Avoid eating heavy meals 2 hours before the appointment.</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'contact' && (
                            <div className='animate-[fadeIn_0.2s_ease-out]'>
                                <div className='flex flex-col gap-3'>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>If you have any urgent concerns prior to your appointment, please reach out:</p>
                                    <div className='flex items-center gap-2'>
                                        <svg className='w-5 h-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                        </svg>
                                        <p className='text-sm text-gray-800 dark:text-gray-200'><strong>Phone:</strong> (555) 123-4567</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <svg className='w-5 h-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                        </svg>
                                        <p className='text-sm text-gray-800 dark:text-gray-200'><strong>Email:</strong> support@primeradental.com</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'faq' && (
                            <div className='animate-[fadeIn_0.2s_ease-out] space-y-4 max-w-4xl'>
                                <div>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>Do I need to arrive early?</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>Please arrive at least 10 minutes prior to your scheduled time.</p>
                                </div>
                                <hr className='border-gray-100 dark:border-gray-800' />
                                <div>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>What if I need to cancel?</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>Cancellations must be made at least 24 hours in advance. You can cancel directly from this page.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Cancel Modal ── */}
            {showCancelModal && (
                <div
                    className='fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm'
                    onClick={(e) => { if (e.target === e.currentTarget && !cancelling) { setShowCancelModal(false); setCancelReason(''); } }}
                >
                    {/* Dialog */}
                    <div className='relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-[fadeIn_0.15s_ease-out]'>
                        {/* Header */}
                        <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800'>
                            <div className='flex items-center gap-3'>
                                <div className='w-9 h-9 rounded-xl bg-error-50 dark:bg-error-500/10 flex items-center justify-center text-error-500'>
                                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M18 6L6 18' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                        <path d='M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className='text-base font-semibold text-gray-800 dark:text-white/90'>Cancel Appointment</h3>
                                    <p className='text-xs text-gray-400 mt-0.5'>ID: {raw.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                                disabled={cancelling}
                                className='p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors disabled:opacity-40'
                            >
                                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className='px-6 py-5 space-y-4'>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Please let us know why you need to cancel. This helps the clinic improve its scheduling.
                            </p>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                                    Reason <span className='text-gray-400 font-normal'>(optional)</span>
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    disabled={cancelling}
                                    placeholder='e.g. Schedule conflict, feeling better, etc.'
                                    rows={3}
                                    maxLength={300}
                                    className='w-full px-4 py-3 border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors disabled:opacity-60'
                                />
                                <p className='text-xs text-gray-400 mt-1 text-right'>{cancelReason.length}/300</p>
                            </div>
                            {cancelError && (
                                <p className='text-xs font-medium text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-500/10 px-3 py-2 rounded-lg border border-error-100 dark:border-error-500/20'>
                                    {cancelError}
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className='flex gap-3 px-6 pb-5'>
                            <button
                                onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                                disabled={cancelling}
                                className='flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors disabled:opacity-60'
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className='flex-1 px-4 py-2.5 bg-error-500 hover:bg-error-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2'
                            >
                                {cancelling ? (
                                    <>
                                        <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                                        </svg>
                                        Cancelling…
                                    </>
                                ) : (
                                    'Confirm Cancel'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppointmentDetails;
