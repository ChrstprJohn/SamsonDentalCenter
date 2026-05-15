import React from 'react';
import { Input, Label } from '../../ui';

const AuditLogFilterBar = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    return (
        <div className='bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-800 rounded-2xl p-6 mb-8 shadow-sm'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                <div>
                    <h5 className='text-xs font-medium capitalize text-gray-400'>Timeline Filters</h5>
                    <p className='text-[12px] font-bold text-gray-500 capitalize mt-1'>Refine activity by action, resource, or date range.</p>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='space-y-1'>
                    <Label className='text-[12px] capitalize font-bold text-gray-400'>Action Type</Label>
                    <select
                        name='action'
                        value={filters.action}
                        onChange={handleChange}
                        className='w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold capitalize focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-white/10 transition-all cursor-pointer'
                    >
                        <option value="">All Actions</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                        <option value="LOGIN">Login</option>
                    </select>
                </div>

                <div className='space-y-1'>
                    <Label className='text-[12px] capitalize font-bold text-gray-400'>Resource Type</Label>
                    <select
                        name='resource_type'
                        value={filters.resource_type}
                        onChange={handleChange}
                        className='w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold capitalize focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-white/10 transition-all cursor-pointer'
                    >
                        <option value="">All Resources</option>
                        <option value="appointments">Appointments</option>
                        <option value="profiles">Profiles</option>
                        <option value="dentists">Dentists</option>
                        <option value="dentist_schedule">Schedules</option>
                        <option value="services">Services</option>
                    </select>
                </div>

                <div className='space-y-1'>
                    <Label className='text-[12px] capitalize font-bold text-gray-400'>From Date</Label>
                    <Input
                        type='date'
                        name='date_from'
                        value={filters.date_from}
                        onChange={handleChange}
                        className='h-11 text-xs font-bold capitalize border-gray-200 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]'
                    />
                </div>

                <div className='space-y-1'>
                    <Label className='text-[12px] capitalize font-bold text-gray-400'>To Date</Label>
                    <Input
                        type='date'
                        name='date_to'
                        value={filters.date_to}
                        onChange={handleChange}
                        className='h-11 text-xs font-bold capitalize border-gray-200 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]'
                    />
                </div>
            </div>
        </div>
    );
};

export default AuditLogFilterBar;
