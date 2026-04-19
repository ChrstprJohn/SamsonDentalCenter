import React from 'react';
import { ChevronRight, Activity, ShieldCheck, Clock, Calendar, CheckSquare, Star, User } from 'lucide-react';

const DoctorRow = ({ doctor, onClick, activeTab }) => {
    const { full_name, tier, specialization, is_active, service_count, license_number, photo_url, stats } = doctor;

    const displayCategory = specialization;

    const renderColumnContent = (isMobile = false) => {
        if (activeTab === 'schedule') {
            return (
                <>
                    <div className='flex items-center gap-2 lg:gap-4 justify-end sm:justify-start flex-grow sm:flex-grow-0'>
                        <div className={`flex items-center gap-1.5 ${isMobile ? 'text-[10px]' : 'text-xs'} font-bold ${is_active ? 'text-success-600 dark:text-success-400' : 'text-gray-500'}`}>
                            <Clock size={isMobile ? 12 : 14} /> 
                            {is_active ? '08:00 AM - 05:00 PM' : 'Not Scheduled'}
                        </div>
                        {!isMobile && (
                            <span className='px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-[10px] font-bold text-amber-600 uppercase tracking-widest hidden lg:block'>
                                Block: May 12
                            </span>
                        )}
                    </div>
                </>
            );
        }

        if (activeTab === 'history') {
            return (
                <>
                    <div className={`flex items-center gap-4 xl:gap-8 justify-end sm:justify-start flex-grow sm:flex-grow-0 ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                        <div className='flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300'>
                            <CheckSquare size={isMobile ? 12 : 14} className="text-success-500"/>
                            {stats?.total_appointments || 0} Appts
                        </div>
                        <div className='flex items-center gap-1.5 font-bold text-brand-600 dark:text-brand-400'>
                            <Star size={isMobile ? 12 : 14} className="text-brand-400 fill-current" />
                            {stats?.rating || '0.0'}
                        </div>
                    </div>
                </>
            );
        }

        // Default 'profile'
        return (
            <>
                <div className='flex items-center gap-6 shrink-0 min-w-[120px] justify-end sm:justify-start flex-grow sm:flex-grow-0'>
                    <span className={`group-hover:hidden ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1`}>
                        <Activity size={isMobile ? 12 : 14} /> {service_count} Services
                    </span>
                    {!isMobile && (
                        <div className='hidden group-hover:flex items-center gap-2'>
                            <button
                                className='p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-brand-500 transition-colors bg-gray-50 dark:bg-transparent'
                                title='View Details'
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all hover:z-10 ${
                !is_active ? 'bg-white dark:bg-white/[0.02]' : 'bg-brand-50/30 dark:bg-brand-500/5'
            }`}
        >
            {/* Desktop View (sm and up) aligned to NotificationRow structure */}
            <div className='hidden sm:flex items-center gap-4 w-full'>
                <div className='flex items-center gap-3 shrink-0 relative'>
                     <span className={`w-2.5 h-2.5 rounded-full ${is_active ? 'bg-success-500' : 'bg-gray-300 dark:bg-gray-600'}`} title={is_active ? 'Active' : 'Inactive'} />
                </div>

                <div className='w-48 lg:w-56 shrink-0 flex items-center gap-3'>
                    <div className='w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm border border-white dark:border-gray-800 shrink-0'>
                        {photo_url ? (
                            <img src={photo_url} alt={full_name} className='w-full h-full object-cover' />
                        ) : (
                            full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        )}
                    </div>
                    <span
                        className={`text-sm sm:text-base truncate ${!is_active ? 'text-gray-500 font-medium' : 'text-gray-900 dark:text-white font-bold'}`}
                    >
                        {full_name}
                    </span>
                </div>

                <div className='w-48 lg:w-56 shrink-0 flex items-center gap-3'>
                    <p className='text-sm sm:text-base truncate'>
                        <span
                            className={`${!is_active ? 'text-gray-600 dark:text-gray-400 font-medium' : 'text-gray-900 dark:text-white font-bold'}`}
                        >
                            {tier === 'both' ? 'General & Specialized Dentist' : tier === 'general' ? 'General Dentist' : 'Specialized Dentist'}
                        </span>
                        <span className='text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium ml-2'>
                            - {displayCategory}
                        </span>
                    </p>
                </div>

                <div className='flex-grow min-w-0 flex justify-end'>
                    {renderColumnContent()}
                </div>
            </div>

            {/* Mobile View (xs only) */}
            <div className='flex sm:hidden gap-4 w-full'>
                <div className='shrink-0'>
                    <div className='relative w-14 h-14 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden border border-brand-600'>
                       {photo_url ? (
                            <img src={photo_url} alt={full_name} className='w-full h-full object-cover' />
                        ) : (
                            full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        )}
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white dark:border-gray-900 ${is_active ? 'bg-success-500' : 'bg-gray-400'}`} />
                    </div>
                </div>
                <div className='flex-grow min-w-0 flex flex-col gap-0.5 justify-center'>
                    <div className='flex justify-between items-center'>
                        <span
                            className={`text-sm tracking-tight truncate ${!is_active ? 'text-gray-500' : 'text-gray-900 dark:text-white font-bold'}`}
                        >
                            {full_name}
                        </span>
                        <span className='text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded'>{tier}</span>
                    </div>
                    <div
                        className={`text-xs truncate ${!is_active ? 'text-gray-600' : 'text-gray-900 dark:text-white font-semibold'}`}
                    >
                        {tier === 'both' ? 'General & Specialized Dentist' : tier === 'general' ? 'General Dentist' : 'Specialized Dentist'}
                    </div>
                    <div className='flex justify-between items-end mt-1'>
                        <div className='text-[10px] text-gray-400 truncate pr-4 flex items-center gap-1'><ShieldCheck size={10}/> {license_number}</div>
                        {renderColumnContent(true)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorRow;
