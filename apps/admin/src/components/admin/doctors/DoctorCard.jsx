import React from 'react';
import { Phone, Mail, Calendar, ChevronRight, User } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';

const DoctorCard = ({ doctor, onClick }) => {
    const { isExpanded, isHovered } = useSidebar();
    const isSidebarOpen = isExpanded || isHovered; // Wider cards (2 columns)
    
    const { 
        full_name, 
        tier, 
        specialization, 
        is_active, 
        phone_number, 
        email, 
        photo_url 
    } = doctor;

    return (
        <div 
            onClick={onClick}
            className='group relative flex flex-row sm:flex-col bg-white dark:bg-white/[0.03] border-b sm:border border-gray-200 dark:border-gray-800 sm:rounded-xl overflow-hidden cursor-pointer transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.02] sm:hover:shadow-lg p-4 sm:p-6'
        >
            {/* Desktop View (Identical to Secretary + Actions) */}
            <div className='hidden sm:flex flex-col h-full'>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                        {/* Avatar */}
                        <div className='relative shrink-0'>
                            <div className='w-16 h-16 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 flex items-center justify-center bg-gray-100 dark:bg-gray-800 shadow-inner'>
                                {photo_url ? (
                                    <img 
                                        src={photo_url} 
                                        alt={full_name} 
                                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                                    />
                                ) : (
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`} 
                                        alt={full_name} 
                                        className='w-full h-full object-cover' 
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className={`font-bold ${isSidebarOpen ? 'sm:text-base lg:text-lg' : 'sm:text-[13px] lg:text-base'} text-gray-900 dark:text-white font-outfit uppercase tracking-tight transition-all duration-300 ease-in-out`}>
                                {full_name.startsWith('Dr.') ? full_name : `Dr. ${full_name}`}
                            </h3>
                            <p className={`text-[9px] ${isSidebarOpen ? 'sm:text-[11px]' : 'sm:text-[10px]'} text-brand-600 dark:text-brand-400 font-medium transition-all duration-300 ease-in-out uppercase tracking-widest`}>
                                {specialization || (tier === 'both' ? 'General & Specialist' : `${tier.charAt(0).toUpperCase() + tier.slice(1)} Dentist`)}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] ${isSidebarOpen ? 'lg:text-[11px]' : 'lg:text-[10px]'} font-bold uppercase tracking-wider transition-all duration-300 ease-in-out ${
                        is_active 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                            : 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'
                    }`}>
                        {is_active ? 'Active' : 'Inactive'}
                    </div>
                </div>

                {/* Contact Info */}
                <div className='mt-6 space-y-2.5 transition-all duration-300 ease-in-out'>
                    <div className='flex items-center gap-3 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out'>
                        <Phone size={14} className='opacity-70 shrink-0' />
                        <span className={`${isSidebarOpen ? 'lg:text-sm' : 'lg:text-xs'} transition-all duration-300 ease-in-out`}>{phone_number || '+1 (555) 000-0000'}</span>
                    </div>
                    <div className='flex items-center gap-3 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out'>
                        <Mail size={14} className='opacity-70 shrink-0' />
                        <span className={`truncate ${isSidebarOpen ? 'lg:text-sm' : 'lg:text-xs'} transition-all duration-300 ease-in-out`}>{email || `dr.${full_name.toLowerCase().replace(' ', '.')}@primera.com`}</span>
                    </div>
                </div>

                {/* Actions (Custom for Admin) */}
                <div className='mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 transition-all duration-300 ease-in-out'>
                    <button className={`flex-grow flex items-center justify-center gap-2 py-3 px-4 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-xl text-[9px] ${isSidebarOpen ? 'sm:text-[11px]' : 'sm:text-[10px]'} font-bold text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all active:scale-95 uppercase tracking-widest`}>
                        <Calendar size={14} className='text-brand-500/70 dark:text-brand-400/70' />
                        <span>Schedule</span>
                    </button>
                    <button className={`py-3 px-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-700 rounded-xl text-[9px] ${isSidebarOpen ? 'sm:text-[11px]' : 'sm:text-[10px]'} font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95 uppercase tracking-widest`}>
                        Edit
                    </button>
                </div>
            </div>

            {/* Mobile View (Horizontal - maintained from previous feedback) */}
            <div className='flex sm:hidden w-full gap-4 items-center'>
                <div className='relative shrink-0'>
                    <div className='w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800'>
                        {photo_url ? (
                            <img src={photo_url} alt={full_name} className='w-full h-full object-cover' />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-300 font-black text-xl'>
                                {full_name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {/* Floating Status Dot on Image */}
                    <div className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 shadow-sm transition-all duration-500 ${
                        is_active 
                            ? 'bg-emerald-500 animate-pulse' 
                            : 'bg-gray-300'
                    }`} />
                </div>
                <div className='flex-grow min-w-0 flex flex-col'>
                    <div className='flex items-center justify-between'>
                        <span className='text-[9px] font-black text-brand-600 uppercase tracking-widest'>{tier}</span>
                    </div>
                    <h3 className='text-base font-black text-gray-900 dark:text-white truncate font-outfit uppercase tracking-tight'>
                        {full_name}
                    </h3>
                    <p className='text-[9px] text-gray-400 font-bold uppercase tracking-widest'>{specialization}</p>
                </div>
                <div className='text-gray-300 shrink-0'>
                    <ChevronRight size={20} />
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
