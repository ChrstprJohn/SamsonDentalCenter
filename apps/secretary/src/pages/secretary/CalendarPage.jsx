import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { useDoctors } from '../../hooks/useDoctors';

// Components
import DoctorCard from '../../components/secretary/calendar/DoctorCard';
import DoctorProfileHeader from '../../components/secretary/calendar/DoctorProfileHeader';
import WeeklyRoutine from '../../components/secretary/calendar/WeeklyRoutine';
import UpcomingSchedule from '../../components/secretary/calendar/UpcomingSchedule';
import BlockDateModal from '../../components/secretary/calendar/BlockDateModal';
import BlockTimeModal from '../../components/secretary/calendar/BlockTimeModal';
import WeeklyScheduleModal from '../../components/secretary/calendar/WeeklyScheduleModal';

const CalendarPage = () => {
    const { tab, id } = useParams();
    const navigate = useNavigate();
    const activeView = tab || 'day';
    const selectedDoctorId = id;

    const { doctors, loading, error, fetchDoctorAppointments, fetchDoctorBlocks, fetchDoctorSchedule } = useDoctors();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [appointments, setAppointments] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // Modal states
    const [isBlockDateOpen, setIsBlockDateOpen] = useState(false);
    const [isBlockTimeOpen, setIsBlockTimeOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

    const loadDetails = async () => {
        if (selectedDoctorId) {
            try {
                setIsLoadingDetails(true);
                const [appData, blockData, scheduleData] = await Promise.all([
                    fetchDoctorAppointments(selectedDoctorId),
                    fetchDoctorBlocks(selectedDoctorId),
                    fetchDoctorSchedule(selectedDoctorId)
                ]);
                setAppointments(appData || []);
                setBlocks(blockData || []);
                setSchedule(scheduleData || []);
            } catch (err) {
                console.error('Failed to load clinician details:', err);
            } finally {
                setIsLoadingDetails(false);
            }
        }
    };

    React.useEffect(() => {
        loadDetails();
    }, [selectedDoctorId]);

    const filteredDoctors = doctors.filter(d => {
        const name = d.full_name || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (activeFilter === 'all') return true;
        return d.is_active === (activeFilter === 'active');
    });

    return (
        <div className="flex flex-col h-full">
            <PageBreadcrumb pageTitle={selectedDoctorId ? 'Clinician Schedule' : 'Schedules'} />

            <div className="grow mt-4 flex flex-col min-h-0">
                {loading && !doctors.length ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                    </div>
                ) : selectedDoctorId ? (
                    <div className="flex flex-col grow min-h-0 bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden no-scrollbar">
                        <div className="grow overflow-y-auto no-scrollbar">
                            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                                <DoctorProfileHeader 
                                    doctor={selectedDoctor} 
                                    onBack={() => navigate('/calendar')} 
                                />
                                
                                {(() => {
                                    const viewSwitcher = (
                                        <div className="flex bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-gray-800">
                                            {['day', 'week'].map(v => (
                                                <button 
                                                    key={v}
                                                    onClick={() => navigate(`/calendar/${v}/${selectedDoctorId}`)}
                                                    className={`px-4 py-2 text-xs font-bold rounded-lg uppercase transition-all ${activeView === v ? 'bg-white dark:bg-white/10 text-brand-500 shadow-sm' : 'text-gray-400'}`}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    );

                                    return activeView === 'week' ? (
                                        <WeeklyRoutine 
                                            schedule={schedule} 
                                            blocks={blocks} 
                                            onBlockDate={() => setIsBlockDateOpen(true)}
                                            onEditSchedule={() => setIsScheduleModalOpen(true)}
                                            viewSwitcher={viewSwitcher}
                                        />
                                    ) : (
                                        <UpcomingSchedule 
                                            appointments={appointments} 
                                            onBlockTime={() => setIsBlockTimeOpen(true)}
                                            viewSwitcher={viewSwitcher}
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map(doc => (
                            <DoctorCard 
                                key={doc.id}
                                doc={doc}
                                onSchedule={() => navigate(`/calendar/day/${doc.id}`)}
                                onEdit={() => navigate(`/calendar/day/${doc.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BlockDateModal isOpen={isBlockDateOpen} onClose={() => setIsBlockDateOpen(false)} doctor={selectedDoctor} blocks={blocks} onSave={loadDetails} />
            <BlockTimeModal isOpen={isBlockTimeOpen} onClose={() => setIsBlockTimeOpen(false)} doctor={selectedDoctor} blocks={blocks} onSave={loadDetails} />
            <WeeklyScheduleModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} doctor={selectedDoctor} schedule={schedule} onSave={loadDetails} />
        </div>
    );
};

export default CalendarPage;
