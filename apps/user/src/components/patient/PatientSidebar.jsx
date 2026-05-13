import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

// ── Inline SVG Icons ──
const GridIcon = () => (
    <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M3.5 3.5H10.5V10.5H3.5V3.5ZM13.5 3.5H20.5V10.5H13.5V3.5ZM3.5 13.5H10.5V20.5H3.5V13.5ZM13.5 13.5H20.5V20.5H13.5V13.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const CalendarIcon = () => (
    <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M15.695 13.7H15.704M15.695 16.7H15.704M11.995 13.7H12.005M11.995 16.7H12.005M8.295 13.7H8.305M8.295 16.7H8.305'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const UserCircleIcon = () => (
    <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const BellIcon = () => (
    <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M15 17H20L18.595 15.595C18.214 15.214 18 14.697 18 14.159V11C18 7.301 15.482 4.191 12.1 3.507V3.5C12.1 2.672 11.428 2 10.6 2C9.772 2 9.1 2.672 9.1 3.5V3.507C5.718 4.191 3.2 7.301 3.2 11V14.159C3.2 14.697 2.986 15.214 2.605 15.595L1.2 17H6.2M15 17V18C15 20.209 13.209 22 11 22C8.791 22 7 20.209 7 18V17M15 17H7'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9.5L12 4L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const HorizontalDots = ({ className }) => (
    <svg
        className={className}
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <circle cx='6' cy='12' r='1.5' fill='currentColor' />
        <circle cx='12' cy='12' r='1.5' fill='currentColor' />
        <circle cx='18' cy='12' r='1.5' fill='currentColor' />
    </svg>
);

const navItems = [
    {
        icon: <GridIcon />,
        name: 'Dashboard',
        path: '/patient',
    },
    {
        icon: <CalendarIcon />,
        name: 'My Appointments',
        path: '/patient/appointments',
    },
    {
        icon: <BellIcon />,
        name: 'Notifications',
        path: '/patient/notifications',
    },
    {
        icon: <UserCircleIcon />,
        name: 'Profile',
        path: '/patient/profile',
    },
];


const PatientSidebar = () => {
    const { isExpanded, isMobileOpen, setIsMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();

    const isActive = useCallback(
        (path) => location.pathname === path,
        [location.pathname]
    );
    
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    return (
        <aside
            className={`fixed top-16 lg:top-0 flex flex-col px-5 pb-20 lg:pb-8 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-[calc(100dvh-64px)] lg:h-[100dvh] transition-[width,transform,padding] duration-300 ease-in-out z-50 border-r border-gray-200 
                ${
                    isExpanded || isMobileOpen
                        ? 'w-[290px]'
                        : isHovered
                        ? 'w-[290px]'
                        : 'w-[90px]'
                }
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`py-8 flex w-full transition-all duration-300 pl-[13px]`}>
                <Link to='/patient' className="flex items-center min-h-[40px]">
                    <div className="flex items-center">
                        <span className="text-2xl font-black text-brand-500 font-outfit min-w-[24px] flex justify-center">
                            S
                        </span>
                        <span 
                            className={`sidebar-text-base text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase font-outfit ${
                                isExpanded || isHovered || isMobileOpen 
                                ? 'opacity-100 max-w-[200px] visible ml-0' 
                                : 'opacity-0 max-w-0 invisible ml-0'
                            }`}
                        >
                            amson <span className='text-brand-500'>Dental</span>
                        </span>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <div className='flex-1 min-h-0 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
                <nav className='mb-6'>
                    <div className='flex flex-col'>
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex items-center leading-[20px] text-gray-400 pl-[13px] transition-all duration-300`}
                            >
                                <div className={`flex items-center transition-all duration-300 ${isExpanded || isHovered || isMobileOpen ? 'opacity-0 scale-50 w-0 overflow-hidden' : 'opacity-100 scale-100 w-[24px]'}`}>
                                    <HorizontalDots className='size-6' />
                                </div>
                                <span className={`sidebar-text-base ${
                                    isExpanded || isHovered || isMobileOpen 
                                    ? 'opacity-100 max-w-[200px] visible ml-0' 
                                    : 'opacity-0 max-w-0 invisible ml-0 text-transparent'
                                }`}>
                                    Menu
                                </span>
                            </h2>
                            <ul className='flex flex-col gap-1'>
                                {navItems.map((nav) => (
                                    <li key={nav.name}>
                                        <Link
                                            to={nav.path}
                                            className={`menu-item group ${
                                                isActive(nav.path)
                                                    ? 'menu-item-active'
                                                    : 'menu-item-inactive'
                                            }`}
                                        >
                                            <span
                                                className={`menu-item-icon-size shrink-0 ${
                                                    isActive(nav.path)
                                                        ? 'menu-item-icon-active'
                                                        : 'menu-item-icon-inactive'
                                                }`}
                                            >
                                                {nav.icon}
                                            </span>
                                            <span className={`sidebar-text-base menu-item-text ${
                                                isExpanded || isHovered || isMobileOpen 
                                                ? 'sidebar-text-expanded' 
                                                : 'sidebar-text-collapsed'
                                            }`}>
                                                {nav.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className='mt-auto pt-4 border-t border-gray-100 dark:border-gray-800'>
                <ul className='flex flex-col gap-1'>
                    <li>
                        <Link
                            to='/'
                            className={`menu-item group menu-item-inactive`}
                        >
                            <span className='menu-item-icon-size menu-item-icon-inactive shrink-0'>
                                <HomeIcon />
                            </span>
                            <span className={`sidebar-text-base menu-item-text ${
                                isExpanded || isHovered || isMobileOpen 
                                ? 'sidebar-text-expanded' 
                                : 'sidebar-text-collapsed'
                            }`}>
                                Back to Home
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default PatientSidebar;
