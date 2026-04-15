import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const heroRef = useRef(null);
    const bgRef = useRef(null);
    const contentRef = useRef(null);

    // Helper to split text into spans for per-letter animation
    const splitText = (text, className = 'hero-letter', extraClasses = '') => {
        return text.split('').map((char, i) => (
            <span
                key={i}
                className={`${className} ${extraClasses} inline-block will-change-transform`}
            >
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                delay: 0.7,
                defaults: { ease: 'expo.out', duration: 1.4 },
            });

            // Line 1: Letter animation (Rising out of mask)
            tl.from('.hero-letter-1', {
                y: '110%',
                opacity: 0,
                stagger: 0.02,
                force3D: true,
            });

            // Line 2: Letter animation (Rising out of mask)
            tl.from(
                '.hero-letter-2',
                {
                    y: '110%',
                    opacity: 0,
                    stagger: 0.02,
                    force3D: true,
                },
                '-=1.1',
            );

            // Initial load animation for subtext, buttons, etc.
            tl.from(
                '.hero-anim',
                {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    clearProps: 'all',
                },
                '-=1',
            );

            // Parallax effect with smoothing (scrub: 1.5) and hardware acceleration
            gsap.to(bgRef.current, {
                y: '20%',
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5, // Smooth "catch-up" lag
                },
            });

            // Smooth fade out of content while scrolling down
            gsap.to(contentRef.current, {
                opacity: 0,
                y: -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'center top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className='relative min-h-svh flex items-center overflow-hidden bg-slate-900'
        >
            {/* Background with overlay */}
            <div
                ref={bgRef}
                className='absolute inset-0 z-0 h-[125%] -top-[10%]'
            >
                <img
                    src='https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1920&auto=format&fit=crop'
                    alt='Dental Office'
                    className='w-full h-full object-cover object-center'
                />
                <div className='absolute inset-0 bg-black/40' />
                <div className='absolute inset-0 bg-linear-to-r from-slate-900/70 via-slate-900/40 to-transparent' />
            </div>

            <div
                ref={contentRef}
                className='relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12'
            >
                <div className='max-w-4xl flex flex-col items-start gap-6 sm:gap-8 pt-32 pb-16 sm:pt-40 lg:pt-48 lg:pb-32'>
                    {/* Headline - fluid typography taking full advantage of clamp */}
                    <h1 className='text-[clamp(2.5rem,7vw+1rem,5.5rem)] font-extrabold tracking-tight text-white leading-[1.05]'>
                        <span className='block overflow-hidden pb-1'>
                            {splitText('Your Smile Is Our', 'hero-letter-1')}
                        </span>
                        <span className='block overflow-hidden pb-2'>
                            {splitText(
                                'First Priority.',
                                'hero-letter-2',
                                'text-transparent bg-clip-text bg-sky-400',
                            )}
                        </span>
                    </h1>

                    {/* Subheading - fluid typography */}
                    <p className='hero-anim text-[clamp(1rem,2vw+0.5rem,1.375rem)] text-slate-300 leading-relaxed max-w-xl font-medium'>
                        Experience world-class dental care with state-of-the-art technology and a
                        team dedicated to your oral health and aesthetic goals.
                    </p>

                    <div className='hero-anim flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2'>
                        <button
                            onClick={() => navigate(user ? '/patient/book' : '/book')}
                            className='group inline-flex items-center justify-center px-8 py-4 text-[clamp(1rem,1.5vw,1.125rem)] font-bold text-white transition-all duration-300 ease-out bg-sky-500 rounded-2xl hover:bg-sky-600 hover:shadow-[0_8px_30px_rgb(14,165,233,0.3)] hover:-translate-y-1 w-full sm:w-auto'
                        >
                            Make an Appointment
                            <svg
                                className='w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/services')}
                            className='inline-flex items-center justify-center px-8 py-4 text-[clamp(1rem,1.5vw,1.125rem)] font-bold transition-all duration-300 ease-out bg-white/10 backdrop-blur-md border-[1.5px] border-white/20 text-white rounded-2xl hover:bg-white/20 hover:border-white/30 hover:shadow-lg focus:outline-none w-full sm:w-auto'
                        >
                            Explore Services
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className='hero-anim flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 w-full max-w-xl'>
                        <div className='flex -space-x-3'>
                            {[
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
                            ].map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    className='w-12 h-12 rounded-full border-[3px] border-slate-900 object-cover shadow-sm ring-1 ring-white/10 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:z-10 hover:shadow-md hover:scale-110 relative'
                                    alt='Reviewer'
                                />
                            ))}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-1 text-amber-400'>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <svg
                                        key={s}
                                        className='w-5 h-5 fill-current drop-shadow-sm'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
                                    </svg>
                                ))}
                            </div>
                            <p className='text-[clamp(0.875rem,1.5vw,1rem)] text-slate-400 font-medium'>
                                Trusted by <span className='font-bold text-white'>2,000+</span>{' '}
                                Happy Patients
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
