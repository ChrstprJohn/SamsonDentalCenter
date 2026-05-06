import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TeamGrid = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean);
        if (!cards.length) return;

        // Ensure cards are visible initially
        gsap.set(cards, { opacity: 1 });

        // Staggered animation triggered on scroll into viewport
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'top 20%',
                once: true,
            },
        });

        tl.fromTo(
            cards,
            {
                opacity: 0,
                y: 50,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
            }
        );

        // Hover animations
        cards.forEach((card) => {
            const img = card.querySelector('img');
            
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.out',
                });
                if (img) {
                    gsap.to(img, {
                        scale: 1.05,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                });
                if (img) {
                    gsap.to(img, {
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Original 4 doctors
    const team = [
        {
            id: 1,
            name: 'Dr. Mae Angelica Garcellano',
            role: 'Lead Dentist',
            image: '/images/about/team-dr-samson.jpg',
        },
        {
            id: 2,
            name: 'Dr Maria Cheyenne Deniece Marasigan',
            role: 'Dentist',
            image: '/images/about/team-staff.jpg',
        },
        {
            id: 3,
            name: 'Dr. Sarah Samson',
            role: 'Dentist',
            image: '/images/about/team-technicians.jpg',
        },
        {
            id: 4,
            name: 'Dr. Silvestre Samson',
            role: 'Dental Hygienist',
            image: '/images/about/team-founders.jpg',
        },
    ];

    return (
        <>
            <section ref={containerRef} className='bg-white py-16 lg:py-24 relative'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                    <div className='mb-12 md:mb-16'>
                        <div className='max-w-3xl'>
                            <div className='flex items-center gap-3 mb-6'>
                                <span className='h-px w-8 bg-red-600' />
                                <span className='text-red-500 font-bold uppercase tracking-widest text-[10px]'>
                                    Our Team
                                </span>
                            </div>
                            <h2 className='text-[clamp(2.25rem,5vw,3.5rem)] font-bold tracking-tight text-stone-900 leading-[1.1] mb-6'>
                                Our Dedicated Team
                            </h2>
                            <p className='text-lg text-stone-600 leading-relaxed max-w-2xl'>
                                Behind every smile is a team of passionate professionals 
                                dedicated to your comfort and care.
                            </p>
                        </div>
                    </div>

                    {/* Team grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
                        {team.map((doctor, index) => (
                            <div
                                key={doctor.id}
                                ref={(el) => (cardsRef.current[index] = el)}
                                className='group cursor-pointer'
                            >
                                <div className='aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 relative border border-stone-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-red-500/10 transition-all duration-500 ease-in-out'>
                                    <img
                                        src={doctor.image}
                                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                                        alt={doctor.name}
                                        loading='lazy'
                                    />
                                    {/* Subtle overlay */}
                                    <div className='absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-500' />
                                </div>
                                <div className='px-2'>
                                    <h3 className='text-xl sm:text-2xl font-bold text-stone-900 mb-2 leading-tight group-hover:text-red-600 transition-colors duration-300'>
                                        {doctor.name}
                                    </h3>
                                    <div className='flex items-center gap-2'>
                                        <span className='h-px w-4 bg-red-600/30' />
                                        <p className='text-[10px] font-bold text-red-600 uppercase tracking-widest'>
                                            {doctor.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default TeamGrid;
