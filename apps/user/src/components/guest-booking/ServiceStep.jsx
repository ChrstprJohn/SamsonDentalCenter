import { useState } from 'react';
import { Lock, ArrowRight, Clock as ClockIcon } from 'lucide-react';
import useServices from '../../hooks/useServices';
import { useAuth } from '../../context/AuthContext';
import SpecializedServiceModal from './SpecializedServiceModal';

const ServiceStep = ({ selectedServiceId, onSelect, onNext, onUpdateFields }) => {
    const { services, loading, error } = useServices();
    const { user } = useAuth();
    const [specializedService, setSpecializedService] = useState(null);
    const [filter, setFilter] = useState('all');

    const handleSelect = (service) => {
        if (service.tier === 'specialized' && !user) {
            setSpecializedService(service);
            return;
        }
        onSelect(service.id, service.name, service.tier, service.duration_minutes);
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
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase'>
                    Select a Service
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed'>
                    Choose the dental service you'd like to book from our available options.
                </p>
            </div>

            {/* Service Type Filter */}
            <div className='flex items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 bg-gray-100 dark:bg-gray-800/50 p-1.5 sm:p-2 rounded-2xl w-fit'>
                {['all', 'general', 'specialized'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all duration-300 ${
                            filter === t
                                ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 shadow-theme-sm ring-1 ring-black/5 dark:ring-white/5'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className='h-[180px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl' />
                    ))}
                </div>
            ) : error ? (
                <div className='text-center text-rose-500 py-10'>{error}</div>
            ) : (
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {filteredServices.map((service) => {
                        const isSelected = String(service.id) === String(selectedServiceId);
                        const isSpecialized = service.tier === 'specialized';
                        const isLocked = isSpecialized && !user;

                        return (
                            <button
                                key={service.id}
                                onClick={() => handleSelect(service)}
                                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all relative group flex flex-col h-full min-h-[160px] sm:min-h-[180px] ${
                                    isSelected
                                        ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-500/10 shadow-theme-sm'
                                        : isLocked
                                          ? 'border-gray-200 bg-gray-50/50 opacity-90 dark:border-gray-800 dark:bg-white/[0.02]'
                                          : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-theme-md'
                                }`}
                            >
                                {isLocked && (
                                    <div className='absolute top-4 right-4 sm:top-5 sm:right-5 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 shadow-theme-xs'>
                                        <Lock size={14} className="sm:hidden" />
                                        <Lock size={16} className="hidden sm:block" />
                                    </div>
                                )}

                                <div className="flex-grow mb-4 sm:mb-5">
                                    <h3 className={`font-bold text-[13px] sm:text-sm md:text-base lg:text-lg pr-8 sm:pr-10 leading-tight mb-1 sm:mb-1.5 ${
                                        isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-gray-800 dark:text-white/90'
                                    }`}>
                                        {service.name}
                                    </h3>
                                    <p className='text-[12px] sm:text-[13px] text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed'>
                                        {service.description}
                                    </p>
                                </div>

                                <div className='flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800'>
                                    <div className='flex items-center gap-2 sm:gap-3'>
                                        <div className='flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-theme-xs'>
                                            <ClockIcon size={12} className='sm:hidden text-brand-500' />
                                            <ClockIcon size={14} className='hidden sm:block text-brand-500' />
                                            {service.duration_minutes}m
                                        </div>
                                    </div>
                                    
                                    {isLocked && (
                                        <div className='flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-amber-100 dark:border-amber-500/20'>
                                            Locked
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {!loading && !error && (!services || services.length === 0) && (
                <div className='text-center text-gray-400 py-20'>
                    <p className='font-medium'>No services available at the moment.</p>
                </div>
            )}

            {/* Navigation */}
            <div className='flex justify-end pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-700'>
                <button
                    onClick={onNext}
                    disabled={!selectedServiceId}
                    className='w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:scale-95
                               text-white font-black px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl
                               transition-all shadow-theme-md disabled:opacity-30 
                               disabled:cursor-not-allowed disabled:active:scale-100
                               flex items-center justify-center gap-2 text-[14px] sm:text-base uppercase tracking-widest'
                >
                    Continue to Date & Time
                    <ArrowRight size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
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
