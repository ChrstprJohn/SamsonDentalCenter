import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DoctorInbox from '../../components/admin/doctors/DoctorInbox';
import AddDoctorModal from '../../components/admin/doctors/AddDoctorModal';
import DoctorDetailView from '../../components/admin/doctors/DoctorDetailView';
import { useSidebar } from '../../context/SidebarContext';
import { UserPlus } from 'lucide-react';
import { useDoctors } from '../../hooks/useDoctors';

const Doctors = () => {
    const { isMobileOpen } = useSidebar();
    const { tab, id } = useParams();
    const navigate = useNavigate();
    const activeTab = tab || 'profile';

    const { 
        doctors, 
        loading, 
        error, 
        updateDoctorProfile, 
        updateDoctorContact, 
        updateDoctorServices,
        onboardDoctor
    } = useDoctors();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const selectedDoctorId = id;
    const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

    // Filter Logic
    const filteredDoctors = doctors.filter(d => {
        const name = d.full_name || '';
        const license = d.license_number || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             license.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return d.is_active;
        if (activeFilter === 'inactive') return !d.is_active;
        if (activeFilter === 'specialized') return d.tier === 'specialized' || d.tier === 'both';
        if (activeFilter === 'general') return d.tier === 'general' || d.tier === 'both';

        return true;
    });

    const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    const breadcrumbTitle = selectedDoctorId ? `Doctor ${tabLabel}` : 'Doctors Registry';
    const parentName = selectedDoctorId ? 'Doctors' : null;
    const parentPath = selectedDoctorId ? '/doctors' : null;

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-red-500">
                    <p>Failed to load doctors: {error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-brand-500 text-white rounded">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='flex flex-col h-full'>
                <PageBreadcrumb 
                    pageTitle={breadcrumbTitle} 
                    parentName={parentName}
                    parentPath={parentPath}
                    className='mb-4'
                />

                <div className='flex flex-col grow'>
                    {selectedDoctorId ? (
                        <DoctorDetailView 
                            key={selectedDoctorId}
                            doctor={selectedDoctor} 
                            onBack={() => navigate(`/doctors/${activeTab}`)} 
                            activeTab={activeTab}
                            updateDoctorProfile={updateDoctorProfile}
                            updateDoctorContact={updateDoctorContact}
                            updateDoctorServices={updateDoctorServices}
                        />
                    ) : (
                        <DoctorInbox 
                            doctors={filteredDoctors}
                            onDoctorClick={(id) => navigate(`/doctors/${activeTab}/${id}`)}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                            onAddClick={() => setIsAddModalOpen(true)}
                        />
                    )}
                </div>
            </div>

            {/* Floating Action Button - Mobile Only - TEMPORARILY DISABLED */}

            <AddDoctorModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSubmit={onboardDoctor}
            />
        </>
    );
};

export default Doctors;
