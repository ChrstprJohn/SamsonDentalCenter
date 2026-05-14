import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import AppointmentDetailActionBar from './AppointmentDetailActionBar';
import ApprovalDetailHeader from './ApprovalDetailHeader';
import ApprovalStatusTimeline from './ApprovalStatusTimeline';
import PatientOverview from './PatientOverview';
import DoctorOverview from './DoctorOverview';
import AppointmentLogistics from './AppointmentLogistics';
import SchedulingVerification from './SchedulingVerification';
import InternalNotes from './InternalNotes';
import PatientHistory from './PatientHistory';
import AppointmentDetailFooter from './AppointmentDetailFooter';
import { formatTime } from '../../../hooks/useAppointments';

const AppointmentRequestDetailView = ({ 
    request, 
    onApprove, 
    onReject, 
    onBack,
    busySlots = [],
    slotPosition,
    timeStr: initialTimeStr,
    completedCount = 0,
    history = [],
    isBookingMode = false
}) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    
    // Internal Notes State (Optimistic)
    const [internalNote, setInternalNote] = useState(request.internalNotes || '');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    if (!request) return null;

    const { patient, service, requestedDate, requestedTime, dentist, serviceTier, dentistPhone, dentistEmail, createdAt } = request;
    const timeStr = initialTimeStr || requestedTime.split(' ')[0];
    const isConflict = busySlots.some(pos => Math.abs(pos - slotPosition) < 8);

    // Calculate End Time (Mocking 1 hour duration for UI)
    const calculateEndTime = (startStr) => {
        if (!startStr) return "N/A";
        const [time, period] = startStr.split(' ');
        const [h, m] = time.split(':').map(Number);
        let endH = h + 1;
        let endPeriod = period;
        if (endH === 12) endPeriod = period === 'AM' ? 'PM' : 'AM';
        if (endH > 12) endH = 1;
        return `${endH}:${m.toString().padStart(2, '0')} ${endPeriod}`;
    };

    const endTime = calculateEndTime(requestedTime);

    const handleSaveNote = () => {
        if (!internalNote.trim()) return;
        setIsSavingNote(true);
        setSaveSuccess(false);
        setTimeout(() => {
            setIsSavingNote(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        }, 600);
    };

    // Format History Items
    const formattedHistory = history
        .filter(apt => apt.id !== request.id) 
        .sort((a, b) => new Date(b.appointment_date + ' ' + b.start_time) - new Date(a.appointment_date + ' ' + a.start_time))
        .slice(0, 10) 
        .map(apt => ({
            id: apt.id,
            startTime: formatTime(apt.start_time),
            endTime: formatTime(apt.end_time),
            date: apt.appointment_date,
            service: apt.service?.name || "Service",
            type: apt.service_tier || "General",
            doctor: apt.dentist?.profile?.last_name ? `Dr. ${apt.dentist.profile.last_name}` : "Clinician",
            status: apt.status
        }));

    const fillerItems = [
        { id: 'f1', startTime: '9:00 AM', endTime: '10:00 AM', date: 'Apr 12, 2026', service: 'Routine Cleaning', type: 'General', doctor: 'Dr. Thompson', status: 'COMPLETED' },
        { id: 'f2', startTime: '11:00 AM', endTime: '12:00 PM', date: 'Mar 28, 2026', service: 'Tooth Extraction', type: 'General', doctor: 'Dr. Chen', status: 'COMPLETED' },
    ];

    const displayHistory = formattedHistory.length > 0 ? formattedHistory : fillerItems;

    return (
        <div className="flex flex-col h-full overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-xl border-t sm:border border-gray-200 dark:border-gray-800 overflow-hidden h-full relative">
                
                <AppointmentDetailActionBar onBack={onBack} />

                {/* Content Area */}
                <div className='px-0 py-6 sm:p-8 md:p-10 overflow-y-auto grow no-scrollbar pb-32 sm:pb-10 bg-white/50 dark:bg-transparent'>
                    <div className='max-w-4xl mx-auto space-y-4 sm:space-y-8'>
                        
                        <ApprovalDetailHeader 
                            serviceName={service} 
                            requestId={request.id} 
                            displayStatus="Pending Request" 
                            badgeColor="warning" 
                        />

                        <ApprovalStatusTimeline createdAt={createdAt} />

                        <PatientOverview 
                            patient={patient} 
                            completedCount={completedCount} 
                        />

                        <DoctorOverview 
                            dentistName={dentist} 
                            specialization={request.specialization} 
                            dentistPhone={dentistPhone} 
                            dentistEmail={dentistEmail} 
                        />

                        <AppointmentLogistics 
                            requestedDate={requestedDate} 
                            requestedTime={requestedTime} 
                            endTime={endTime} 
                            patientLabel={patient.name} 
                        />

                        <SchedulingVerification 
                            isConflict={isConflict} 
                            busySlots={busySlots} 
                            slotPosition={slotPosition} 
                            timeStr={timeStr} 
                        />

                        <InternalNotes 
                            internalNote={internalNote} 
                            setInternalNote={setInternalNote} 
                            handleSaveNote={handleSaveNote} 
                            isSavingNote={isSavingNote} 
                            saveSuccess={saveSuccess} 
                        />

                        <PatientHistory 
                            displayHistory={displayHistory} 
                            completedCount={completedCount} 
                            noShowCount={patient.noShowCount} 
                            cancellationCount={patient.cancellationCount} 
                        />

                    </div>
                </div>

                <AppointmentDetailFooter 
                    onApprove={onApprove} 
                    onRejectClick={() => setIsRejecting(true)} 
                />

                {/* Rejection Modal Overlay */}
                {isRejecting && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-[fadeIn_0.2s_ease-out]">
                        <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Reject Request</h3>
                                <button 
                                    onClick={() => setIsRejecting(false)} 
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 font-bold uppercase tracking-widest leading-relaxed">
                                Please provide a reason for declining this appointment request. This will be sent to the patient.
                            </p>
                            <textarea 
                                value={rejectionReason} 
                                onChange={(e) => setRejectionReason(e.target.value)} 
                                placeholder="e.g., Dentist is unavailable, slot already booked..." 
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm h-32 resize-none shadow-sm mb-6 focus:ring-2 focus:ring-error-500/20 focus:border-error-500 transition-all outline-none" 
                            />
                            <button 
                                onClick={() => onReject(rejectionReason)} 
                                disabled={!rejectionReason.trim()} 
                                className="w-full bg-error-500 text-white font-bold py-4 text-sm rounded-2xl shadow-theme-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentRequestDetailView;
