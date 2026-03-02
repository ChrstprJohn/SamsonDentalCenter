import React, { useState, useRef, useEffect } from 'react';
import SectionHeading from '../common/SectionHeading';

const BEFORE_AFTER_CASES = [
    {
        id: 1,
        title: 'Full Arch Restoration',
        type: 'All-on-4 Treatment',
        before: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200',
        after: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200',
    },
    {
        id: 2,
        title: 'Smile Makeover',
        type: 'Porcelain Veneers',
        before: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1200',
        after: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    },
    {
        id: 3,
        title: 'Dental Implants',
        type: 'Single Tooth Replacement',
        before: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&q=80&w=1200',
        after: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200',
    },
];

const BeforeAfterSlider = ({ before, after }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef(null);

    const handleMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const relativeX = x - rect.left;
        const position = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
        setSliderPos(position);
    };

    return (
        <div
            ref={containerRef}
            className='relative w-full aspect-4/3 md:aspect-video rounded-2xl overflow-hidden cursor-ew-resize group shadow-sm border border-slate-200/80'
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            {/* After Image (Background) */}
            <img
                src={after}
                alt='After'
                className='absolute inset-0 w-full h-full object-cover'
            />

            {/* Before Image (Clip) */}
            <div
                className='absolute inset-0 w-full h-full overflow-hidden'
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img
                    src={before}
                    alt='Before'
                    className='absolute inset-0 w-full h-full object-cover'
                />
            </div>

            {/* Slider Handle */}
            <div
                className='absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none'
                style={{ left: `${sliderPos}%` }}
            >
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200'>
                    <svg
                        className='w-6 h-6 text-slate-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2.5'
                            d='M8 7l-4 4m0 0l4 4m-4-4h16m-4-8l4 4m0 0l-4 4'
                        ></path>
                    </svg>
                </div>
            </div>

            {/* Labels */}
            <div className='absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none'>
                Before
            </div>
            <div className='absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none'>
                After
            </div>
        </div>
    );
};

const Portfolio = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % BEFORE_AFTER_CASES.length);
    };

    const handlePrev = () => {
        setActiveIndex(
            (prev) => (prev - 1 + BEFORE_AFTER_CASES.length) % BEFORE_AFTER_CASES.length,
        );
    };

    const getVisibleCases = () => {
        return [
            ...BEFORE_AFTER_CASES.slice(activeIndex),
            ...BEFORE_AFTER_CASES.slice(0, activeIndex),
        ];
    };

    return (
        <section className='py-12 sm:py-16 bg-white relative overflow-hidden'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col lg:flex-row items-center lg:items-end justify-between mb-10 md:mb-12 gap-8'>
                    <div className='max-w-2xl text-center lg:text-left'>
                        <div className='flex items-center justify-center lg:justify-start gap-3 mb-4 text-blue-600'>
                            <span className='h-px w-8 bg-current opacity-30'></span>
                            <span className='font-bold uppercase tracking-widest text-[10px]'>
                                Transformation Gallery
                            </span>
                        </div>
                        <h2 className='text-[clamp(2rem,4vw,3rem)] font-bold text-slate-900 leading-tight tracking-tight'>
                            Witness the <br />
                            <span className='text-blue-600'>Transformation.</span>
                        </h2>
                    </div>

                    <div className='flex gap-3 justify-center lg:justify-end'>
                        <button
                            onClick={handlePrev}
                            className='w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-white transition-all shadow-sm active:translate-y-0 hover:-translate-y-0.5 flex items-center justify-center'
                        >
                            <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2.5'
                                    d='M15 19l-7-7 7-7'
                                ></path>
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className='w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-white transition-all shadow-sm active:translate-y-0 hover:-translate-y-0.5 flex items-center justify-center'
                        >
                            <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2.5'
                                    d='M9 5l7 7-7 7'
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='relative'>
                    <div className='flex gap-6 overflow-visible transition-all duration-500 ease-in-out'>
                        {getVisibleCases().map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                className={`w-full md:w-[calc(33.333%-16px)] shrink-0 transition-all duration-500 ${idx >= 3 ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <div className='space-y-4'>
                                    <BeforeAfterSlider
                                        before={item.before}
                                        after={item.after}
                                    />
                                    <div className='px-1'>
                                        <h3 className='text-sm font-bold text-slate-900 uppercase tracking-tight'>
                                            {item.title}
                                        </h3>
                                        <p className='text-[10px] text-slate-500 font-bold uppercase tracking-widest'>
                                            {item.type}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Left Blur Fade */}
                    <div className='absolute -left-4 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent pointer-events-none z-10 hidden md:block'></div>
                    {/* Right Blur Fade */}
                    <div className='absolute -right-4 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent pointer-events-none z-10 hidden md:block'></div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
