import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import PatientInbox from '../../components/admin/patients/PatientInbox';
import PatientDetailView from '../../components/admin/patients/PatientDetailView';

const Patients = () => {
    const { tab, id } = useParams();
    const navigate = useNavigate();
    const activeTab = tab || 'profile';

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    const breadcrumbTitle = id ? `Patient ${tabLabel}` : "Patient Registry";

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb 
                pageTitle={breadcrumbTitle} 
                parentName={id ? "Patient Registry" : null}
                parentPath={id ? "/patients" : null}
                className='mb-4' 
            />
            
            <div className='grow flex flex-col'>
                {id ? (
                    <PatientDetailView 
                        patientId={id}
                        activeTab={activeTab}
                        onBack={() => navigate('/patients')}
                    />
                ) : (
                    <PatientInbox 
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        activeTab={activeTab}
                        onAddClick={() => console.log('Register Patient clicked')}
                        onPatientClick={(patientId) => navigate(`/patients/${activeTab}/${patientId}`)}
                    />
                )}
            </div>
        </div>
    );
};

export default Patients;
