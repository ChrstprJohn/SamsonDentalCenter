import React from 'react';
import { Calendar, CheckCircle2, Users } from 'lucide-react';
import StatCard from './StatCard';

const DashboardStats = () => {
    return (
        <div className='flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-5 min-w-0'>
            <StatCard 
                title='Appointments Today' 
                value='5' 
                icon={Calendar} 
                color='brand' 
            />
            <StatCard 
                title='Checked In' 
                value='2' 
                icon={CheckCircle2} 
                color='success' 
            />
            <StatCard 
                title='Waiting' 
                value='1' 
                icon={Users} 
                color='warning' 
            />
            <StatCard 
                title='Completed' 
                value='0' 
                icon={CheckCircle2} 
                color='gray' 
            />
        </div>
    );
};

export default DashboardStats;
