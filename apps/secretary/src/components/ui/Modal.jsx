import { useRef, useEffect } from 'react';

export const Modal = ({
    isOpen,
    onClose,
    children,
    className = '',
    showCloseButton = true,
    isFullscreen = false,
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const contentClasses = isFullscreen
        ? 'w-full min-h-screen'
        : 'relative w-full rounded-3xl bg-white dark:bg-gray-900 shadow-2xl pointer-events-auto my-8';

    return (
        <div 
            className={`fixed inset-0 z-[999999] overflow-y-auto bg-gray-900/60 backdrop-blur-sm transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 pointer-events-none">
                <div
                    ref={modalRef}
                    className={`${contentClasses} ${className}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className='absolute right-4 top-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/80 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white backdrop-blur-sm shadow-sm'
                        >
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};
