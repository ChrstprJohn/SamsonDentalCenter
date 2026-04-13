import React from 'react';
import { Search, ListChecks, SearchX, Clock, Calendar, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ApprovalRow from './ApprovalRow';
import Pagination from '../../common/Pagination';

const CATEGORIES = [
    { id: 'all', label: 'All Requests', icon: ListChecks },
    { id: 'stale', label: 'Stale (>24h)', icon: Clock },
    { id: 'recent', label: 'Recent', icon: Calendar },
];

const SERVICES = [
    'All Services',
    'Dental Implants',
    'Surgical Extraction',
    'Orthodontic Consultation',
    'Teeth Whitening',
    'Routine Checkup'
];

const DOCTORS = [
    'All Doctors',
    'Dr. Smith',
    'Dr. Garcia',
    'Dr. Lopez'
];

const ITEMS_PER_PAGE = 8;

const MiniCalendar = ({ selectedDate, onDateChange, requestDates }) => {
    const [viewDate, setViewDate] = React.useState(new Date(selectedDate || Date.now()));
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const days = [];
    const totalDays = daysInMonth(currentYear, currentMonth);
    const offset = firstDayOfMonth(currentYear, currentMonth);

    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{monthName} {currentYear}</span>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"><ChevronLeft size={16} /></button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"><ChevronRight size={16} /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-400 py-1">{d}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="h-8" />;
                    
                    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const isSelected = selectedDate === dateStr;
                    const hasRequest = requestDates.includes(dateStr);
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;

                    return (
                        <button
                            key={day}
                            onClick={() => onDateChange(dateStr)}
                            className={`h-8 relative flex flex-col items-center justify-center rounded-xl text-xs font-medium transition-all group ${
                                isSelected 
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            } ${isToday && !isSelected ? 'border border-brand-500/30' : ''}`}
                        >
                            <span>{day}</span>
                            {hasRequest && (
                                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-error-500'}`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const ApprovalInbox = ({ 
    requests, 
    allRequests,
    activeFilter, 
    onFilterChange, 
    searchQuery, 
    onSearchChange,
    selectedService,
    onServiceChange,
    selectedDoctor,
    onDoctorChange,
    selectedDate,
    onDateChange,
    onRowClick,
    currentPage,
    onPageChange
}) => {
    const [showFilters, setShowFilters] = React.useState(false);
    
    // Local state for deferred filtering
    const [localService, setLocalService] = React.useState(selectedService);
    const [localDoctor, setLocalDoctor] = React.useState(selectedDoctor);
    const [localDate, setLocalDate] = React.useState(selectedDate);

    // Sync local state when dropdown opens
    React.useEffect(() => {
        if (showFilters) {
            setLocalService(selectedService);
            setLocalDoctor(selectedDoctor);
            setLocalDate(selectedDate);
        }
    }, [showFilters, selectedService, selectedDoctor, selectedDate]);

    const handleApplyFilters = () => {
        onServiceChange(localService);
        onDoctorChange(localDoctor);
        onDateChange(localDate);
        setShowFilters(false);
    };
    
    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    const paginatedRequests = requests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const requestDates = React.useMemo(() => {
        return [...new Set((allRequests || []).map(r => r.requestedDate))];
    }, [allRequests]);

    return (
        <div className='flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden h-full'>
            <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4 shrink-0'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='relative flex-grow'>
                        <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                            <Search size={18} />
                        </span>
                        <input 
                            type='text' 
                            placeholder='Search by patient name...'
                            className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none'
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    
                    <div className='flex gap-2 shrink-0 items-center relative'>
                        <div className="relative">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                                    showFilters || selectedService !== 'All Services' || selectedDoctor !== 'All Doctors' || selectedDate
                                    ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/30'
                                    : 'bg-white dark:bg-white/[0.03] border-gray-100 dark:border-gray-800 text-gray-600 hover:bg-gray-50 dark:hover:bg-white/[0.05]'
                                }`}
                            >
                                <Filter size={16} />
                                <span>Filters {(selectedService !== 'All Services' || selectedDoctor !== 'All Doctors' || selectedDate) && '•'}</span>
                                {selectedDate && (
                                    <span className="ml-1 px-2 py-0.5 bg-brand-500 text-white rounded-full text-[9px] font-black uppercase">
                                        {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                )}
                            </button>
                            {showFilters && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-[820px] hidden md:block bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex h-[440px]">
                                            {/* COLUMN 1: Calendar */}
                                            <div className="w-[280px] bg-gray-50/50 dark:bg-gray-800/20 border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Appointment Date</label>
                                                <div className="flex-grow">
                                                    <MiniCalendar 
                                                        selectedDate={localDate} 
                                                        onDateChange={setLocalDate}
                                                        requestDates={requestDates}
                                                    />
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                                                    <div className="flex items-center gap-2 mb-1.5 font-black">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-error-500 animate-pulse" />
                                                        <span className="text-[9px] text-gray-500 uppercase tracking-wider">Pending Approvals</span>
                                                    </div>
                                                    <p className="text-[9px] leading-relaxed text-gray-400 font-bold uppercase tracking-tighter">Dots mark dates needing attention</p>
                                                </div>
                                            </div>

                                            {/* COLUMN 2: Service Type */}
                                            <div className="w-[260px] border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Service Type</label>
                                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-2">
                                                    {SERVICES.map(s => (
                                                        <button 
                                                            key={s} 
                                                            onClick={() => setLocalService(s)} 
                                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                                                localService === s 
                                                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                                                                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                                            }`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* COLUMN 3: Dentist */}
                                            <div className="flex-1 p-6 flex flex-col bg-gray-50/30 dark:bg-gray-800/10">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Dentist</label>
                                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 mb-6 pr-2">
                                                    {DOCTORS.map(d => (
                                                        <button 
                                                            key={d} 
                                                            onClick={() => setLocalDoctor(d)} 
                                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                                                localDoctor === d 
                                                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                                                                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                                            }`}
                                                        >
                                                            {d}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button 
                                                    onClick={handleApplyFilters}
                                                    className="w-full bg-gray-900 dark:bg-brand-500 hover:bg-gray-800 dark:hover:bg-brand-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group flex items-center justify-center gap-2"
                                                >
                                                    <span>Apply Filters</span>
                                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Filter View (Simplified) */}
                                    <div className="fixed inset-x-4 top-20 md:hidden bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-800 p-6 z-50 animate-in fade-in zoom-in duration-200">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1 mb-2">Appointment Date</label>
                                                <input type="date" value={localDate} onChange={(e) => setLocalDate(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none text-xs font-bold" />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">Service</label>
                                                    <select value={localService} onChange={(e) => setLocalService(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none text-[10px] font-bold">
                                                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">Dentist</label>
                                                    <select value={localDoctor} onChange={(e) => setLocalDoctor(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none text-[10px] font-bold">
                                                        {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <button onClick={handleApplyFilters} className="w-full bg-brand-500 text-white font-black py-4 rounded-2xl text-xs uppercase shadow-lg shadow-brand-500/25">Apply Filters</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex items-center gap-2 overflow-x-auto no-scrollbar'>
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeFilter === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                    isActive 
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                                    : 'bg-gray-50 dark:bg-white/[0.03] text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                                }`}
                            >
                                <Icon size={14} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Requests List */}
            <div className='flex-grow overflow-y-auto no-scrollbar min-h-[500px]'>
                {paginatedRequests.length > 0 ? (
                    <div className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                        {paginatedRequests.map((request) => (
                            <ApprovalRow 
                                key={request.id} 
                                request={request} 
                                onClick={() => onRowClick(request.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center h-full py-20 px-6 text-center animate-in fade-in zoom-in duration-300'>
                        <div className='w-20 h-20 bg-gray-50 dark:bg-white/[0.03] rounded-[32px] flex items-center justify-center mb-6'>
                            <SearchX className='text-gray-300 dark:text-gray-700' size={32} />
                        </div>
                        <h3 className='text-lg font-black text-gray-900 dark:text-white mb-2'>No requests found</h3>
                        <p className='text-sm text-gray-400 max-w-[280px] font-medium leading-relaxed'>
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
            
            {/* Footer / Pagination Placeholder */}
            {(totalPages > 1 || requests.length > 0) && (
                <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 sm:px-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.2)] sm:shadow-none shrink-0 py-3 pb-6 sm:pb-3'>
                    <div className='flex flex-row items-center justify-between w-full h-12'>
                        {/* Left: Results text */}
                        <div className='w-1/3 text-left'>
                            <span className='text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap mt-4'>
                                Showing {paginatedRequests.length} of {requests.length}
                            </span>
                        </div>

                        {/* Right: Pagination */}
                        <div className='flex items-center justify-end w-2/3 mt-[-20px]'>
                            {totalPages > 1 && (
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalInbox;

