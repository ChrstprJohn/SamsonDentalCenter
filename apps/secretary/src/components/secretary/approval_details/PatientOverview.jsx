import React from 'react';
import PenaltyBadges from '../approvals/PenaltyBadges';
import { Phone, Mail, User as UserIcon } from 'lucide-react';

const PatientOverview = ({ patient, completedCount = 0 }) => {
    const isGuest = patient.source === 'GUEST_BOOKING';
    
    return (
        <div className='bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl mx-4 sm:mx-0 p-4 sm:p-8 shadow-theme-xs'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg shrink-0'>
                    {patient.name?.charAt(0) || <UserIcon />}
                </div>
                <div className='flex-1 min-w-0'>
                    <div className='flex flex-wrap items-center gap-2 mb-2'>
                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-lg uppercase tracking-wider ${
                            isGuest ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-brand-100 text-brand-700 border border-brand-200'
                        }`}>
                            {isGuest ? 'Guest Booking' : 'Registered Patient'}
                        </span>
                    </div>
                    <h3 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate mb-3'>
                        {patient.name}
                    </h3>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2'>
                        <div className='flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                            <Phone className='size-3.5 sm:size-4 text-emerald-500 shrink-0' />
                            <span className='font-semibold tabular-nums'>{patient.phone}</span>
                        </div>
                        <div className='flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                            <Mail className='size-3.5 sm:size-4 text-blue-500 shrink-0' />
                            <span className='font-medium'>{patient.email}</span>
                        </div>
                    </div>

                    <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50'>
                        <h4 className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3'>Penalty & History Status</h4>
                        <PenaltyBadges 
                            noShowCount={patient.noShowCount}
                            cancellationCount={patient.cancellationCount}
                            completedCount={completedCount}
                            isBookingRestricted={patient.isBookingRestricted}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientOverview;
