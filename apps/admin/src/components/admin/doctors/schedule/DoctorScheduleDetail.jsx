import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import WeeklyRoutine from './WeeklyRoutine';
import WeeklyTimeline from './WeeklyTimeline';
import BlockTimeModal from './BlockTimeModal';
import { useToast } from '../../../../context/ToastContext.jsx';

const DoctorScheduleDetail = ({ doctor }) => {
    const { showToast } = useToast();
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isTimeBlockModalOpen, setIsTimeBlockModalOpen] = useState(false);

    // Initial Sample Data (Synced across UI)
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const dayAfterStr = format(addDays(new Date(), 2), 'yyyy-MM-dd');

    const [events, setEvents] = useState([
        { date: todayStr, start: '09:30', duration: 45, service: 'Dental Cleaning', patient: 'John Doe', type: 'appointment' },
        { date: todayStr, start: '12:00', duration: 60, service: 'Lunch Break', patient: 'Staff', type: 'blocked' },
        { date: todayStr, start: '14:30', duration: 30, service: 'Quick Consult', patient: 'Liza Soberano', type: 'appointment' },
        { date: tomorrowStr, start: '10:00', duration: 90, service: 'Root Canal', patient: 'Jane Smith', type: 'appointment' },
        { date: tomorrowStr, start: '13:00', duration: 45, service: 'Audit Meeting', patient: 'Clinical Staff', type: 'blocked' },
        { date: tomorrowStr, start: '14:00', duration: 45, service: 'Checkup', patient: 'Mike Ross', type: 'appointment' },
        { date: dayAfterStr, start: '08:00', duration: 120, service: 'Surgery Prep', patient: 'Clinical Staff', type: 'blocked' },
        { date: dayAfterStr, start: '11:00', duration: 30, service: 'Quick Consult', patient: 'Harvey Specter', type: 'appointment' },
        { date: dayAfterStr, start: '15:30', duration: 60, service: 'Teeth Whitening', patient: 'Piolo Pascual', type: 'appointment' },
    ]);

    const handleApplyTimeBlocks = (date, blockedSlots, unblockedSlots, reason) => {
        setEvents(prev => {
            // 1. Remove unblocked slots
            let filtered = prev.filter(e => {
                const isTargetDate = e.date === date && e.type === 'blocked';
                if (!isTargetDate) return true;
                return !unblockedSlots.has(format(new Date().setHours(...e.start.split(':').map(Number)), 'h:mm a'));
            });

            // 2. Add new blocked slots
            const newBlocks = Array.from(blockedSlots).map(slot => {
                // Convert "8:00 AM" to "08:00"
                const [time, ampm] = slot.split(' ');
                let [h, m] = time.split(':').map(Number);
                if (ampm === 'PM' && h !== 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                const paddedH = String(h).padStart(2, '0');
                const paddedM = String(m).padStart(2, '0');

                return {
                    date,
                    start: `${paddedH}:${paddedM}`,
                    duration: 30, // Default to 30 for now or pass from modal
                    service: reason || 'Manual Block',
                    patient: 'Clinical Staff',
                    type: 'blocked'
                };
            });

            return [...filtered, ...newBlocks];
        });

        showToast('Schedule updated successfully.', 'success', 'Updated');
    };

    return (
        <div className='flex flex-col gap-6'>
            {/* Top row: The main weekly form */}
            <div className='w-full'>
                <WeeklyRoutine 
                    doctor={doctor} 
                    externalBlockModalOpen={isBlockModalOpen}
                    setExternalBlockModalOpen={setIsBlockModalOpen}
                />
            </div>

            {/* Bottom row: Weekly Timeline view */}
            <div className='w-full'>
                <WeeklyTimeline 
                    doctor={doctor} 
                    events={events}
                    onBlockClick={() => setIsTimeBlockModalOpen(true)}
                />
            </div>

            <BlockTimeModal 
                isOpen={isTimeBlockModalOpen}
                onClose={() => setIsTimeBlockModalOpen(false)}
                events={events}
                onSave={handleApplyTimeBlocks}
            />
        </div>
    );
};

export default DoctorScheduleDetail;

