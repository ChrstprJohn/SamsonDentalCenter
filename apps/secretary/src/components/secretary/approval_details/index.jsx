import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentDetailActionBar from './AppointmentDetailActionBar';
import ApprovalStatusTimeline from './ApprovalStatusTimeline';
import DoctorOverview from './DoctorOverview';
import AppointmentLogistics from './AppointmentLogistics';
import InternalNotes from './InternalNotes';
import AppointmentDetailFooter from './AppointmentDetailFooter';
import { formatDate, formatTime } from '../../../hooks/useAppointments';

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

const ApprovalDetailView = ({ request, onApprove, onReject, onBack }) => {
    if (!request) return null;

    const [notes, setNotes] = useState(request.notes || '');

    const displayStatus = 'Pending Request';
    const badgeColor = 'warning';
    const duration = getDuration(request.start_time, request.end_time);

    return (
        <div className='flex-grow min-h-0 relative sm:mx-0'>
            <div className='flex-grow flex flex-col h-full bg-white dark:bg-gray-900 sm:rounded-xl border-t sm:border border-gray-200 dark:border-gray-800 overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
                
                <AppointmentDetailActionBar onBack={onBack} />

                {/* Content Area - Matched to User Portal AppointmentDetails */}
                <div className='px-0 py-6 sm:p-8 md:p-10 overflow-y-auto grow no-scrollbar pb-32 sm:pb-10 bg-white/50 dark:bg-transparent'>
                    <div className='max-w-4xl mx-auto space-y-4 sm:space-y-8'>
                        
                        {/* 1. Header Section: Service Name & Status */}
                        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 px-4 py-5 sm:p-8 shadow-theme-xs'>
                            <div className='flex flex-row items-center justify-between gap-4'>
                                <div className='space-y-2'>
                                    <h2 className='text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit leading-tight tracking-tight'>
                                        {request.service}
                                    </h2>
                                    <div className='flex items-center gap-2 text-[10px] sm:text-[12px] font-bold'>
                                        <span className='uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500'>Request ID:</span>
                                        <span className='font-mono text-brand-600 dark:text-brand-400 px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 rounded-lg'>
                                            {request.id?.toString().padStart(8, '0')}
                                        </span>
                                    </div>
                                </div>

                                <div className='shrink-0'>
                                    <span className='px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl uppercase tracking-wider shadow-sm bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400 shadow-warning-500/5'>
                                        {displayStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Timeline Section */}
                        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 p-4 sm:p-8 shadow-theme-xs'>
                            <ApprovalStatusTimeline 
                                createdAt={request.createdAt}
                                updatedAt={request.updatedAt}
                                status={request.status}
                                approvalStatus={request.approvalStatus}
                            />
                        </div>

                        {/* 3. Assigned Doctor Section */}
                        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 p-4 sm:p-8 shadow-theme-xs'>
                            <DoctorOverview 
                                dentistName={request.dentist}
                                specialization={request.dentistSpecialization}
                            />
                        </div>

                        {/* 4. Appointment Logistics Section */}
                        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 p-4 sm:p-8 shadow-theme-xs'>
                            <AppointmentLogistics 
                                date={request.requestedDate}
                                time={`${request.requestedTime} – ${request.requestedEndTime}`}
                                duration={duration}
                                patientName={request.patient.name}
                            />
                        </div>

                        {/* 5. Internal Notes Section (Equivalent to Tabs/Notes in User Portal) */}
                        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 p-4 sm:p-8 shadow-theme-xs'>
                            <InternalNotes 
                                notes={notes}
                                setNotes={setNotes}
                            />
                        </div>

                    </div>
                </div>

                {/* 6. Footer Actions */}
                <AppointmentDetailFooter 
                    onApprove={onApprove}
                    onReject={onReject}
                />

            </div>
        </div>
    );
};

export default ApprovalDetailView;
