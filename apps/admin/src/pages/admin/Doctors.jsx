import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DoctorInbox from '../../components/admin/doctors/DoctorInbox';
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
        updateDoctorServices 
    } = useDoctors();

    console.log("=== DOCTORS FETCHED ===", doctors);

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

    const breadcrumbTitle = selectedDoctorId ? 'Doctor Profile' : 'Doctors';
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
                            activeTab={activeTab}
                            doctors={filteredDoctors}
                            onDoctorClick={(id) => navigate(`/doctors/${activeTab}/${id}`)}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                        />
                    )}
                </div>
            </div>

            {/* Floating Action Button - Mobile Only (Hidden when sidebar is open) */}
            {!selectedDoctorId && !isMobileOpen && (
                <button
                    className='fixed bottom-20 right-5 sm:hidden z-50 flex items-center gap-2 px-5 py-3 bg-brand-500 text-white rounded-xl shadow-2xl shadow-brand-500/40 active:scale-95 transition-all outline-none border border-white/20'
                    onClick={() => console.log('Add Doctor')}
                >
                    <UserPlus size={18} strokeWidth={2.5} />
                    <span className='text-xs font-black uppercase tracking-wider'>Add Doctor</span>
                </button>
            )}
        </>
    );
};

export default Doctors;
