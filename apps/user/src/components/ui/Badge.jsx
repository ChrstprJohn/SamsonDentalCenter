const Badge = ({
    variant = 'light',
    color = 'primary',
    size = 'md',
    startIcon,
    endIcon,
    children,
    className = '',
}) => {
    const baseStyles =
        'inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-lg font-medium transition-all';

    // Define size styles
    const sizeStyles = {
        sm: 'text-theme-xs', // Smaller padding and font size
        md: 'text-sm', // Default padding and font size
    };

    // Define color styles for variants
    const variants = {
        light: {
            primary:
                'bg-brand-50 text-brand-500 border border-brand-100/80 dark:bg-brand-500/15 dark:text-brand-400 dark:border-brand-500/20',
            success:
                'bg-success-50 text-success-600 border border-success-100/80 dark:bg-success-500/15 dark:text-success-500 dark:border-success-500/20',
            error:
                'bg-error-50 text-error-600 border border-error-100/80 dark:bg-error-500/15 dark:text-error-500 dark:border-error-500/20',
            warning:
                'bg-warning-50 text-warning-600 border border-warning-100/80 dark:bg-warning-500/15 dark:text-orange-400 dark:border-warning-500/20',
            info: 
                'bg-blue-light-50 text-blue-light-500 border border-blue-light-100/80 dark:bg-blue-light-500/15 dark:text-blue-light-500 dark:border-blue-light-500/20',
            light: 
                'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-white/5 dark:text-white/80 dark:border-white/10',
            dark: 
                'bg-gray-500 text-white border border-gray-600 dark:bg-white/5 dark:text-white dark:border-white/10',
        },
        solid: {
            primary: 'bg-brand-500 text-white dark:text-white border border-brand-600',
            success: 'bg-success-500 text-white dark:text-white border border-success-600',
            error: 'bg-error-500 text-white dark:text-white border border-error-600',
            warning: 'bg-warning-500 text-white dark:text-white border border-warning-600',
            info: 'bg-blue-light-500 text-white dark:text-white border border-blue-light-600',
            light: 'bg-gray-400 dark:bg-white/5 text-white dark:text-white/80 border border-gray-500',
            dark: 'bg-gray-700 text-white dark:text-white border border-gray-800',
        },
    };

    // Get styles based on size and color variant
    const sizeClass = sizeStyles[size] || sizeStyles.md;
    const colorStyles = variants[variant]?.[color] || variants.light.primary;

    return (
        <span className={`${baseStyles} ${sizeClass} ${colorStyles} ${className}`}>
            {startIcon && <span className='mr-1'>{startIcon}</span>}
            {children}
            {endIcon && <span className='ml-1'>{endIcon}</span>}
        </span>
    );
};

export default Badge;
