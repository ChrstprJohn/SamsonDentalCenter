import { ChevronLeftIcon, ChevronRightIcon } from './AppointmentIcons';

const AppointmentPagination = ({ page, totalPages, prevPage, nextPage, goToPage, totalItems }) => {
    const pageNumbers = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = new Set([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages]);
        return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    };

    const renderPageButtons = () => {
        if (!totalItems || totalItems === 0 || !totalPages || totalPages < 1) return null;
        const nums = pageNumbers();
        const result = [];
        nums.forEach((num, i) => {
            if (i > 0 && num - nums[i - 1] > 1) {
                result.push(
                    <span key={`ellipsis-${num}`} className='w-7 h-7 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium'>
                        ...
                    </span>
                );
            }
            result.push(
                <button
                    key={num}
                    onClick={() => goToPage(num)}
                    className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors ${num === page
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                        }`}
                >
                    {num}
                </button>
            );
        });
        return result;
    };

    return (
        <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.2)] sm:shadow-none'>
            <div className='flex flex-row items-center justify-between w-full gap-2 sm:gap-0'>
                {/* Left: Results Text */}
                <div className='w-auto sm:w-1/3 text-left'>
                    <span className='text-[10px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap'>
                        Showing {totalItems ?? 0} results
                    </span>
                </div>

                {/* Center: Pagination numbers */}
                <div className='flex items-center justify-end sm:justify-center w-auto sm:w-1/3'>
                    <div className='flex items-center gap-1 justify-center shrink-0'>
                        {renderPageButtons()}
                    </div>
                </div>

                {/* Right: Empty spacer to ensure exact center alignment on desktop */}
                <div className='hidden sm:block sm:w-1/3'></div>
            </div>
        </div>
    );
};

export default AppointmentPagination;
