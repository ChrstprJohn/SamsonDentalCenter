import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import PatientInbox from '../../components/secretary/patients/PatientInbox';
import PatientDetailView from '../../components/secretary/patients/PatientDetailView';

const DUMMY_PATIENTS = [
    {
        id: '1',
        full_name: 'John Doe',
        is_active: true,
        patient_id: 'PAT-001',
        last_visit: '2026-04-15',
        appointments_count: 5,
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        email: 'john.doe@example.com',
        phone: '09123456789',
        gender: 'Male',
        age: 32,
        birthday: '1994-05-12',
        blood_type: 'O+',
        allergies: 'Penicillin, Peanuts',
        previous_treatments: ['Root Canal (2023)', 'Tooth Extraction (2021)'],
        insurance: { provider: 'PhilHealth', policy_number: '1234-5678-9012' },
        notes: 'Patient prefers morning appointments and is anxious about needles.'
    },
    {
        id: '2',
        full_name: 'Jane Smith',
        is_active: true,
        patient_id: 'PAT-002',
        last_visit: '2026-04-20',
        appointments_count: 3,
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        email: 'jane.smith@example.com',
        phone: '09223334444',
        gender: 'Female',
        age: 28,
        birthday: '1998-08-25',
        blood_type: 'A-',
        allergies: 'None recorded',
        previous_treatments: ['Teeth Whitening (2024)', 'Scaling & Polishing (2024)'],
        insurance: { provider: 'MaxiCare', policy_number: 'MAX-987654' },
        notes: 'Regular check-up patient.'
    },
    {
        id: '3',
        full_name: 'Bob Wilson',
        is_active: false,
        patient_id: 'PAT-003',
        last_visit: '2025-12-10',
        appointments_count: 12,
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        email: 'bob.wilson@example.com',
        phone: '09334445555',
        gender: 'Male',
        age: 45,
        birthday: '1981-02-03',
        blood_type: 'B+',
        allergies: 'Latex',
        previous_treatments: ['Dental Implants (2022)', 'Crown Placement (2022)'],
        insurance: { provider: 'Intellicare', policy_number: 'INT-554433' },
        notes: 'Complex dental history.'
    },
    {
        id: '4',
        full_name: 'Alice Johnson',
        is_active: true,
        patient_id: 'PAT-004',
        last_visit: null,
        appointments_count: 0,
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        email: 'alice.j@example.com',
        phone: '09445556666',
        gender: 'Female',
        age: 24,
        birthday: '2002-11-30',
        blood_type: 'O-',
        allergies: 'None recorded',
        previous_treatments: [],
        insurance: { provider: 'N/A', policy_number: 'N/A' },
        notes: 'New patient inquiry.'
    }
];

const PatientsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const selectedPatient = DUMMY_PATIENTS.find(p => p.id === selectedPatientId);

    const filteredPatients = DUMMY_PATIENTS.filter(p => {
        const matchesSearch = p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.patient_id.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return p.is_active;
        if (activeFilter === 'inactive') return !p.is_active;
        if (activeFilter === 'new') return p.appointments_count === 0;

        return true;
    });

    const breadcrumbTitle = selectedPatientId ? 'Patient File' : 'Patient Management';
    const parentName = selectedPatientId ? 'Patients' : null;
    const parentPath = selectedPatientId ? '/patients' : null;

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb 
                pageTitle={breadcrumbTitle} 
                parentName={parentName}
                parentPath={parentPath}
            />
            <div className='flex flex-col grow'>
                {selectedPatientId ? (
                    <PatientDetailView 
                        patient={selectedPatient}
                        onBack={() => setSelectedPatientId(null)}
                    />
                ) : (
                    <PatientInbox 
                        patients={filteredPatients}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        onPatientClick={(id) => setSelectedPatientId(id)}
                        onAddClick={() => console.log('Add patient clicked')}
                    />
                )}
            </div>
        </div>
    );
};


export default PatientsPage;

