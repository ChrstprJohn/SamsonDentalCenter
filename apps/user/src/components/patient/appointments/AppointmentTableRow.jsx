import { Badge, Dropdown, DropdownItem } from '../../ui';
import { ThreeDotsIcon } from './AppointmentIcons';
import { STATUS_LABEL, STATUS_COLOR, getDisplayStatus, formatDate, formatTime } from '../../../hooks/useAppointments';

const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getInitial = (name = '') => name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();

const AppointmentTableRow = ({ appointment, user, openDropdown, onToggleDropdown, onViewDetails }) => {
    const { label: displayStatus, color: badgeColor } = getDisplayStatus(appointment.status, appointment.approval_status, appointment.cancellation_reason);
    const dentistName = (typeof appointment.dentist === 'object' && appointment.dentist?.profile)
        ? `${appointment.dentist.profile.last_name}, ${appointment.dentist.profile.first_name} ${appointment.dentist.profile.middle_name || ''} ${appointment.dentist.profile.suffix || ''}`.replace(/\s+/g, ' ').trim()
        : (appointment.dentist || 'TBD');

    const patientName = (appointment.last_name || appointment.first_name)
        ? `${appointment.last_name || ''}, ${appointment.first_name || ''} ${appointment.middle_name || ''} ${appointment.suffix || ''}`.replace(/\s+/g, ' ').trim()
        : (appointment.booked_for_name || '—');

    return (
        <div 
            onClick={() => onViewDetails(appointment.id)}
            className='group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-4 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]'
        >
            {/* Desktop View (sm and up) */}
            <div className='hidden sm:flex items-center gap-4 w-full'>
                <div className='shrink-0 pl-1 text-gray-300 dark:text-gray-600 transition-colors group-hover:text-amber-400'>
                    <div className='w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-sm'>
                        {getInitial(appointment.service)}
                    </div>
                </div>

                <div className='w-32 lg:w-40 shrink-0 truncate ml-2'>
                    <span className='text-sm sm:text-base text-gray-900 dark:text-white font-bold'>
                        {truncateText(appointment.service, 20)}
                    </span>
                </div>

                <div className='flex-grow min-w-0 flex items-center'>
                    <span className='text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate'>
                        {dentistName}
                    </span>
                    <span className='text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium ml-2 shrink-0'>
                        - {formatDate(appointment.date)} at {formatTime(appointment.start_time)}
                    </span>
                </div>


                <div className='flex items-center gap-4 shrink-0 min-w-[100px] justify-end' onClick={(e) => e.stopPropagation()}>
                    <Badge size='sm' color={badgeColor}>
                        {displayStatus}
                    </Badge>

                    <div className='relative'>
                        <button
                            onClick={() => onToggleDropdown(appointment.id)}
                            className='p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                        >
                            <ThreeDotsIcon />
                        </button>
                        <Dropdown
                            isOpen={openDropdown === appointment.id}
                            onClose={() => onToggleDropdown(null)}
                            className='w-40 p-2 right-0 top-full mt-1 z-10'
                        >
                            <DropdownItem onClick={() => onViewDetails(appointment.id)}>
                                View Details
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {/* Mobile View (xs only) */}
            <div className='flex sm:hidden gap-4 w-full'>
                <div className='shrink-0'>
                    <div className='w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg'>
                        {getInitial(appointment.service)}
                    </div>
                </div>
                <div className='flex-grow min-w-0 flex flex-col gap-0.5'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm tracking-tight font-bold text-gray-900 dark:text-white truncate pr-2'>
                            {appointment.service}
                        </span>
                        <span className='text-[10px] text-gray-400 font-medium'>
                            {formatDate(appointment.date)}
                        </span>
                    </div>
                    <div className='text-sm truncate text-gray-900 dark:text-white font-semibold'>
                        {dentistName}
                    </div>
                    <div className='flex justify-between items-end'>
                        <div className='text-xs text-gray-400 truncate pr-4 grow font-medium'>
                            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </div>
                        <Badge size='sm' color={badgeColor} className='shrink-0'>
                            {displayStatus}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentTableRow;
