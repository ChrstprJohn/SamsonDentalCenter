import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import WaitlistInbox from '../../components/patient/waitlist/WaitlistInbox';
import WaitlistDetailView from '../../components/patient/waitlist_details/WaitlistDetailView';
import ClaimSlotModal from '../../components/patient/waitlist/ClaimSlotModal';
import useWaitlist from '../../hooks/useWaitlist';
import { Clock } from 'lucide-react';

const WaitlistPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { 
        entries, 
        offers, 
        loading, 
        error, 
        cancel, 
        confirmOffer 
    } = useWaitlist();

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Sync selectedId with URL 'id' param
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setSelectedId(id);
        } else {
            setSelectedId(null);
        }
    }, [searchParams]);

    const handleEntryClick = (id) => {
        setSearchParams({ id });
    };

    const handleClaimClick = (slot) => {
        setSelectedSlot(slot);
        setIsClaimModalOpen(true);
    };

    const handleConfirmClaim = async (id) => {
        try {
            await confirmOffer(id);
            setIsClaimModalOpen(false);
            setSelectedSlot(null);
        } catch (err) {
            console.error('Failed to confirm offer:', err);
        }
    };

    const handleCancelEntry = async (id, options = {}) => {
        try {
            await cancel(id, options);
            // If the cancelled entry was selected, deselect it
            if (selectedId === id) {
                setSearchParams({});
            }
        } catch (err) {
            console.error('Failed to cancel entry:', err);
        }
    };

    // Filter Logic
    const filtered = entries.filter(item => {
        const matchesSearch = item.service_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const selectedEntry = entries.find(e => e.id === selectedId);

    // Dynamic breadcrumbs
    const breadcrumbTitle = selectedId ? 'Request Detail' : 'Waitlist';
    const parentName = selectedId ? 'Waitlist' : null;
    const parentPath = selectedId ? '/patient/waitlist' : null;

    if (loading && entries.length === 0) {
        return (
            <>
                <PageBreadcrumb pageTitle={breadcrumbTitle} />
                <div className='flex items-center justify-center grow py-20'>
                    <div className='animate-pulse flex flex-col items-center gap-4'>
                        <Clock size={40} className='text-gray-200 dark:text-gray-800' />
                        <div className='h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded-full' />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageBreadcrumb 
                pageTitle={breadcrumbTitle} 
                parentName={parentName} 
                parentPath={parentPath}
            />

            {error && (
                <div className='mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100'>
                    {error}
                </div>
            )}
            
            {selectedId ? (
                <div className='flex-grow min-h-0 relative sm:mx-0'>
                    <WaitlistDetailView 
                        item={selectedEntry}
                        onBack={() => setSearchParams({})}
                        onClaim={handleClaimClick}
                        onCancel={handleCancelEntry}
                    />
                </div>
            ) : (
                <WaitlistInbox 
                    entries={filtered}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onEntryClick={handleEntryClick}
                    selectedId={selectedId}
                    loading={loading}
                />
            )}

            <ClaimSlotModal 
                isOpen={isClaimModalOpen} 
                onClose={() => setIsClaimModalOpen(false)} 
                slot={selectedSlot}
                onConfirm={handleConfirmClaim}
                loading={loading}
            />
        </>
    );
};

export default WaitlistPage;
