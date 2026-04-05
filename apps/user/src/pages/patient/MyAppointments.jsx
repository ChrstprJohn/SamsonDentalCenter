import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ThreeDotsIcon = () => (
    <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

export const appointmentsData = [
    {
        id: 'APP-001',
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: 'John Doe',
        service: 'Routine Checkup',
        date: 'Oct 24, 2024',
        time: '10:00 AM',
        status: 'Approved',
    },
    {
        id: 'APP-002',
        dentist: {
            name: 'Dr. Mark Wilson',
            specialty: 'Orthodontist',
            image: '/images/user/user-02.jpg',
        },
        patient: 'John Doe',
        service: 'Braces Adjustment',
        date: 'Oct 20, 2024',
        time: '02:30 PM',
        status: 'Approved',
    },
    {
        id: 'APP-003',
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: 'John Doe',
        service: 'Tooth Extraction',
        date: 'Oct 15, 2024',
        time: '09:00 AM',
        status: 'Cancelled',
        rejectionReason: 'Clinic requested cancellation due to schedule conflict.',
    },
    {
        id: 'APP-004',
        dentist: {
            name: 'Dr. Emily Chen',
            specialty: 'Periodontist',
            image: '/images/user/user-03.jpg',
        },
        patient: 'John Doe',
        service: 'Gum Treatment',
        date: 'Nov 05, 2024',
        time: '11:15 AM',
        status: 'Pending',
    },
    {
        id: 'APP-005',
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: 'John Doe',
        service: 'Teeth Whitening',
        date: 'Nov 12, 2024',
        time: '04:00 PM',
        status: 'Pending',
    },
];

const MyAppointments = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleViewDetails = (id) => {
        setOpenDropdown(null);
        navigate(`/patient/appointments/${id}`);
    };

    return (
        <>
            <PageBreadcrumb pageTitle='My Appointments' />
            <ComponentCard
                title='Recent Appointments'
                desc='View and manage your upcoming and past dental visits.'
            >
                <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
                    <div className='max-w-full overflow-x-auto'>
                        <Table>
                            {/* Table Header */}
                            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[150px]'
                                    >
                                        Date & Time
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Service
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Dentist
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Patient
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400'
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                                {appointmentsData.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell className='px-4 py-3 text-start min-w-[150px]'>
                                            <div className='flex flex-col sm:flex-row sm:items-center sm:gap-3'>
                                                <span className='font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                                                    {app.date}
                                                </span>
                                                <span className='text-gray-500 text-theme-xs dark:text-gray-400'>
                                                    {app.time}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            {app.service}
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-start'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 overflow-hidden rounded-full bg-brand-50'>
                                                    <div className='w-full h-full flex items-center justify-center text-brand-500 font-bold text-xs'>
                                                        {app.dentist.name
                                                            .replace('Dr. ', '')
                                                            .charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                                                        {app.dentist.name}
                                                    </span>
                                                    <span className='block text-gray-500 text-theme-xs dark:text-gray-400'>
                                                        {app.dentist.specialty}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            {app.patient}
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            <Badge
                                                size='sm'
                                                color={
                                                    app.status === 'Approved'
                                                        ? 'success'
                                                        : app.status === 'Cancelled'
                                                        ? 'error'
                                                        : 'warning'
                                                }
                                            >
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400'>
                                            <div className='relative flex justify-end'>
                                                <button
                                                    onClick={() =>
                                                        toggleDropdown(app.id)
                                                    }
                                                    className='dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                                                >
                                                    <ThreeDotsIcon />
                                                </button>
                                                <Dropdown
                                                    isOpen={
                                                        openDropdown === app.id
                                                    }
                                                    onClose={() =>
                                                        setOpenDropdown(null)
                                                    }
                                                    className='w-40 p-2'
                                                >
                                                    <DropdownItem
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                app.id
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </DropdownItem>
                                                </Dropdown>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ComponentCard>
        </>
    );
};

export default MyAppointments;
