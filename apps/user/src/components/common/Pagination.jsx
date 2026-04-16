import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // We show the pagination if there is at least something to show, 
    // or if we want to maintain the footer height consistency.
    if (totalPages < 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];

        // Always show the current page
        // And its neighbors if they exist
        const hasPrev = currentPage > 1;
        const hasNext = currentPage < totalPages;

        if (currentPage <= 2) {
            // Near start: 1, 2, 3, ...
            pages.push(1, 2, 3, '...');
        } else if (currentPage >= totalPages - 1) {
            // Near end: ..., 8, 9, 10
            pages.push('...', totalPages - 2, totalPages - 1, totalPages);
        } else {
            // Middle: ... 2 3 4 ...
            pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
        }

        return pages;
    };

    return (
        <div className='flex items-center justify-center gap-1 sm:gap-2 mt-0'>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className='w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-700 transition-all active:scale-95 shadow-sm'
                aria-label='Previous Page'
            >
                <ChevronLeft
                    size={18}
                    strokeWidth={2.5}
                />
            </button>

            <div className='flex items-center gap-1.5'>
                {getPageNumbers().map((n, idx) => {
                    if (n === '...') {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className='w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 font-bold'
                            >
                                ...
                            </span>
                        );
                    }
                    return (
                        <button
                            key={n}
                            onClick={() => onPageChange(n)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-90 ${
                                currentPage === n
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 -translate-y-px'
                                    : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:border-brand-200 dark:hover:border-brand-500/50 hover:text-brand-500 shadow-sm'
                            }`}
                        >
                            {n}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className='w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-700 transition-all active:scale-95 shadow-sm'
                aria-label='Next Page'
            >
                <ChevronRight
                    size={18}
                    strokeWidth={2.5}
                />
            </button>
        </div>
    );
};

export default Pagination;
