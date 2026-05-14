import React from 'react';
import { Button } from '../../ui';
import { getFriendlyAction } from '../../../utils/auditUtils';

const AuditLogTable = ({ logs, onViewDetails, loading }) => {
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    const getActionColor = (action) => {
        if (action.includes('CREATE')) return 'bg-green-500';
        if (action.includes('UPDATE')) return 'bg-blue-500';
        if (action.includes('DELETE')) return 'bg-red-500';
        return 'bg-gray-400';
    };

    if (loading) {
        return (
            <div className='grow flex items-center justify-center'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin' />
                    <p className='text-xs text-gray-500 font-medium capitalize'>Loading Timeline...</p>
                </div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className='grow flex items-center justify-center opacity-40'>
                <p className='text-[12px] font-medium text-gray-400 capitalize'>No Activity Logged</p>
            </div>
        );
    }

    return (
        <div className='grow relative py-8'>
            {/* Vertical Line */}
            <div className='absolute left-[39px] top-0 bottom-0 w-[1px] bg-gray-300 dark:bg-gray-800' />

            <div className='space-y-12'>
                {logs.map((log, idx) => (
                    <div key={log.id} className='relative flex items-start gap-12 group'>
                        {/* Timeline Node */}
                        <div className='relative z-10'>
                            <div className={`w-[80px] h-[80px] rounded-2xl flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm group-hover:border-brand-500 transition-all duration-500`}>
                                <div className={`w-3 h-3 rounded-full ${getActionColor(log.action)} shadow-xl`} />
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className='grow grid grid-cols-1 lg:grid-cols-4 items-center gap-8 py-2'>
                            {/* Actor Details */}
                            <div className='lg:col-span-1'>
                                <h4 className='text-sm sm:text-lg font-medium text-gray-900 dark:text-white capitalize font-outfit leading-tight'>
                                    {log.actor_name || 'System / Guest'}
                                </h4>
                                <div className='flex items-center gap-3 mt-1.5'>
                                    <span className='text-[11px] font-medium text-brand-500 dark:text-brand-400 capitalize'>
                                        {log.actor_role || 'Auto'}
                                    </span>
                                    <div className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700' />
                                    <span className='text-[12px] font-bold text-gray-400 capitalize'>
                                        {formatTimestamp(log.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Summary (Friendly) */}
                            <div className='lg:col-span-2 bg-gray-50/50 dark:bg-white/[0.01] p-4 rounded-2xl border border-gray-100 dark:border-white/5'>
                                <div className='flex flex-wrap items-center gap-2'>
                                    <span className='text-[12px] font-medium text-gray-400 capitalize'>
                                        Successfully
                                    </span>
                                    <span className='text-sm font-medium text-gray-900 dark:text-white capitalize'>
                                        {getFriendlyAction(log.action)}
                                    </span>
                                    <span className='text-[12px] font-medium text-gray-400 capitalize'>
                                        for
                                    </span>
                                    <span className='text-[11px] font-medium text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-lg capitalize'>
                                        {log.resource_name}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='lg:col-span-1 flex justify-end'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => onViewDetails(log)}
                                    className='text-[12px] font-medium capitalize border-gray-200 dark:border-white/5 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 px-6 h-11 rounded-xl transition-all shadow-sm'
                                >
                                    Review Activity
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditLogTable;
