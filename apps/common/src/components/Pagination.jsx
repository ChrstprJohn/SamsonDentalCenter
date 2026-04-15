import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 3; // Keep it very compact (1, 2, 3)

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first 3
            if (currentPage <= 2) {
                pages.push(1, 2, 3, '...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 1) {
                pages.push(1, '...');
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...');
                pages.push(currentPage, '...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className='flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-0'>
            <button
                onClick={handlePrevious}
                className='w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-90 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:border-sky-200 dark:hover:border-sky-500/50 hover:text-sky-500 shadow-sm'
                disabled={currentPage === 1}
            >
                <ChevronLeft
                    size={18}
                    strokeWidth={2.5}
                />
            </button>

            <div className='flex items-center gap-1 sm:gap-1.5'>
                {getPageNumbers().map((n, idx) =>
                    n === '...' ? (
                        <span
                            key={`dots-${idx}`}
                            className='px-1 text-gray-400 font-bold'
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={n}
                            onClick={() => onPageChange(n)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-90 ${
                                currentPage === n
                                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 -translate-y-px'
                                    : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:border-sky-200 dark:hover:border-sky-500/50 hover:text-sky-500 shadow-sm'
                            }`}
                        >
                            {n}
                        </button>
                    ),
                )}
            </div>

            <button
                onClick={handleNext}
                className='w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-90 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:border-sky-200 dark:hover:border-sky-500/50 hover:text-sky-500 shadow-sm'
                disabled={currentPage === totalPages}
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
