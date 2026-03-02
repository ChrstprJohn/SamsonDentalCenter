import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MobileMenu from './MobileMenu';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/inquiries', label: 'Inquiries' },
    { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
                isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
                    : 'bg-transparent border-b border-transparent py-4'
            }`}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12'>
                <div className='flex items-center justify-between'>
                    {/* Section 1: Logo */}
                    <div className='flex-1 flex items-center justify-start'>
                        <Link
                            to='/'
                            className='inline-flex items-center gap-2.5 cursor-pointer focus:outline-none transition-all duration-200 ease-in-out hover:opacity-80'
                        >
                            <div className='relative w-8 h-8 shrink-0'>
                                <svg
                                    viewBox='0 0 100 100'
                                    className='w-full h-full text-blue-600 fill-current'
                                >
                                    <path d='M50 5 C25 5 20 40 20 60 C20 85 40 95 50 95 C60 95 80 85 80 60 C80 40 75 5 50 5 Z M50 85 C35 85 30 70 30 60 C30 40 35 15 50 15 C65 15 70 40 70 60 C70 70 65 85 50 85 Z' />
                                    <path
                                        className='text-slate-900'
                                        d='M50 35 C40 35 35 45 35 55 C35 65 40 75 50 75 C60 75 65 65 65 55 C65 45 60 35 50 35 Z M50 65 C45 65 42 60 42 55 C42 50 45 45 50 45 C55 45 58 50 58 55 C58 60 55 65 50 65 Z'
                                    />
                                </svg>
                            </div>
                            <span className='font-bold text-base tracking-tight text-slate-900 hidden sm:inline'>
                                <span className='text-slate-500'>SAMSON DENTAL</span>{' '}
                                <span className='text-blue-600'>CENTER</span>
                            </span>
                            <span className='font-bold text-base tracking-tight text-slate-500 sm:hidden'>
                                SAMSON
                            </span>
                            <span className='font-bold text-base tracking-tight text-blue-600 sm:hidden'>
                                DENTAL
                            </span>
                        </Link>
                    </div>

                    {/* Section 2: Links (Desktop) */}
                    <div className='hidden md:flex items-center justify-center gap-8'>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) =>
                                    `text-sm font-medium tracking-wide transition-all duration-200 ease-in-out ${
                                        isActive
                                            ? 'text-blue-600 font-semibold'
                                            : 'text-slate-600 hover:text-blue-600'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Section 3: Actions */}
                    <div className='flex-1 flex items-center justify-end gap-3'>
                        <button
                            onClick={() => navigate('/book')}
                            className='hidden sm:inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                        >
                            Book Now
                        </button>

                        {user ? (
                            <button
                                onClick={() => navigate('/patient')}
                                className='hidden sm:inline-flex items-center justify-center text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 bg-white/50 hover:bg-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            >
                                Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className='hidden sm:inline-flex items-center justify-center text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 bg-white/50 hover:bg-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className='md:hidden p-2.5 rounded-xl hover:bg-slate-100 focus:outline-none text-slate-600 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-600'
                    >
                        {mobileOpen ? (
                            <X
                                size={22}
                                strokeWidth={2}
                            />
                        ) : (
                            <Menu
                                size={22}
                                strokeWidth={2}
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <MobileMenu
                    links={navLinks}
                    user={user}
                    onClose={() => setMobileOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
