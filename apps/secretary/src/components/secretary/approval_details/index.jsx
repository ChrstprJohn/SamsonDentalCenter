import React, { useState } from 'react';
import { Calendar, Clock, User, Timer, Check, Phone, Mail, X, ChevronLeft, Shield, CircleDot } from 'lucide-react';
import PenaltyBadges from '../approvals/PenaltyBadges';
import { formatTime } from '../../../hooks/useAppointments';

const AppointmentDetailView = ({ 
    request, 
    onApprove, 
    onReject, 
    onBack,
    busySlots = [],
    slotPosition,
    timeStr: initialTimeStr,
    completedCount = 0,
    history = []
}) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    if (!request) return null;

    const { patient, service, requestedDate, requestedTime, dentist, serviceTier, dentistPhone, dentistEmail, createdAt } = request;
    const timeStr = initialTimeStr || requestedTime.split(' ')[0];
    const isGuest = patient.source === 'GUEST_BOOKING';
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

    // Format History Items
    const formattedHistory = history
        .filter(apt => apt.id !== request.id) 
        .sort((a, b) => new Date(b.appointment_date + ' ' + b.start_time) - new Date(a.appointment_date + ' ' + a.start_time))
        .slice(0, 15) 
        .map(apt => ({
            id: apt.id,
            startTime: formatTime(apt.start_time),
            endTime: formatTime(apt.end_time),
            date: apt.appointment_date,
            service: apt.service?.name || "Service",
            type: apt.service_tier || "General",
            doctor: apt.dentist?.profile?.last_name ? `Dr. ${apt.dentist.profile.last_name}` : "Clinician",
            source: apt.source || "Account",
            status: apt.status
        }));

    const fillerItems = [
        { id: 'f1', startTime: '9:00 AM', endTime: '10:00 AM', date: 'Apr 12, 2026', service: 'Routine Cleaning', type: 'General', doctor: 'Dr. James Thompson', source: 'Walk-in' },
        { id: 'f2', startTime: '11:00 AM', endTime: '12:00 PM', date: 'Mar 28, 2026', service: 'Tooth Extraction', type: 'General', doctor: 'Dr. Emily Chen', source: 'Account' },
        { id: 'f3', startTime: '2:30 PM', endTime: '3:30 PM', date: 'Mar 15, 2026', service: 'Root Canal', type: 'Specialized', doctor: 'Dr. Sarah Smith', source: 'Guest' },
        { id: 'f4', startTime: '10:00 AM', endTime: '11:00 AM', date: 'Feb 20, 2026', service: 'Checkup', type: 'General', doctor: 'Dr. James Thompson', source: 'Walk-in' },
        { id: 'f5', startTime: '1:00 PM', endTime: '2:00 PM', date: 'Jan 15, 2026', service: 'Braces Adjust', type: 'Specialized', doctor: 'Dr. Mark Wilson', source: 'Account' },
        { id: 'f6', startTime: '4:00 PM', endTime: '5:00 PM', date: 'Dec 05, 2025', service: 'Teeth Whitening', type: 'General', doctor: 'Dr. Lisa Ray', source: 'Guest' },
        { id: 'f7', startTime: '9:00 AM', endTime: '10:00 AM', date: 'Nov 12, 2025', service: 'Consultation', type: 'General', doctor: 'Dr. Emily Chen', source: 'Account' },
        { id: 'f8', startTime: '11:00 AM', endTime: '12:00 PM', date: 'Oct 28, 2025', service: 'Filling', type: 'General', doctor: 'Dr. James Thompson', source: 'Walk-in' },
    ];

    const displayHistory = formattedHistory.length > 0 ? formattedHistory : fillerItems;

    // Timeline Steps (based on AppointmentDetailStatus design)
    const steps = [
        { 
            id: 'requested', 
            title: 'Request Submitted', 
            desc: 'User initiated booking request', 
            time: createdAt ? new Date(createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : null,
            status: 'completed' 
        },
        { 
            id: 'review', 
            title: 'Under Review', 
            desc: 'Awaiting clinical approval', 
            status: 'active' 
        },
        { 
            id: 'visit', 
            title: 'Visit Scheduled', 
            desc: 'Marked complete after visit', 
            status: 'pending' 
        }
    ];

    const getStepIcon = (status) => {
        if (status === 'completed') return <Check size={18} strokeWidth={3} />;
        if (status === 'active') return <CircleDot size={18} strokeWidth={3} />;
        return <div className="w-2 h-2 rounded-full bg-current opacity-30" />;
    };

    return (
        <div className="flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden h-full relative font-outfit">
            
            {/* Action Bar */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-20">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors shadow-theme-xs"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Request Details</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-4 md:p-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                    
                    {/* 1 - Timeline (Status Flow Design) */}
                    <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 relative overflow-hidden shrink-0">
                        <div className="flex items-start justify-center">
                            <div className="flex items-start justify-between w-full max-w-4xl px-4">
                                {steps.map((step, index) => {
                                    const isLast = index === steps.length - 1;
                                    const isCompleted = step.status === 'completed';
                                    const isActive = step.status === 'active';
                                    
                                    return (
                                        <div key={step.id} className="relative flex flex-col items-center text-center flex-1">
                                            {/* Connector Line */}
                                            {!isLast && (
                                                <div className="absolute top-6 left-1/2 w-full h-[2px] bg-gray-200 dark:bg-white/5">
                                                    <div className={`h-full transition-all duration-700 ${isCompleted ? 'bg-brand-500 w-full' : 'w-0'}`} />
                                                </div>
                                            )}

                                            {/* Step Icon */}
                                            <div className="relative z-10 mb-6">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                    isCompleted 
                                                        ? 'bg-brand-500 text-white' 
                                                        : isActive
                                                            ? 'bg-white dark:bg-gray-800 border-2 border-brand-500 text-brand-500'
                                                            : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 text-gray-300'
                                                }`}>
                                                    {getStepIcon(step.status)}
                                                </div>
                                            </div>

                                            {/* Step Info */}
                                            <div className="px-2">
                                                <h4 className="text-[13px] font-black text-gray-900 dark:text-white mb-1 tracking-tight">
                                                    {step.title}
                                                </h4>
                                                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-tight max-w-[140px] mx-auto">
                                                    {step.desc}
                                                </p>
                                                {step.time && (
                                                    <div className="mt-2 text-[9px] font-bold text-brand-500/60 uppercase tracking-widest font-mono">
                                                        {step.time}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Middle Row (2, 4, 5 and 3) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Left Column (2, 4, 5) */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* 2 & 2.5 - Patient Profile & Info */}
                            <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500 opacity-80"></div>
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-3xl shadow-lg shrink-0">
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                                                isGuest ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-brand-100 text-brand-700 border border-brand-200'
                                            }`}>
                                                {isGuest ? 'Guest Booking' : 'Registered Patient'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate mb-4">
                                            {patient.name}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone className="size-4 text-emerald-500" />
                                                <span className="font-semibold tabular-nums">{patient.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="size-4 text-blue-500" />
                                                <span className="truncate font-medium">{patient.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row for 4 & 5 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 4 - Assigned Doctor */}
                                <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Assigned Doctor</span>
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl">
                                            <User className="size-6 text-brand-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{dentist}</span>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                    <Phone className="size-3 text-emerald-500" />
                                                    <span className="tabular-nums">{dentistPhone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                    <Mail className="size-3 text-blue-500" />
                                                    <span className="truncate max-w-[150px]">{dentistEmail}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 5 - Appointment Details */}
                                <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Appointment Info</span>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg"><Timer className="size-4 text-gray-500" /></div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-100 dark:border-brand-500/20 tracking-widest w-fit">
                                                        {serviceTier || 'General'}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{service}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Duration</span>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white">60 mins</span>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</span>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 tabular-nums">{requestedDate}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-right">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start</span>
                                                        <span className="text-xs font-black text-brand-600 dark:text-brand-400 tabular-nums">{requestedTime}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">End</span>
                                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 tabular-nums">{endTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3 - History (Recent Appointments List) */}
                        <div className="lg:col-span-5 flex flex-col relative">
                            <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between mb-6 shrink-0">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Recent Appointments</h3>
                                        {formattedHistory.length === 0 && (
                                            <span className="text-[8px] text-amber-500 font-bold uppercase tracking-tighter">Displaying Sample Data</span>
                                        )}
                                    </div>
                                    <PenaltyBadges 
                                        noShowCount={patient.noShowCount}
                                        cancellationCount={patient.cancellationCount}
                                        completedCount={completedCount}
                                        isBookingRestricted={patient.isBookingRestricted}
                                        minimal
                                    />
                                </div>

                                <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                    {displayHistory.map((apt, idx) => {
                                        const isFiller = apt.id.toString().startsWith('f');
                                        return (
                                            <div key={apt.id} className={`flex flex-col bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden shrink-0 transition-all duration-500 ${isFiller ? 'opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : 'opacity-100'}`} style={{ transitionDelay: `${idx * 50}ms` }}>
                                                <div className="flex flex-row">
                                                    <div className="flex flex-col w-[70px] bg-gray-50/50 dark:bg-gray-800/20 border-r border-gray-100 dark:border-gray-800 shrink-0">
                                                        <div className="flex-1 flex flex-col justify-center px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-center">
                                                            <span className="text-[7px] font-bold uppercase text-gray-400">Start</span>
                                                            <span className="text-[10px] font-bold text-gray-900 dark:text-white tabular-nums">{apt.startTime}</span>
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-center px-2 py-2 text-center">
                                                            <span className="text-[7px] font-bold uppercase text-gray-400">End</span>
                                                            <span className="text-[10px] font-medium text-gray-500 tabular-nums">{apt.endTime}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 p-3 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest tabular-nums">{apt.date}</span>
                                                            <span className={`px-1 py-0.5 rounded text-[7px] font-bold uppercase ${apt.source === 'Walk-in' ? 'text-amber-500 bg-amber-50' : 'text-brand-500 bg-brand-50'}`}>{apt.source}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{apt.service}</span>
                                                            <span className="text-[7px] font-black uppercase text-brand-500 tracking-tighter shrink-0 border border-brand-100 dark:border-brand-500/20 px-1 rounded-sm">{apt.type}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[9px] text-gray-500"><User size={9} className="text-brand-500" /><span>{apt.doctor}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6 - Conflict Checking & Timeline Toggle */}
                    <div className="shrink-0 flex flex-col gap-3">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scheduling Verification</span>
                            <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${isConflict ? 'bg-error-500 animate-pulse' : 'bg-success-500'}`} />
                                <span className={`text-[10px] font-bold uppercase ${isConflict ? 'text-error-500' : 'text-success-500'}`}>
                                    {isConflict ? 'Conflict Found' : 'Clear Slot'}
                                </span>
                            </div>
                        </div>
                        {isConflict ? (
                            <div className="flex items-center justify-center gap-3 p-4 bg-error-50 dark:bg-error-500/10 border border-error-100 dark:border-error-500/20 rounded-2xl animate-pulse">
                                <X className="size-5 text-error-600" /><span className="text-sm font-bold text-error-700 dark:text-error-400">Conflict detected! Dentist is busy at this time.</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3 p-4 bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 rounded-2xl">
                                <Check className="size-5 text-success-600" /><span className="text-sm font-bold text-success-700 dark:text-success-400">No scheduling conflict detected. Ready for approval.</span>
                            </div>
                        )}

                        {/* Minimal Schedule Bar (Moved here to make room for status timeline) */}
                        <div className="relative h-12 bg-white dark:bg-gray-950 rounded-2xl flex items-center overflow-visible border border-gray-200 dark:border-gray-700 shadow-inner px-6 mt-2">
                            {busySlots.map((pos, idx) => (
                                <div 
                                    key={`busy-${idx}`}
                                    className="absolute h-full top-0 w-[8%] bg-gray-100/50 dark:bg-gray-800/40 border-x border-white/5 dark:border-gray-700/20 flex items-center justify-center grayscale"
                                    style={{ left: `${pos}%` }}
                                >
                                    <span className="text-[6px] text-gray-300 font-black uppercase tracking-tighter">Busy</span>
                                </div>
                            ))}
                            {slotPosition >= 0 && slotPosition <= 95 && (
                                <div 
                                    className="absolute h-[110%] top-[-5%] w-[10%] bg-brand-500 text-white rounded-lg flex flex-col items-center justify-center shadow-md z-20"
                                    style={{ left: `${slotPosition}%` }}
                                >
                                    <span className="text-[8px] font-black tabular-nums">{timeStr}</span>
                                </div>
                            )}
                            <div className="absolute -bottom-4 left-0 w-full flex justify-between px-2">
                                {[9,11,1,3,5].map(h => (
                                    <span key={h} className="text-[8px] font-bold text-gray-300 tracking-tighter tabular-nums">
                                        {h}{h > 8 && h < 12 ? 'am' : 'pm'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex justify-end gap-4 mt-4 mb-8 shrink-0">
                        <button onClick={() => setIsRejecting(true)} className="px-8 py-3 bg-gray-50 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 font-bold text-sm rounded-2xl border border-gray-100 dark:border-gray-800">Reject</button>
                        <button onClick={onApprove} className="px-12 py-3 bg-success-500 text-white font-bold text-sm rounded-2xl shadow-lg active:scale-95">Approve</button>
                    </div>
                </div>
            </div>

            {/* Reject Modal Overlay */}
            {isRejecting && (
                <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-30 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-3xl p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reject Request</h3>
                            <button onClick={() => setIsRejecting(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white"><X className="size-5" /></button>
                        </div>
                        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter rejection reason here..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 rounded-2xl p-4 text-sm h-32 resize-none shadow-sm mb-6" />
                        <button onClick={() => onReject(rejectionReason)} disabled={!rejectionReason.trim()} className="w-full bg-error-500 text-white font-bold py-4 text-sm rounded-2xl shadow-theme-md disabled:opacity-50 transition-all">Confirm Rejection</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentDetailView;
