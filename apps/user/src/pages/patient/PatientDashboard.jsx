import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DashboardStats from '../../components/patient/dashboard/DashboardStats';
import DashboardNotifications from '../../components/patient/dashboard/DashboardNotifications';
import DashboardAppointments from '../../components/patient/dashboard/DashboardAppointments';

const PatientDashboard = () => {
    return (
        <>
            <PageBreadcrumb pageTitle='Dashboard' />
            
            <div className='space-y-6'>
                {/* Welcome Section */}
                <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm'>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white/90 font-outfit'>
                        Welcome back!
                    </h2>
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                        Here's an overview of your dental health and upcoming appointments.
                    </p>
                </div>

                {/* Metrics Grid */}
                <DashboardStats />

                {/* Main Content: Notifications (Left) & Appointments (Right) */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Notifications section (1 column on large screens) */}
                    <div className='lg:col-span-1'>
                        <DashboardNotifications />
                    </div>

                    {/* Appointments Table section (2 columns on large screens) */}
                    <div className='lg:col-span-2'>
                        <DashboardAppointments />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientDashboard;
