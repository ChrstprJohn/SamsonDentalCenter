import React from 'react';
import { Calendar, ClipboardList, Clock } from 'lucide-react';
import StatCard from './StatCard';

const DashboardStats = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            <StatCard 
                title='Upcoming Appointment' 
                value='Oct 24, 2024' 
                icon={Clock} 
                color='success' 
            />
            <StatCard 
                title='Total Appointments' 
                value='12' 
                icon={Calendar} 
                color='brand' 
            />
            <StatCard 
                title='Waitlist Entries' 
                value='3' 
                icon={ClipboardList} 
                color='warning' 
            />
        </div>
    );
};

export default DashboardStats;
