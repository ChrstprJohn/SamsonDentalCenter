import { useNavigate } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import useServices from '../../hooks/useServices';

const HomeServices = () => {
    const navigate = useNavigate();
    const { services, loading } = useServices();

    // Mapping services to include images if they don't have them
    const serviceImages = [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
    ];

    const gridItems = services.slice(0, 5).map((s, idx) => ({ ...s, image: serviceImages[idx] }));
    const listItems = services.slice(5);

    const getGridClasses = (index) => {
        switch (index) {
            case 0:
                return 'col-span-2 md:col-span-4 h-[300px] md:h-[450px]';
            default:
                return 'col-span-1 h-[280px] md:h-[420px]';
        }
    };

    return (
        <section className='bg-slate-900 py-16 sm:py-24 lg:py-32 relative overflow-hidden'>
            {/* Background Decor */}
            <div className='absolute top-0 right-0 w-200 h-200 bg-blue-600/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-700'></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='max-w-3xl mb-12 md:mb-20'>
                    <div className='flex items-center gap-3 mb-6'>
                        <span className='h-px w-8 bg-blue-600'></span>
                        <span className='text-blue-500 font-bold uppercase tracking-widest text-[10px]'>
                            Medical Services
                        </span>
                    </div>
                    <h2 className='text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-[1.1] tracking-tight'>
                        Clinical <br />
                        <span className='text-slate-500'>Solutions.</span>
                    </h2>
                </div>

                {loading ? (
                    <div className='text-center text-slate-400 py-20 flex flex-col items-center gap-4'>
                        <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                        <span className='text-sm font-medium tracking-wide'>
                            Loading therapeutic options...
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Image Grid (01-05) */}
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16'>
                            {gridItems.map((service, idx) => (
                                <div
                                    key={service.id}
                                    onClick={() => navigate(`/services/${service.id}`)}
                                    className={`group relative overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 hover:border-blue-500/30 cursor-pointer ${getGridClasses(idx)} shadow-sm hover:shadow-md`}
                                >
                                    <img
                                        src={service.image}
                                        className='absolute inset-0 w-full h-full object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105'
                                        alt={service.name}
                                    />

                                    <div className='absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-500'></div>
                                    <div className='absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity'></div>

                                    <div className='absolute top-6 left-6 text-white/70 font-bold text-xs tracking-tighter group-hover:text-blue-400 transition-colors'>
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>

                                    <div className='absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transform transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:rotate-45'>
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
                                                d='M5 19L19 5m0 0H8m11 0v11'
                                            ></path>
                                        </svg>
                                    </div>

                                    <div className='absolute bottom-6 left-6 pr-8'>
                                        <h3
                                            className={`font-bold text-white tracking-tight leading-[1.2] ${idx === 0 ? 'text-2xl md:text-4xl max-w-lg' : 'text-lg md:text-2xl max-w-37.5'}`}
                                        >
                                            {service.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* List View (06+) */}
                        <div className='border-t border-white/10 divide-y divide-white/10'>
                            {listItems.map((service, idx) => {
                                const displayIndex = idx + 6;
                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => navigate(`/services/${service.id}`)}
                                        className='group flex items-center justify-between py-10 md:py-14 px-4 hover:px-8 transition-all duration-500 cursor-pointer hover:bg-white/[0.02]'
                                    >
                                        <div className='flex items-center gap-8 md:gap-20'>
                                            <span className='text-white/30 font-bold text-sm md:text-base group-hover:text-blue-500 transition-colors'>
                                                {String(displayIndex).padStart(2, '0')}
                                            </span>
                                            <h3 className='text-xl md:text-4xl font-bold text-white/80 group-hover:text-white transition-colors tracking-tight'>
                                                {service.name}
                                            </h3>
                                        </div>

                                        <div className='w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500'>
                                            <svg
                                                className='w-6 h-6 md:w-7 md:h-7'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2.5'
                                                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* CTA Banner */}
                <div className='mt-24 flex flex-col md:flex-row items-center justify-between bg-blue-50/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 md:p-6 group'>
                    <div className='flex flex-col md:flex-row items-center gap-6 px-6 py-6 text-center md:text-left'>
                        <div className='w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-sm'>
                            <svg
                                className='w-7 h-7'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <p className='text-white font-bold text-xl md:text-2xl tracking-tight'>
                                Start Your Journey Today
                            </p>
                            <p className='text-slate-500 font-medium text-xs mt-1 uppercase tracking-wider'>
                                Book a comprehensive 3D scan and diagnostic
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/services')}
                        className='w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold py-5 px-12 rounded-xl text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                    >
                        View All Services
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HomeServices;
