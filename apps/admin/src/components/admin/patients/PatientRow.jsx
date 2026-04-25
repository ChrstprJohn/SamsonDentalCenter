import React from 'react';
import { ChevronRight, Calendar, User, Phone, Mail, ShieldAlert, CreditCard } from 'lucide-react';

const PatientRow = ({ patient, onClick, activeTab }) => {
    const { full_name, email, phone, last_visit, status, avatar_url, balance } = patient;

    const renderColumnContent = (isMobile = false) => {
        if (activeTab === 'financial') {
            return (
                <div className={`flex items-center gap-1.5 ${isMobile ? 'text-[10px]' : 'text-xs'} font-bold ${balance === '₱ 0.00' ? 'text-success-600' : 'text-red-500'}`}>
                    <CreditCard size={isMobile ? 12 : 14} /> 
                    {balance}
                </div>
            );
        }

        if (activeTab === 'records') {
            return (
                <div className={`flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    <Calendar size={isMobile ? 12 : 14} className="text-brand-500"/>
                    Last: {last_visit}
                </div>
            );
        }

        // Default 'profile'
        return (
            <div className='flex items-center gap-6 shrink-0 min-w-[120px] justify-end sm:justify-start flex-grow sm:flex-grow-0'>
                <span className={`group-hover:hidden ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1`}>
                    Ref: {patient.id.substring(0, 8)}
                </span>
                {!isMobile && (
                    <div className='hidden group-hover:flex items-center gap-2'>
                        <button
                            className='p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-brand-500 transition-colors bg-gray-50 dark:bg-transparent'
                            title='View Records'
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all hover:z-10 bg-white dark:bg-white/[0.02]`}
        >
            {/* Desktop View */}
            <div className='hidden sm:flex items-center gap-4 w-full'>
                <div className='flex items-center gap-3 shrink-0 relative'>
                     <span className={`w-2.5 h-2.5 rounded-full ${status === 'Regular' ? 'bg-success-500' : 'bg-amber-400'}`} title={status} />
                </div>

                <div className='w-48 lg:w-56 shrink-0 flex items-center gap-3'>
                    <div className='w-11 h-11 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 font-bold text-sm border border-white dark:border-gray-800 shrink-0'>
                        {avatar_url ? (
                            <img src={avatar_url} alt={full_name} className='w-full h-full object-cover' />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                    <span className={`text-sm sm:text-base truncate text-gray-900 dark:text-white font-bold`}>
                        {full_name}
                    </span>
                </div>

                <div className='w-48 lg:w-56 shrink-0 flex items-center gap-3'>
                    <p className='text-sm sm:text-base truncate'>
                        <span className={`text-gray-900 dark:text-white font-bold`}>
                            {status} Patient
                        </span>
                        <span className='text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium ml-2'>
                            - {email}
                        </span>
                    </p>
                </div>

                <div className='flex-grow min-w-0 flex justify-end'>
                    {renderColumnContent()}
                </div>
            </div>

            {/* Mobile View */}
            <div className='flex sm:hidden gap-4 w-full'>
                <div className='shrink-0'>
                    <div className='relative w-14 h-14 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 font-bold text-xl overflow-hidden border border-gray-200 dark:border-gray-800'>
                       {avatar_url ? (
                            <img src={avatar_url} alt={full_name} className='w-full h-full object-cover' />
                        ) : (
                            <User size={24} />
                        )}
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white dark:border-gray-900 ${status === 'Regular' ? 'bg-success-500' : 'bg-amber-500'}`} />
                    </div>
                </div>
                <div className='flex-grow min-w-0 flex flex-col gap-0.5 justify-center'>
                    <div className='flex justify-between items-center'>
                        <span className={`text-sm tracking-tight truncate text-gray-900 dark:text-white font-bold`}>
                            {full_name}
                        </span>
                        <span className='text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded'>{status}</span>
                    </div>
                    <div className='text-xs truncate text-gray-500'>{phone}</div>
                    <div className='flex justify-between items-end mt-1'>
                        <div className='text-[10px] text-gray-400 truncate pr-4 flex items-center gap-1'><Mail size={10}/> {email}</div>
                        {renderColumnContent(true)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRow;
