import React, { useState } from 'react';
import { User, Phone, Mail, Check, X, AlertCircle } from 'lucide-react';
import PenaltyBadges from './PenaltyBadges';

const ApprovalContextView = ({ request, onApprove, onReject, onClose }) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    if (!request) return null;

    const { patient, service, requestedDate, requestedTime, dentist } = request;

    // Simulate different timeline views based on the requested time
    const [timeStr, ampm] = requestedTime.split(' ');
    let requestedHour = parseInt(timeStr.split(':')[0]);
    if (ampm === 'PM' && requestedHour !== 12) requestedHour += 12;
    if (ampm === 'AM' && requestedHour === 12) requestedHour = 0;

    // Generate random busy slots around the requested hour to make it look dynamic
    const getPositionPercent = (hour) => ((hour - 9) / 8) * 100; // 9am to 5pm (8 hours total)
    const slotPosition = getPositionPercent(requestedHour);
    
    // Fake busy slot for visual variety
    const busySlotPosition = (requestedHour < 13) ? getPositionPercent(requestedHour + 2) : getPositionPercent(requestedHour - 2);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
            {/* Header / Drawer Controls */}
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-outfit">Request Details</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-brand-500 flex items-center justify-center text-white text-xl font-bold shadow-theme-md">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">{patient.name}</h2>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-2">
                                <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> {patient.phone}</span>
                                <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> {patient.email}</span>
                            </div>
                        </div>
                    </div>
                    <PenaltyBadges 
                        noShowCount={patient.noShowCount}
                        cancellationCount={patient.cancellationCount}
                        isBookingRestricted={patient.isBookingRestricted}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar relative z-10">
                {/* Request Details Compact */}
                <section>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-white/[0.02] p-3 rounded-xl">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Service</p>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{service}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/[0.02] p-3 rounded-xl border border-brand-100 dark:border-brand-900/30">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-brand-500 mb-0.5">Date & Time</p>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{new Date(requestedDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} • {requestedTime}</p>
                        </div>
                    </div>
                </section>

                {/* Dynamic Timeline */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dentist Availability</h3>
                        <span className="text-[10px] font-bold text-brand-500 bg-brand-50 px-2 py-0.5 rounded ml-2">{dentist}</span>
                    </div>
                    
                    <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-3 overflow-visible">
                        <div className="relative h-16 bg-gray-50/50 dark:bg-gray-800/20 rounded-lg flex items-center overflow-visible border border-gray-100/50 dark:border-gray-800/50">
                            
                            {/* Dummy Busy Block */}
                            {busySlotPosition >= 0 && busySlotPosition <= 80 && (
                                <div 
                                    className="absolute h-[80%] top-[10%] w-[12%] bg-gray-200 dark:bg-gray-700/50 rounded flex items-center justify-center opacity-70"
                                    style={{ left: `${busySlotPosition}%` }}
                                >
                                    <span className="text-[8px] text-gray-500 font-bold uppercase">Busy</span>
                                </div>
                            )}

                            {/* Requested Ghost Block */}
                            {slotPosition >= 0 && slotPosition <= 90 && (
                                <div 
                                    className="absolute h-[120%] top-[-10%] w-[12.5%] bg-brand-50 border-2 border-brand-500 rounded-md flex flex-col items-center justify-center shadow-md z-10 transition-all duration-500 ease-out"
                                    style={{ left: `${slotPosition}%` }}
                                >
                                    <span className="text-[9px] text-brand-600 font-bold uppercase tracking-tighter">Req</span>
                                </div>
                            )}

                            {/* Time markers */}
                            <div className="absolute -bottom-5 left-0 w-full flex justify-between px-1">
                                {[9,11,1,3,5].map(h => (
                                    <span key={h} className="text-[8px] font-medium text-gray-400">{h}</span>
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-6 text-center">
                            No conflict detected with {dentist}'s schedule.
                        </p>
                    </div>
                </section>
            </div>

            {/* Actions Sticky Bottom */}
            <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 sticky bottom-0 z-20">
                {!isRejecting ? (
                    <div className="flex gap-3">
                        <button 
                            onClick={onApprove}
                            className="flex-1 bg-success-500 hover:bg-success-600 text-white font-bold py-3.5 text-sm rounded-xl shadow-theme-md transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="size-4" />
                            Approve
                        </button>
                        <button 
                            onClick={() => setIsRejecting(true)}
                            className="flex-1 bg-white dark:bg-gray-800 border-2 border-error-500 text-error-500 hover:bg-error-50 font-bold py-3.5 text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <X className="size-4" />
                            Reject
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Reason</label>
                            <button 
                                onClick={() => setIsRejecting(false)}
                                className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                        </div>
                        <textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="w-full bg-white dark:bg-gray-900 border-2 border-error-500/50 focus:border-error-500 rounded-xl p-3 text-sm outline-none transition-all h-20 resize-none shadow-sm"
                        />
                        <button 
                            onClick={() => onReject(rejectionReason)}
                            disabled={!rejectionReason.trim()}
                            className="w-full bg-error-500 hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 text-sm rounded-xl shadow-theme-md transition-all flex items-center justify-center gap-2"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApprovalContextView;
