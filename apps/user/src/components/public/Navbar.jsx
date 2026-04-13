import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Settings, Bell } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../context/AuthContext';
import PatientNotification from '../patient/PatientNotification';
import useClickOutside from '../../hooks/useClickOutside';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    // { name: 'Inquiries', path: '/inquiries' },
    { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileRef = useRef(null);
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

            // GSAP smooth state changes - only based on scroll, not page
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

    useClickOutside(profileRef, () => {
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
    });

    const isScrolled = scrollY > 20;

    return (
        <>
            <nav
                ref={navRef}
                className='fixed top-0 left-0 right-0 z-[80] flex items-center'
                style={{
                    backgroundColor: 'transparent',
                    paddingTop: '1.5rem',
                    paddingBottom: '1.5rem',
                    backdropFilter: 'none',
                }}
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                    <div className='flex items-center justify-between'>
                        {/* Section 1: Mobile Hamburger / Desktop Logo */}
                        <div className='flex items-center gap-4'>
                            {/* Mobile Menu Toggle (Left on mobile) */}
                            <button
                                className={`lg:hidden p-2 rounded-xl transition-all duration-300 ring-1 ${isScrolled || isMobileMenuOpen
                                        ? 'text-slate-600 ring-slate-200 hover:bg-slate-100'
                                        : 'text-white/90 ring-white/10 hover:bg-white/10'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label='Toggle Mobile Menu'
                            >
                                {isMobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>

                            {/* Logo Container (Hidden on mobile, flex on desktop) */}
                            <div className='hidden lg:flex items-center flex-shrink-0'>
                                <Link
                                    to='/'
                                    className='flex items-center space-x-3 group'
                                >
                                    <div className='w-10 flex items-center justify-center transition-all duration-500 group-hover:scale-110'>
                                        <img src="/images/logo/samson-logo.png" alt="Samson Dental Logo" className="w-full h-auto drop-shadow-sm" />
                                    </div>
                                    <div className='flex flex-col items-start justify-center'>
                                        <span
                                            className={`font-black text-[22px] tracking-[-0.04em] leading-none ${isScrolled || isMobileMenuOpen
                                                ? 'text-slate-800'
                                                : 'text-white'
                                                }`}
                                        >
                                            SAMSON
                                        </span>
                                        <span
                                            className={`text-[10px] uppercase tracking-[0.28em] font-bold mt-[2px] ${isScrolled || isMobileMenuOpen
                                                ? 'text-blue-600'
                                                : 'text-blue-400'
                                                }`}
                                        >
                                            Dental Center
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Section 2: Links (Desktop Only) */}
                        <div className='hidden lg:flex items-center justify-center'>
                            <ul
                                className='flex items-center justify-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 ring-1 h-[48px] bg-white/10 ring-white/20'
                                style={{
                                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : undefined,
                                    backdropFilter: isScrolled ? 'blur(12px)' : undefined,
                                    borderColor: isScrolled ? 'rgba(229, 231, 235, 1)' : undefined,
                                }}
                            >
                                {navLinks.map((link, index) => (
                                    <li
                                        key={index}
                                        className='relative'
                                    >
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `font-medium text-sm transition-all duration-300 px-5 py-1.5 rounded-2xl ${isActive
                                                    ? isScrolled
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white/20 text-white backdrop-blur-sm shadow-sm'
                                                    : isScrolled
                                                        ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/50'
                                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 3: Profile & Notifications */}
                        <div className='flex items-center gap-2 lg:gap-4'>
                            {user && (
                                <PatientNotification />
                            )}

                            <div
                                className='relative'
                                ref={profileRef}
                            >
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${isScrolled
                                        ? 'hover:bg-slate-100 bg-white ring-1 ring-slate-200'
                                        : 'hover:bg-white/20 bg-white/10 ring-1 ring-white/20'
                                        }`}
                                    title={user ? user.full_name || user.email : 'Guest Menu'}
                                >
                                    <span
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${user
                                            ? isScrolled
                                                ? 'bg-blue-600'
                                                : 'bg-sky-500'
                                            : isScrolled
                                                ? 'bg-slate-400'
                                                : 'bg-white/20'
                                            }`}
                                    >
                                        {user ? (
                                            user.full_name?.charAt(0).toUpperCase() ||
                                            user.email?.charAt(0).toUpperCase()
                                        ) : (
                                            <svg
                                                className='w-5 h-5'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            >
                                                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                                                <circle
                                                    cx='12'
                                                    cy='7'
                                                    r='4'
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    <svg
                                        className={`transition-transform duration-200 flex-shrink-0 ${isProfileMenuOpen ? 'rotate-180' : ''
                                            } ${isScrolled ? 'text-slate-500' : 'text-white/70'}`}
                                        width='18'
                                        height='20'
                                        viewBox='0 0 18 20'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            d='M4.3125 8.65625L9 13.3437L13.6875 8.65625'
                                            stroke='currentColor'
                                            strokeWidth='1.5'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                    </svg>
                                </button>

                                {isProfileMenuOpen && (
                                    <div className='absolute right-0 mt-3 w-[260px] rounded-2xl shadow-theme-lg z-50 p-3 border bg-white border-gray-200'>
                                        <div className='px-4 py-2 mb-2'>
                                            <span className='block font-semibold text-sm truncate text-gray-800'>
                                                {user ? user.full_name || 'User' : 'Guest User'}
                                            </span>
                                            <span className='mt-0.5 block text-xs truncate text-gray-500'>
                                                {user ? user.email : 'Welcome to Primera Dental'}
                                            </span>
                                        </div>

                                        {!user ? (
                                            <div className='grid grid-cols-1 gap-1 pt-2 border-t border-gray-100'>
                                                <Link
                                                    to='/login'
                                                    state={{ from: location.pathname }}
                                                    className='flex items-center gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-colors text-gray-700 hover:bg-gray-100'
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    <X
                                                        size={18}
                                                        className='text-gray-400'
                                                    />
                                                    Sign In
                                                </Link>
                                                <Link
                                                    to='/register'
                                                    className='flex items-center gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-colors text-gray-700 hover:bg-gray-100'
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    <Settings
                                                        size={18}
                                                        className='text-gray-400'
                                                    />
                                                    Sign Up
                                                </Link>
                                                <Link
                                                    to='/book'
                                                    className='flex items-center gap-3 px-3 py-2.5 mt-1 font-medium rounded-lg text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700'
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    Book as a Guest
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                <ul className='flex flex-col gap-1 pt-2 pb-2 border-t border-b border-gray-100'>
                                                    <li>
                                                        <Link
                                                            to='/patient'
                                                            className='flex items-center gap-3 px-3 py-2 font-medium rounded-lg group text-sm transition-colors text-gray-700 hover:bg-gray-100'
                                                            onClick={() => setIsProfileMenuOpen(false)}
                                                        >
                                                            <Settings size={18} />
                                                            Dashboard
                                                        </Link>
                                                    </li>
                                                    {/* <li>
                                                    <Link
                                                        to='/patient/profile'
                                                        className='flex items-center gap-3 px-3 py-2 font-medium rounded-lg group text-sm transition-colors text-gray-700 hover:bg-gray-100'
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                    >
                                                        Edit Profile
                                                    </Link>
                                                </li> */}
                                                </ul>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsProfileMenuOpen(false);
                                                        navigate('/');
                                                    }}
                                                    className='w-full text-left px-3 py-2 mt-2 text-sm flex items-center gap-3 rounded-lg transition-colors font-medium border border-transparent text-red-600 hover:bg-red-50 hover:border-red-100'
                                                >
                                                    <LogOut size={18} />
                                                    Logout
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-[9999] w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Header: Logo */}
                <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
                    <Link
                        to='/'
                        className='flex items-center space-x-3 group'
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className='w-9 flex items-center justify-center transition-transform duration-500 group-hover:scale-110'>
                            <img src="/images/logo/samson-logo.png" alt="Samson Dental Logo" className="w-full h-auto drop-shadow-sm" />
                        </div>
                        <div className='flex flex-col items-start justify-center'>
                            <span className='font-black text-[20px] tracking-[-0.04em] text-slate-800 uppercase leading-none'>
                                SAMSON
                            </span>
                            <span className='text-[9px] uppercase tracking-[0.28em] mt-[2px] font-bold text-blue-600'>
                                Dental Center
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors'
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className='flex flex-col h-[calc(100vh-88px)] justify-between overflow-y-auto no-scrollbar'>
                    {/* Navigation Links */}
                    <div className='px-4 py-6'>
                        <h3 className='px-4 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 mb-4'>
                            Menu
                        </h3>
                        <ul className='space-y-1'>
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${isActive
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-100 border border-blue-600'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-transparent'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sidebar Footer: Profile/Guest Actions */}
                    <div className='p-6 border-t border-gray-100 bg-slate-50/50'>
                        {!user ? (
                            <div className='grid grid-cols-1 gap-3'>
                                <Link
                                    to='/login'
                                    state={{ from: location.pathname }}
                                    className='flex items-center justify-center gap-2 w-full py-2.5 font-semibold text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to='/book'
                                    className='flex items-center justify-center gap-2 w-full py-2.5 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 transition-colors'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Book as a Guest
                                </Link>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                <div className='flex items-center gap-3 px-2'>
                                    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold'>
                                        {user.full_name?.charAt(0).toUpperCase() ||
                                            user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className='flex flex-col min-w-0'>
                                        <span className='font-bold text-sm text-slate-800 truncate'>
                                            {user.full_name || 'User'}
                                        </span>
                                        <span className='text-xs text-slate-500 truncate'>
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 gap-2'>
                                    <Link
                                        to='/patient'
                                        className='flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Settings size={18} />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to='/patient/notifications'
                                        className='flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Bell size={18} />
                                        Notifications
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                            navigate('/');
                                        }}
                                        className='flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors'
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
