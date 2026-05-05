import React from 'react';
import { Button } from '../../ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AuditLogPagination = ({ metadata, onPageChange }) => {
    const { page, totalPages } = metadata;

    if (totalPages <= 1) return null;

    return (
        <div className='flex items-center justify-between mt-8 px-4 py-6 border-t border-gray-100 dark:border-gray-800'>
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>
                Page <span className='text-gray-900 dark:text-white'>{page}</span> of <span className='text-gray-900 dark:text-white'>{totalPages}</span>
            </p>
            <div className='flex items-center gap-2'>
                <Button
                    variant='outline'
                    size='sm'
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className='h-11 w-11 p-0 rounded-xl border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30'
                >
                    <ChevronLeft size={18} />
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className='h-11 w-11 p-0 rounded-xl border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30'
                >
                    <ChevronRight size={18} />
                </Button>
            </div>
        </div>
    );
};

export default AuditLogPagination;
