import { Badge, Dropdown, DropdownItem } from '../../ui'; // Nudge for refresh
import { ThreeDotsIcon } from './AppointmentIcons';
import { STATUS_LABEL, STATUS_COLOR, getDisplayStatus, formatDate, formatTime } from '../../../hooks/useAppointments';
import { Calendar, Clock, User, UserCheck, ChevronRight, X } from 'lucide-react';

const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getInitial = (name = '') => name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();

const AppointmentTableRow = ({ appointment, user, onViewDetails }) => {
    const { label: displayStatus, color: badgeColor } = getDisplayStatus(appointment.status, appointment.approval_status, appointment.cancellation_reason);
    
    const patientName = (appointment.last_name || appointment.first_name)
        ? `${appointment.first_name || ''} ${appointment.last_name || ''}`.trim()
        : (appointment.booked_for_name || 'Yourself');

    const isSelf = patientName === 'Yourself' || patientName === (user?.full_name || '');
    const isPending = appointment.status === 'PENDING' && (appointment.approval_status || '').toLowerCase() !== 'approved' && (appointment.approval_status || '').toLowerCase() !== 'rejected';

    // Custom date formatter to handle mobile (no day name) vs desktop
    const formatMobileDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div 
            onClick={() => onViewDetails(appointment.id)}
            className='group relative bg-white dark:bg-white/[0.03] sm:rounded-xl border-b sm:border border-gray-100 dark:border-gray-800 sm:shadow-sm hover:shadow-md sm:hover:z-10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-row'
        >
            {/* 1. Left Side: Schedule Block (Desktop Only) */}
            <div className='hidden sm:flex w-44 bg-gray-50/50 dark:bg-gray-800/20 border-r border-gray-200 dark:border-white/10 shrink-0 flex-col text-left'>
                <div className='px-6 py-2.5 flex-1 flex flex-col justify-center'>
                    <p className='text-[10px] font-black text-gray-500 dark:text-gray-400 mb-0.5'>Date</p>
                    <p className='text-[14px] font-bold text-gray-900 dark:text-white leading-tight'>
                        {formatDate(appointment.date)}
                    </p>
                </div>
                <div className='h-px w-full bg-gray-200 dark:bg-white/5' />
                <div className='px-6 py-2.5 flex-1 flex flex-col justify-center'>
                    <p className='text-[10px] font-black text-gray-500 dark:text-gray-400 mb-0.5'>Time</p>
                    <p className='text-[13px] font-bold text-brand-500 leading-tight'>
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                    </p>
                </div>
            </div>

            {/* 2. Content Area (Unified but responsive) */}
            <div className='flex-grow flex items-center min-w-0'>
                {/* Mobile View (xs only) - EXACT Notification style match */}
                <div className='flex sm:hidden gap-4 w-full px-4 py-4'>
                    <div className='shrink-0'>
                        <div className='w-12 h-12 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/20'>
                            {getInitial(appointment.service)}
                        </div>
                    </div>
                    <div className='flex-grow min-w-0 flex flex-col gap-0.5'>
                        <div className='flex justify-between items-center min-w-0'>
                            <span className='text-sm font-bold text-gray-900 dark:text-white tracking-tight truncate flex-grow min-w-0'>
                                {appointment.service}
                            </span>
                            <div className='shrink-0 ml-2'>
                                <Badge size='sm' color={badgeColor} className='font-black text-[8px] px-1.5 py-0.5 rounded-md tracking-tighter'>
                                    {displayStatus}
                                </Badge>
                            </div>
                        </div>
                        <div className='text-xs truncate text-gray-500 dark:text-gray-400 font-semibold leading-tight'>
                            {patientName} {isSelf && <span className='text-brand-500/70'>(You)</span>}
                        </div>
                        <div className='flex justify-between items-end mt-0.5'>
                            <div className='text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide truncate pr-4 flex items-center gap-1.5'>
                                <span>{formatMobileDate(appointment.date)}</span>
                                <span className='text-gray-300'>•</span>
                                <span className='text-gray-500/80'>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                            </div>
                            <div className='shrink-0 text-gray-300 group-hover:text-brand-500 transition-colors'>
                                <ChevronRight size={16} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop View Content (sm and up) */}
                <div className='hidden sm:flex flex-grow px-8 py-3 items-center gap-6 min-w-0'>
                    <div className='w-14 h-14 rounded-xl bg-brand-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-brand-500/10 shrink-0'>
                        {getInitial(appointment.service)}
                    </div>
                    
                    <div className='flex flex-col sm:flex-row sm:items-center flex-grow gap-0 min-w-0'>
                        {/* Service Column */}
                        <div className='flex flex-col min-w-0 sm:w-[200px] lg:w-[260px] shrink-0'>
                            <p className='text-[10px] font-black text-gray-500 dark:text-gray-400 mb-1'>Service</p>
                            <h3 className='text-[17px] font-bold text-gray-900 dark:text-white truncate leading-tight group-hover:text-brand-500 transition-colors'>
                                {appointment.service}
                            </h3>
                        </div>

                        {/* Patient Column */}
                        <div className='flex flex-col min-w-0 flex-grow sm:pl-8 sm:border-l sm:border-gray-100 sm:dark:border-white/5'>
                            <p className='text-[10px] font-black text-gray-500 dark:text-gray-400 mb-1'>Patient</p>
                            <div className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400'>
                                <span className='text-[14px] font-bold truncate'>
                                    {patientName} {isSelf && <span className='text-brand-500 opacity-70 ml-1 font-bold'>(You)</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Right Side: Desktop-Only Status & Action Block */}
            <div className='hidden sm:flex w-44 bg-gray-50/50 dark:bg-gray-800/20 border-l border-gray-200 dark:border-white/10 shrink-0 flex flex-col text-left'>
                <div className='px-8 py-2.5 flex-1 flex flex-col justify-center items-start'>
                    <p className='text-[10px] font-black text-gray-500 dark:text-gray-400 mb-1'>Status</p>
                    <Badge size='sm' color={badgeColor} className='font-bold text-[11px] px-4 py-1 rounded-md'>
                        {displayStatus}
                    </Badge>
                </div>
                <div className='h-px w-full bg-gray-200 dark:bg-white/5' />
                <div className='px-8 py-2.5 flex-1 flex items-center justify-start'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(appointment.id);
                        }}
                        className='px-4 py-2 border bg-white dark:bg-white/10 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:text-brand-500 shadow-sm rounded-lg text-[12px] font-bold flex items-center gap-2 transition-all active:scale-95'
                    >
                        <span className='text-gray-500 dark:text-gray-400'>View</span>
                        <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentTableRow;
