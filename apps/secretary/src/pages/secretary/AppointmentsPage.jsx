import React, { useState, useEffect } from 'react';
import Badge from '../../components/ui/Badge';
import { Calendar as CalendarIcon, ChevronDown, Plus, Search, ChevronLeft, ChevronRight, Users, Tag, ShieldCheck, Eye, MousePointer2 } from 'lucide-react';

const DOCTORS = [
    'All',
    'Dr. James Thompson',
    'Dr. Emily Chen',
    'Dr. Sarah Smith',
    'Dr. John Doe',
];

const SERVICE_TYPES = ['All', 'General', 'Specialized'];

const STATUSES = ['All', 'Displaced', 'Upcoming', 'In Progress', 'Completed', 'Pending', 'Cancelled'];
const SOURCES = ['All', 'Walk-in', 'Guest Booking', 'Account Booking'];

const ITEMS_PER_PAGE = 5;

const APPOINTMENTS_DATA = [
    {
        id: 1,
        time: '9:00 AM',
        date: 'May 14',
        patient: { name: 'Sarah Mitchell', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        doctor: { name: 'Dr. James Thompson', avatar: 'https://i.pravatar.cc/150?u=james' },
        service: { name: 'Routine Cleaning', type: 'General' },
        status: 'Completed'
    },
    {
        id: 2,
        time: '11:00 AM',
        date: 'May 14',
        patient: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=jamesw' },
        doctor: { name: 'Dr. Emily Chen', avatar: 'https://i.pravatar.cc/150?u=emily' },
        service: { name: 'Orthodontic Checkup', type: 'Specialized' },
        status: 'Completed'
    },
    {
        id: 3,
        time: '2:30 PM',
        date: 'May 14',
        patient: { name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?u=elena' },
        doctor: { name: 'Dr. Sarah Smith', avatar: 'https://i.pravatar.cc/150?u=sarah2' },
        service: { name: 'Root Canal', type: 'Specialized' },
        status: 'In Progress'
    },
    {
        id: 4,
        time: '4:00 PM',
        date: 'May 14',
        patient: { name: 'Michael Chang', avatar: 'https://i.pravatar.cc/150?u=michael' },
        doctor: { name: 'Dr. John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
        service: { name: 'Consultation', type: 'General' },
        status: 'Upcoming'
    },
    {
        id: 5,
        time: '9:00 AM',
        date: 'May 15',
        patient: { name: 'Sophia Martinez', avatar: 'https://i.pravatar.cc/150?u=sophia' },
        doctor: { name: 'Dr. James Thompson', avatar: 'https://i.pravatar.cc/150?u=james' },
        service: { name: 'Tooth Extraction', type: 'Specialized' },
        status: 'Upcoming'
    },
    {
        id: 6,
        time: '10:30 AM',
        date: 'May 15',
        patient: { name: 'David Miller', avatar: 'https://i.pravatar.cc/150?u=david' },
        doctor: { name: 'Dr. Emily Chen', avatar: 'https://i.pravatar.cc/150?u=emily' },
        service: { name: 'Cavity Filling', type: 'General' },
        status: 'Pending'
    },
    {
        id: 7,
        time: '1:00 PM',
        date: 'May 15',
        patient: { name: 'Isabella Garcia', avatar: 'https://i.pravatar.cc/150?u=isabella' },
        doctor: { name: 'Dr. John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
        service: { name: 'Teeth Whitening', type: 'General' },
        status: 'Cancelled'
    },
    {
        id: 8,
        time: '3:30 PM',
        date: 'May 15',
        patient: { name: 'Robert Taylor', avatar: 'https://i.pravatar.cc/150?u=robert' },
        doctor: { name: 'Dr. Sarah Smith', avatar: 'https://i.pravatar.cc/150?u=sarah2' },
        service: { name: 'Dental Implants', type: 'Specialized' },
        status: 'Displaced'
    },
    {
        id: 9,
        time: '8:30 AM',
        date: 'May 16',
        patient: { name: 'Olivia Brown', avatar: 'https://i.pravatar.cc/150?u=olivia' },
        doctor: { name: 'Dr. Emily Chen', avatar: 'https://i.pravatar.cc/150?u=emily' },
        service: { name: 'Checkup', type: 'General' },
        status: 'Upcoming'
    },
    {
        id: 10,
        time: '10:00 AM',
        date: 'May 16',
        patient: { name: 'William Jones', avatar: 'https://i.pravatar.cc/150?u=william' },
        doctor: { name: 'Dr. James Thompson', avatar: 'https://i.pravatar.cc/150?u=james' },
        service: { name: 'Bridge Work', type: 'Specialized' },
        status: 'Upcoming'
    },
    {
        id: 11,
        time: '11:30 AM',
        date: 'May 16',
        patient: { name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?u=emilyd' },
        doctor: { name: 'Dr. John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
        service: { name: 'Routine Cleaning', type: 'General' },
        status: 'Pending'
    },
    {
        id: 12,
        time: '2:00 PM',
        date: 'May 16',
        patient: { name: 'Liam Wilson', avatar: 'https://i.pravatar.cc/150?u=liam' },
        doctor: { name: 'Dr. Sarah Smith', avatar: 'https://i.pravatar.cc/150?u=sarah2' },
        service: { name: 'Wisdom Tooth Removal', type: 'Specialized' },
        status: 'In Progress'
    },
    {
        id: 13,
        time: '4:30 PM',
        date: 'May 16',
        patient: { name: 'Ava Johnson', avatar: 'https://i.pravatar.cc/150?u=ava' },
        doctor: { name: 'Dr. Emily Chen', avatar: 'https://i.pravatar.cc/150?u=emily' },
        service: { name: 'Consultation', type: 'General' },
        status: 'Completed'
    },
    {
        id: 14,
        time: '9:30 AM',
        date: 'May 17',
        patient: { name: 'Noah Martinez', avatar: 'https://i.pravatar.cc/150?u=noah' },
        doctor: { name: 'Dr. James Thompson', avatar: 'https://i.pravatar.cc/150?u=james' },
        service: { name: 'X-Ray Scan', type: 'General' },
        status: 'Upcoming'
    },
    {
        id: 15,
        time: '1:30 PM',
        date: 'May 17',
        patient: { name: 'Charlotte Clark', avatar: 'https://i.pravatar.cc/150?u=charlotte' },
        doctor: { name: 'Dr. John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
        service: { name: 'Periodontal Therapy', type: 'Specialized' },
        status: 'Upcoming',
        source: 'Guest Booking'
    }
];

// Helper to assign random sources to initial data for demo
APPOINTMENTS_DATA.forEach((apt, i) => {
    if (!apt.source) {
        const sources = ['Walk-in', 'Guest Booking', 'Account Booking'];
        apt.source = sources[i % sources.length];
    }
});

const AppointmentsPage = () => {
    const [selectedDate, setSelectedDate] = useState('2026-05-14');
    const [selectedDoctor, setSelectedDoctor] = useState('All');
    const [selectedServiceType, setSelectedServiceType] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedSource, setSelectedSource] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDate, selectedDoctor, selectedServiceType, selectedStatus, selectedSource]);

    const getStatusBadge = (status) => {
        const colorMap = {
            'In Progress': 'warning',
            'Upcoming': 'info',
            'Completed': 'success',
            'Displaced': 'secondary',
            'Pending': 'warning',
            'Cancelled': 'error',
        };
        const color = colorMap[status] || 'light';
        
        return (
            <Badge variant="light" color={color} size="sm" className="sm:size-auto">
                <span className="px-1 py-0.5 font-bold tracking-wide text-[9px] sm:text-[10px] uppercase">{status}</span>
            </Badge>
        );
    };

    const filteredAppointments = APPOINTMENTS_DATA.filter((apt) => {
        const matchDoctor = selectedDoctor === 'All' ? true : apt.doctor.name === selectedDoctor;
        const matchService = selectedServiceType === 'All' ? true : apt.service.type === selectedServiceType;
        const matchStatus = selectedStatus === 'All' ? true : apt.status === selectedStatus;
        const matchSource = selectedSource === 'All' ? true : apt.source === selectedSource;
        
        return matchDoctor && matchService && matchStatus && matchSource;
    }).sort((a, b) => {
        const dateA = new Date(`${a.date}, 2026 ${a.time}`);
        const dateB = new Date(`${b.date}, 2026 ${b.time}`);
        return dateA - dateB;
    });

    const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE) || 1;
    const currentAppointments = filteredAppointments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            {/* Header Section */}
            <div className="px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Appointments
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Manage clinic schedule and bookings
                        </p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm">
                        <Plus size={18} />
                        <span>New Appointment</span>
                    </button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
                    <div className="relative group w-full sm:w-auto shrink-0">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors z-10">
                            <CalendarIcon size={16} />
                        </div>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1120]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                        />
                    </div>

                    <div className="relative group flex-1 sm:flex-none sm:w-[220px] min-w-[140px]">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors z-10">
                            <Users size={16} />
                        </div>
                        <select 
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#0B1120]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm hover:shadow-md transition-all duration-300 appearance-none cursor-pointer"
                        >
                            {DOCTORS.map(doc => (
                                <option key={doc} value={doc}>{doc === 'All' ? 'All Doctors' : doc}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors" />
                    </div>

                    <div className="relative group flex-1 sm:flex-none sm:w-[180px] min-w-[130px]">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors z-10">
                            <Tag size={16} />
                        </div>
                        <select 
                            value={selectedServiceType}
                            onChange={(e) => setSelectedServiceType(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#0B1120]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm hover:shadow-md transition-all duration-300 appearance-none cursor-pointer"
                        >
                            {SERVICE_TYPES.map(type => (
                                <option key={type} value={type}>{type === 'All' ? 'All Services' : type}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors" />
                    </div>

                    <div className="relative group flex-1 sm:flex-none sm:w-[160px] min-w-[130px]">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors z-10">
                            <ShieldCheck size={16} />
                        </div>
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#0B1120]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm hover:shadow-md transition-all duration-300 appearance-none cursor-pointer"
                        >
                            {STATUSES.map(status => (
                                <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors" />
                    </div>

                    <div className="relative group flex-1 sm:flex-none sm:w-[180px] min-w-[130px]">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors z-10">
                            <MousePointer2 size={16} />
                        </div>
                        <select 
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#0B1120]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm hover:shadow-md transition-all duration-300 appearance-none cursor-pointer"
                        >
                            {SOURCES.map(source => (
                                <option key={source} value={source}>{source === 'All' ? 'All Sources' : source}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-500 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grow flex flex-col overflow-hidden">
                {/* Column Headers (Desktop Only) */}
                <div className="hidden sm:flex items-center gap-4 px-4 sm:px-6 py-3 bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex-[0.8] min-w-[100px]">Time</div>
                    <div className="flex-[3] min-w-[250px]">Patient & Service</div>
                    <div className="flex-[2] min-w-[200px]">Doctor</div>
                    <div className="flex-[1.5] min-w-[130px] text-center">Source</div>
                    <div className="flex-[1.5] min-w-[120px] text-center">Status</div>
                    <div className="flex-[0.5] min-w-[60px] text-right">Action</div>
                </div>

                <div className="flex flex-col grow overflow-y-auto pb-20 sm:pb-0">
                    {currentAppointments.length > 0 ? (
                        currentAppointments.map((apt) => (
                            <div key={apt.id} className="group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                {/* Desktop View */}
                                <div className="hidden sm:flex items-center gap-4 w-full">
                                    <div className="flex-[0.8] min-w-[100px]">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white font-outfit">{apt.time}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{apt.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex-[3] min-w-[250px]">
                                        <div className="flex items-center gap-3">
                                            <img src={apt.patient.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{apt.patient.name}</span>
                                                <div className="flex items-center gap-1.5 text-xs truncate mt-0.5">
                                                    <span className="font-bold text-brand-500 dark:text-brand-400">{apt.service.name}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></span>
                                                    <span className="font-medium text-gray-500 dark:text-gray-400">{apt.service.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-[2] min-w-[200px]">
                                        <div className="flex items-center gap-2">
                                            <img src={apt.doctor.avatar} alt="" className="w-6 h-6 rounded-full" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">{apt.doctor.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex-[1.5] min-w-[130px] flex justify-center">
                                        <Badge variant="soft" color={apt.source === 'Walk-in' ? 'secondary' : apt.source === 'Guest Booking' ? 'info' : 'primary'} size="xs">
                                            <span className="text-[9px] leading-none uppercase font-bold">{apt.source}</span>
                                        </Badge>
                                    </div>
                                    <div className="flex-[1.5] min-w-[120px] flex justify-center">
                                        {getStatusBadge(apt.status)}
                                    </div>
                                    <div className="flex-[0.5] min-w-[60px] flex justify-end">
                                        <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-all" title="View Details">
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile View */}
                                <div className="flex sm:hidden gap-3 w-full">
                                    <div className="shrink-0">
                                        <img src={apt.patient.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
                                    </div>
                                    <div className="flex-grow min-w-0 flex flex-col gap-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white truncate tracking-tight">
                                                {apt.patient.name}
                                            </span>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="text-[10px] text-gray-900 dark:text-white font-bold uppercase tracking-wider">{apt.time}</span>
                                                <span className="text-[9px] text-gray-500 dark:text-gray-400 font-semibold uppercase">{apt.date}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 text-[11px] truncate">
                                            <span className="font-bold text-brand-500 dark:text-brand-400">{apt.service.name}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></span>
                                            <span className="font-medium text-gray-500 dark:text-gray-400">{apt.service.type}</span>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                                                <img src={apt.doctor.avatar} alt="" className="w-4 h-4 rounded-full" />
                                                <span className="truncate">{apt.doctor.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Badge variant="soft" color={apt.source === 'Walk-in' ? 'secondary' : apt.source === 'Guest Booking' ? 'info' : 'primary'} size="xs">
                                                    <span className="text-[9px] leading-none uppercase font-bold">{apt.source}</span>
                                                </Badge>
                                                <div className="origin-right">
                                                    {getStatusBadge(apt.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No appointments found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-1">
                                Try adjusting your filters or search query to find what you're looking for.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Footer */}
            {filteredAppointments.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button 
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${
                                        currentPage === page 
                                            ? 'bg-brand-500 text-white' 
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;
