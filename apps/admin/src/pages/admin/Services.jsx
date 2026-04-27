import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Plus, Search, Filter } from 'lucide-react';
import { ServiceCard, ServiceModal } from '../../components/services';

// Extracted Filters configuration
const FILTERS = [
    { id: 'all', label: 'All Services' },
    { id: 'general', label: 'General' },
    { id: 'specialized', label: 'Specialized' },
];

const Services = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTier, setActiveTier] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [visibleCount, setVisibleCount] = useState(20);

    // Mock data generators
    const MOCK_SERVICES = useMemo(
        () => [
            {
                id: 1,
                name: 'Oral Prophylaxis (Cleaning)',
                tier: 'general',
                cost: '1500',
                duration: '45m',
                auto_approve: true,
                image_url:
                    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop',
            },
            {
                id: 2,
                name: 'Composite Restoration',
                tier: 'general',
                cost: '2000',
                duration: '1h',
                auto_approve: true,
                image_url:
                    'https://images.unsplash.com/photo-1606811841660-1b51e9dd2d95?w=800&h=600&fit=crop',
            },
            {
                id: 3,
                name: 'Root Canal Therapy',
                tier: 'specialized',
                cost: '8000',
                duration: '1h 30m',
                auto_approve: false,
                image_url: null,
            },
            {
                id: 4,
                name: 'Orthodontic Braces',
                tier: 'specialized',
                cost: '45000',
                duration: '1h',
                auto_approve: false,
                image_url: null,
            },
            {
                id: 5,
                name: 'Dental Implants',
                tier: 'specialized',
                cost: '60000',
                duration: '2h',
                auto_approve: false,
                image_url: null,
            },
            {
                id: 6,
                name: 'Teeth Whitening',
                tier: 'general',
                cost: '12000',
                duration: '1h',
                auto_approve: true,
                image_url: null,
            },
            {
                id: 7,
                name: 'Tooth Extraction',
                tier: 'general',
                cost: '1500',
                duration: '30m',
                auto_approve: true,
                image_url: null,
            },
            {
                id: 8,
                name: 'Wisdom Tooth Surgery',
                tier: 'specialized',
                cost: '15000',
                duration: '1h 30m',
                auto_approve: false,
                image_url: null,
            },
        ],
        [],
    );

    const filteredServices = useMemo(() => {
        return MOCK_SERVICES.filter((s) => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTier = activeTier === 'all' || s.tier === activeTier;
            return matchesSearch && matchesTier;
        });
    }, [searchQuery, activeTier, MOCK_SERVICES]);

    const displayedServices = filteredServices.slice(0, visibleCount);

    return (
        <div className='flex flex-col h-full bg-gray-50/50 dark:bg-gray-900'>
            <div className='mb-4'>
                <PageBreadcrumb pageTitle='Services Catalog' />
            </div>

            <div className='flex-grow flex flex-col bg-white dark:bg-white/[0.03] sm:rounded-2xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
                {/* Toolbar */}
                <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-5 bg-white xl:sticky xl:top-0 z-20'>
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                        <div className='relative flex-grow w-full'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                                <Search size={18} />
                            </span>
                            <input
                                type='text'
                                placeholder='Search treatments by name...'
                                className='w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingService(null);
                                setIsModalOpen(true);
                            }}
                            className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-600 transition-all active:scale-95 shrink-0 shadow-xl shadow-brand-500/20'
                        >
                            <Plus
                                size={18}
                                strokeWidth={3}
                            />
                            <span>Add Service</span>
                        </button>
                    </div>

                    <div className='flex items-center gap-2 overflow-x-auto no-scrollbar pb-1'>
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveTier(filter.id)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTier === filter.id
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className='grow p-4 sm:p-6 bg-gray-50/50 dark:bg-transparent min-h-[500px]'>
                    {displayedServices.length > 0 ? (
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                            {displayedServices.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    onClick={(service) => {
                                        setEditingService(service);
                                        setIsModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-24 text-center'>
                            <div className='w-24 h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-sm'>
                                <Filter size={40} />
                            </div>
                            <h3 className='text-xl font-black text-gray-900 font-outfit uppercase tracking-tight'>
                                No Treatments Found
                            </h3>
                            <p className='text-sm text-gray-500 max-w-sm mt-2'>
                                Try adjusting your search criteria or tier filters to locate the
                                specific service.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Service Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                initialData={editingService}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingService(null);
                }}
            />
        </div>
    );
};

export default Services;
