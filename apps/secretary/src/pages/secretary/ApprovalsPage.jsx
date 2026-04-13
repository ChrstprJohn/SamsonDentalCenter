import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import ApprovalHeader from '../../components/secretary/approvals/ApprovalHeader';
import ApprovalInbox from '../../components/secretary/approvals/ApprovalInbox';
import ApprovalDetailView from '../../components/secretary/approvals_details/ApprovalDetailView';

const mockRequests = [
    {
        id: 1,
        patient: {
            name: "Juan Dela Cruz",
            phone: "+63 917 123 4567",
            email: "juan.dc@example.com",
            noShowCount: 2,
            cancellationCount: 1,
            isBookingRestricted: false
        },
        service: "Dental Implants",
        requestedDate: "2026-04-14",
        requestedTime: "10:00 AM",
        dentist: "Dr. Smith",
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30h ago (Stale)
    },
    {
        id: 2,
        patient: {
            name: "Maria Santos",
            phone: "+63 918 234 5678",
            email: "maria.s@example.com",
            noShowCount: 0,
            cancellationCount: 4,
            isBookingRestricted: true
        },
        service: "Surgical Extraction",
        requestedDate: "2026-04-14",
        requestedTime: "02:00 PM",
        dentist: "Dr. Garcia",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago (New)
    },
    {
        id: 3,
        patient: {
            name: "Rico Blanco",
            phone: "+63 919 345 6789",
            email: "rico.b@example.com",
            noShowCount: 1,
            cancellationCount: 0,
            isBookingRestricted: false
        },
        service: "Orthodontic Consultation",
        requestedDate: "2026-04-15",
        requestedTime: "09:30 AM",
        dentist: "Dr. Lopez",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48h ago (Stale)
    },
    {
        id: 4,
        patient: {
            name: "Anna Rivera",
            phone: "+63 920 456 7890",
            email: "anna.r@example.com",
            noShowCount: 0,
            cancellationCount: 0,
            isBookingRestricted: false
        },
        service: "Teeth Whitening",
        requestedDate: "2026-04-14",
        requestedTime: "03:00 PM",
        dentist: "Dr. Smith",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago (New)
    },
    {
        id: 5,
        patient: {
            name: "Carlos Mendoza",
            phone: "+63 921 567 8901",
            email: "carlos.m@example.com",
            noShowCount: 0,
            cancellationCount: 0,
            isBookingRestricted: false
        },
        service: "Routine Checkup",
        requestedDate: "2026-04-15",
        requestedTime: "11:00 AM",
        dentist: "Dr. Garcia",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1h ago (New)
    },
    {
        id: 6,
        patient: {
            name: "Lisa Manoban",
            phone: "+63 922 678 1234",
            email: "lisa.m@example.com",
            noShowCount: 1,
            cancellationCount: 0,
            isBookingRestricted: false
        },
        service: "Teeth Whitening",
        requestedDate: "2026-04-20",
        requestedTime: "10:30 AM",
        dentist: "Dr. Lopez",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 7,
        patient: {
            name: "Jennie Kim",
            phone: "+63 923 789 2345",
            email: "jennie.k@example.com",
            noShowCount: 0,
            cancellationCount: 0,
            isBookingRestricted: false
        },
        service: "Routine Checkup",
        requestedDate: "2026-04-22",
        requestedTime: "01:00 PM",
        dentist: "Dr. Garcia",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    }
];

const ApprovalsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [requests, setRequests] = useState(mockRequests);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState('All Services');
    const [selectedDoctor, setSelectedDoctor] = useState('All Doctors');
    
    // Set default date to tomorrow
    const [selectedDate, setSelectedDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);

    // Sync selectedId with URL 'id' param
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setSelectedId(parseInt(id));
        } else {
            setSelectedId(null);
        }
    }, [searchParams]);

    const handleApprove = (id) => {
        const reqToApprove = requests.find(r => r.id === id);
        if (!reqToApprove) return;
        setRequests(requests.filter(r => r.id !== id));
        if (selectedId === id) setSearchParams({});
        alert(`Request from ${reqToApprove.patient.name} approved!`);
    };

    const handleReject = (id, reason = 'No reason provided') => {
        const reqToReject = requests.find(r => r.id === id);
        if (!reqToReject) return;
        setRequests(requests.filter(r => r.id !== id));
        if (selectedId === id) setSearchParams({});
        alert(`Request from ${reqToReject.patient.name} rejected. Reason: ${reason}`);
    };

    const handleRowClick = (id) => {
        setSearchParams({ id: id.toString() });
    };

    const handleBack = () => {
        setSearchParams({});
    };

    // Filters and Search
    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesService = selectedService === 'All Services' || r.service === selectedService;
        const matchesDoctor = selectedDoctor === 'All Doctors' || r.dentist === selectedDoctor;
        const matchesDate = !selectedDate || r.requestedDate === selectedDate;
        
        if (!matchesSearch || !matchesService || !matchesDoctor || !matchesDate) return false;
        
        if (activeFilter === 'all') return true;
        
        const hours = (new Date() - new Date(r.createdAt)) / (1000 * 60 * 60);
        if (activeFilter === 'stale') return hours > 24;
        if (activeFilter === 'recent') return hours <= 24;
        
        return true;
    });

    const staleCount = requests.filter(r => {
        const hours = (new Date() - new Date(r.createdAt)) / (1000 * 60 * 60);
        return hours > 24;
    }).length;

    const newCount = requests.filter(r => {
        const hours = (new Date() - new Date(r.createdAt)) / (1000 * 60 * 60);
        return hours <= 24;
    }).length;

    const selectedRequest = requests.find(r => r.id === selectedId);

    // Dynamic breadcrumbs based on selection
    const breadcrumbTitle = selectedId ? 'Request Details' : 'Approvals';
    const parentName = selectedId ? 'Approvals' : null;
    const parentPath = selectedId ? '/approvals' : null;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="mb-6">
                <PageBreadcrumb 
                    pageTitle={breadcrumbTitle} 
                    parentName={parentName} 
                    parentPath={parentPath}
                />
            </div>

            {!selectedId && (
                <ApprovalHeader 
                    totalPending={requests.length}
                    newCount={newCount}
                    staleCount={staleCount}
                />
            )}

            {/* Dynamic View Panel */}
            <div className="flex-1 min-h-0 flex flex-col sm:mb-6">
                {selectedId ? (
                    <ApprovalDetailView 
                        request={selectedRequest}
                        onApprove={() => handleApprove(selectedId)}
                        onReject={(reason) => handleReject(selectedId, reason)}
                        onBack={handleBack}
                    />
                ) : (
                    <ApprovalInbox 
                        requests={filteredRequests}
                        allRequests={requests}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedService={selectedService}
                        onServiceChange={setSelectedService}
                        selectedDoctor={selectedDoctor}
                        onDoctorChange={setSelectedDoctor}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onRowClick={handleRowClick}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};

export default ApprovalsPage;
