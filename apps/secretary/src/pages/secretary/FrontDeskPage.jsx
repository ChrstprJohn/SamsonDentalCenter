import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { CheckCircle2, CalendarClock, CalendarDays, UserX, Undo2, Eye, MapPin, Phone, Mail, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import ApprovalDetailView from '../../components/secretary/approval_details';
import RealTimeClock from '../../components/common/RealTimeClock';
import CheckoutView from '../../components/secretary/patients/appointments/CheckoutView';
import HistoryDetailView from '../../components/secretary/patients/history/HistoryDetailView';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

const mockFrontDeskAppointments = [
    {
        id: 1,
        status: 'Upcoming',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        service: 'Routine Cleaning',
        patient: 'Christopher Picarding',
        patientAvatar: 'https://ui-avatars.com/api/?name=Christopher+Picarding&background=6366f1&color=fff',
        doctor: 'Dr. James Thompson',
        doctorAvatar: 'https://ui-avatars.com/api/?name=James+Thompson&background=random',
        specialty: 'General Dentistry',
        phone: '+63 917 123 4567',
        email: 'cpicarding@example.com',
        location: 'Clinic Room A',
        history: 'Last visit: 6 months ago (Cleaning)',
        notes: 'Patient reports mild sensitivity in lower left molar.'
    },
    {
        id: 2,
        status: 'In Progress',
        startTime: '10:30 AM',
        endTime: '11:30 AM',
        service: 'Orthodontic Checkup',
        patient: 'Sarah Mitchell',
        patientAvatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=f59e0b&color=fff',
        doctor: 'Dr. Emily Chen',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random',
        specialty: 'Specialized Dentistry',
        phone: '+63 920 987 6543',
        email: 'sarah.m@example.com',
        location: 'Orthodontics Wing'
    },
    {
        id: 3,
        status: 'Upcoming',
        startTime: '1:00 PM',
        endTime: '2:00 PM',
        service: 'Tooth Extraction',
        patient: 'James Wilson',
        patientAvatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=ef4444&color=fff',
        doctor: 'Dr. Alan Smith',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Alan+Smith&background=random',
        specialty: 'Oral Surgery',
        phone: '+63 932 555 7890',
        email: 'jwilson@example.com',
        location: 'Surgery Room 1',
        history: 'First time surgery. Patient is anxious.',
        notes: 'Pre-op instructions given over the phone.'
    },
    {
        id: 4,
        status: 'Completed',
        startTime: '8:00 AM',
        endTime: '9:00 AM',
        service: 'Initial Consultation',
        patient: 'Michael Scott',
        patientAvatar: 'https://ui-avatars.com/api/?name=Michael+Scott&background=10b981&color=fff',
        doctor: 'Dr. Emily Chen',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random',
        specialty: 'Specialized Dentistry',
        phone: '+63 999 111 2222',
        email: 'm.scott@dundermifflin.com',
        location: 'Clinic Room B'
    },
    {
        id: 5,
        status: 'No Show',
        startTime: '2:30 PM',
        endTime: '3:30 PM',
        service: 'Tooth Extraction',
        patient: 'Emma Thompson',
        patientAvatar: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=6366f1&color=fff',
        doctor: 'Dr. James Thompson',
        doctorAvatar: 'https://ui-avatars.com/api/?name=James+Thompson&background=random',
        specialty: 'Oral Surgery',
        phone: '+63 932 555 1111',
        email: 'ethompson@example.com',
        location: 'Surgery Room 1'
    }
];

const FrontDeskPage = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [appointments, setAppointments] = useState(mockFrontDeskAppointments);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        variant: 'warning',
        confirmText: 'Confirm'
    });

    const handleActionClick = (e, aptId, newStatus, actionType) => {
        e.stopPropagation();
        
        let title = '';
        let message = '';
        let variant = 'warning';
        let confirmText = 'Confirm';

        if (actionType === 'CHECK_IN') {
            title = 'Confirm Patient Check-In';
            message = 'This will move the patient to "In Progress" and notify the clinical staff. This change will be reflected in the clinical records.';
            variant = 'info';
            confirmText = 'Check In Now';
        } else if (actionType === 'CHECK_OUT') {
            title = 'Confirm Patient Check-Out';
            message = 'This will finalize the appointment and proceed to the billing/checkout summary. Please ensure all treatment notes are complete.';
            variant = 'success';
            confirmText = 'Proceed to Check Out';
        } else if (actionType === 'UNDO') {
            title = 'Revert Appointment Status?';
            message = 'This will move the patient back to "Upcoming". Use this if the check-in was a mistake. This action will reset the clinical start timer.';
            variant = 'danger';
            confirmText = 'Revert Status';
        }

        setConfirmModal({
            isOpen: true,
            title,
            message,
            variant,
            confirmText,
            action: () => executeStatusChange(aptId, newStatus, actionType)
        });
    };

    const executeStatusChange = (id, newStatus, actionType) => {
        if (newStatus === 'Completed') {
            const apt = appointments.find(a => a.id === id);
            setSelectedApt(apt);
            setIsCheckingOut(true);
            toast.info(`Finalizing ${apt.patient}'s appointment...`);
        } else {
            setAppointments(prev => prev.map(apt => 
                apt.id === id ? { ...apt, status: newStatus } : apt
            ));
            
            const apt = appointments.find(a => a.id === id);
            if (actionType === 'CHECK_IN') {
                toast.success(`${apt.patient} has been checked in successfully.`);
            } else if (actionType === 'UNDO') {
                toast.warning(`${apt.patient} has been moved back to Upcoming.`);
            }
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleViewDetails = (apt) => {
        setSelectedApt(apt);
        setIsCheckingOut(apt.status === 'In Progress');
    };

    const handleCheckOutConfirm = (id, treatmentNotes, doctorNotes) => {
        setAppointments(prev => prev.map(apt => 
            apt.id === id ? { ...apt, status: 'Completed', treatmentNotes, doctorNotes } : apt
        ));
        setIsCheckingOut(false);
        setSelectedApt(null);
        toast.success("Appointment completed and finalized.");
    };

    const filteredAppointments = appointments.filter(apt => apt.status === activeTab);
    const counts = {
        Upcoming: appointments.filter(apt => apt.status === 'Upcoming').length,
        'In Progress': appointments.filter(apt => apt.status === 'In Progress').length,
        Completed: appointments.filter(apt => apt.status === 'Completed').length,
        'No Show': appointments.filter(apt => apt.status === 'No Show').length,
    };

    const requestForContext = selectedApt ? {
        id: selectedApt.id,
        patient: {
            name: selectedApt.patient,
            phone: selectedApt.phone || 'N/A',
            email: selectedApt.email || 'N/A',
            noShowCount: 0,
            cancellationCount: 0,
            isBookingRestricted: false
        },
        service: selectedApt.service,
        requestedDate: new Date().toISOString().split('T')[0],
        requestedTime: selectedApt.startTime,
        dentist: selectedApt.doctor
    } : null;

    if (selectedApt && isCheckingOut) {
        return (
            <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden pb-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <CheckoutView 
                    appointment={selectedApt}
                    patient={{
                        full_name: selectedApt.patient,
                        phone: selectedApt.phone
                    }}
                    onBack={() => {
                        setIsCheckingOut(false);
                        setSelectedApt(null);
                    }}
                    onConfirm={() => handleCheckOutConfirm(selectedApt.id)}
                />
            </div>
        );
    }

    if (selectedApt && !isCheckingOut) {
        const isHistory = selectedApt.status === 'Completed' || selectedApt.status === 'No Show';
        return (
            <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden pb-8">
                <PageBreadcrumb 
                    pageTitle={isHistory ? "Clinical Record" : "Appointment Details"} 
                    parentName="Front Desk" 
                    parentPath="/front-desk" 
                />
                <div className="mt-6 flex-1 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-theme-sm overflow-hidden">
                    {isHistory ? (
                        <HistoryDetailView 
                            historyItem={{
                                ...selectedApt,
                                date: 'Apr 20, 2026',
                                doctor: selectedApt.doctor
                            }}
                            patient={{
                                full_name: selectedApt.patient,
                                phone: selectedApt.phone
                            }}
                            onBack={() => setSelectedApt(null)}
                        />
                    ) : (
                        <ApprovalDetailView 
                            request={requestForContext}
                            onBack={() => setSelectedApt(null)}
                            onApprove={() => {
                                executeStatusChange(selectedApt.id, selectedApt.status === 'Upcoming' ? 'In Progress' : 'Completed', 'CHECK_IN');
                                setSelectedApt(null);
                            }}
                            onReject={() => {
                                executeStatusChange(selectedApt.id, 'No Show', 'NO_SHOW');
                                setSelectedApt(null);
                            }}
                            isBookingMode={true}
                            busySlots={[15, 30, 55]}
                            slotPosition={10}
                            timeStr={selectedApt.startTime}
                            completedCount={counts.Completed}
                            breadcrumbItems={[
                                { label: 'Home', href: '/' },
                                { label: 'Front Desk', href: '/front-desk' },
                                { label: 'Appointment Details' }
                            ]}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden pb-8">
            <PageBreadcrumb 
                pageTitle="Front Desk" 
                subtitle="Manage patient arrivals, departures, and checkouts." 
            />
           
            <div className="grow flex flex-col min-h-0">
                <div className="grow flex flex-col bg-white dark:bg-white/[0.03] sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar">
                        {/* Tabs */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 dark:border-gray-800 gap-4 sm:gap-0">
                            <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center w-full sm:w-auto shrink-0 pb-px overflow-hidden">
                                {['Upcoming', 'In Progress', 'Completed', 'No Show'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 pb-2.5 px-1 border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-brand-500 text-[#0B1120] dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                                    >
                                        {tab === 'Upcoming' && <CalendarClock size={16} className={`shrink-0 hidden sm:block ${activeTab === tab ? 'text-blue-600' : 'text-gray-400'}`} />}
                                        {tab === 'In Progress' && <div className="hidden sm:block"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${activeTab === tab ? 'text-amber-500' : 'text-gray-400'}`}><path d="M12 3a9 9 0 0 1 0 18"/><path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9" strokeDasharray="4 5"/><path d="M8 12l3 3 5-5"/></svg></div>}
                                        {tab === 'Completed' && <CheckCircle2 size={16} className={`shrink-0 hidden sm:block ${activeTab === tab ? 'text-emerald-500' : 'text-gray-400'}`} />}
                                        {tab === 'No Show' && <UserX size={16} className={`shrink-0 hidden sm:block ${activeTab === tab ? 'text-red-500' : 'text-gray-400'}`} />}
                                        <span className={`font-semibold text-[12px] xs:text-xs sm:text-base ${activeTab === tab ? '' : 'font-medium'}`}>{tab}</span>
                                        <span className={`sm:ml-1 px-1.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold ${activeTab === tab ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                            {counts[tab]}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <RealTimeClock />
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-3 sm:mb-2 shadow-sm w-fit">
                                    <CalendarDays size={14} className="text-gray-400 shrink-0" />
                                    <span>Today, 25 Apr 2026</span>
                                </div>
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="flex flex-col gap-3 mt-6">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(apt => (
                                    <div 
                                        key={apt.id} 
                                        onClick={() => {
                                            if (activeTab === 'Upcoming') return; // Non-clickable for upcoming
                                            if (apt.status === 'In Progress') {
                                                setSelectedApt(apt);
                                                setIsCheckingOut(true);
                                            } else {
                                                setSelectedApt(apt);
                                            }
                                        }}
                                        className={`flex flex-col bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group ${activeTab === 'Upcoming' ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Time Column */}
                                            <div className="flex flex-row sm:flex-col w-full sm:w-[120px] bg-gray-50/50 dark:bg-gray-800/20 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800 shrink-0">
                                                <div className="flex-1 flex flex-col justify-center px-5 py-4 sm:py-5 border-r sm:border-r-0 sm:border-b border-gray-200 dark:border-gray-800">
                                                    <span className="text-[11px] font-medium capitalize text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1.5"><Clock size={10} /> Start</span>
                                                    <span className="text-sm sm:text-base font-medium text-[#0B1120] dark:text-white font-outfit">{apt.startTime}</span>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center px-5 py-4 sm:py-5">
                                                    <span className="text-[11px] font-medium capitalize text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1.5"><Clock size={10} /> End</span>
                                                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500 font-outfit">{apt.endTime}</span>
                                                </div>
                                            </div>

                                            {/* Main Content */}
                                            <div className="flex-1 p-5 sm:p-6">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                    {/* Patient */}
                                                    <div className="flex items-center gap-4 lg:w-[280px] shrink-0">
                                                        <div className="relative shrink-0">
                                                            <img src={apt.patientAvatar} alt={apt.patient} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-white dark:border-gray-800 shadow-sm-md object-cover" />
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-[#111827] rounded-full ${apt.status === 'In Progress' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <h3 className="font-medium text-[#0B1120] dark:text-white text-lg sm:text-xl font-outfit truncate leading-tight group-hover:text-brand-500 transition-colors">
                                                                {apt.patient}
                                                            </h3>
                                                            <span className="text-[12px] font-medium capitalize text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1.5">
                                                                <ShieldCheck size={12} className="text-brand-500" /> Regular Patient
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Details Grid */}
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-medium capitalize text-gray-400 dark:text-gray-500">Service</span>
                                                            <span className="text-xs sm:text-[13px] font-bold text-[#0B1120] dark:text-white truncate">{apt.service}</span>
                                                            <span className="text-[12px] text-gray-400 font-medium">{apt.specialty}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-medium capitalize text-gray-400 dark:text-gray-500">Attending Doctor</span>
                                                            <span className="text-xs sm:text-[13px] font-bold text-gray-700 dark:text-gray-300 truncate">{apt.doctor}</span>
                                                            <span className="text-[12px] text-brand-500 font-bold capitalize">In Clinic</span>
                                                        </div>
                                                        <div className="hidden xl:flex flex-col gap-1">
                                                            <span className="text-[11px] font-medium capitalize text-gray-400 dark:text-gray-500">Location</span>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin size={12} className="text-emerald-500" />
                                                                <span className="text-xs sm:text-[13px] font-bold text-gray-700 dark:text-gray-300">{apt.location || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-3 lg:w-[180px] justify-end">
                                                        {apt.status === 'In Progress' && (
                                                            <button 
                                                                onClick={(e) => handleActionClick(e, apt.id, 'Upcoming', 'UNDO')}
                                                                className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all active:scale-95 shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-500/20" 
                                                                title="Undo Check-In"
                                                            >
                                                                <Undo2 size={18} />
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewDetails(apt);
                                                            }}
                                                            className="p-3 bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-brand-500 rounded-xl border border-gray-100 dark:border-gray-800 transition-all active:scale-95" 
                                                            title="View Profile"
                                                        >
                                                            <Eye size={20} />
                                                        </button>

                                                        {apt.status !== 'Completed' && apt.status !== 'No Show' && (
                                                            <button 
                                                                onClick={(e) => handleActionClick(e, apt.id, apt.status === 'Upcoming' ? 'In Progress' : 'Completed', apt.status === 'Upcoming' ? 'CHECK_IN' : 'CHECK_OUT')}
                                                                className={`px-6 py-3 text-[11px] font-medium capitalize  rounded-xl shadow-lg transition-all active:scale-95 text-white ${
                                                                    apt.status === 'Upcoming' ? 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                                                }`}
                                                            >
                                                                {apt.status === 'Upcoming' ? 'Check In' : 'Check Out'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded View for Upcoming */}
                                        {activeTab === 'Upcoming' && (
                                            <div className="px-6 py-4 bg-gray-50/30 dark:bg-white/[0.01] border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-start">
                                                <div className="flex-1 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <MessageCircle size={14} className="text-brand-500" />
                                                        <span className="text-[12px] font-medium capitalize text-gray-400 dark:text-gray-500">Administrative Notes</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium italic leading-relaxed">
                                                        "{apt.notes || "No special instructions for this visit."}"
                                                    </p>
                                                </div>
                                                <div className="flex-1 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-amber-500" />
                                                        <span className="text-[12px] font-medium capitalize text-gray-400 dark:text-gray-500">Patient History</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                        {apt.history || "No previous records found for this patient."}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-emerald-500" />
                                                        <span className="text-[12px] font-medium capitalize text-gray-400 dark:text-gray-500">Contact</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{apt.phone}</span>
                                                        <span className="text-[12px] text-gray-400 lowercase">{apt.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl bg-gray-50/30 dark:bg-white/[0.01]">
                                    <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                        <CalendarClock size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-outfit">No appointments found</h3>
                                    <p className="text-gray-400 text-sm mt-1">There are no appointments scheduled in this category for today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reusable Confirmation Modal */}
            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.action}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
                confirmText={confirmModal.confirmText}
            />
        </div>
    );
};

export default FrontDeskPage;
