import React, { useState, useEffect } from 'react';
import { useDoctors } from '../../../../hooks/useDoctors';
import { format, parseISO } from 'date-fns';

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'cancelled', label: 'Rejected' },
];

const DoctorHistoryDetail = ({ doctor }) => {
    const { fetchDoctorHistory } = useDoctors(false);
    const [history, setHistory] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, pages: 1, current_page: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadHistory = async () => {
            if (!doctor?.id) return;
            try {
                setIsLoading(true);
                setError(null);
                const result = await fetchDoctorHistory(doctor.id, { 
                    page: currentPage, 
                    limit: 10, 
                    status: activeFilter 
                });
                setHistory(result.appointments || []);
                setPagination(result.pagination || { total: 0, pages: 1, current_page: 1 });
            } catch (err) {
                console.error('Failed to load doctor history:', err);
                setError('Failed to load clinical history records.');
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [doctor?.id, fetchDoctorHistory, activeFilter, currentPage]);

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setCurrentPage(1); // Reset to first page
    };

    const getStatusStyle = (status) => {
        const s = (status || '').toUpperCase();
        if (s === 'COMPLETED') return 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
        if (s === 'CANCELLED' || s === 'LATE_CANCEL' || s === 'REJECTED') return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10 border-red-100 dark:border-red-500/20';
        if (s === 'NO_SHOW' || s === 'PENDING') return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
        if (s === 'UPCOMING' || s === 'APPROVED') return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
        return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20';
    };

    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03] flex flex-col'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                            Clinical Registry
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            Total: {pagination.total} Records Found
                        </p>
                    </div>
                    <div className='flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[50%] sm:max-w-none'>
                        {FILTERS.map(f => (
                            <button
                                key={f.id}
                                onClick={() => handleFilterChange(f.id)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all shrink-0 ${
                                    activeFilter === f.id 
                                        ? 'bg-brand-500 text-white shadow-sm' 
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className='grow min-h-[400px] flex flex-col justify-between'>
                    {isLoading ? (
                        <div className='py-20 flex flex-col items-center justify-center'>
                            <div className='w-5 h-5 border-2 border-slate-200 dark:border-white/10 border-t-slate-500 dark:border-t-white/40 rounded-full animate-spin mb-4' />
                            <span className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Syncing Registry...</span>
                        </div>
                    ) : error ? (
                        <div className='py-20 text-center'>
                            <p className='text-sm font-medium text-red-600 dark:text-red-400 mb-2'>{error}</p>
                            <button onClick={() => setCurrentPage(prev => prev)} className='text-xs font-bold text-red-700 dark:text-red-300 underline'>Retry</button>
                        </div>
                    ) : history.length > 0 ? (
                        <div className='overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800'>
                            <div className='divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent'>
                                {history.map((appt) => (
                                    <div key={appt.id} className='px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors'>
                                        <div className='flex items-center gap-3'>
                                            <div className='hidden sm:flex w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center font-bold text-xs text-brand-500'>
                                                {(appt.patient?.name || 'P').split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className='text-sm font-semibold text-gray-900 dark:text-white/90'>{appt.patient?.name || 'Anonymous Patient'}</p>
                                                <p className='text-[11px] font-medium text-gray-500'>{appt.service || 'General Service'}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between sm:flex-col sm:items-end gap-1'>
                                            <p className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
                                                {appt.date ? format(parseISO(appt.date), 'MMM dd, yyyy') : 'No Date'}
                                            </p>
                                            <div className='flex items-center gap-2'>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${getStatusStyle(appt.status)}`}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center'>
                            <p className='text-sm font-medium text-gray-400'>No records found for this filter.</p>
                            <button onClick={() => setActiveFilter('all')} className='text-xs font-bold text-brand-500 mt-2 hover:underline'>Clear Filters</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1.5'>
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || isLoading}
                                className='p-2 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all'
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <div className='flex items-center gap-1'>
                                {Array.from({ length: pagination.pages }).map((_, i) => {
                                    const p = i + 1;
                                    // Basic logic to show limited pages if many
                                    if (pagination.pages > 5 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== pagination.pages) return null;
                                    
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                                currentPage === p 
                                                    ? 'bg-brand-500 text-white shadow-sm' 
                                                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                                disabled={currentPage === pagination.pages || isLoading}
                                className='p-2 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all'
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorHistoryDetail;
