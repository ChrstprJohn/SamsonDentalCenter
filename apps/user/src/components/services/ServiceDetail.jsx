import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ServiceDetail = ({ service, loading, error }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className='min-h-[50vh] flex items-center justify-center text-slate-400'>
                Loading service details...
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className='min-h-[50vh] flex flex-col items-center justify-center'>
                <p className='text-amber-600 mb-4 text-center max-w-sm'>
                    {error
                        ? "We're using cached service information due to a temporary connection issue."
                        : 'Service not found.'}
                </p>
                <button
                    onClick={() => navigate('/services')}
                    className='text-sky-500 hover:text-sky-600 font-medium text-sm'
                >
                    ← Back to Services
                </button>
            </div>
        );
    }

    return (
        <section className='py-16 sm:py-20 bg-white'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Back link */}
                <button
                    onClick={() => navigate('/services')}
                    className='flex items-center gap-1 text-sky-500 hover:text-sky-600
                               font-medium text-sm mb-8 transition-colors'
                >
                    <ChevronLeft size={16} />
                    Back to Services
                </button>

                {/* Service info */}
                <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 mb-4'>
                    {service.name}
                </h1>

                <div className='flex flex-wrap items-center gap-4 mb-6'>
                    <span className='inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium'>
                        ⏱ {service.duration_minutes} min
                    </span>
                    {service.price && (
                        <span className='inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium'>
                            ₱{Number(service.price).toLocaleString()}
                        </span>
                    )}
                </div>

                <p className='text-slate-600 leading-relaxed mb-8'>{service.description}</p>

                {/* Requirements — if the backend provides them */}
                {service.requirements && (
                    <div className='bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8'>
                        <h3 className='font-semibold text-amber-800 text-sm mb-2'>
                            Before Your Appointment
                        </h3>
                        <p className='text-sm text-amber-700'>{service.requirements}</p>
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={() => navigate(`/book?service=${service.id}`)}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold
                               px-8 py-3 rounded-xl transition-colors shadow-lg shadow-sky-500/25'
                >
                    Book This Service
                </button>
            </div>
        </section>
    );
};

export default ServiceDetail;
