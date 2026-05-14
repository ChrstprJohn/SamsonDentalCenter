import React from 'react';
import { ChevronRight, Calendar, User, Phone, Mail, ShieldAlert, CreditCard } from 'lucide-react';

const PatientRow = ({ patient, onClick, activeTab }) => {
    const { full_name, email, phone, last_visit, status, avatar_url, balance, is_registered, is_booking_restricted, is_active } = patient;

    const renderColumnContent = (isMobile = false) => {
        if (activeTab === 'financial') {
            return (
                <div className={`flex items-center gap-1.5 ${isMobile ? 'text-[12px]' : 'text-[13px]'} font-medium ${balance === '₱ 0.00' ? 'text-success-600' : 'text-red-500'}`}>
                    <CreditCard size={isMobile ? 14 : 16} /> 
                    {balance}
                </div>
            );
        }

        if (activeTab === 'records') {
            return (
                <div className={`flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300 ${isMobile ? 'text-[12px]' : 'text-[13px]'}`}>
                    <Calendar size={isMobile ? 14 : 16} className="text-brand-500"/>
                    Last: {last_visit || 'No visits'}
                </div>
            );
        }

        // Default 'profile'
        return (
            <div className='flex items-center gap-6 shrink-0 min-w-[120px] justify-end sm:justify-start flex-grow sm:flex-grow-0'>
                <span className={`${isMobile ? 'text-[12px]' : 'text-[13px]'} text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1`}>
                    Ref: {patient.id.substring(0, 8)}
                </span>
            </div>
        );
    };

    const getStandardizedStatus = () => {
        if (is_registered) {
            return is_active === false ? 'Inactive Account' : 'Active Account';
        }
        if (email) return 'Inactive Account';
        return 'Offline Profile';
    };

    const displayStatus = getStandardizedStatus();

    return (
        <div
            onClick={onClick}
            className={`group relative border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.02] ${
                is_booking_restricted ? 'bg-red-50/30 dark:bg-red-500/5' : 'bg-white dark:bg-white/[0.01]'
            }`}
        >
            {/* Desktop View (High Density Stacked) */}
            <div className='hidden sm:flex items-center px-6 py-4 gap-8'>
                {/* Profile Block */}
                <div className='w-56 lg:w-64 shrink-0 flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-800 shrink-0 relative'>
                        {avatar_url ? (
                            <img src={avatar_url} alt={full_name} className='w-full h-full object-cover' />
                        ) : (
                            <User size={20} />
                        )}
                        <span className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${is_booking_restricted ? 'bg-red-500' : (is_registered && is_active !== false) ? 'bg-success-500' : email ? 'bg-brand-400' : 'bg-gray-300'}`} />
                    </div>
                    <div className='flex flex-col min-w-0'>
                        <span className={`text-[15px] font-medium truncate ${is_booking_restricted ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                            {full_name}
                        </span>
                    </div>
                </div>

                {/* Account Status Block */}
                <div className='w-48 lg:w-56 shrink-0 flex flex-col'>
                    <span className={`text-[13px] font-medium leading-none mb-1.5 ${is_registered ? 'text-success-600' : email ? 'text-brand-600' : 'text-gray-500'}`}>
                        {displayStatus}
                    </span>
                    <span className='text-[12px] font-medium text-gray-400 dark:text-gray-500 truncate'>
                        {email || 'No email registered'}
                    </span>
                </div>

                {/* Contextual Action Block */}
                <div className='grow flex justify-end items-center gap-4'>
                    {renderColumnContent()}
                    <ChevronRight size={14} className='text-gray-300 group-hover:text-brand-500 transition-colors' />
                </div>
            </div>

            {/* Mobile View (Full Width Card Style) */}
            <div className='sm:hidden p-5 flex flex-col gap-4'>
                {/* Top: Name & Status */}
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-800 shrink-0 relative'>
                            {avatar_url ? (
                                <img src={avatar_url} alt={full_name} className='w-full h-full object-cover' />
                            ) : (
                                <User size={20} />
                            )}
                            <span className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${is_booking_restricted ? 'bg-red-500' : (is_registered && is_active !== false) ? 'bg-success-500' : email ? 'bg-brand-500' : 'bg-gray-400'}`} />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-[11px] font-medium text-gray-500 mb-1'>Patient Name</span>
                            <span className={`text-[14px] font-medium  ${is_booking_restricted ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>{full_name}</span>
                        </div>
                    </div>
                    <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-lg shadow-sm ${
                        (is_registered && is_active !== false) ? 'bg-success-50 text-success-600 border border-success-100/80 dark:bg-success-500/10 dark:border-success-500/20' : email ? 'bg-brand-50 text-brand-600 border border-brand-100/80 dark:bg-brand-500/10 dark:border-brand-500/20' : 'bg-gray-50 text-gray-500 border border-gray-200/80 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'
                    }`}>
                        {displayStatus.split(' ')[0]}
                    </span>
                </div>

                {/* Middle: Contact Info */}
                <div className='grid grid-cols-2 gap-4 py-3 border-y border-gray-50 dark:border-gray-800/50'>
                    <div className='flex flex-col'>
                        <span className='text-[11px] font-medium text-gray-500 mb-1'>Phone</span>
                        <span className='text-[13px] font-medium text-gray-900 dark:text-gray-100'>{phone || 'N/A'}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[11px] font-medium text-gray-500 mb-1'>Email Address</span>
                        <span className='text-[13px] font-medium text-gray-500 truncate'>{email || 'None'}</span>
                    </div>
                </div>

                {/* Bottom: Contextual Data */}
                <div className='flex justify-between items-end'>
                    <div className='flex flex-col'>
                        <span className='text-[11px] font-medium text-gray-500 mb-1'>Patient Reference</span>
                        <span className='text-[13px] font-medium text-gray-500'>Ref: {patient.id.substring(0, 8)}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        {renderColumnContent(true)}
                        <ChevronRight size={14} className='text-gray-300' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRow;
