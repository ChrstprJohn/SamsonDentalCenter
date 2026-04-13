import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';

const SecretaryHeader = () => {
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className='sticky top-0 flex w-full bg-white border-gray-200 z-99999 lg:border-b'>
            <div className='flex items-center justify-between w-full px-3 py-3 lg:px-6 lg:py-4'>
                {/* Left: Toggle + Mobile Logo */}
                <div className='flex items-center gap-3'>
                    <button
                        className='flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg lg:h-11 lg:w-11 lg:border border-gray-200'
                        onClick={handleToggle}
                        aria-label='Toggle Sidebar'
                    >
                        {isMobileOpen ? (
                            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path fillRule='evenodd' clipRule='evenodd' d='M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z' fill='currentColor' />
                            </svg>
                        ) : (
                            <svg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path fillRule='evenodd' clipRule='evenodd' d='M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z' fill='currentColor' />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Right: User Info & Notifications (Notifications removed for cleanup) */}
                <div className='flex items-center gap-2 lg:gap-4'>
                    <div className='relative'>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className='flex items-center text-gray-700 dropdown-toggle'
                        >
                            <span className='mr-3 overflow-hidden rounded-full h-11 w-11 bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm'>
                                {user?.full_name?.[0]?.toUpperCase() || 'S'}
                            </span>
                            <span className='hidden sm:block mr-1 font-medium truncate max-w-[120px] text-theme-sm'>
                                {user?.full_name?.split(' ')[0] || 'Secretary'}
                            </span>
                            <svg className={`stroke-gray-500 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M4.3125 8.65625L9 13.3437L13.6875 8.65625' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className='fixed inset-0 z-40' onClick={() => setIsDropdownOpen(false)} />
                                <div className='absolute right-0 mt-2 w-[260px] bg-white rounded-2xl border border-gray-200 shadow-theme-lg z-50 p-3'>
                                    <div>
                                        <span className='block font-medium text-gray-700 text-sm truncate'>
                                            {user?.full_name || 'Secretary'}
                                        </span>
                                        <span className='mt-0.5 block text-xs text-gray-500 truncate'>
                                            {user?.email}
                                        </span>
                                    </div>

                                    <ul className='flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200'>
                                        <li>
                                            <Link
                                                to='/profile'
                                                className='flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-sm hover:bg-gray-100'
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Edit profile
                                            </Link>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={handleLogout}
                                        className='flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-sm hover:bg-gray-100 w-full text-left'
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SecretaryHeader;
