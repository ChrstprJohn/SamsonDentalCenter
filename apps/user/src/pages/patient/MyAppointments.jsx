import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import ComponentCard from '../../components/common/ComponentCard';
import { useSidebar } from '../../context/SidebarContext';
import useAppointments, {
    formatDate,
} from '../../hooks/useAppointments';

// Extracted Components
import { PlusIcon } from '../../components/patient/appointments/AppointmentIcons';
import AppointmentFilters from '../../components/patient/appointments/AppointmentFilters';
import AppointmentTable from '../../components/patient/appointments/AppointmentTable';
import AppointmentPagination from '../../components/patient/appointments/AppointmentPagination';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const MyAppointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { isMobileOpen } = useSidebar();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { appointments, page, totalPages, loading, error, goToPage, prevPage, nextPage } =
        useAppointments({ status: statusFilter, sort: 'desc', limit: 10 });

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

    return (
        <>
            <PageBreadcrumb pageTitle='My Appointments' />
            <div className='flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden'>
                <AppointmentFilters 
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusChange={(val) => {
                        setStatusFilter(val);
                        goToPage(1);
                    }}
                />

                <AppointmentTable 
                    appointments={filtered}
                    loading={loading}
                    error={error}
                    user={user}
                    openDropdown={openDropdown}
                    onToggleDropdown={toggleDropdown}
                    onViewDetails={handleViewDetails}
                />

                <AppointmentPagination 
                    page={page}
                    totalPages={totalPages}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    goToPage={goToPage}
                    totalItems={filtered.length}
                />
            </div>

            {/* Floating Action Button - Mobile Only (Hidden when sidebar is open) */}
            {!isMobileOpen && (
                <Link
                    to='/patient/book'
                    className='fixed bottom-16 right-5 sm:hidden z-50 flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-full shadow-2xl shadow-brand-500/40 active:scale-95 transition-all outline-none'
                >
                    <PlusIcon size={18} />
                    <span className='text-xs font-bold'>New Appointment</span>
                </Link>
            )}
        </>
    );
};

export default MyAppointments;
