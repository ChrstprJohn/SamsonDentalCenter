import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DoctorInbox from '../../components/admin/doctors/DoctorInbox';
import DoctorDetailView from '../../components/admin/doctors/DoctorDetailView';
import { useSidebar } from '../../context/SidebarContext';
import { UserPlus } from 'lucide-react';

const MOCK_DOCTORS = [
    {
        id: '1',
        full_name: 'Dr. Sarah Smith',
        email: 'sarah.smith@primeradental.com',
        phone: '+1 (555) 123-4567',
        bio: 'Expert in restorative and cosmetic dentistry with over 12 years of experience. Dedicated to patient comfort and state-of-the-art dental care.',
        photo_url: null,
        tier: 'both', // general, specialized, or both
        specialization: 'Cosmetic Dentistry',
        license_number: 'DEN-98231',
        is_active: true,
        service_count: 8,
        services: ['Dental Cleaning', 'Root Canal', 'Teeth Whitening', 'X-Ray Scan', 'Filling', 'Extraction'],
        created_at: '2023-01-15T10:00:00Z',
        stats: {
            total_appointments: 1240,
            treatment_count: 850,
            rating: 4.9
        }
    },
    {
        id: '2',
        full_name: 'Dr. John Doe',
        email: 'john.doe@primeradental.com',
        phone: '+1 (555) 987-6543',
        bio: 'Specialized in orthodontics and oral surgery. Focuses on complex dental alignments and surgical extractions.',
        photo_url: null,
        tier: 'specialized',
        specialization: 'Orthodontics',
        license_number: 'DEN-77421',
        is_active: true,
        service_count: 5,
        services: ['Orthodontic Consult', 'Oral Surgery', 'Braces Adjustment', 'Invisalign Check'],
        created_at: '2023-06-20T10:00:00Z',
        stats: {
            total_appointments: 620,
            treatment_count: 410,
            rating: 4.7
        }
    },
    {
        id: '3',
        full_name: 'Dr. Emily Chen',
        email: 'emily.chen@primeradental.com',
        phone: '+1 (555) 444-5555',
        bio: 'General practitioner with a passion for pediatric dentistry and preventative care for all ages.',
        photo_url: null,
        tier: 'general',
        specialization: 'General Dentistry',
        license_number: 'DEN-11234',
        is_active: false,
        service_count: 12,
        services: ['Dental Cleaning', 'Teeth Whitening', 'X-Ray Scan', 'Fluoride Treatment', 'Sealants'],
        created_at: '2024-02-10T10:00:00Z',
        stats: {
            total_appointments: 150,
            treatment_count: 95,
            rating: 4.8
        }
    }
];

const Doctors = () => {
    const { isMobileOpen } = useSidebar();
    const { tab, id } = useParams();
    const navigate = useNavigate();
    const activeTab = tab || 'profile';

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const selectedDoctorId = id;
    const selectedDoctor = MOCK_DOCTORS.find(d => d.id === selectedDoctorId);

    // Filter Logic
    const filteredDoctors = MOCK_DOCTORS.filter(d => {
        const matchesSearch = d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             d.license_number.toLowerCase().includes(searchQuery.toLowerCase());
        
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
                            doctor={selectedDoctor} 
                            onBack={() => navigate(`/doctors/${activeTab}`)} 
                            activeTab={activeTab}
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
