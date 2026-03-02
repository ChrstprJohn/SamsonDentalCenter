import { forwardRef, useRef } from 'react';
import SectionHeading from '../common/SectionHeading';

const PROMOTIONS = [
    {
        id: 1,
        title: 'New Patient Special',
        discount: '20% OFF',
        description: 'Get 20% off your first comprehensive exam, x-rays, and cleaning.',
        code: 'NEW20',
        gradient: 'from-blue-400 to-blue-600',
    },
    {
        id: 2,
        title: 'Teeth Whitening',
        discount: '$100 OFF',
        description: 'Brighten your smile with our professional in-office whitening treatment.',
        code: 'BRIGHT100',
        gradient: 'from-blue-400 to-blue-600',
    },
    {
        id: 3,
        title: 'Invisalign Consultation',
        discount: 'FREE',
        description: 'Book a complimentary consultation to see if Invisalign is right for you.',
        code: 'SMILEFREE',
        gradient: 'from-blue-400 to-blue-600',
    },
];

const Promotions = forwardRef((props, ref) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount =
                direction === 'left'
                    ? -scrollRef.current.offsetWidth * 0.8
                    : scrollRef.current.offsetWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section
            ref={ref}
            className='py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden'
        >
            {/* Background Decor */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-24 -right-24 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl opacity-50'></div>
                <div className='absolute top-1/2 -left-24 w-72 h-72 bg-blue-50/30 rounded-full blur-3xl opacity-50'></div>
            </div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6'>
                    <div className='max-w-xl'>
                        <div className='flex items-center gap-3 mb-4'>
                            <span className='relative flex h-3 w-3'>
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
                                <span className='relative inline-flex rounded-full h-3 w-3 bg-blue-600'></span>
                            </span>
                            <span className='text-blue-600 font-bold uppercase tracking-widest text-xs sm:text-sm'>
                                Limited Time Offers
                            </span>
                        </div>
                        <SectionHeading
                            title='Exclusive Patient Perks'
                            subtitle='Take advantage of our seasonal promotions designed to make premium dental care more accessible.'
                            className='!text-left !mb-0'
                        />
                    </div>
                    {/* Mobile Navigation Buttons */}
                    <div className='flex gap-3 md:hidden self-end'>
                        <button
                            onClick={() => scroll('left')}
                            className='w-10 h-10 rounded-xl bg-slate-100/80 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out shadow-sm'
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
                                    strokeWidth='2'
                                    d='M15 19l-7-7 7-7'
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className='w-10 h-10 rounded-xl bg-slate-100/80 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out shadow-sm'
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
                                    strokeWidth='2'
                                    d='M9 5l7 7-7 7'
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className='flex md:grid md:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide'
                >
                    {PROMOTIONS.map((promo) => (
                        <div
                            key={promo.id}
                            className='min-w-[280px] w-[85vw] md:w-auto md:min-w-0 snap-center group relative bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 border border-slate-200/80 overflow-hidden shrink-0 flex flex-col h-full'
                        >
                            {/* Gradient Blob Background */}
                            <div
                                className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-br ${promo.gradient} opacity-5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity duration-200 group-hover:opacity-10`}
                            ></div>

                            <div className='relative z-10 flex flex-col h-full'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div
                                        className={`bg-linear-to-r ${promo.gradient} text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-sm tracking-wide`}
                                    >
                                        {promo.discount}
                                    </div>
                                    <div className='w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-colors duration-200'>
                                        <svg
                                            className='w-5 h-5'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className='text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 leading-tight'>
                                    {promo.title}
                                </h3>

                                <p className='text-sm sm:text-base text-slate-600 leading-relaxed mb-8 grow'>
                                    {promo.description}
                                </p>

                                <div className='bg-slate-50/80 rounded-xl p-4 border border-slate-200/50 border-dashed flex items-center justify-between group-hover:border-blue-200/80 transition-colors duration-200'>
                                    <div className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest'>
                                        Promo Code
                                    </div>
                                    <div className='font-mono font-bold text-slate-900 tracking-wider'>
                                        {promo.code}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Promotions.displayName = 'Promotions';
export default Promotions;
