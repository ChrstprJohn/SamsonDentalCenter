import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { UserCheck, CheckCircle2, MapPin, X, CalendarClock, CalendarDays } from 'lucide-react';

const ProgressCheckIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Solid right arc */}
        <path d="M12 3a9 9 0 0 1 0 18" />
        {/* Dashed left arc */}
        <path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9" strokeDasharray="4 5" />
        {/* Center check */}
        <path d="M8 12l3 3 5-5" />
    </svg>
);

const mockFrontDeskAppointments = [
    {
        id: 1,
        status: 'Upcoming',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        service: 'Routine Cleaning',
        patient: 'Christopher Picarding',
        patientAvatar: 'https://ui-avatars.com/api/?name=Christopher+Picarding&background=random',
        doctor: 'Dr. James Thompson',
        doctorAvatar: 'https://ui-avatars.com/api/?name=James+Thompson&background=random',
        specialty: 'General Dentistry',
        phone: '+63 917 123 4567',
    },
    {
        id: 2,
        status: 'In Progress',
        startTime: '10:30 AM',
        endTime: '11:30 AM',
        service: 'Orthodontic Checkup',
        patient: 'Sarah Mitchell',
        patientAvatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=random',
        doctor: 'Dr. Emily Chen',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random',
        specialty: 'Specialized Dentistry',
        phone: '+63 920 987 6543',
    },
    {
        id: 3,
        status: 'Upcoming',
        startTime: '1:00 PM',
        endTime: '2:00 PM',
        service: 'Tooth Extraction',
        patient: 'James Wilson',
        patientAvatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=random',
        doctor: 'Dr. Alan Smith',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Alan+Smith&background=random',
        specialty: 'Oral Surgery',
        phone: '+63 932 555 7890',
    },
    {
        id: 4,
        status: 'Completed',
        startTime: '8:00 AM',
        endTime: '9:00 AM',
        service: 'Initial Consultation',
        patient: 'Michael Scott',
        patientAvatar: 'https://ui-avatars.com/api/?name=Michael+Scott&background=random',
        doctor: 'Dr. Emily Chen',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random',
        specialty: 'Specialized Dentistry',
        phone: '+63 999 111 2222',
    }
];

const FrontDeskPage = () => {
    const [activeTab, setActiveTab] = useState('Upcoming');

    const filteredAppointments = mockFrontDeskAppointments.filter(apt => apt.status === activeTab);
   
    // Calculate counts
    const upcomingCount = mockFrontDeskAppointments.filter(apt => apt.status === 'Upcoming').length;
    const inProgressCount = mockFrontDeskAppointments.filter(apt => apt.status === 'In Progress').length;
    const completedCount = mockFrontDeskAppointments.filter(apt => apt.status === 'Completed').length;

    return (
        <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden pb-8">
            <PageBreadcrumb pageTitle="Front Desk" />
           
            <div className="mt-4 sm:mt-6 flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold font-outfit tracking-tight text-[#0B1120] dark:text-white leading-tight">
                    Check-in / Check-out
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                    Manage patient arrivals and departures.
                </p>
            </div>

            {/* Tabs & Date Selection Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 dark:border-gray-800 mt-6 sm:mt-8 gap-4 sm:gap-0">
               
                {/* Tabs */}
                <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0 pb-px">
                    <button
                        onClick={() => setActiveTab('Upcoming')}
                        className={`flex items-center gap-2 pb-2.5 px-1 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'Upcoming'
                            ? 'border-brand-500 text-[#0B1120] dark:text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <CalendarClock size={16} className={`shrink-0 ${activeTab === 'Upcoming' ? 'text-blue-600 dark:text-blue-500' : 'text-blue-600/70 dark:text-blue-500/70'}`} />
                        <span className="font-semibold text-sm sm:text-base">Upcoming</span>
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                            activeTab === 'Upcoming'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                            {upcomingCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('In Progress')}
                        className={`flex items-center gap-2 pb-2.5 px-1 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'In Progress'
                            ? 'border-brand-500 text-[#0B1120] dark:text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <ProgressCheckIcon size={16} className={`shrink-0 ${activeTab === 'In Progress' ? 'text-amber-500' : 'text-amber-500/70'}`} />
                        <span className="font-semibold text-sm sm:text-base">In Progress</span>
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                            activeTab === 'In Progress'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                            {inProgressCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('Completed')}
                        className={`flex items-center gap-2 pb-2.5 px-1 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'Completed'
                            ? 'border-brand-500 text-[#0B1120] dark:text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <CheckCircle2 size={16} className={`shrink-0 ${activeTab === 'Completed' ? 'text-emerald-500' : 'text-emerald-500/70'}`} />
                        <span className="font-semibold text-sm sm:text-base">Completed</span>
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                            activeTab === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                            {completedCount}
                        </span>
                    </button>
                </div>

                {/* Date Selection */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800/80 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-3 sm:mb-2 shadow-sm w-fit">
                    <CalendarDays size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="truncate">Today, 25 Apr 2026</span>
                </div>
            </div>

            {/* Appointment Cards */}
            <div className="flex flex-col gap-3 mt-4 sm:mt-6 w-full">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(apt => (
                        <div key={apt.id} className="flex flex-col sm:flex-row bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                           
                            {/* Left Time Column */}
                            <div className="flex flex-row sm:flex-col w-full sm:w-[120px] bg-gray-50/50 dark:bg-gray-800/20 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800 shrink-0">
                                <div className="flex-1 flex flex-col justify-center px-4 py-2 sm:py-3 border-r sm:border-r-0 sm:border-b border-gray-200 dark:border-gray-800">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Start Time</span>
                                    <span className="text-sm sm:text-base font-semibold text-[#0B1120] dark:text-white font-outfit truncate">{apt.startTime}</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center px-4 py-2 sm:py-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">End Time</span>
                                    <span className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 font-outfit truncate">{apt.endTime}</span>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-5 gap-4 md:gap-6 min-w-0 w-full">
                               
                                {/* Patient Info */}
                                <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[200px] shrink-0">
                                    <div className="relative shrink-0">
                                        <img src={apt.patientAvatar} alt={apt.patient} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm object-cover" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#111827] rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-semibold text-[#0B1120] dark:text-white text-base sm:text-lg font-outfit group-hover:text-brand-500 transition-colors truncate">
                                            {apt.patient}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                            Patient
                                        </span>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4 w-full md:flex-1 min-w-0">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Service</span>
                                        <span className="text-xs sm:text-sm font-semibold text-[#0B1120] dark:text-white truncate" title={apt.service}>{apt.service}</span>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Doctor</span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate" title={apt.doctor}>{apt.doctor}</span>
                                    </div>
                                    <div className="flex flex-col sm:col-span-2 lg:col-span-1 min-w-0">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Contact</span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5 truncate" title={apt.phone}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone text-emerald-500 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                            <span className="truncate">{apt.phone}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end w-full md:w-auto mt-1 sm:mt-0 shrink-0">
                                    {apt.status === 'Completed' ? (
                                        <button className="w-full md:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95">
                                            View Details
                                        </button>
                                    ) : (
                                        <button className={`w-full md:w-auto px-4 py-2 text-white text-xs sm:text-sm font-medium rounded-md shadow-sm hover:shadow transition-all active:scale-95 ${
                                            apt.status === 'Upcoming'
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-emerald-600 hover:bg-emerald-700'
                                        }`}>
                                            {apt.status === 'Upcoming' ? 'Check In' : 'Check Out'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 sm:p-8 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No appointments in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FrontDeskPage;
