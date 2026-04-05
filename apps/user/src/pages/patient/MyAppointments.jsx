import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import ComponentCard from '../../components/common/ComponentCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    Badge,
    Dropdown,
    DropdownItem,
} from '../../components/ui';
import useAppointments, {
    STATUS_LABEL,
    STATUS_COLOR,
    formatDate,
    formatTime,
} from '../../hooks/useAppointments';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const ThreeDotsIcon = () => (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PlusIcon = () => (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M12 5V19M5 12H19' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getInitial = (name = '') => name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();

// ---------------------------------------------------------------------------
// Skeleton row (loading state)
// ---------------------------------------------------------------------------
const SkeletonRow = () => (
    <TableRow>
        {[...Array(7)].map((_, i) => (
            <TableCell key={i} className='px-4 py-3'>
                <div className='h-4 bg-gray-100 dark:bg-white/[0.06] rounded animate-pulse w-20' />
            </TableCell>
        ))}
    </TableRow>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const MyAppointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { appointments, page, totalPages, loading, error, goToPage, prevPage, nextPage } =
        useAppointments({ status: statusFilter, sort: 'desc', limit: 5 });

    // Client-side search against service / dentist / date
    const filtered = search.trim()
        ? appointments.filter((a) => {
            const q = search.toLowerCase();
            return (
                (a.service || '').toLowerCase().includes(q) ||
                (a.dentist || '').toLowerCase().includes(q) ||
                (formatDate(a.date) || '').toLowerCase().includes(q)
            );
        })
        : appointments;

    const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);

    const handleViewDetails = (id) => {
        setOpenDropdown(null);
        navigate(`/patient/appointments/${id}`);
    };

    // Build visible page numbers for pagination
    const pageNumbers = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = new Set([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages]);
        return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    };

    const renderPageButtons = () => {
        const nums = pageNumbers();
        const result = [];
        nums.forEach((num, i) => {
            if (i > 0 && num - nums[i - 1] > 1) {
                result.push(
                    <span key={`ellipsis-${num}`} className='w-8 h-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
                        ...
                    </span>
                );
            }
            result.push(
                <button
                    key={num}
                    onClick={() => goToPage(num)}
                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${num === page
                            ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-500'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05]'
                        }`}
                >
                    {num}
                </button>
            );
        });
        return result;
    };

    return (
        <>
            <PageBreadcrumb pageTitle='My Appointments' />
            <ComponentCard
                title='My Appointments'
                desc='View and manage your upcoming and past dental visits.'
                action={
                    <Link
                        to='/patient/book'
                        className='inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors w-full sm:w-auto shadow-theme-xs'
                    >
                        <PlusIcon />
                        Make an Appointment
                    </Link>
                }
            >
                <div className='rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden'>
                    {/* Search & Filter Container */}
                    <div className='flex flex-col sm:flex-row items-center justify-end px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-4 bg-white dark:bg-white/[0.02]'>
                        <div className='flex items-center gap-3 w-full sm:w-auto'>
                            {/* Search */}
                            <div className='relative flex-grow sm:flex-none'>
                                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            d='M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z'
                                            stroke='currentColor'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                    </svg>
                                </span>
                                <input
                                    type='text'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder='Search service, dentist...'
                                    className='pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-transparent dark:border-white/[0.05] dark:text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-full sm:w-[320px]'
                                />
                            </div>
                            {/* Status filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    goToPage(1);
                                }}
                                className='px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-white/[0.03] dark:text-gray-300 dark:border-white/[0.05] focus:outline-none focus:border-brand-500 flex-shrink-0'
                            >
                                <option value=''>All Statuses</option>
                                <option value='upcoming'>Upcoming</option>
                                <option value='pending'>Pending</option>
                                <option value='cancel'>Cancelled</option>
                                <option value='completed'>Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className='max-w-full overflow-x-auto overflow-y-visible min-h-[400px] md:min-h-[285px]'>
                        <Table>
                            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                                <TableRow>
                                    {['Date', 'Time', 'Service', 'Dentist', 'Patient', 'Status', 'Action'].map((h, i) => (
                                        <TableCell
                                            key={h}
                                            isHeader
                                            className={`px-4 py-3 font-medium text-gray-500 text-sm dark:text-gray-400 ${i === 6 ? 'text-end' : 'text-start'} ${i === 0 ? 'min-w-[120px]' : i === 1 ? 'min-w-[150px]' : ''}`}
                                        >
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                                {/* Loading skeleton */}
                                {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

                                {/* Error */}
                                {!loading && error && (
                                    <TableRow>
                                        <TableCell className='px-4 py-8 text-center text-sm text-error-500' colSpan={7}>
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Empty */}
                                {!loading && !error && filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell className='px-4 py-8 text-center text-sm text-gray-400' colSpan={7}>
                                            No appointments found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Data rows */}
                                {!loading && !error && filtered.map((app) => {
                                    const displayStatus = STATUS_LABEL[app.status] || app.status;
                                    const badgeColor = STATUS_COLOR[displayStatus] || 'primary';
                                    const dentistName = app.dentist || 'TBD';

                                    return (
                                        <TableRow key={app.id}>
                                            {/* Date */}
                                            <TableCell className='px-4 py-3 text-start min-w-[120px]'>
                                                <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                                                    {formatDate(app.date)}
                                                </span>
                                            </TableCell>

                                            {/* Time */}
                                            <TableCell className='px-4 py-3 text-start min-w-[150px]'>
                                                <span className='block text-gray-500 text-theme-sm dark:text-gray-400'>
                                                    {formatTime(app.start_time)} – {formatTime(app.end_time)}
                                                </span>
                                            </TableCell>

                                            {/* Service */}
                                            <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                                <span className='block' title={app.service}>
                                                    {truncateText(app.service, 18)}
                                                </span>
                                            </TableCell>

                                            {/* Dentist */}
                                            <TableCell className='px-4 py-3 text-start'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-8 h-8 overflow-hidden rounded-full bg-brand-50 flex items-center justify-center text-brand-500 font-bold text-xs flex-shrink-0'>
                                                        {getInitial(dentistName)}
                                                    </div>
                                                    <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90' title={dentistName}>
                                                        {truncateText(dentistName, 16)}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Patient — it's always the logged-in user */}
                                            <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                                <span className='block' title={user?.full_name || ''}>
                                                    {truncateText(user?.full_name || '—', 14)}
                                                </span>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className='px-4 py-3 text-start'>
                                                <Badge size='sm' color={badgeColor}>
                                                    {displayStatus}
                                                </Badge>
                                            </TableCell>

                                            {/* Action */}
                                            <TableCell className='px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400'>
                                                <div className='relative flex justify-end'>
                                                    <button
                                                        onClick={() => toggleDropdown(app.id)}
                                                        className='dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                                                    >
                                                        <ThreeDotsIcon />
                                                    </button>
                                                    <Dropdown
                                                        isOpen={openDropdown === app.id}
                                                        onClose={() => setOpenDropdown(null)}
                                                        className='w-40 p-2'
                                                    >
                                                        <DropdownItem onClick={() => handleViewDetails(app.id)}>
                                                            View Details
                                                        </DropdownItem>
                                                    </Dropdown>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className='flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.05] gap-4'>
                        <div className='flex items-center justify-between w-full sm:w-auto gap-3'>
                            <button
                                onClick={prevPage}
                                disabled={page === 1}
                                className='flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-white/[0.03] dark:text-gray-300 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors flex-1 sm:flex-none disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M15 18L9 12L15 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                </svg>
                                Previous
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={page === totalPages}
                                className='flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-white/[0.03] dark:text-gray-300 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors flex-1 sm:flex-none sm:hidden disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                Next
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                </svg>
                            </button>
                        </div>

                        <div className='hidden md:flex items-center gap-1'>
                            {renderPageButtons()}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={page === totalPages}
                            className='hidden sm:flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-white/[0.03] dark:text-gray-300 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
                        >
                            Next
                            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                        </button>
                    </div>
                </div>
            </ComponentCard>
        </>
    );
};

export default MyAppointments;
