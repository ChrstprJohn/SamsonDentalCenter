import React from 'react';
import { Calendar, Clock, Activity } from 'lucide-react';

const ScheduleMetrics = ({ doctor }) => {
    // Mock data - In a real app, these would be calculated from the doctor's schedule
    const metrics = [
        {
            label: 'Weekly Capacity',
            value: '40 Hours',
            subtext: 'Standard Routine',
            icon: Clock,
            color: 'text-brand-500',
            bg: 'bg-white dark:bg-white/[0.03]'
        },
        {
            label: 'Upcoming Time Off',
            value: 'Apr 25',
            subtext: '4 Days Blocked',
            icon: Calendar,
            color: 'text-success-500',
            bg: 'bg-white dark:bg-white/[0.03]'
        },
        {
            label: 'System Status',
            value: 'Active',
            subtext: 'Available for Routing',
            icon: Activity,
            color: 'text-brand-600 dark:text-brand-400',
            bg: 'bg-brand-50/50 dark:bg-brand-500/[0.02]',
            border: 'border-brand-200 dark:border-brand-500/30'
        }
    ];

    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            {metrics.map((m, i) => (
                <div 
                    key={i}
                    className={`p-[clamp(1rem,4vw,1.5rem)] border ${m.border || 'border-gray-200 dark:border-gray-800'} rounded-xl ${m.bg} space-y-2 flex flex-col ${i === 2 ? 'col-span-2 lg:col-span-1' : ''}`}
                >
                    <m.icon size={20} className={m.color} />
                    <h4 className='text-[clamp(1.25rem,4.5vw,1.5rem)] font-medium text-gray-900 dark:text-white font-outfit leading-tight'>
                        {m.value}
                    </h4>
                    <p className={`text-[clamp(9px,2vw,10px)] font-bold capitalize  ${m.color.includes('brand') && i === 2 ? 'opacity-70' : 'text-gray-400'}`}>
                        {m.label}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ScheduleMetrics;
