const ComponentCard = ({ title, children, className = '', desc = '', action = null }) => {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm ${className}`}
        >
            {/* Card Header */}
            <div className='px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center justify-between'>
                <div>
                    <h3 className='text-base font-medium text-gray-800 dark:text-white/90'>
                        {title}
                    </h3>
                    {desc && (
                        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                            {desc}
                        </p>
                    )}
                </div>
                {action && (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {action}
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className='p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6'>
                <div className='space-y-6'>{children}</div>
            </div>
        </div>
    );
};

export default ComponentCard;
