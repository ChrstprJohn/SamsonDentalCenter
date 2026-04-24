import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const AuditLogs = () => {
    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb pageTitle="System Audit Logs" className='mb-4' />
            
            <div className='grow flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-white/[0.03] p-12 text-center'>
                <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight'>
                        System Audit & Logs
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 max-w-sm'>
                        This module is currently under architectural design. It will provide a comprehensive timeline of all administrative and medical actions in the system.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
