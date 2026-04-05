import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
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
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-8'>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className='flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all active:scale-95 w-full sm:w-auto justify-center shadow-sm'
            >
                <ChevronLeft size={16} strokeWidth={3} />
                Previous
            </button>

            <div className='flex items-center gap-2'>
                {getPageNumbers().map((n) => (
                    <button
                        key={n}
                        onClick={() => onPageChange(n)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-90 ${
                            currentPage === n
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 translate-y-[-2px]'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-500 shadow-sm'
                        }`}
                    >
                        {n}
                    </button>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className='flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all active:scale-95 w-full sm:w-auto justify-center shadow-sm'
            >
                Next
                <ChevronRight size={16} strokeWidth={3} />
            </button>
        </div>
    );
};

export default Pagination;
