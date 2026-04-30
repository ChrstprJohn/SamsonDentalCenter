import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../../../ui';

const ProfileTab = ({ patient }) => {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
                <div className='p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-brand-50/30 dark:bg-brand-500/5'>
                    <h4 className='text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                        <Calendar size={14} /> Upcoming Appointment
                    </h4>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-bold text-gray-900 dark:text-white'>{patient.next_appointment || 'No upcoming appointments'}</p>
                        <Button variant='ghost' className='text-[10px] font-black uppercase text-brand-600'>View Details</Button>
                    </div>
                </div>
                <div className='p-6 rounded-2xl border border-gray-100 dark:border-gray-800'>
                    <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>Patient Summary</h4>
                    <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                        Patient has been active since {new Date(patient.created_at).toLocaleDateString()}. Total of {patient.total_visits || 0} visits recorded across all services.
                    </p>
                </div>
            </div>
            <div className='space-y-6'>
                <div className='p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4'>
                    <div className='flex justify-between items-center'>
                        <span className='text-[10px] font-bold text-gray-400 uppercase'>Outstanding</span>
                        <span className='text-sm font-black text-gray-900 dark:text-white'>{patient.balance || '₱ 0.00'}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-[10px] font-bold text-gray-400 uppercase'>Attendence</span>
                        <span className='text-sm font-black text-success-600'>100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
