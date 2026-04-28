import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const Carousel = ({ className }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselImages = [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className={cn(
                'hidden md:flex md:w-1/2 lg:w-[45%] flex-shrink-0 relative bg-slate-900 overflow-hidden min-h-full',
                className,
            )}
        >
            {carouselImages.map((img, idx) => (
                <img
                    key={idx}
                    src={img}
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out',
                        currentImageIndex === idx ? 'opacity-40' : 'opacity-0',
                    )}
                    alt='Clinic'
                />
            ))}

            {/* Gradient Overlay - Improved visibility */}
            <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30 z-10' />

            {/* Content Overlay */}
            <div className='relative z-20 w-full p-8 lg:p-12 flex flex-col h-full justify-between text-left'>
                {/* Brand */}
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 ring-1 ring-white/10 backdrop-blur-sm'>
                        <svg
                            className='w-5 h-5 fill-current'
                            viewBox='0 0 100 100'
                        >
                            <path d='M50 5 C25 5 20 40 20 60 C20 85 40 95 50 95 C60 95 80 85 80 60 C80 40 75 5 50 5 Z' />
                        </svg>
                    </div>
                    <span className='font-sans font-bold text-white tracking-wide text-lg uppercase'>
                        Samson Dental Center
                    </span>
                </div>

                {/* Bottom Content */}
                <div className='space-y-8'>
                    <div className='inline-flex px-4 py-1.5 bg-white/10 border border-white/10 rounded-full backdrop-blur-md shadow-sm'>
                        <span className='text-[11px] font-bold text-blue-200 uppercase tracking-widest'>
                            Administrative Portal
                        </span>
                    </div>

                    <div className='space-y-4 max-w-md'>
                        <h1 className='text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight'>
                            Modern Care,
                            <br />
                            Efficient Smiles.
                        </h1>
                        <p className='text-slate-300 text-base leading-relaxed font-medium'>
                            Access the administrative dashboard to manage clinicians, schedules, and clinical operations.
                        </p>
                    </div>

                    {/* Indicators */}
                    <div className='flex gap-3 pt-4'>
                        {carouselImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    'h-1.5 rounded-full transition-all duration-500 ease-out',
                                    currentImageIndex === idx
                                        ? 'w-8 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                                        : 'w-2 bg-white/20 hover:bg-white/40',
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
