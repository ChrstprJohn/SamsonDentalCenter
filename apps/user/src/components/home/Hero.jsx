import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className='relative min-h-[100svh] flex items-center overflow-hidden bg-slate-50'>
            {/* Background with overlay */}
            <div className='absolute inset-0 z-0'>
                <img
                    src='https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1920&auto=format&fit=crop'
                    alt='Dental Office'
                    className='w-full h-full object-cover object-center'
                />
                <div className='absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:from-white/98 sm:via-white/90' />
            </div>

            <div className='relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12'>
                <div className='max-w-2xl flex flex-col items-start gap-6 sm:gap-8 py-16 sm:py-24 lg:py-32'>
                    {/* Badge */}
                    <span className='inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 text-blue-700 text-sm font-medium tracking-wide ring-1 ring-inset ring-blue-600/10 backdrop-blur-sm'>
                        Welcome to Samson Dental Center
                    </span>

                    {/* Headline */}
                    <h1 className='text-[clamp(2.25rem,5vw+0.5rem,4rem)] font-bold tracking-tight text-slate-900 leading-[1.15]'>
                        Your Smile Is Our
                        <span className='text-blue-600 sm:block mt-1 sm:mt-2'>
                            {' '}
                            First Priority.
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className='text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] text-slate-600 leading-relaxed max-w-xl'>
                        Experience world-class dental care with state-of-the-art technology and a
                        team dedicated to your oral health and aesthetic goals.
                    </p>

                    {/* CTA Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2'>
                        <button
                            onClick={() => navigate('/book')}
                            className='inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 ease-in-out bg-slate-900 rounded-xl hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 w-full sm:w-auto'
                        >
                            Make an Appointment
                        </button>
                        <button
                            onClick={() => navigate('/services')}
                            className='inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-xl hover:bg-white hover:text-slate-900 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 w-full sm:w-auto'
                        >
                            Explore Services
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-200/70 w-full max-w-xl'>
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
                                    className='w-11 h-11 rounded-full border-3 border-white object-cover shadow-sm ring-1 ring-slate-900/5 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:z-10 hover:shadow-md relative'
                                    alt='Reviewer'
                                />
                            ))}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-0.5 text-amber-400'>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <svg
                                        key={s}
                                        className='w-4 h-4 fill-current'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
                                    </svg>
                                ))}
                            </div>
                            <p className='text-sm text-slate-600'>
                                Trusted by{' '}
                                <span className='font-semibold text-slate-900'>2,000+</span> Happy
                                Patients
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
