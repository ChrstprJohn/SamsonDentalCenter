import React from 'react';
import { useParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import GlobalRegistryView from '../../components/admin/registry/GlobalRegistryView';

const GlobalRegistry = () => {
    const { mode } = useParams();
    
    // Default to 'upcoming' if mode is invalid or missing
    const activeMode = ['upcoming', 'today', 'history', 'displaced'].includes(mode) 
        ? mode 
        : 'upcoming';

    const getModeLabel = () => {
        switch (activeMode) {
            case 'today': return "Today's Schedule";
            case 'history': return "Clinical History";
            case 'displaced': return "Displaced Registry";
            case 'upcoming': return "Upcoming Appointments";
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
