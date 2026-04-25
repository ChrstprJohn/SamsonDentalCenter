import React from 'react';
import { Badge, Button } from '../../ui';

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

    const getActionVariant = (action) => {
        switch (action) {
            case 'CREATE': return 'success';
            case 'UPDATE': return 'primary';
            case 'DELETE': return 'danger';
            case 'LOGIN': return 'warning';
            default: return 'neutral';
        }
    };

    if (loading) {
        return (
            <div className='min-h-[400px] flex items-center justify-center bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-gray-800'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin' />
                    <p className='text-sm text-gray-500 font-medium'>Loading logs...</p>
                </div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className='min-h-[400px] flex items-center justify-center bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-gray-800'>
                <p className='text-sm text-gray-500 font-medium font-outfit uppercase tracking-widest opacity-60'>No audit logs found</p>
            </div>
        );
    }

    return (
        <div className='bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='border-b border-gray-50 dark:border-gray-800/50'>
                            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400'>Timestamp</th>
                            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400'>Actor</th>
                            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400'>Action</th>
                            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400'>Resource</th>
                            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right'>Details</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50 dark:divide-gray-800/20'>
                        {logs.map((log) => (
                            <tr key={log.id} className='group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors'>
                                <td className='px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400'>
                                    {formatTimestamp(log.created_at)}
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-bold text-gray-900 dark:text-white'>
                                            {log.actor?.full_name || 'System / Guest'}
                                        </span>
                                        <span className='text-[10px] font-medium text-gray-400 uppercase tracking-wider'>
                                            {log.actor?.role || 'automatic'}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    <Badge variant={getActionVariant(log.action)} className='text-[10px] font-black px-2 py-0.5'>
                                        {log.action}
                                    </Badge>
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight'>
                                            {log.resource_type}
                                        </span>
                                        <span className='text-[9px] font-medium text-gray-400 family-mono truncate max-w-[120px]'>
                                            {log.resource_id}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 text-right'>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => onViewDetails(log)}
                                        className='text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-500'
                                    >
                                        View Changes
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogTable;
