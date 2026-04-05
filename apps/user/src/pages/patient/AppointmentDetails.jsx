import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Badge } from '../../components/ui';

import { appointmentsData } from './MyAppointments';

// Dummy data generator combining specific row data with full details
const getAppointmentData = (id) => {
    const found = appointmentsData.find(a => a.id === id);
    
    // Map list statuses to our strict 3 (Approved, Pending, Rejected)
    let mappedStatus = 'Pending';
    let rejectionReason = null;
    
    if (found) {
        if (found.status === 'Scheduled' || found.status === 'Completed') mappedStatus = 'Approved';
        if (found.status === 'Cancelled') {
            mappedStatus = 'Rejected';
            rejectionReason = 'Patient requested cancellation.';
        }
        if (found.status === 'Pending') mappedStatus = 'Pending';
    }

    return {
        id: id,
        dentist: found?.dentist || {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: found?.patient || 'John Doe',
        service: found?.service || 'Routine Checkup',
        date: found?.date || 'Oct 24, 2024',
        time: found?.time || '10:00 AM',
        endTime: '11:00 AM', // Dummy static
        duration: '1 Hour', // Dummy static
        status: mappedStatus,
        rejectionReason: rejectionReason,
        preTreatmentNotes: [
            'Please arrive 10 minutes early to fill out any necessary forms.',
            'Avoid eating heavy meals 2 hours before the appointment.'
        ],
    };
};

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const app = getAppointmentData(id);
    const [showStatusDetails, setShowStatusDetails] = React.useState(false);
    const statusRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusRef.current && !statusRef.current.contains(event.target)) {
                setShowStatusDetails(false);
            }
        };

        if (showStatusDetails) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStatusDetails]);

    return (
        <>
            <PageBreadcrumb 
                pageTitle='Appointment Details' 
                parentName='My Appointments'
                parentPath='/patient/appointments'
            />
            
            <div className="space-y-6">
                {/* Header Card */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 shadow-theme-sm">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row xl:w-auto pb-6 xl:pb-0 border-b xl:border-b-0 border-gray-100 dark:border-gray-800">
                        <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-brand-50 text-brand-600 font-bold text-2xl'>
                            {app.dentist.name.replace('Dr. ', '').charAt(0)}
                        </div>
                        <div className='text-center xl:text-left'>
                            <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                                {app.dentist.name}
                            </h4>
                            <div className='flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{app.dentist.specialty}</p>
                                <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block'></div>
                                <p className="text-sm text-gray-400">ID: {app.id}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div ref={statusRef} className="flex flex-col items-center xl:items-end gap-3 xl:justify-end xl:w-auto w-full pt-1 xl:pt-0 relative">
                        <div 
                            className="flex items-center justify-center xl:justify-end gap-2.5 mb-1.5 cursor-pointer select-none group"
                            onClick={() => setShowStatusDetails(!showStatusDetails)}
                        >
                            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">Appointment Status:</span>
                            <div className="scale-110 origin-left flex items-center gap-1.5">
                                <Badge
                                    size='sm'
                                    color={
                                        app.status === 'Approved' ? 'success' :
                                        app.status === 'Pending' ? 'warning' :
                                        app.status === 'Rejected' || app.status === 'Cancelled' ? 'error' : 'primary'
                                    }
                                >
                                    {app.status}
                                </Badge>
                                <div className="p-1 rounded bg-gray-100 dark:bg-white/[0.05] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                                    <svg 
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${showStatusDetails ? 'rotate-180' : ''}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Expandable Status Details */}
                        {showStatusDetails && (
                            <div className="absolute top-full right-0 mt-3 w-full xl:w-max min-w-[280px] flex justify-center xl:justify-end origin-top z-20 shadow-lg rounded-xl animate-[fadeIn_0.15s_ease-out]">
                                {app.status === 'Pending' && (
                                    <p className="text-sm font-medium text-warning-700 dark:text-warning-500 bg-warning-50 dark:bg-warning-500/10 px-4 py-3 rounded-xl border border-warning-100 dark:border-warning-500/20 text-center xl:text-right w-full">
                                        This appointment requires confirmation from our clinic. We will notify you once approved.
                                    </p>
                                )}
                                {app.status === 'Rejected' && (
                                    <p className="text-sm font-medium text-error-700 dark:text-error-500 bg-error-50 dark:bg-error-500/10 px-4 py-3 rounded-xl border border-error-100 dark:border-error-500/20 text-center xl:text-right w-full">
                                        Reason: {app.rejectionReason || 'No reason provided.'}
                                    </p>
                                )}
                                {app.status === 'Approved' && (
                                    <p className="text-sm font-medium text-success-700 dark:text-success-500 bg-success-50 dark:bg-success-500/10 px-4 py-3 rounded-xl border border-success-100 dark:border-success-500/20 text-center xl:text-right w-full">
                                        Your appointment has been confirmed by our senior dentist.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Core Details */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] shadow-theme-sm">
                            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 font-outfit">Service Overview</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <CalendarIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                            <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">{app.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <ClockIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                            <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">{app.time} - {app.endTime}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Duration: {app.duration}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-400">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Patient</p>
                                            <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">{app.patient}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                                            <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">{app.service}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guidelines / Notes */}
                        <div className="bg-amber-50 dark:bg-transparent rounded-2xl border border-amber-100 dark:border-amber-500/20 p-5 lg:p-6 shadow-theme-sm">
                            <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-500">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">Pre-Treatment Notes</h4>
                            </div>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {app.preTreatmentNotes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] lg:sticky lg:top-24 shadow-theme-sm">
                            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 font-outfit">Manage Appointment</h3>
                            
                            <div className="flex flex-col gap-3">
                                {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                                    <>
                                        <button className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors flex justify-center items-center gap-2 shadow-theme-xs">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Reschedule
                                        </button>
                                        <button className="w-full px-4 py-3 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-700 text-error-600 dark:text-error-500 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors flex justify-center items-center gap-2 shadow-theme-xs">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Cancel Appointment
                                        </button>
                                    </>
                                )}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                                    <button
                                        onClick={() => navigate('/patient/appointments')}
                                        className="inline-block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 underline transition-colors"
                                    >
                                        Back to All Appointments
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppointmentDetails;
