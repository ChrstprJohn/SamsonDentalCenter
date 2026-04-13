import React from 'react';
import PenaltyBadges from '../approvals/PenaltyBadges';
import { Phone, Mail } from 'lucide-react';

const PatientOverview = ({ patient, completedCount = 0 }) => {
    const isGuest = patient.source === 'GUEST_BOOKING';
    return (
        <div className='mb-10 sm:mb-14'>
            <div className='flex items-center gap-4 mb-6 sm:mb-8'>
                <h2 className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest'>
                    Patient Overview
                </h2>
                <div className='h-px grow bg-gray-200 dark:bg-gray-800'></div>
            </div>

            <div className='bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row gap-6 sm:gap-8 relative overflow-hidden'>
                <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500 rounded-l-3xl opacity-80'></div>

                <div className='md:w-[40%] shrink-0 flex flex-col items-start'>
                    <div className='flex items-center gap-4 mb-4'>
                        <div className='w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-md'>
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <p className={`text-[11px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider mb-2 ${
                                isGuest ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-brand-50 text-brand-600 border border-brand-100'
                            }`}>
                                {isGuest ? 'Guest Booking' : 'Registered Patient'}
                            </p>
                            <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-1'>
                                {patient.name}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className='hidden md:block w-px bg-gray-200/80 dark:bg-gray-800/80'></div>
                <div className='block md:hidden h-px bg-gray-200/80 dark:bg-gray-800/80 w-full my-1'></div>

                <div className='flex-1 flex flex-col space-y-4 sm:space-y-5'>
                    <span className='text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>
                        Contact & History
                    </span>

                    <div className="flex flex-col gap-2.5">
                        <span className="flex items-center gap-3 text-[14px]">
                            <Phone className="size-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white font-medium">{patient.phone}</span>
                        </span>
                        <span className="flex items-center gap-3 text-[14px]">
                            <Mail className="size-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white font-medium">{patient.email}</span>
                        </span>
                    </div>

                    <div className='pt-2'>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Penalty Status</h3>
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
