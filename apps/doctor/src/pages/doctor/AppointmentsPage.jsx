import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import AppointmentTable from '../../components/patient/appointments/AppointmentTable';
import AppointmentFilters from '../../components/patient/appointments/AppointmentFilters';
import useDoctorAppointments from '../../hooks/useDoctorAppointments';
import InvoiceModal from '../../components/doctor/appointments/InvoiceModal';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const MOCK_APPOINTMENTS = [
    {
        id: 'mock-1',
        start_time: '09:00 AM',
        end_time: '10:00 AM',
        status: 'IN_PROGRESS',
        patient: { name: 'John Doe', phone: '09123456789' },
        service: 'Tooth Extraction',
        service_id: 'mock-service-1',
        date: new Date().toISOString(),
    },
    {
        id: 'mock-2',
        start_time: '10:30 AM',
        end_time: '11:00 AM',
        status: 'CONFIRMED',
        patient: { name: 'Jane Smith', phone: '09188877766' },
        service: 'General Consultation',
        service_id: 'mock-service-2',
        date: new Date().toISOString(),
    }
];

const AppointmentsPage = () => {
    // We keep the hook call to avoid breaking context but ignore its data for simulation
    const { 
        filters, 
        setFilters, 
    } = useDoctorAppointments();
    
    const { user } = useAuth();
    const { showToast } = useToast();

    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    // Forced values for full simulation
    const displayAppointments = MOCK_APPOINTMENTS;
    const loading = false;
    const error = null;

    const handleToggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleViewDetails = (id) => {
        console.log('Simulation: View details for', id);
    };

    const handleStartAppointment = async (id) => {
        console.log('Simulation: Starting appointment:', id);
        showToast('Appointment started (Simulated)!', 'success');
    };

    const handleOpenInvoiceModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsInvoiceModalOpen(true);
        setOpenDropdown(null);
    };

    return (
        <>
            <PageBreadcrumb pageTitle='Patient Appointments' />
            
            <div className='space-y-6'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-800 dark:text-white/90 font-outfit uppercase tracking-wider'>
                            Clinical Schedule (Simulation Mode)
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            View and manage patient treatments without database dependency.
                        </p>
                    </div>
                </div>

                <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm overflow-hidden'>
                    <AppointmentFilters 
                        filters={filters} 
                        setFilters={setFilters} 
                    />
                    
                    <div className='mt-6'>
                        <AppointmentTable 
                            appointments={displayAppointments}
                            loading={loading}
                            error={error}
                            user={user}
                            openDropdown={openDropdown}
                            onToggleDropdown={handleToggleDropdown}
                            onViewDetails={handleViewDetails}
                            onStartAppointment={handleStartAppointment}
                            onCreateInvoice={handleOpenInvoiceModal}
                        />
                    </div>
                </div>
            </div>

            {selectedAppointment && (
                <InvoiceModal 
                    isOpen={isInvoiceModalOpen}
                    onClose={() => setIsInvoiceModalOpen(false)}
                    appointment={selectedAppointment}
                    onSuccess={() => {
                        setIsInvoiceModalOpen(false);
                        showToast('Simulation: Invoice Generated Successfully!', 'success');
                    }}
                />
            )}
        </>
    );
};

export default AppointmentsPage;
