import React from 'react';
import { Badge } from '../../ui';

const WAITLIST_DATA = [
    {
        id: 1,
        service: 'Dental Cleaning',
        dentist: 'Dr. Sarah Smith',
        preferred_time: 'Mornings',
        status: 'Offered',
        date_requested: 'Oct 08, 2024',
        color: 'brand'
    },
    {
        id: 2,
        service: 'Tooth Extraction',
        dentist: 'Dr. John Doe',
        preferred_time: 'Afternoons',
        status: 'Pending',
        date_requested: 'Oct 07, 2024',
        color: 'warning'
    },
    {
        id: 3,
        service: 'Consultation',
        dentist: 'Dr. Sarah Smith',
        preferred_time: 'Anytime',
        status: 'Claimed',
        date_requested: 'Sep 30, 2024',
        color: 'success'
    },
    {
        id: 4,
        service: 'Routine Checkup',
        dentist: 'Dr. John Doe',
        preferred_time: 'Mornings',
        status: 'Expired',
        date_requested: 'Sep 25, 2024',
        color: 'error'
    },
];

const WaitlistTable = ({ activeFilter, onClaim }) => {
    const filtered = activeFilter === 'All' 
        ? WAITLIST_DATA 
        : WAITLIST_DATA.filter(i => i.status.toLowerCase() === activeFilter.toLowerCase());

    return (
        <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm'>
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01]'>
                            <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Service & Dentist</th>
                            <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Pref. Time</th>
                            <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Requested On</th>
                            <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Status</th>
                            <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                        {filtered.map((item) => (
                            <tr key={item.id} className='hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors'>
                                <td className='px-6 py-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-semibold text-gray-800 dark:text-white/90'>{item.service}</span>
                                        <span className='text-xs text-gray-400'>{item.dentist}</span>
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>{item.preferred_time}</span>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>{item.date_requested}</span>
                                </td>
                                <td className='px-6 py-4'>
                                    <Badge color={item.color}>
                                        {item.status}
                                    </Badge>
                                </td>
                                <td className='px-6 py-4 text-right'>
                                    {item.status === 'Offered' ? (
                                        <button 
                                            onClick={() => onClaim(item)}
                                            className='px-4 py-1.5 text-xs font-bold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors shadow-sm'
                                        >
                                            Claim
                                        </button>
                                    ) : item.status === 'Expired' ? (
                                        <span className='text-xs text-red-400 font-medium italic'>Timed out</span>
                                    ) : (
                                        <span className='text-xs text-gray-400 font-medium italic'>No action</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <p className='text-sm text-gray-400'>No waitlist requests found for this filter.</p>
                </div>
            )}
        </div>
    );
};

export default WaitlistTable;
