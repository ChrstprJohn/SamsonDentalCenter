import React from 'react';
import { Search, UserPlus, Users } from 'lucide-react';
import PatientRow from './PatientRow';

const FILTERS = [
    { id: 'all', label: 'All Patients' },
    { id: 'regular', label: 'Regular' },
    { id: 'new', label: 'New' },
    { id: 'restricted', label: 'Restricted' },
];

const PatientInbox = ({ 
    patients = [], 
    onPatientClick, 
    searchQuery, 
    onSearchChange,
    activeFilter,
    onFilterChange,
    activeTab,
    onAddClick
}) => {
    // Mock data for skeleton
    const MOCK_PATIENTS = [
        { id: '1', full_name: 'Maria Santos', email: 'maria.santos@email.com', phone: '+63 917 123 4567', last_visit: 'Apr 12, 2026', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', status: 'Regular', balance: '₱ 0.00' },
        { id: '2', full_name: 'Juan Dela Cruz', email: 'juan.dc@email.com', phone: '+63 918 765 4321', last_visit: 'Mar 28, 2026', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan', status: 'New', balance: '₱ 1,200.00' },
        { id: '3', full_name: 'Isabella Garcia', email: 'isabella.g@email.com', phone: '+63 919 555 0000', last_visit: 'Feb 15, 2026', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella', status: 'Restricted', balance: '₱ 0.00' },
    ];

    const displayPatients = patients.length > 0 ? patients : MOCK_PATIENTS;

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
                            placeholder='Search patients by name, email, or phone...'
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
                        <span>Register Patient</span>
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
                {displayPatients.length > 0 ? (
                    displayPatients.map((patient) => (
                        <PatientRow 
                            key={patient.id} 
                            patient={patient} 
                            activeTab={activeTab}
                            onClick={() => onPatientClick(patient.id)} 
                        />
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center px-4'>
                        <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4'>
                            <Users size={32} />
                        </div>
                        <h4 className='text-lg font-bold text-gray-800 dark:text-white mb-1'>
                            No patients found
                        </h4>
                        <p className='text-sm text-gray-500 max-w-[280px]'>
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
            
            {/* Footer Area */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-5 border-t border-gray-100 dark:border-gray-800 sm:shadow-none'>
                <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
                    <div className='flex items-center justify-center w-full'>
                        <div className='flex gap-1'>
                            {[1, 2, 3].map(n => (
                                <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold leading-none flex items-center justify-center ${n === 1 ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-500 dark:bg-white/5'}`}>{n}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientInbox;
