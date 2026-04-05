import { Link } from 'react-router-dom';

const DropdownItem = ({
    tag = 'button',
    to,
    onClick,
    onItemClick,
    baseClassName = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white rounded-lg transition-colors',
    className = '',
    children,
}) => {
    const combinedClasses = `${baseClassName} ${className}`.trim();

    const handleClick = (event) => {
        if (tag === 'button') {
            event.preventDefault();
        }
        if (onClick) onClick();
        if (onItemClick) onItemClick();
    };

    if (tag === 'Link' && to) {
        return (
            <Link to={to} className={combinedClasses} onClick={handleClick}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={handleClick} className={combinedClasses}>
            {children}
        </button>
    );
};

export default DropdownItem;
