import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Inquiries', path: '/inquiries' },
    { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navRef = useRef(null);
    const lastScrollY = useRef(0);
    const [isVisible, setIsVisible] = useState(true);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);

            // Smart Navbar: Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            // GSAP smooth state changes
            if (currentScrollY > 20) {
                gsap.to(navRef.current, {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    borderBottom: '1px solid rgba(229, 231, 235, 1)',
                    duration: 0.4,
                    ease: 'power2.out',
                });
            } else {
                gsap.to(navRef.current, {
                    backgroundColor: 'transparent',
                    paddingTop: '1.5rem',
                    paddingBottom: '1.5rem',
                    boxShadow: '0 0px 0px 0 rgba(0, 0, 0, 0)',
                    borderBottom: '1px solid transparent',
                    duration: 0.4,
                    ease: 'power2.out',
                });
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        let ctx = gsap.context(() => {
            gsap.from('.nav-anim', {
                y: -30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.08,
                ease: 'expo.out',
                delay: 0.2,
                clearProps: 'transform,opacity',
            });
        }, navRef);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            ctx.revert();
        };
    }, []);

    // Smart Visibility Logic
    useEffect(() => {
        gsap.to(navRef.current, {
            y: isVisible ? 0 : -100,
            duration: 0.4,
            ease: 'power2.inOut',
        });
    }, [isVisible]);

    const isScrolled = scrollY > 20;

    return (
        <nav
            ref={navRef}
            className='fixed top-0 left-0 right-0 z-50 flex items-center'
            style={{
                backgroundColor: 'transparent',
                paddingTop: '1.5rem',
                paddingBottom: '1.5rem',
                backdropFilter: 'none',
            }}
        >
            <div className='max-w-350 mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                <div className='flex items-center justify-between'>
                    {/* Section 1: Logo */}
                    <div className='flex-1 flex items-center justify-start nav-anim'>
                        <Link
                            to='/'
                            className='group inline-flex items-center gap-2 sm:gap-3 cursor-pointer focus:outline-none transition-all duration-300 hover:opacity-80'
                        >
                            <div
                                className={`relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-xl transition-colors duration-300 ring-1 ${isScrolled ? 'bg-blue-50 text-blue-600 ring-blue-100/50 group-hover:bg-blue-600 group-hover:text-white' : 'bg-white/10 text-white ring-white/20'}`}
                            >
                                <svg
                                    viewBox='0 0 100 100'
                                    className='w-5 h-5 sm:w-6 sm:h-6 fill-current'
                                >
                                    <path d='M50 5 C25 5 20 40 20 60 C20 85 40 95 50 95 C60 95 80 85 80 60 C80 40 75 5 50 5 Z M50 85 C35 85 30 70 30 60 C30 40 35 15 50 15 C65 15 70 40 70 60 C70 70 65 85 50 85 Z' />
                                    <path
                                        className={`${isScrolled ? 'text-slate-900 group-hover:text-blue-100' : 'text-white/80'} transition-colors duration-300`}
                                        d='M50 35 C40 35 35 45 35 55 C35 65 40 75 50 75 C60 75 65 65 65 55 C65 45 60 35 50 35 Z M50 65 C45 65 42 60 42 55 C42 50 45 45 50 45 C55 45 58 50 58 55 C58 60 55 65 50 65 Z'
                                    />
                                </svg>
                            </div>
                            <div className='flex flex-col items-start justify-center pt-0.5 ml-1'>
                                <span
                                    className={`font-extrabold text-[1.4rem] sm:text-[1.7rem] uppercase leading-none tracking-tight pb-1 ${isScrolled ? 'text-[#172554]' : 'text-white'}`}
                                >
                                    SAMSON
                                </span>
                                <span
                                    className={`text-[8px] sm:text-[10px] uppercase tracking-[0.3em] leading-none font-bold ${isScrolled ? 'text-blue-600' : 'text-sky-400'}`}
                                >
                                    DENTAL CENTER
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Section 2: Links (Desktop) */}
                    <div className='hidden lg:flex items-center justify-center'>
                        <ul className='hidden lg:flex items-center justify-center gap-8'>
                            {navLinks.map((link, index) => (
                                <li
                                    key={index}
                                    className='relative'
                                >
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `font-medium transition-colors duration-300 pb-1.5 ${
                                                isScrolled
                                                    ? 'text-slate-600 hover:text-slate-900'
                                                    : 'text-white/80 hover:text-white'
                                            } ${isActive && (isScrolled ? 'text-blue-600' : 'text-white')}`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {link.name}
                                                <span
                                                    className={`absolute bottom-0 left-0 w-full h-0.5 transition-transform duration-300 ease-out origin-left transform ${
                                                        isActive ? 'scale-x-100' : 'scale-x-0'
                                                    } ${isScrolled ? 'bg-blue-600' : 'bg-white'}`}
                                                ></span>
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 3: Buttons & Mobile Menu */}
                    <div className='flex-1 flex items-center justify-end gap-3'>
                        <div className='nav-anim flex items-center gap-3'>
                            {!user ? (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className={`hidden sm:inline-flex items-center justify-center font-bold text-sm transition-all duration-300 ease-out ring-1 px-5 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm ${isScrolled ? 'text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 ring-slate-200 hover:ring-blue-200 focus:ring-blue-600 focus:ring-offset-2' : 'text-white bg-white/10 hover:bg-white/20 ring-white/20 hover:ring-white/30 focus:ring-sky-400 focus:ring-offset-slate-900'}`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate(user ? '/dashboard/book' : '/book')}
                                        className={`hidden md:inline-flex items-center justify-center font-bold text-sm transition-all duration-300 ease-out shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 py-2.5 rounded-2xl ${isScrolled ? 'bg-sky-500 hover:bg-sky-600 text-white hover:shadow-[0_8px_20px_rgb(14,165,233,0.3)] focus:ring-sky-400 focus:ring-offset-2' : 'bg-sky-500 hover:bg-sky-600 text-white hover:shadow-[0_8px_20px_rgb(14,165,233,0.3)] focus:ring-sky-400 focus:ring-offset-slate-900'}`}
                                    >
                                        Book Now
                                    </button>
                                </>
                            ) : (
                                <div className='relative'>
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 ${isScrolled ? 'hover:bg-slate-100 bg-white ring-1 ring-slate-200' : 'hover:bg-white/20 bg-white/10 ring-1 ring-white/20'}`}
                                        title={user?.full_name || user?.email}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${isScrolled ? 'bg-blue-600' : 'bg-sky-500'}`}
                                        >
                                            {user?.full_name?.charAt(0).toUpperCase() ||
                                                user?.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <span
                                            className={`hidden md:inline text-sm font-medium ${isScrolled ? 'text-slate-700' : 'text-white'}`}
                                        >
                                            {user?.full_name?.split(' ')[0] || 'Profile'}
                                        </span>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileMenuOpen && (
                                        <div
                                            className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 py-2 ${isScrolled ? 'bg-white ring-1 ring-slate-200' : 'bg-slate-900 ring-1 ring-slate-700'}`}
                                        >
                                            <div
                                                className={`px-4 py-2 border-b ${isScrolled ? 'border-slate-200 text-slate-600' : 'border-slate-700 text-slate-300'}`}
                                            >
                                                <p className='text-sm font-semibold'>
                                                    {user?.full_name || 'User'}
                                                </p>
                                                <p className='text-xs'>{user?.email}</p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    navigate('/patient');
                                                    setIsProfileMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isScrolled ? 'text-slate-700 hover:bg-blue-50' : 'text-slate-300 hover:bg-slate-800'}`}
                                            >
                                                <Settings size={16} />
                                                Dashboard
                                            </button>

                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsProfileMenuOpen(false);
                                                    navigate('/');
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors border-t ${isScrolled ? 'border-slate-200 text-red-600 hover:bg-red-50' : 'border-slate-700 text-red-400 hover:bg-slate-800'}`}
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className='nav-anim md:hidden'>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2.5 rounded-2xl transition-all duration-300 focus:outline-none active:scale-95 ${isScrolled ? 'bg-white/80 backdrop-blur-md ring-1 ring-slate-200/80 text-slate-700 hover:text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-600' : 'bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-white hover:text-sky-400 hover:bg-white/20 focus:ring-2 focus:ring-sky-400'}`}
                            >
                                {isMobileMenuOpen ? (
                                    <X
                                        size={20}
                                        strokeWidth={2.5}
                                    />
                                ) : (
                                    <Menu
                                        size={20}
                                        strokeWidth={2.5}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='fixed inset-0 z-40 bg-white/90 backdrop-blur-md overflow-y-auto'>
                    <div className='max-w-sm mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                                <Link
                                    to='/'
                                    className='flex items-center gap-2'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            strokeWidth={2}
                                            stroke='currentColor'
                                            className='w-5 h-5'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M3 12h18M12 3v18'
                                            />
                                        </svg>
                                    </div>
                                    <span className='text-xl font-extrabold leading-tight'>
                                        SAMSON
                                    </span>
                                </Link>
                            </div>
                            <div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className='p-2 rounded-md text-slate-600 hover:text-blue-600 focus:outline-none'
                                >
                                    <X
                                        size={24}
                                        strokeWidth={2}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className='mt-8'>
                            <ul className='flex flex-col gap-4'>
                                {navLinks.map((link, index) => (
                                    <li
                                        key={index}
                                        className='relative'
                                    >
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `block py-2 px-3 rounded ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-slate-200 hover:bg-slate-700'
                                                }`
                                            }
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                            <div className='mt-6 space-y-3'>
                                {!user ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate('/login');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className='w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-slate-100 transition-colors duration-300'
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate(user ? '/dashboard/book' : '/book');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className='w-full bg-sky-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-300'
                                        >
                                            Book Now
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className='bg-slate-800 rounded-lg p-3 text-center border border-slate-700'>
                                            <p className='text-sm font-semibold text-white'>
                                                {user?.full_name || 'User'}
                                            </p>
                                            <p className='text-xs text-slate-400'>{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigate('/patient');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className='w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300'
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                                navigate('/');
                                            }}
                                            className='w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300'
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
