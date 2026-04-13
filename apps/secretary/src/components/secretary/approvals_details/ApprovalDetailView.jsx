import React, { useState } from 'react';
import { User, Phone, Mail, Check, X, AlertCircle, ArrowLeft } from 'lucide-react';
import PenaltyBadges from '../approvals/PenaltyBadges';

const ApprovalDetailView = ({ request, onApprove, onReject, onBack }) => {
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
        <div className="flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden h-full">
            {/* Header Controls */}
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-20 flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors bg-gray-50 dark:bg-gray-800 p-2 sm:px-4 sm:py-2 rounded-xl"
                >
                    <ArrowLeft className="size-4" />
                    <span className="hidden sm:inline text-sm font-bold">Back to Queue</span>
                </button>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsRejecting(true)}
                        className="px-4 py-2 border border-error-200 text-error-600 hover:bg-error-50 dark:border-error-900 dark:text-error-500 dark:hover:bg-error-500/10 rounded-xl text-sm font-bold transition-all"
                    >
                        Reject
                    </button>
                    <button 
                        onClick={onApprove}
                        className="px-4 py-2 bg-success-500 hover:bg-success-600 text-white shadow-sm shadow-success-500/20 rounded-xl text-sm font-bold transition-all"
                    >
                        Approve
                    </button>
                </div>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
                {/* Left Pane - Patient Details */}
                <div className="p-6 md:p-8 lg:p-10 lg:w-1/3 flex flex-col space-y-8 bg-gray-50/30 dark:bg-gray-900/50">
                    <div>
                        <div className="size-20 lg:size-24 rounded-[1.25rem] bg-brand-500 flex items-center justify-center text-white text-3xl font-bold shadow-theme-md mx-auto lg:mx-0 mb-6">
                            {patient.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white font-outfit text-center lg:text-left">{patient.name}</h2>
                        
                        <div className="flex flex-col gap-3 mt-6 text-sm text-gray-600 dark:text-gray-400 items-center lg:items-start p-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl">
                            <span className="flex items-center gap-2.5"><Phone className="size-4 text-brand-500" /> {patient.phone}</span>
                            <span className="flex items-center gap-2.5"><Mail className="size-4 text-brand-500" /> {patient.email}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 px-1">Penalty Status</h3>
                        <PenaltyBadges 
                            noShowCount={patient.noShowCount}
                            cancellationCount={patient.cancellationCount}
                            isBookingRestricted={patient.isBookingRestricted}
                        />
                    </div>
                </div>

                {/* Right Pane - Request Information */}
                <div className="p-6 md:p-8 lg:p-10 lg:w-2/3 space-y-10 bg-white dark:bg-gray-900 relative">
                    
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

                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-500 mb-6 px-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                            Request Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-white/[0.02] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-theme-xs">
                                <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Service Requested</p>
                                <p className="font-bold text-lg text-gray-900 dark:text-white">{service}</p>
                            </div>
                            <div className="bg-brand-50 dark:bg-brand-500/10 p-6 rounded-2xl border border-brand-100 dark:border-brand-500/20">
                                <p className="text-[11px] uppercase tracking-wider font-bold text-brand-500 mb-2">Requested Timings</p>
                                <p className="font-bold text-lg text-brand-600 dark:text-brand-400">{new Date(requestedDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} • {requestedTime}</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8 px-1">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <User className="size-4" />
                                Dentist Availability
                            </h3>
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">{dentist}</span>
                        </div>
                        
                        <div className="relative h-20 bg-white dark:bg-gray-900 rounded-2xl flex items-center overflow-visible border border-gray-200 dark:border-gray-700 shadow-sm px-6 mx-2">
                            
                            {/* Dummy Busy Block */}
                            {busySlotPosition >= 0 && busySlotPosition <= 80 && (
                                <div 
                                    className="absolute h-full top-0 w-[12%] bg-gray-100 dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 flex items-center justify-center"
                                    style={{ left: `${busySlotPosition}%` }}
                                >
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Busy</span>
                                </div>
                            )}

                            {/* Requested Ghost Block */}
                            {slotPosition >= 0 && slotPosition <= 90 && (
                                <div 
                                    className="absolute h-[130%] top-[-15%] w-[15%] bg-brand-50 border-2 border-brand-500 rounded-xl flex flex-col items-center justify-center shadow-lg z-10 transition-all duration-500 ease-out"
                                    style={{ left: `${slotPosition}%` }}
                                >
                                    <span className="text-[9px] text-brand-600 font-bold uppercase tracking-tighter">Req</span>
                                    <span className="text-xs font-bold text-brand-700 mt-0.5">{timeStr}</span>
                                </div>
                            )}

                            {/* Time markers */}
                            <div className="absolute -bottom-8 left-0 w-full flex justify-between px-2">
                                {[9,11,1,3,5].map(h => (
                                    <span key={h} className="text-[10px] font-bold text-gray-400">
                                        {h}:00{h > 8 && h < 12 ? 'AM' : 'PM'}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-12 text-center bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-500 py-3 rounded-xl border border-success-100 dark:border-success-500/20 font-medium">
                            <Check className="inline-block size-4 mr-2" />
                            No scheduling conflict detected. Safe to approve.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ApprovalDetailView;
