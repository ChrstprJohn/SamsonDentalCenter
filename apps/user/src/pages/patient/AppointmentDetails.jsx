import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Badge } from '../../components/ui';

// Dummy data
const getAppointmentData = (id) => {
    return {
        id: id,
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: 'John Doe',
        service: 'Routine Checkup',
        date: 'Oct 24, 2024',
        time: '10:00 AM',
        endTime: '11:00 AM',
        duration: '1 Hour',
        serviceTier: 'Standard',
        approvalStatus: 'Pending',
        status: 'Scheduled',
        preTreatmentNotes: [
            'Please arrive 10 minutes early to fill out any necessary forms.',
            'Avoid eating heavy meals 2 hours before the appointment.'
        ]
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

    return (
        <>
            <PageBreadcrumb 
                pageTitle='Appointment Details' 
                parentName='My Appointments'
                parentPath='/patient/appointments'
            />
            
            <div className="space-y-6">
                {/* Header Card */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-theme-sm">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row xl:w-auto">
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
                    
                    <div className="flex flex-col items-start md:items-end gap-3 xl:justify-end xl:w-auto w-full">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Appointment Status:</span>
                            <Badge
                                size='sm'
                                color={
                                    app.status === 'Scheduled' ? 'primary' :
                                    app.status === 'Completed' ? 'success' :
                                    app.status === 'Cancelled' ? 'error' : 'warning'
                                }
                            >
                                {app.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Approval Status:</span>
                            <span className={`text-sm font-semibold ${app.approvalStatus === 'Approved' ? 'text-success-600 dark:text-success-500' : 'text-warning-600 dark:text-warning-500'}`}>
                                {app.approvalStatus}
                            </span>
                        </div>
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
                                            <p className="text-xs text-gray-400 mt-0.5">Tier: {app.serviceTier}</p>
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
