import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import StaffInbox from '../../components/admin/staff/StaffInbox';
import StaffDetailView from '../../components/admin/staff/StaffDetailView';

const Staff = () => {
    const { tab, id } = useParams();
    const navigate = useNavigate();
    const activeTab = tab || 'profile';

    // State for filtering (in real app, this would come from a hook like useStaff)
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    const breadcrumbTitle = id ? `Staff ${tabLabel}` : "Staff & Reception";

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb 
                pageTitle={breadcrumbTitle} 
                parentName={id ? "Staff & Reception" : null}
                parentPath={id ? "/staff" : null}
                className='mb-4' 
            />
            
            <div className='grow flex flex-col'>
                {id ? (
                    <StaffDetailView 
                        id={id}
                        activeTab={activeTab}
                        onBack={() => navigate('/staff')}
                    />
                ) : (
                    <StaffInbox 
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        activeTab={activeTab}
                        onAddClick={() => console.log('Add Staff Member clicked')}
                        onStaffClick={(staffId) => navigate(`/staff/${activeTab}/${staffId}`)}
                    />
                )}
            </div>
        </div>
    );
};

export default Staff;
