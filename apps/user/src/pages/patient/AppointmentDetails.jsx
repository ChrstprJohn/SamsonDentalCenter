import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Badge } from '../../components/ui';

import { appointmentsData } from './MyAppointments';

// Dummy data generator combining specific row data with full details
const getAppointmentData = (id) => {
    const found = appointmentsData.find(a => a.id === id);
    
    // Map list statuses directly
    let mappedStatus = 'Pending';
    let rejectionReason = null;
    
    if (found) {
        mappedStatus = found.status || 'Pending';
        if (found.status === 'Cancelled') {
            rejectionReason = found.rejectionReason || 'Patient requested cancellation.';
        }
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
        description: 'Routine checkup and general cleaning. Patient requested special attention to lower molars due to recent sensitivity.',
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
    const [activeTab, setActiveTab] = React.useState('description');
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
                                        app.status === 'Cancelled' ? 'error' : 'primary'
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
                                {app.status === 'Cancelled' && (
                                    <p className="text-sm font-medium text-error-700 dark:text-error-500 bg-error-50 dark:bg-error-500/10 px-4 py-3 rounded-xl border border-error-100 dark:border-error-500/20 text-center xl:text-right w-full">
                                        Cancellation Reason: {app.rejectionReason || 'No reason provided.'}
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
                <div className="flex flex-col xl:flex-row items-stretch gap-6">
                    {/* Left Column - Core Details */}
                    <div className="w-full xl:w-2/3 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] shadow-theme-sm flex flex-col">
                        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 font-outfit">Service Overview</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grow items-center">
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

                    {/* Right Column - Actions */}
                    <div className="w-full xl:w-1/3 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] shadow-theme-sm flex flex-col justify-between">
                        <div>
                            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 font-outfit">Manage Appointment</h3>
                            <div className="flex flex-col gap-3">
                                {app.status !== 'Cancelled' && app.status !== 'Completed' ? (
                                    <>
                                        <button className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors flex justify-center items-center gap-2 shadow-theme-xs">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Reschedule
                                        </button>
                                        <button className="w-full px-4 py-3 bg-white dark:bg-transparent border border-error-200 dark:border-error-500/20 text-error-600 dark:text-error-500 rounded-lg text-sm font-medium hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors flex justify-center items-center gap-2 shadow-theme-xs">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Cancel Appointment
                                        </button>
                                    </>
                                ) : app.status === 'Cancelled' ? (
                                    <div className="text-center p-5 rounded-xl border border-gray-100 bg-gray-50/50 dark:bg-white/[0.02] dark:border-white/[0.05]">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                            This appointment is cancelled. <br />You can <button className="text-brand-500 hover:text-brand-600 font-medium transition-colors" onClick={() => navigate('/patient/appointments')}>book a new one</button> or <button className="text-brand-500 hover:text-brand-600 font-medium transition-colors" onClick={() => setActiveTab('contact')}>contact us</button>.
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Full-Width Tabs Area (Description / Pre-Treatment) */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] shadow-theme-sm">
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-6 relative overflow-x-auto whitespace-nowrap hide-scrollbar">
                        <button 
                            onClick={() => setActiveTab('description')}
                            className={`pb-3 text-sm font-medium transition-colors relative ${
                                activeTab === 'description' 
                                ? 'text-brand-600 dark:text-brand-500' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                        >
                            Description
                            {activeTab === 'description' && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-500 rounded-t-sm" />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('notes')}
                            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                                activeTab === 'notes' 
                                ? 'text-brand-600 dark:text-brand-500' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                        >
                            Pre-Treatment Notes
                            {activeTab === 'notes' && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-500 rounded-t-sm" />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('contact')}
                            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                                activeTab === 'contact' 
                                ? 'text-brand-600 dark:text-brand-500' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                        >
                            Contact Clinic
                            {activeTab === 'contact' && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-500 rounded-t-sm" />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('faq')}
                            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                                activeTab === 'faq' 
                                ? 'text-brand-600 dark:text-brand-500' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                        >
                            FAQ
                            {activeTab === 'faq' && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-500 rounded-t-sm" />
                            )}
                        </button>
                    </div>

                    {/* Tabs Content */}
                    <div className="min-h-[80px]">
                        {activeTab === 'description' && (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl">
                                    {app.description || "Routine dental operation and general hygiene optimization."}
                                </p>
                            </div>
                        )}
                        {activeTab === 'notes' && (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    {app.preTreatmentNotes?.length > 0 ? (
                                        app.preTreatmentNotes.map((note, index) => (
                                            <li key={index}>{note}</li>
                                        ))
                                    ) : (
                                        <li>No pre-treatment notes required.</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'contact' && (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">If you have any urgent concerns prior to your appointment, please reach out to us:</p>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <p className="text-sm text-gray-800 dark:text-gray-200"><strong>Phone:</strong> (555) 123-4567</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm text-gray-800 dark:text-gray-200"><strong>Email:</strong> support@primeradental.com</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'faq' && (
                            <div className="animate-[fadeIn_0.2s_ease-out] space-y-4 max-w-4xl">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Do I need to arrive early?</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Please arrive at least 10 minutes prior to your scheduled time to complete any necessary paperwork.</p>
                                </div>
                                <hr className="border-gray-100 dark:border-gray-800" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">What if I need to cancel?</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Cancellations must be made at least 24 hours in advance. You can cancel your appointment directly using the "Manage Appointment" tools on this page.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppointmentDetails;
