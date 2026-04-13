import React, { useState } from 'react';
import CalendarToolbar from './CalendarToolbar';
import CalendarGrid from './CalendarGrid';
import { addDays, startOfWeek } from 'date-fns';

const DENTISTS = [
    { id: 'd1', name: 'Dr. Sarah Smith', color: '#465fff' },
    { id: 'd2', name: 'Dr. John Doe', color: '#12b76a' },
    { id: 'd3', name: 'Dr. Mike Ross', color: '#f79009' },
];

const MOCK_APPOINTMENTS = [
    {
        id: 1,
        dentistId: 'd1',
        patientName: 'Alice Cooper',
        service: 'Full Cleaning',
        start: new Date(2026, 3, 14, 8, 0), // April 14, 2026 8:00 AM
        duration: 120, // 2 hours
        type: 'confirmed'
    },
    {
        id: 2,
        dentistId: 'd2',
        patientName: 'Bob Builder',
        service: 'Tooth Extraction',
        start: new Date(2026, 3, 14, 10, 0),
        duration: 60,
        type: 'pending'
    },
    {
        id: 3,
        dentistId: 'd3',
        patientName: 'Charlie Sheen',
        service: 'Routine Checkup',
        start: new Date(2026, 3, 14, 14, 0),
        duration: 90, // 1.5 hours
        type: 'confirmed'
    },
    {
        id: 4,
        dentistId: 'd1',
        patientName: 'Diana Prince',
        service: 'Consultation',
        start: new Date(2026, 3, 14, 13, 0),
        duration: 60,
        type: 'confirmed'
    },
    {
        id: 5,
        dentistId: 'd2',
        patientName: 'Blocked Slot',
        service: 'Maintenance',
        start: new Date(2026, 3, 14, 15, 0),
        duration: 60,
        type: 'blocked'
    }
];

const Calendar = () => {
    const [viewMode, setViewMode] = useState('day'); // Switching to Day view as default as user liked it
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 3, 14)); // Target April 14
    const [visibleDentists, setVisibleDentists] = useState(new Set(DENTISTS.map(d => d.id)));

    const toggleDentist = (id) => {
        const newVisible = new Set(visibleDentists);
        if (newVisible.has(id)) {
            newVisible.delete(id);
        } else {
            newVisible.add(id);
        }
        setVisibleDentists(newVisible);
    };

    // Calculate dates to display
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start Monday
    const dates = viewMode === 'week' 
        ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
        : [selectedDate];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden">
            <CalendarToolbar 
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dentists={DENTISTS}
                visibleDentists={visibleDentists}
                toggleDentist={toggleDentist}
            />
            
            <div className="flex-1 overflow-hidden">
                <CalendarGrid 
                    viewMode={viewMode}
                    dates={dates}
                    dentists={DENTISTS.filter(d => visibleDentists.has(d.id))}
                    appointments={MOCK_APPOINTMENTS}
                />
            </div>
        </div>
    );
};

export default Calendar;
