import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import AuditLogFilterBar from '../../components/admin/audit/AuditLogFilterBar';
import AuditLogTable from '../../components/admin/audit/AuditLogTable';
import AuditLogPagination from '../../components/admin/audit/AuditLogPagination';
import AuditLogDiffModal from '../../components/admin/audit/AuditLogDiffModal';

const AuditLogs = () => {
    const { 
        logs, 
        metadata, 
        loading, 
        error, 
        filters, 
        updateFilter, 
        setPage, 
        getDetails 
    } = useAuditLogs();

    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedLog(null), 300);
    };

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb pageTitle="System Audit Logs" className='mb-6' />
            
            <div className='grow flex flex-col'>
                {/* Filter Bar */}
                <AuditLogFilterBar 
                    filters={filters} 
                    onFilterChange={updateFilter} 
                />

                {/* Main Table */}
                <AuditLogTable 
                    logs={logs} 
                    onViewDetails={handleViewDetails} 
                    loading={loading}
                />

                {/* Error State */}
                {error && (
                    <div className='mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl'>
                        <p className='text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest'>Error Loading Logs</p>
                        <p className='text-sm text-red-500 mt-1'>{error}</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && logs.length > 0 && (
                    <AuditLogPagination 
                        metadata={metadata} 
                        onPageChange={setPage} 
                    />
                )}
            </div>

            {/* Diff Modal */}
            <AuditLogDiffModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                log={selectedLog}
                fetchDetails={getDetails}
            />
        </div>
    );
};

export default AuditLogs;
