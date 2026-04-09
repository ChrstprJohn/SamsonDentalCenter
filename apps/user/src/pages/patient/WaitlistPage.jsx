import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import WaitlistOfferCard from '../../components/patient/waitlist/WaitlistOfferCard';
import WaitlistEmptyState from '../../components/patient/waitlist/WaitlistEmptyState';
import WaitlistTable from '../../components/patient/waitlist/WaitlistTable';
import ClaimSlotModal from '../../components/patient/waitlist/ClaimSlotModal';

const FILTERS = ['All', 'Pending', 'Offered', 'Claimed', 'Expired'];

const WaitlistPage = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleClaimClick = (slot) => {
        setSelectedSlot(slot || { service: 'Dental Cleaning', date: 'Oct 15, 2024', time: '10:00 AM' });
        setIsModalOpen(true);
    };

    return (
        <>
            <PageBreadcrumb pageTitle='Waitlist' />
            
            <div className='space-y-8'>
                {/* Featured State Section (Stacked for demo) */}
                <div className='grid gap-6'>
                    <WaitlistOfferCard onClaim={() => handleClaimClick()} />
                    <WaitlistEmptyState />
                </div>

                {/* List section */}
                <div className='space-y-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                        <div>
                            <h3 className='text-lg font-bold text-gray-800 dark:text-white font-outfit'>
                                Waitlist Requests
                            </h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                View and manage your requests for earlier slots.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className='flex bg-gray-100 dark:bg-white/[0.05] p-1 rounded-xl w-max'>
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                        activeFilter === f 
                                        ? 'bg-white dark:bg-gray-800 text-brand-500 shadow-sm' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <WaitlistTable activeFilter={activeFilter} onClaim={handleClaimClick} />
                </div>
            </div>

            <ClaimSlotModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                slot={selectedSlot}
            />
        </>
    );
};

export default WaitlistPage;
