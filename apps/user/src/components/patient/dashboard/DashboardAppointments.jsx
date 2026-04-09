import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';

const APPOINTMENTS = [
    {
        id: 1,
        service: 'Dental Cleaning',
        dentist: 'Dr. Sarah Smith',
        date: 'Oct 24, 2024',
        time: '10:00 AM',
        status: 'Approved',
        color: 'success'
    },
    {
        id: 2,
        service: 'Tooth Extraction',
        dentist: 'Dr. John Doe',
        date: 'Nov 05, 2024',
        time: '02:30 PM',
        status: 'Pending',
        color: 'warning'
    },
    {
        id: 3,
        service: 'Consultation',
        dentist: 'Dr. Sarah Smith',
        date: 'Nov 12, 2024',
        time: '09:00 AM',
        status: 'Approved',
        color: 'success'
    },
    {
        id: 4,
        service: 'Whitening',
        dentist: 'TBD',
        date: 'Dec 01, 2024',
        time: '11:15 AM',
        status: 'Approved',
        color: 'success'
    },
    {
        id: 5,
        service: 'Routine Checkup',
        dentist: 'Dr. John Doe',
        date: 'Jan 15, 2025',
        time: '04:00 PM',
        status: 'Approved',
        color: 'success'
    },
];

const DashboardAppointments = () => {
    return (
        <div className='rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm overflow-hidden flex flex-col h-full'>
            <div className='flex items-center justify-between p-6 pb-4'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit'>
                    Upcoming Appointments
                </h3>
                <Link 
                    to='/patient/appointments' 
                    className='flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors'
                >
                    View All <ChevronRight size={14} />
                </Link>
            </div>

            <div className='overflow-x-auto grow'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01]'>
                            <th className='px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Date & Time</th>
                            <th className='px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Service</th>
                            <th className='px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Dentist</th>
                            <th className='px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                        {APPOINTMENTS.map((app) => (
                            <tr key={app.id} className='hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors'>
                                <td className='px-6 py-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-800 dark:text-white/90'>{app.date}</span>
                                        <span className='text-[11px] text-gray-400'>{app.time}</span>
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>{app.service}</span>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>{app.dentist}</span>
                                </td>
                                <td className='px-6 py-4 text-right'>
                                    <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
                                        app.color === 'success' 
                                        ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400' 
                                        : 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {APPOINTMENTS.length === 0 && (
                <div className='flex flex-col items-center justify-center py-10 text-center'>
                    <Calendar size={40} className='text-gray-200 dark:text-gray-800 mb-3' />
                    <p className='text-sm text-gray-400'>No appointments found.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardAppointments;
