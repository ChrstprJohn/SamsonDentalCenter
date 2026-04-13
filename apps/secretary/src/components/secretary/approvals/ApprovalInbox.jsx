import React from 'react';
import { Search, ListChecks, SearchX, Clock, Calendar, Filter, ChevronDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import ApprovalRow from './ApprovalRow';
import Pagination from '../../common/Pagination';

const CATEGORIES = [
    { id: 'all', label: 'All Requests', icon: ListChecks },
    { id: 'urgent', label: 'Urgent', icon: Zap },
    { id: 'stale', label: 'Needs Attention', icon: Clock },
    { id: 'recent', label: 'Recent Request', icon: Calendar },
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
    'Dr. Alice Smith',
    'Dr. Bob Johnson',
    'Dr. Charlie Davis'
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
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={`${d}-${i}`} className="text-[10px] font-bold text-gray-400 py-1">{d}</span>
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
                            className={`h-8 relative flex flex-col items-center justify-center rounded-xl text-xs font-medium transition-all group ${isSelected
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
    const { isMobileOpen } = useSidebar();
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
        <div className='flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-2xl border-t sm:border border-gray-200 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden h-full'>
            <div className='px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 space-y-4 shrink-0'>
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
                        <div className="relative z-[100002] md:z-20">
                            {/* Desktop Filter Button (Hidden on Mobile) */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${showFilters || selectedService !== 'All Services' || selectedDoctor !== 'All Doctors' || selectedDate
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
                                    <div className="fixed inset-0 bg-black/40 z-[100000] md:hidden animate-in fade-in duration-300" onClick={() => setShowFilters(false)} />
                                    
                                    {/* Desktop Filter Modal - No Animation */}
                                    <div className="absolute right-0 top-full mt-2 w-[820px] hidden md:block bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-[50]">
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
                                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${localService === s
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
                                                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group/doc ${localDoctor === d
                                                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                                                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span>{d}</span>
                                                                {d !== 'All Doctors' && (
                                                                    <span className={`text-[9px] uppercase tracking-tighter px-1.5 py-0.5 rounded-md font-black ${
                                                                        localDoctor === d 
                                                                        ? 'bg-white/20 text-white' 
                                                                        : 'bg-brand-50 text-brand-500 dark:bg-brand-500/10'
                                                                    }`}>
                                                                        M, Thu, Fri
                                                                    </span>
                                                                )}
                                                            </div>
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

                                    {/* Mobile Filter Bottom Sheet */}
                                    <div className="fixed inset-x-0 bottom-0 md:hidden bg-white dark:bg-gray-900 rounded-t-[40px] shadow-2xl border-t border-gray-100 dark:border-gray-800 p-8 pt-10 z-[100002] animate-in slide-in-from-bottom-full duration-500 ease-in-out">
                                        {/* Pull indicator */}
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full" />
                                        
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Filter Options</h3>
                                                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
                                                    <ChevronDown className="text-gray-400" />
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1 mb-3">Appointment Date</label>
                                                    <input type="date" value={localDate} onChange={(e) => setLocalDate(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none text-sm font-bold shadow-inner" />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">Service</label>
                                                        <select value={localService} onChange={(e) => setLocalService(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none text-[10px] font-bold shadow-sm">
                                                            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">Dentist</label>
                                                        <select value={localDoctor} onChange={(e) => setLocalDoctor(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none text-[10px] font-bold shadow-sm">
                                                            {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <button onClick={handleApplyFilters} className="w-full bg-brand-500 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-500/25 active:scale-[0.98] transition-all mt-4">
                                                    Apply Filters
                                                </button>
                                            </div>
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
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive
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
            <div className='flex-grow overflow-y-auto no-scrollbar min-h-[500px] pb-24 sm:pb-0'>
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

            {/* Floating Action Button - Mobile Only */}
            {!isMobileOpen && (
                <button
                    onClick={() => setShowFilters(true)}
                    className='fixed bottom-16 right-5 md:hidden z-50 flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-full shadow-2xl shadow-brand-500/40 active:scale-95 transition-all outline-none'
                >
                    <Filter size={18} />
                    <span className='text-xs font-bold'>Filters</span>
                    {(selectedService !== 'All Services' || selectedDoctor !== 'All Doctors' || selectedDate) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                </button>
            )}

            {/* Footer / Pagination Placeholder */}
            {(totalPages >= 1 || requests.length > 0) && (
                <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.2)] sm:shadow-none shrink-0'>
                    <div className='flex flex-row items-center justify-between w-full gap-2 sm:gap-0'>
                        {/* Left: Results text */}
                        <div className='w-auto sm:w-1/3 text-left'>
                            <span className='text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap'>
                                Showing {requests.length} results
                            </span>
                        </div>

                        {/* Center: Pagination */}
                        <div className='flex items-center justify-end sm:justify-center w-auto sm:w-1/3'>
                            <div className='flex items-center gap-1 justify-center shrink-0'>
                                {totalPages > 1 && (
                                    <button 
                                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                                        className='w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] disabled:opacity-30'
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                )}
                                <button className='w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors bg-brand-500 text-white shadow-md shadow-brand-500/20'>
                                    {currentPage}
                                </button>
                                {totalPages > currentPage && (
                                    <button 
                                        onClick={() => onPageChange(currentPage + 1)}
                                        className='w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                                    >
                                        {currentPage + 1}
                                    </button>
                                )}
                                {totalPages > currentPage + 1 && (
                                    <button 
                                        onClick={() => onPageChange(currentPage + 1)}
                                        className='w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Empty spacer to ensure exact center alignment on desktop */}
                        <div className='hidden sm:block sm:w-1/3'></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalInbox;

