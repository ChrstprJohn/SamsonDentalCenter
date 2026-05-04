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
            <PageBreadcrumb pageTitle="System Audit Logs" className='mb-4' />
            
            <div className='flex flex-col grow min-h-0 bg-white dark:bg-white/[0.03] sm:rounded-2xl border-t sm:border border-gray-300 dark:border-gray-800 transition-all duration-300 overflow-hidden no-scrollbar shadow-sm'>
                {/* Identity Header */}
                <div className='bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800 px-6 sm:px-8 py-6 sm:py-8'>
                    <h3 className='text-[clamp(18px,2.2vw,22px)] font-black text-gray-900 dark:text-white uppercase tracking-tight font-outfit'>
                        Security & Audit Trail
                    </h3>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1'>
                        Comprehensive system-wide logging for compliance and integrity.
                    </p>
                </div>

                <div className='grow overflow-y-auto no-scrollbar p-6 sm:p-8 lg:p-10'>
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
                        <div className='mt-8 p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl'>
                            <p className='text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest'>Critical Exception</p>
                            <p className='text-sm font-bold text-red-500 mt-2'>{error}</p>
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
