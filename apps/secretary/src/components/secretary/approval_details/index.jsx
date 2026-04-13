import React, { useState } from 'react';
import AppointmentDetailActionBar from './AppointmentDetailActionBar';
import AppointmentDetailFooter from './AppointmentDetailFooter';
import PatientOverview from './PatientOverview';
import ServiceOverview from './ServiceOverview';
import { X } from 'lucide-react';

const AppointmentDetailView = ({ 
    request, 
    onApprove, 
    onReject, 
    onBack,
    busySlots = [],
    slotPosition,
    timeStr: initialTimeStr,
    completedCount = 0
}) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    if (!request) return null;

    const { patient, service, requestedDate, requestedTime, dentist } = request;
    const timeStr = initialTimeStr || requestedTime.split(' ')[0];

    return (
        <div className="flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden h-full relative">
            
            <AppointmentDetailActionBar onBack={onBack} />

            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-6 md:p-8 sm:p-10 pb-28 lg:pb-10">
                <div className="max-w-3xl mx-auto flex flex-col">
                    <PatientOverview patient={patient} completedCount={completedCount} />
                    
                    <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 sm:p-7 pt-7 sm:pt-9 relative overflow-hidden mb-6 sm:mb-8">
                        <ServiceOverview 
                            service={service}
                            requestedDate={requestedDate}
                            requestedTime={requestedTime}
                            dentist={dentist}
                            busySlots={busySlots}
                            slotPosition={slotPosition}
                            timeStr={timeStr}
                        />
                    </div>

                    <div className="flex justify-end pt-2 sm:pt-0">
                        <AppointmentDetailFooter 
                            onApprove={onApprove} 
                            onRejectClick={() => setIsRejecting(true)} 
                        />
                    </div>
                </div>
            </div>

            {/* Reject Modal Overlay */}
            {isRejecting && (
                <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-30 flex items-center justify-center p-6 md:p-12 animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-3xl p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reject Request</h3>
                            <button 
                                onClick={() => setIsRejecting(false)}
                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this appointment request. This will be visible to the patient.</p>
                        <textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason here..."
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-error-500 focus:border-error-500 rounded-2xl p-4 text-sm outline-none transition-all h-32 resize-none shadow-sm mb-6"
                        />
                        <button 
                            onClick={() => onReject(rejectionReason)}
                            disabled={!rejectionReason.trim()}
                            className="w-full bg-error-500 hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 text-sm rounded-2xl shadow-theme-md transition-all flex items-center justify-center gap-2"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentDetailView;
