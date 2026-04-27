import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Plus, Search, Filter } from 'lucide-react';
import { ServiceCard } from '../../components/services';
import { useServicesContext } from '../../context/ServicesContext';

import { useSidebar } from '../../context/SidebarContext';

// Extracted Filters configuration
const FILTERS = [
    { id: 'all', label: 'All Services' },
    { id: 'general', label: 'General' },
    { id: 'specialized', label: 'Specialized' },
];

const Services = () => {
    const { services, loading, error } = useServicesContext();
    const { isExpanded, isHovered } = useSidebar();
    const isSidebarOpen = isExpanded || isHovered;
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTier, setActiveTier] = useState('all');
    const [visibleCount, setVisibleCount] = useState(6);

    const filteredServices = useMemo(() => {
        return services.filter((s) => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTier = activeTier === 'all' || s.tier === activeTier;
            return matchesSearch && matchesTier;
        });
    }, [searchQuery, activeTier, services]);

    const displayedServices = filteredServices.slice(0, visibleCount);

    if (loading) return (
        <div className='flex items-center justify-center h-full'>
            <div className='animate-pulse text-gray-400 font-black uppercase tracking-widest text-xs'>
                Loading Catalog...
            </div>
        </div>
    );

    if (error) return (
        <div className='flex items-center justify-center h-full text-red-500'>
            Error: {error}
        </div>
    );

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb 
                pageTitle='Services Catalog' 
                className='mb-4'
            />

            <div className='flex flex-col grow'>
                <div className='flex-grow flex flex-col h-full bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-200 dark:border-gray-800 overflow-hidden'>
                    <header className='shrink-0'>
                        {/* Header / Search Area - Standardized with Doctor Registry */}
                        <div className='px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-800 space-y-4'>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='relative flex-grow'>
                                    <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                                        <Search size={18} />
                                    </span>
                                    <input
                                        type='text'
                                        placeholder='Search services by name or description...'
                                        className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-white/10 transition-all outline-none font-medium text-gray-900 dark:text-white'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button 
                                    className='hidden sm:flex items-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-all active:scale-95 shrink-0'
                                >
                                    <Plus size={16} />
                                    <span>Add Service</span>
                                </button>
                            </div>

                            {/* Filters */}
                            <div className='flex items-center gap-2 overflow-x-auto no-scrollbar pb-1'>
                                {FILTERS.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setActiveTier(filter.id)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                                            activeTier === filter.id
                                                ? 'bg-brand-500 text-white'
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    <main className='grow overflow-y-auto no-scrollbar p-0 sm:p-4 lg:p-6'>
                        {displayedServices.length > 0 ? (
                            <div className='space-y-0 sm:space-y-8'>
                                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarOpen ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-0 sm:gap-6`}>
                                    {displayedServices.map((service) => (
                                        <ServiceCard
                                            key={service.id}
                                            service={service}
                                        />
                                    ))}
                                </div>

                                {/* Load More Pagination */}
                                {visibleCount < filteredServices.length && (
                                    <div className='mt-8 flex justify-center pb-6'>
                                        <button
                                            onClick={() => setVisibleCount((prev) => prev + 6)}
                                            className='flex items-center gap-2 px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm active:scale-95'
                                        >
                                            Load More Services
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-24 text-center'>
                                <div className='w-24 h-24 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6 shadow-sm'>
                                    <Search size={40} />
                                </div>
                                <h4 className='text-lg font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                                    No Services Found
                                </h4>
                                <p className='text-xs text-gray-400 mt-2 max-w-[280px] font-medium leading-relaxed'>
                                    We couldn't find any service matches your current filter or search criteria.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Floating Action Button (Extended) */}
            <button 
                className='sm:hidden fixed bottom-6 right-6 h-11 px-5 bg-brand-500 text-white rounded-xl shadow-2xl flex items-center gap-2 active:scale-95 transition-all z-30 group'
                onClick={() => {/* Trigger Add Service Modal */}}
            >
                <Plus size={18} strokeWidth={3} />
                <span className='font-black uppercase tracking-widest text-[10px]'>Add Service</span>
            </button>
        </div>
    );
};

export default Services;
