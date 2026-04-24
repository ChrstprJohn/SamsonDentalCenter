import React from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import StatCard from './StatCard';
import { formatDate, formatTime } from '../../../hooks/useAppointments';
import { Link } from 'react-router-dom';

const DashboardStats = ({ entries = [], appointments = [], totalAppointments = 0, loading = false }) => {
    const scrollRef = React.useRef(null);
    const [scrolled, setScrolled] = React.useState(false);

    const handleScroll = () => {
        if (scrollRef.current) {
            setScrolled(scrollRef.current.scrollLeft > 20);
        }
    };

    // Latest Appointment — most recently created
    const latestAppt = [...appointments]
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))[0];

    const pendingCount = appointments.filter(a => (a.status || '').toUpperCase() === 'PENDING').length;
    const approvedCount = appointments.filter(a => {
        const s = (a.status || '').toUpperCase();
        const as = (a.approval_status || '').toLowerCase();
        const isApproved = s === 'CONFIRMED' || as === 'approved';
        const isInactive = ['CANCELLED', 'LATE_CANCEL', 'NO_SHOW', 'RESCHEDULED'].includes(s);
        return isApproved && !isInactive;
    }).length;
    const waitlistCount = entries.length;

    const serviceName = loading ? '…' : (latestAppt ? latestAppt.service?.name || latestAppt.service : null);

    return (
        <div className='flex flex-col lg:grid lg:grid-cols-5 gap-4 min-w-0'>
            {/* ── Card 1: Latest Appointment ── */}
            <div className='lg:col-span-2 relative rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] min-h-[100px] sm:min-h-[110px]'>
                <div className='flex items-center h-full px-4 sm:px-5 py-3.5 sm:py-4'>
                    <div className='flex items-center gap-3 sm:gap-4 min-w-0 grow'>
                        {loading ? (
                            <>
                                <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 animate-pulse' />
                                <div className='space-y-1.5 sm:space-y-2 grow'>
                                    <div className='h-4.5 sm:h-5 w-3/4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
                                    <div className='h-3.5 sm:h-4 w-1/2 bg-gray-50 dark:bg-gray-800/50 rounded animate-pulse' />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 shrink-0'>
                                    <Clock size={18} className="sm:w-[20px] sm:h-[20px]" />
                                </div>
                                
                                <div className='min-w-0 grow'>
                                    <p className='text-[10px] sm:text-[11px] lg:text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wider'>
                                        Next Appointment
                                    </p>
                                    <h3 className='text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate tracking-tight'>
                                        {serviceName || 'No appointments'}
                                    </h3>
                                    {latestAppt && (
                                        <div className='flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap'>
                                            <span className='inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tight'>
                                                <Calendar size={10} className="sm:w-[12px] sm:h-[12px]" />
                                                {formatDate(latestAppt.date)}
                                            </span>
                                            <span className='inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tight'>
                                                <Clock size={10} className="sm:w-[12px] sm:h-[12px]" />
                                                {formatTime(latestAppt.start_time)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* External Link */}
                    {latestAppt && !loading && (
                        <Link to={`/patient/appointments/${latestAppt.id}`} className='absolute inset-0 z-10' aria-label='View appointment' />
                    )}
                </div>
            </div>

            {/* ── Cards 2-4: Stats (2-Card Carousel) ── */}
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className='flex overflow-x-auto lg:contents gap-4 pb-1 lg:pb-0 no-scrollbar snap-x snap-mandatory'
            >
                <div className='min-w-[calc(50%-8px)] lg:min-w-0 lg:col-span-1 snap-start'>
                    <StatCard
                        title='Pending'
                        value={pendingCount.toString()}
                        icon={AlertCircle}
                        color='warning'
                        loading={loading}
                    />
                </div>
                <div className='min-w-[calc(50%-8px)] lg:min-w-0 lg:col-span-1 snap-start'>
                    <StatCard
                        title='Approved'
                        value={approvedCount.toString()}
                        icon={CheckCircle2}
                        color='success'
                        loading={loading}
                    />
                </div>
                <div className='min-w-[calc(50%-8px)] lg:min-w-0 lg:col-span-1 snap-start'>
                    <StatCard
                        title='Waitlist'
                        value={waitlistCount.toString()}
                        icon={ClipboardList}
                        color='info'
                        loading={loading}
                    />
                </div>
            </div>

            {/* Mobile Pagination Dots (2 Pages) */}
            <div className='flex lg:hidden justify-center gap-1.5 mt-[-4px] mb-1'>
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${!scrolled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${scrolled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
            </div>
        </div>
    );
};

export default DashboardStats;
