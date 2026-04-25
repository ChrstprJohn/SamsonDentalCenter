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
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-widest'>Loading Timeline...</p>
                </div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className='grow flex items-center justify-center opacity-40'>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>No Activity Logged</p>
            </div>
        );
    }

    return (
        <div className='grow relative py-4'>
            {/* Vertical Line */}
            <div className='absolute left-[31px] top-0 bottom-0 w-[1px] bg-gray-100 dark:bg-gray-800' />

            <div className='space-y-12'>
                {logs.map((log, idx) => (
                    <div key={log.id} className='relative flex items-start gap-10 group'>
                        {/* Timeline Node */}
                        <div className='relative z-10'>
                            <div className={`w-[62px] h-[62px] rounded-2xl flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm group-hover:border-brand-500/50 transition-all duration-300`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${getActionColor(log.action)} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className='grow grid grid-cols-1 md:grid-cols-4 items-center gap-6'>
                            {/* Actor Details */}
                            <div className='md:col-span-1'>
                                <h4 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight font-outfit'>
                                    {log.actor_name || 'System / Guest'}
                                </h4>
                                <div className='flex items-center gap-2 mt-1'>
                                    <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                                        {log.actor_role || 'Auto'}
                                    </span>
                                    <div className='w-1 h-1 rounded-full bg-gray-300' />
                                    <span className='text-[10px] font-medium text-gray-500'>
                                        {formatTimestamp(log.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Summary (Friendly) */}
                            <div className='md:col-span-2'>
                                <div className='flex flex-wrap items-baseline gap-1.5'>
                                    <span className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
                                        Successfully
                                    </span>
                                    <span className='text-sm font-bold text-gray-900 dark:text-white'>
                                        {getFriendlyAction(log.action)}
                                    </span>
                                    <span className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
                                        for
                                    </span>
                                    <span className='text-sm font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-lg'>
                                        {log.resource_name}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='md:col-span-1 flex justify-end'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => onViewDetails(log)}
                                    className='text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-500 hover:bg-brand-500/5 group/btn border border-transparent hover:border-brand-500/20 px-4 h-9 rounded-xl transition-all'
                                >
                                    Review Details
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
