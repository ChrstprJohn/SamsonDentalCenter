import React from 'react';
import { useNavigate } from 'react-router-dom';

const LocationHours = () => {
    const navigate = useNavigate();

    return (
        <section className='py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden'>
            {/* Background Decor */}
            <div className='absolute top-0 right-0 w-150 h-150 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none'></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center'>
                    {/* Left Side: Hours & Info (Larger Column) */}
                    <div className='lg:col-span-7 flex flex-col'>
                        <div className='flex items-center gap-4 mb-6'>
                            <span className='h-px w-8 bg-blue-600'></span>
                            <span className='tracking-wide font-medium text-blue-600 text-sm'>
                                Contact & Hours
                            </span>
                        </div>

                        <h2 className='text-[clamp(2.25rem,5vw+0.5rem,4rem)] font-bold text-slate-900 leading-[1.15] tracking-tight mb-10'>
                            Visit Our <br />
                            <span className='text-blue-600'>Clinical Space.</span>
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200/80 rounded-3xl overflow-hidden bg-slate-50/30 backdrop-blur-sm shadow-sm mb-12'>
                            {/* Hours Column */}
                            <div className='p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-200/80 bg-white/50'>
                                <div className='flex items-center gap-2 mb-8'>
                                    <div className='w-1.5 h-1.5 rounded-full bg-blue-600'></div>
                                    <h3 className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]'>
                                        Operating Hours
                                    </h3>
                                </div>
                                <div className='space-y-6'>
                                    <div className='flex justify-between items-end'>
                                        <div className='flex flex-col'>
                                            <span className='text-xs font-bold text-slate-400 uppercase tracking-tight mb-1'>
                                                Mon — Fri
                                            </span>
                                            <span className='font-bold text-slate-900 text-lg'>
                                                9:00 AM — 6:00 PM
                                            </span>
                                        </div>
                                    </div>
                                    <div className='h-px w-full bg-linear-to-r from-slate-200/60 to-transparent'></div>
                                    <div className='flex justify-between items-end'>
                                        <div className='flex flex-col'>
                                            <span className='text-xs font-bold text-slate-400 uppercase tracking-tight mb-1'>
                                                Saturday
                                            </span>
                                            <span className='font-bold text-slate-900 text-lg'>
                                                8:00 AM — 5:00 PM
                                            </span>
                                        </div>
                                    </div>
                                    <div className='h-px w-full bg-linear-to-r from-slate-200/60 to-transparent'></div>
                                    <div className='flex justify-between items-end'>
                                        <div className='flex flex-col'>
                                            <span className='text-xs font-bold text-slate-400 uppercase tracking-tight mb-1'>
                                                Sunday
                                            </span>
                                            <span className='font-semibold text-blue-600/60 italic'>
                                                By Appointment
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Column */}
                            <div className='p-8 md:p-10 flex flex-col justify-between bg-white/30'>
                                <div>
                                    <div className='flex items-center gap-2 mb-8'>
                                        <div className='w-1.5 h-1.5 rounded-full bg-slate-400'></div>
                                        <h3 className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]'>
                                            Our Location
                                        </h3>
                                    </div>
                                    <div className='space-y-4'>
                                        <p className='text-2xl text-slate-900 font-bold leading-tight tracking-tight'>
                                            7 Himlayan Rd, <br />
                                            Tandang Sora
                                        </p>
                                        <p className='text-sm text-slate-500 font-medium leading-relaxed max-w-60'>
                                            Quezon City, Metro Manila. <br />
                                            Accessible via Commonwealth Ave.
                                        </p>
                                    </div>
                                </div>

                                <div className='pt-8'>
                                    <button
                                        onClick={() => navigate('/contact')}
                                        className='group flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-blue-200'
                                    >
                                        Get Directions
                                        <svg
                                            className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2.5'
                                                d='M13 7l5 5m0 0l-5 5m5-5H6'
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Map (Smaller Column) */}
                    <div className='lg:col-span-5'>
                        <div className='relative aspect-square md:aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 group transition-all duration-200 ease-in-out hover:shadow-md'>
                            <iframe
                                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.953843794345!2d121.0466!3d14.6735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0a561055555%3A0x1234567890abcdef!2sTandang%20Sora%20Ave%2C%20Quezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1620000000000!5m2!1sen!2sph'
                                width='100%'
                                height='100%'
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading='lazy'
                                className='absolute inset-0 w-full h-full grayscale-20 group-hover:grayscale-0 transition-all duration-700 ease-in-out'
                            ></iframe>

                            {/* Minimal Map Badge */}
                            <div className='absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-sm border border-slate-200/80 z-10 transition-all duration-200 group-hover:-translate-y-1'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm'>
                                        <svg
                                            className='w-4 h-4'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2.5'
                                                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className='flex flex-col overflow-hidden'>
                                        <p className='font-bold text-slate-900 text-xs truncate'>
                                            Samson Dental Center
                                        </p>
                                        <a
                                            href='https://maps.google.com'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest'
                                        >
                                            View Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationHours;
