import React from 'react';
import { useParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import GlobalRegistryView from '../../components/admin/registry/GlobalRegistryView';

const GlobalRegistry = () => {
    const { mode } = useParams();
    
    // Default to 'upcoming' if mode is invalid or missing
    const activeMode = ['upcoming', 'today', 'history', 'displaced', 'pending'].includes(mode) 
        ? mode 
        : 'upcoming';

    const getModeLabel = () => {
        switch (activeMode) {
            case 'today': return "Today's Attendance";
            case 'pending': return "Approvals Inbox";
            case 'history': return "Clinical History";
            case 'displaced': return "Rescheduling Queue";
            case 'upcoming': return "Global Schedule";
            default: return "Global Registry";
        }
    };

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb
                pageTitle={getModeLabel()}
                className='mb-4'
            />

            <div className='flex flex-col grow'>
                <GlobalRegistryView mode={activeMode} />
            </div>
        </div>
    );
};

export default GlobalRegistry;
