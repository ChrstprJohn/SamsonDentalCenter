import React, { useEffect, useState } from 'react';
import { Modal, Button } from '../../ui';
import { X, ArrowRight } from 'lucide-react';
import { generateSmartDiff } from '../../../utils/auditUtils';

const AuditLogDiffModal = ({ isOpen, onClose, log, fetchDetails }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && log) {
            setLoading(true);
            fetchDetails(log.id)
                .then(data => setDetails(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setDetails(null);
        }
    }, [isOpen, log, fetchDetails]);

    if (!log) return null;

    const renderJsonValue = (val) => {
        if (val === null) return <span className="text-gray-400">null</span>;
        if (typeof val === 'object') return <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">{JSON.stringify(val, null, 2)}</pre>;
        return <span>{String(val)}</span>;
    };

    const smartChanges = details ? generateSmartDiff(details.old_values, details.new_values) : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className='max-w-4xl w-[95%]'>
            <div className='bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-800'>
                {/* Header */}
                <div className='px-10 py-8 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-transparent'>
                    <div>
                        <h4 className='text-xl sm:text-2xl font-medium text-gray-900 dark:text-white capitalize font-outfit'>
                            Change Analysis
                        </h4>
                        <p className='text-[12px] font-medium text-gray-400 capitalize mt-1'>
                            Audit Sequence Log ID: {log.id}
                        </p>
                    </div>
                    <Button variant='ghost' size='icon' onClick={onClose} className='w-11 h-11 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all'>
                        <X size={24} />
                    </Button>
                </div>

                {/* Content */}
                <div className='p-8 space-y-10'>
                    {loading ? (
                        <div className='flex flex-col items-center justify-center py-12 gap-3'>
                            <div className='w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin' />
                            <p className='text-xs text-gray-500 font-medium'>Fetching differences...</p>
                        </div>
                    ) : details ? (
                        <>
                            {/* Phase 3: Smart Diffing Summary */}
                            {smartChanges.length > 0 && (
                                <div className='space-y-6'>
                                    <div className='flex items-center gap-3'>
                                        <div className='h-4 w-1.5 bg-brand-500 rounded-full' />
                                        <h5 className='text-[11px] font-medium capitalize text-brand-600 dark:text-brand-400'>
                                            Human-Readable Analysis
                                        </h5>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {smartChanges.map((change, idx) => (
                                            <div key={idx} className='flex items-start gap-4 p-5 bg-white dark:bg-white/[0.01] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/30 transition-all'>
                                                <div className='mt-2 w-2 h-2 rounded-full bg-brand-500 shrink-0 shadow-lg shadow-brand-500/50' />
                                                <span className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-bold capitalize'>{change}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='h-4 w-1.5 bg-gray-300 dark:bg-gray-700 rounded-full' />
                                    <h5 className='text-[11px] font-medium capitalize text-gray-400'>
                                        Raw Structural Comparison
                                    </h5>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                                    {/* Old Values */}
                                    <div className='space-y-4'>
                                        <h5 className='text-[12px] font-medium capitalize text-gray-400 opacity-60'>
                                            Original State (Baseline)
                                        </h5>
                                        <div className='p-6 bg-gray-50 dark:bg-white/[0.01] rounded-2xl border border-gray-200 dark:border-gray-800 min-h-[200px] overflow-auto shadow-inner'>
                                            {renderJsonValue(details.old_values)}
                                        </div>
                                    </div>

                                    {/* New Values */}
                                    <div className='space-y-4 relative'>
                                        <h5 className='text-[12px] font-medium capitalize text-gray-400 opacity-60'>
                                            Revised State (Modified)
                                        </h5>
                                        <div className='p-6 bg-brand-50/30 dark:bg-brand-500/5 rounded-2xl border border-brand-200 dark:border-brand-500/20 min-h-[200px] overflow-auto shadow-inner'>
                                            {renderJsonValue(details.new_values)}
                                        </div>
                                        
                                        {/* Arrow indicator between columns on desktop */}
                                        <div className='hidden md:flex absolute -left-[35px] top-[60%] -translate-y-1/2 items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-brand-500 shadow-xl z-20'>
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className='text-center text-gray-500 py-12'>Failed to load data details.</p>
                    )}
                </div>

                {/* Footer */}
                <div className='px-10 py-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01] flex justify-end'>
                    <Button onClick={onClose} className='px-10 rounded-xl font-medium text-[11px] capitalize h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg active:scale-95 transition-all'>
                        Close Analysis View
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AuditLogDiffModal;
