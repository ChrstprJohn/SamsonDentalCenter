import { useNavigate } from 'react-router-dom';
import useServices from '../../hooks/useServices';

const ServicesList = () => {
    const navigate = useNavigate();
    const { services, loading, error } = useServices();

    // Mapping services to include images if they don't have them
    const serviceImages = [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1445527815219-ec9fc013d333?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    ];

    const getGridClasses = (index) => {
        // Every card takes exactly 1 slot now
        return 'col-span-1 h-[280px] md:h-[350px]';
    };

    return (
        <section className='bg-slate-900 py-10 sm:py-13 lg:py-26 relative overflow-hidden'>
            {/* Background Decor */}
            <div className='absolute top-0 right-0 w-125 h-125 bg-blue-600/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-700 pointer-events-none'></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='max-w-3xl mb-12 md:mb-20'>
                    <div className='flex items-center gap-3 mb-6'>
                        <span className='h-px w-8 bg-blue-600'></span>
                        <span className='text-blue-500 font-bold tracking-wide text-sm'>
                            Medical Services
                        </span>
                    </div>
                    <h2 className='text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-[1.1] tracking-tight'>
                        Clinical <br />
                        <span className='text-slate-500'>Solutions.</span>
                    </h2>
                </div>

                {loading && (
                    <div className='flex flex-col items-center justify-center py-32 gap-4'>
                        <div className='w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin'></div>
                        <p className='text-slate-400 font-medium animate-pulse'>
                            Curating services...
                        </p>
                    </div>
                )}

                {!loading && services?.length === 0 && !error && (
                    <div className='text-center py-32 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 backdrop-blur-sm'>
                        <p className='text-slate-400 font-medium'>
                            Our service catalog is currently being updated.
                        </p>
                    </div>
                )}

                {services?.length > 0 && (
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16'>
                        {services.map((service, idx) => {
                            const imageStr = serviceImages[idx % serviceImages.length];
                            return (
                                <div
                                    key={service.id}
                                    onClick={() => navigate(`/services/${service.id}`)}
                                    className={`group relative overflow-hidden rounded-2xl border border-white/5 transition-all duration-300 ease-in-out hover:border-blue-500/30 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 ${getGridClasses(idx)}`}
                                >
                                    <img
                                        src={imageStr}
                                        className='absolute inset-0 w-full h-full object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105'
                                        alt={service.name}
                                    />

                                    <div className='absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-300 ease-in-out'></div>
                                    <div className='absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 ease-in-out'></div>

                                    <div className='absolute top-6 left-6 text-white/70 font-bold text-sm tracking-tight group-hover:text-blue-400 transition-colors duration-200 ease-in-out'>
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>

                                    <div className='absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transform transition-all duration-300 ease-in-out group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:rotate-45'>
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
                                                d='M5 19L19 5m0 0H8m11 0v11'
                                            ></path>
                                        </svg>
                                    </div>

                                    <div className='absolute bottom-6 left-6 pr-8 flex flex-col gap-2'>
                                        <h3 className='font-bold text-white tracking-tight leading-[1.15] text-[clamp(1.125rem,2vw+0.5rem,1.5rem)] max-w-60'>
                                            {service.name}
                                        </h3>
                                        {service.duration_minutes && (
                                            <span className='inline-block text-blue-300 font-medium text-sm drop-shadow-sm'>
                                                ⏱ {service.duration_minutes} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CTA Banner */}
                {/* <div className='mt-16 md:mt-24 flex flex-col md:flex-row items-center justify-between bg-white backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 md:p-6 shadow-sm group transition-all duration-300 ease-in-out hover:border-blue-200 hover:shadow-md'>
                    <div className='flex flex-col md:flex-row items-center gap-6 px-6 py-6 text-center md:text-left'>
                        <div className='w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm'>
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
                        <div className='flex flex-col gap-1'>
                            <p className='text-slate-900 font-bold text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] tracking-tight leading-[1.15]'>
                                Start Your Journey Today
                            </p>
                            <p className='text-slate-500 font-medium text-sm tracking-wide'>
                                Book a comprehensive diagnostic and consultation
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/services')}
                        className='w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-xl text-sm transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                    >
                        View All Services
                    </button>
                </div> */}
            </div>
        </section>
    );
};

export default ServicesList;
