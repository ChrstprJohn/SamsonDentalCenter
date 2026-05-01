import React from 'react';
import { ChevronRight, Activity, ShieldCheck, Clock, Calendar, CheckSquare, User } from 'lucide-react';

const PatientRow = ({ patient, onClick }) => {
    const { full_name, is_active, last_visit, patient_id, photo_url, appointments_count } = patient;

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all hover:z-10 ${
                !is_active ? 'bg-white dark:bg-white/[0.02]' : 'bg-brand-50/30 dark:bg-brand-500/5'
            }`}
        >
            {/* Desktop View (sm and up) */}
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
                            Patient ID: {patient_id}
                        </span>
                        <span className='text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium ml-2'>
                            - Last Visit: {last_visit || 'No visits'}
                        </span>
                    </p>
                </div>

                <div className='flex-grow min-w-0 flex justify-end'>
                    <div className='flex items-center gap-6 shrink-0 min-w-[120px] justify-end sm:justify-start flex-grow sm:flex-grow-0'>
                        <span className={`group-hover:hidden text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1`}>
                            <Activity size={14} /> {appointments_count || 0} Appointments
                        </span>
                        <div className='hidden group-hover:flex items-center gap-2'>
                            <button
                                className='p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-brand-500 transition-colors bg-gray-50 dark:bg-transparent'
                                title='View Details'
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
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
                        <span className='text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded'>ID: {patient_id}</span>
                    </div>
                    <div
                        className={`text-xs truncate ${!is_active ? 'text-gray-600' : 'text-gray-900 dark:text-white font-semibold'}`}
                    >
                        Last Visit: {last_visit || 'No visits'}
                    </div>
                    <div className='flex justify-between items-end mt-1'>
                        <div className='text-[10px] text-gray-400 truncate pr-4 flex items-center gap-1'><CheckSquare size={10}/> {appointments_count || 0} Appts</div>
                        <div className='flex items-center gap-6 shrink-0 min-w-[120px] justify-end sm:justify-start flex-grow sm:flex-grow-0'>
                            <span className={`group-hover:hidden text-[10px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1`}>
                                <Activity size={12} /> {appointments_count || 0} Appts
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRow;
