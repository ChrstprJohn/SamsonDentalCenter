import React, { useState } from 'react';
import { Search, UserPlus, Users, Plus } from 'lucide-react';
import DoctorCard from './DoctorCard';
import { useSidebar } from '../../../context/SidebarContext';

const FILTERS = [
    { id: 'all', label: 'All Doctors' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'specialized', label: 'Specialized' },
    { id: 'general', label: 'General' },
];

const DoctorInbox = ({ 
    doctors, 
    onDoctorClick, 
    searchQuery, 
    onSearchChange,
    activeFilter,
    onFilterChange,
    onAddClick
}) => {
    const { isExpanded, isHovered } = useSidebar();
    const isSidebarOpen = isExpanded || isHovered;
    const [visibleCount, setVisibleCount] = useState(6);
    const hasMore = doctors.length > visibleCount;

    const handleShowMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    return (
        <div className='flex flex-col grow h-full bg-white dark:bg-white/[0.03] border-t sm:border border-gray-200 dark:border-gray-800 sm:rounded-xl overflow-hidden'>
            {/* 1. Header: Search & Filters */}
            <div className='px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-800 space-y-4 bg-white dark:bg-transparent'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='relative flex-grow'>
                        <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                            <Search size={18} />
                        </span>
                        <input
                            type='text'
                            placeholder='Search doctors by name or license...'
                            className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-white/10 transition-all outline-none font-medium text-gray-900 dark:text-white'
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={onAddClick}
                        className='hidden sm:flex items-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-all active:scale-95 shrink-0'
                    >
                        <Plus size={16} />
                        <span>Add Doctor</span>
                    </button>
                </div>
                
                <div className='flex items-center gap-2 overflow-x-auto no-scrollbar pb-1'>
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                                activeFilter === filter.id
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Grid Area */}
            <div className='flex-grow overflow-y-auto no-scrollbar'>
                {doctors.length > 0 ? (
                    <div className='p-0 sm:p-6 space-y-6'>
                        <div className={`grid grid-cols-1 md:grid-cols-2 ${isSidebarOpen ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-0 sm:gap-6`}>
                            {doctors.slice(0, visibleCount).map((doctor) => (
                                <DoctorCard 
                                    key={doctor.id} 
                                    doctor={doctor} 
                                    onClick={() => onDoctorClick(doctor.id)} 
                                />
                            ))}
                        </div>

                        {/* Show More Trigger */}
                        {hasMore && (
                            <div className='flex justify-center pt-4 sm:pt-8 pb-12 px-4 sm:px-0'>
                                <button 
                                    onClick={handleShowMore}
                                    className='w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white hover:border-brand-500 hover:text-brand-500 transition-all active:scale-95 shadow-sm'
                                >
                                    Show More Doctors
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center px-4'>
                        <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6'>
                            <Users size={32} />
                        </div>
                        <h4 className='text-lg font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight mb-2'>
                            No Doctors Found
                        </h4>
                        <p className='text-xs text-gray-500 uppercase font-bold tracking-widest max-w-[280px]'>
                            Adjust your filters or search query
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Mobile FAB (Extended) */}
            <button 
                className='sm:hidden fixed bottom-6 right-6 h-11 px-5 bg-brand-500 text-white rounded-xl shadow-2xl flex items-center gap-2 active:scale-95 transition-all z-30 group'
                onClick={onAddClick}
            >
                <Plus size={18} strokeWidth={3} />
                <span className='font-black uppercase tracking-widest text-[10px]'>Add Doctor</span>
            </button>
        </div>
    );
};

export default DoctorInbox;
