import { useState } from 'react';
import { Lock } from 'lucide-react';
import useServices from '../../hooks/useServices';
import { useAuth } from '../../context/AuthContext';
import SpecializedServiceModal from './SpecializedServiceModal';

/**
 * Service selection step - displays both general and specialized services.
 *
 * Two-Tier Behavior:
 * - GENERAL services: Direct selection → proceed to next step
 * - SPECIALIZED services: Show lock icon → open modal on click → redirect to login/register
 */
const ServiceStep = ({ selectedServiceId, onSelect, onNext, onUpdateFields }) => {
    const { services, loading, error } = useServices();
    const { user } = useAuth();
    const [specializedService, setSpecializedService] = useState(null);

    const [filter, setFilter] = useState('all');

    const handleSelect = (service) => {
        // If specialized service AND user is NOT logged in → show modal
        if (service.tier === 'specialized' && !user) {
            setSpecializedService(service);
            return;
        }

        // ✅ When service changes, clear the previously selected date and time
        // (Different services have different time slots)
        onSelect(service.id, service.name, service.tier);
        if (onUpdateFields) {
            onUpdateFields({ date: '', time: '' });
        }
    };

    const filteredServices = (services || []).filter((s) => {
        if (filter === 'all') return true;
        return s.tier === filter;
    });

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Select a Service</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Choose the dental service you'd like to book.
            </p>

            {/* Service Type Filter */}
            <div className='flex flex-wrap gap-2 mb-6'>
                {['all', 'general', 'specialized'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                            filter === t
                                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-500/10'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                        }`}
                    >
                        {t === 'all' ? 'All Services' : `${t} Services`}
                    </button>
                ))}
            </div>

            {loading && <div className='text-center text-slate-400 py-12'>Loading services...</div>}

            {error && (
                <div className='text-center text-red-500 py-12'>
                    Failed to load services. Please try again.
                </div>
            )}

            {!loading && !error && filteredServices && filteredServices.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
                    {filteredServices.map((service) => {
                        const isSelected = service.id === selectedServiceId;
                        const isSpecialized = service.tier === 'specialized';
                        const isLocked = isSpecialized && !user; // Only locked if specialized AND not logged in

                        return (
                            <button
                                key={service.id}
                                onClick={() => handleSelect(service)}
                                className={`text-left p-4 rounded-xl border-2 transition-all relative ${
                                    isSelected
                                        ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/20'
                                        : isLocked
                                          ? 'border-amber-100 bg-amber-50/30 hover:border-amber-200 cursor-pointer'
                                          : 'border-slate-100 bg-white hover:border-sky-200 hover:bg-sky-50/50'
                                }`}
                            >
                                {/* Lock icon badge for locked services */}
                                {isLocked && (
                                    <div className='absolute top-3 right-3 bg-amber-500 text-white rounded-full p-1.5 shadow-lg'>
                                        <Lock size={14} />
                                    </div>
                                )}

                                <h3 className='font-semibold text-slate-900 text-sm pr-8'>
                                    {service.name}
                                </h3>
                                <p className='text-xs text-slate-500 mt-1 line-clamp-2'>
                                    {service.description}
                                </p>

                                {/* Show "Login required" label only for locked services */}
                                {isLocked && (
                                    <p className='text-xs text-amber-600 font-medium mt-2'>
                                        🔒 Login required to book
                                    </p>
                                )}

                                <div className='flex items-center gap-3 mt-2'>
                                    <span className='text-xs text-sky-600 font-medium'>
                                        ⏱ {service.duration_minutes} min
                                    </span>
                                    {service.price && (
                                        <span className='text-xs text-slate-700 font-bold'>
                                            ₱{Number(service.price).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {!loading && !error && (!services || services.length === 0) && (
                <div className='text-center text-slate-400 py-12'>
                    No services available at the moment.
                </div>
            )}

            {/* Navigation */}
            <div className='flex justify-end'>
                <button
                    onClick={onNext}
                    disabled={!selectedServiceId}
                    className='bg-sky-500 hover:bg-sky-600 active:bg-sky-700
                               text-white font-semibold px-6 py-2.5 rounded-xl
                               transition-colors shadow-lg shadow-sky-500/20
                               disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    Next: Pick Date & Time →
                </button>
            </div>

            {/* Specialized Service Modal */}
            {specializedService && (
                <SpecializedServiceModal
                    service={specializedService}
                    onClose={() => setSpecializedService(null)}
                />
            )}
        </div>
    );
};

export default ServiceStep;
