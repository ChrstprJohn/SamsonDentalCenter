import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';
import { useAppointmentState } from '../../../context/AppointmentContext';
import { getDisplayStatus, formatDate, formatTime } from '../../../hooks/useAppointments';

const STATUS_CLASSES = {
    success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
    error:   'bg-error-50   text-error-600   dark:bg-error-500/10   dark:text-error-400',
    info:    'bg-blue-50    text-blue-600    dark:bg-blue-500/10    dark:text-blue-400',
    primary: 'bg-brand-50   text-brand-600   dark:bg-brand-500/10   dark:text-brand-400',
    light:   'bg-gray-100   text-gray-500    dark:bg-gray-800        dark:text-gray-400',
};

const DashboardAppointments = () => {
    const navigate = useNavigate();
    const { appointments, loading } = useAppointmentState();

    const displayed = appointments
        .filter(a => {
            const statusStr = (a.status || '').toUpperCase();
            const appStatusStr = (a.approval_status || '').toLowerCase();
            const isApproved = appStatusStr === 'approved' || statusStr === 'CONFIRMED';
            return isApproved &&
                   statusStr !== 'CANCELLED' &&
                   statusStr !== 'LATE_CANCEL' &&
                   statusStr !== 'NO_SHOW' &&
                   statusStr !== 'RESCHEDULED';
        })
        .slice(0, 5);

    return (
        <div className='rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm overflow-hidden flex flex-col h-full'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800'>
                <h3 className='text-sm sm:text-base font-semibold text-gray-800 dark:text-white/90 font-outfit'>
                    Upcoming Appointments
                </h3>
                <Link
                    to='/patient/appointments'
                    className='flex items-center gap-1 text-[11px] sm:text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors'
                >
                    View All <ChevronRight size={13} />
                </Link>
            </div>

            <div className='overflow-x-auto grow'>
                {loading && displayed.length === 0 ? (
                    <div className='flex flex-col gap-3 px-4 sm:px-6 py-4'>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className='h-11 bg-gray-100 dark:bg-white/[0.05] rounded-xl animate-pulse' />
                        ))}
                    </div>
                ) : displayed.length > 0 ? (
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='bg-gray-50/60 dark:bg-white/[0.01]'>
                                {/* Date and Time as SEPARATE columns */}
                                <th className='px-3 sm:px-5 py-2.5 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap'>Date</th>
                                <th className='px-3 sm:px-5 py-2.5 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap'>Time</th>
                                <th className='px-3 sm:px-5 py-2.5 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Service</th>
                                <th className='px-3 sm:px-5 py-2.5 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell'>Dentist</th>
                                <th className='px-3 sm:px-5 py-2.5 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right'>Status</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                            {displayed.map((app) => {
                                const { label, color } = getDisplayStatus(app.status, app.approval_status, app.cancellation_reason);
                                const dentistName = typeof app.dentist === 'object'
                                    ? (app.dentist?.profile
                                        ? `${app.dentist.profile.last_name}, ${app.dentist.profile.first_name}`.replace(/,\s*$/, '').trim()
                                        : 'TBD')
                                    : (app.dentist || 'TBD');

                                return (
                                    <tr
                                        key={app.id}
                                        onClick={() => navigate(`/patient/appointments/${app.id}`)}
                                        className='hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors cursor-pointer'
                                    >
                                        {/* Date — own column */}
                                        <td className='px-3 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap'>
                                            <span className='text-xs sm:text-sm font-semibold text-gray-800 dark:text-white/90'>
                                                {formatDate(app.date)}
                                            </span>
                                        </td>

                                        {/* Time — own column */}
                                        <td className='px-3 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap'>
                                            <span className='text-xs sm:text-sm font-medium text-brand-500 dark:text-brand-400'>
                                                {formatTime(app.start_time)}
                                            </span>
                                        </td>

                                        {/* Service */}
                                        <td className='px-3 sm:px-5 py-3 sm:py-3.5 max-w-[100px] sm:max-w-[180px]'>
                                            <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>
                                                {app.service?.name || app.service || '—'}
                                            </span>
                                        </td>

                                        {/* Dentist — hidden below lg */}
                                        <td className='px-3 sm:px-5 py-3 sm:py-3.5 hidden lg:table-cell'>
                                            <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate'>{dentistName}</span>
                                        </td>

                                        {/* Status */}
                                        <td className='px-3 sm:px-5 py-3 sm:py-3.5 text-right'>
                                            <span className={`inline-flex px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap ${STATUS_CLASSES[color] || STATUS_CLASSES.primary}`}>
                                                {label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : null}
            </div>

            {!loading && displayed.length === 0 && (
                <div className='flex flex-col items-center justify-center py-10 sm:py-14 text-center'>
                    <Calendar size={36} className='text-gray-200 dark:text-gray-800 mb-3' />
                    <p className='text-xs sm:text-sm text-gray-400'>No upcoming appointments.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardAppointments;
