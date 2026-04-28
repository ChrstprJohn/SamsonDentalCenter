import React from 'react';
import { Search, UserPlus, SlidersHorizontal, Users } from 'lucide-react';
import DoctorRow from './DoctorRow';

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
    activeTab,
    onAddClick
}) => {
    return (
        <div className='flex-grow flex flex-col h-full bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden'>
            {/* Header / Search Area */}
            <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='relative flex-grow'>
                        <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                            <Search size={18} />
                        </span>
                        <input
                            type='text'
                            placeholder='Search doctors by name or license...'
                            className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-white/10 transition-all outline-none font-medium'
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={onAddClick}
                        className='hidden sm:flex items-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-all active:scale-95 shrink-0'
                    >
                        <UserPlus size={16} />
                        <span>Add Doctor</span>
                    </button>
                </div>

                {/* Filters */}
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

            {/* List Area */}
            <div className='grow flex flex-col min-h-120 md:min-h-140 overflow-y-auto no-scrollbar'>
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <DoctorRow 
                            key={doctor.id} 
                            doctor={doctor} 
                            activeTab={activeTab}
                            onClick={() => onDoctorClick(doctor.id)} 
                        />
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center px-4'>
                        <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4'>
                            <Users size={32} />
                        </div>
                        <h4 className='text-lg font-bold text-gray-800 dark:text-white mb-1'>
                            No doctors found
                        </h4>
                        <p className='text-sm text-gray-500 max-w-[280px]'>
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
            
            {/* Footer Area / Consistency with AppointmentPagination */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-5 border-t border-gray-100 dark:border-gray-800 sm:shadow-none'>
                <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
                    <div className='flex items-center justify-center w-full sm:justify-center'>
                        <div className='flex justify-center'>
                            <div className='flex gap-1'>
                                {[1].map(n => (
                                    <button key={n} className='w-8 h-8 rounded-lg bg-brand-500 text-white text-xs font-bold leading-none flex items-center justify-center'>{n}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorInbox;
