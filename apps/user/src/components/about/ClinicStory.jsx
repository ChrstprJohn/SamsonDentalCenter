import SectionHeading from '../common/SectionHeading';

const ClinicStory = () => {
    return (
        <section className='py-24 sm:py-32 bg-white relative overflow-hidden'>
            {/* Background Decor */}
            <div className='absolute top-0 left-0 w-150 h-150 bg-blue-600/5 rounded-full blur-[120px] -ml-40 -mt-40 pointer-events-none'></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center'>
                    {/* Visual Side */}
                    <div className='lg:col-span-5'>
                        <div className='relative group'>
                            {/* Decorative Frame */}
                            <div className='absolute -inset-4 bg-slate-100/80 rounded-3xl -rotate-2 transition-transform group-hover:rotate-0 duration-500'></div>

                            <div className='relative aspect-4/5 rounded-2xl overflow-hidden shadow-2xl border border-white'>
                                <img
                                    src='https://images.unsplash.com/photo-1629909613654-2871b740801a?auto=format&fit=crop&q=80&w=800'
                                    alt='Clinic Atmosphere'
                                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                                />
                                <div className='absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent'></div>
                            </div>

                            {/* Floating Achievement */}
                            <div className='absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-50 animate-bounce-slow'>
                                <p className='text-3xl font-bold text-blue-600 mb-1'>12+</p>
                                <p className='text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight'>
                                    Years of Clinical Mastery
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Narrative Side */}
                    <div className='lg:col-span-7 space-y-8'>
                        <div className='space-y-6'>
                            <p className='text-xl text-slate-900 font-semibold leading-relaxed'>
                                Founded with a singular passion for merging medical precision with
                                patient comfort.
                            </p>
                            <p className='text-lg text-slate-600 leading-relaxed font-medium'>
                                Samson Dental Center has evolved from a local practice into a
                                premier dental hub. Our journey is defined by a relentless pursuit
                                of the latest dental innovations, ensuring our patients receive
                                nothing short of world-class treatment.
                            </p>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-slate-100'>
                                <div>
                                    <h4 className='font-bold text-slate-900 mb-2'>
                                        Patient-First Philosophy
                                    </h4>
                                    <p className='text-sm text-slate-500 leading-relaxed'>
                                        We believe every smile tells a unique story. Our approach is
                                        tailored, compassionate, and deeply personal.
                                    </p>
                                </div>
                                <div>
                                    <h4 className='font-bold text-slate-900 mb-2'>
                                        Cutting-Edge Tech
                                    </h4>
                                    <p className='text-sm text-slate-500 leading-relaxed'>
                                        From 3D imaging to painless laser therapy, we invest in the
                                        future of your oral health today.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='pt-4'>
                            <button className='group flex items-center gap-3 text-blue-600 font-bold text-sm tracking-widest uppercase'>
                                Explore Our Philosophy
                                <span className='h-px w-8 bg-blue-600 transition-all duration-300 group-hover:w-12'></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClinicStory;
