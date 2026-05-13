import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Calendar, ArrowUpRight } from 'lucide-react';
import StatCard from './StatCard';
import { formatDate, formatTime } from '../../../hooks/useAppointments';
import { Link } from 'react-router-dom';

const DashboardStats = ({ appointments = [], totalAppointments = 0, loading = false }) => {
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

    const serviceName = loading ? '…' : (latestAppt ? latestAppt.service?.name || latestAppt.service : null);

    return (
        <div className='flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6 min-w-0'>
            {/* ── Card 1: Latest Appointment (Balanced Size) ── */}
            <div className='lg:col-span-2 group relative rounded-2xl border border-gray-200 bg-white/50 dark:border-gray-800 dark:bg-white/[0.02] backdrop-blur-md min-h-[140px] sm:min-h-[160px] transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1.5 hover:border-brand-500/30 overflow-hidden'>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[80px] -mr-32 -mt-32 group-hover:bg-brand-500/15 transition-colors duration-700" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-sky-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className='relative flex items-center h-full px-6 sm:px-8 py-6'>
                    <div className='flex items-center gap-5 sm:gap-8 min-w-0 grow'>
                        {loading ? (
                            <>
                                <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 shrink-0 animate-pulse' />
                                <div className='space-y-3 grow'>
                                    <div className='h-6 w-1/3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
                                    <div className='h-8 w-2/3 bg-gray-50 dark:bg-gray-800/50 rounded animate-pulse' />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-xl shadow-brand-500/30 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500'>
                                    <Clock size={28} className="sm:w-[32px] sm:h-[32px]" />
                                </div>
                                
                                <div className='min-w-0 grow'>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <p className='text-[10px] font-bold text-gray-400'>
                                            Upcoming Session
                                        </p>
                                    </div>
                                    <h3 className='text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate tracking-tight leading-none mb-3'>
                                        {serviceName || 'No Scheduled Visit'}
                                    </h3>
                                    {latestAppt ? (
                                        <div className='flex items-center gap-3 flex-wrap'>
                                            <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-200 transition-all group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-500/20'>
                                                <Calendar size={14} />
                                                {formatDate(latestAppt.date)}
                                            </span>
                                            <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-200 transition-all group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-500/20'>
                                                <Clock size={14} />
                                                {formatTime(latestAppt.start_time)}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 font-bold mt-1">Book an appointment to see details here</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Enhanced View Details Trigger */}
                    {latestAppt && !loading && (
                        <div className="ml-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 hidden sm:block">
                             <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                                <ArrowUpRight size={24} />
                             </div>
                        </div>
                    )}

                    {/* External Link Overlay */}
                    {latestAppt && !loading && (
                        <Link to={`/patient/appointments/${latestAppt.id}`} className='absolute inset-0 z-10' aria-label='View appointment' />
                    )}
                </div>
            </div>

            {/* ── Cards 2-3: Secondary Stats ── */}
            <div className='lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6'>
                <div className='snap-start'>
                    <StatCard
                        title='Pending'
                        value={pendingCount.toString()}
                        icon={AlertCircle}
                        color='warning'
                        loading={loading}
                    />
                </div>
                <div className='snap-start'>
                    <StatCard
                        title='Approved'
                        value={approvedCount.toString()}
                        icon={CheckCircle2}
                        color='success'
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
