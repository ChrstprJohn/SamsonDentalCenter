import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Save, Info } from 'lucide-react';
import Button from '../../../ui/Button';
import { useToast } from '../../../../context/ToastContext.jsx';
import useServices from '../../../../hooks/useServices';

const DoctorProfileDetail = ({ doctor, updateDoctorServices }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { services: allServices = [] } = useServices();
    
    // selectedServices now stores full service objects instead of just names
    const currentServices = doctor.services || [];
    const [selectedServices, setSelectedServices] = useState(
        currentServices.map(s => s.name)
    );

    // Sync state when props update (e.g. after a backend save updates the authorized list)
    React.useEffect(() => {
        setSelectedServices((doctor.services || []).map(s => s.name));
    }, [doctor.services]);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    const categorizedServices = useMemo(() => {
        const fallbackId = (index) => `temp-${index}`;
        
        const mappedServices = allServices.map((s, index) => ({
            id: s.id || fallbackId(index),
            name: s.name,
            category: s.category || (s.tier === 'general' ? 'General' : s.tier === 'specialized' ? 'Specialized' : 'Clinical')
        }));
        
        return {
            authorized: mappedServices.filter(s => selectedServices.includes(s.name)),
            general: mappedServices.filter(s => !selectedServices.includes(s.name) && s.category?.toLowerCase() === 'general'),
            specialized: mappedServices.filter(s => !selectedServices.includes(s.name) && s.category?.toLowerCase() === 'specialized')
        };
    }, [selectedServices, allServices]);

    const renderServiceCheckbox = (service) => {
        const isChecked = selectedServices.includes(service.name);
        return (
            <label 
                key={service.name}
                className={`h-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer group overflow-hidden ${
                    isChecked 
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' 
                        : 'border-gray-100 dark:border-gray-800/80 hover:border-brand-500/50 hover:bg-white dark:hover:bg-white/[0.03] bg-gray-50/30 dark:bg-white/[0.01]'
                }`}
            >
                <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                    <input 
                        type="checkbox"
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 shrink-0"
                        checked={isChecked}
                        onChange={() => toggleService(service.name)}
                    />
                    <div className="min-w-0 max-w-full">
                        <p className={`text-[clamp(11px,2.5vw,14px)] font-semibold text-gray-800 dark:text-white/90 truncate`}>{service.name}</p>
                        <span className={`text-[clamp(8px,2vw,9px)] font-bold uppercase tracking-widest transition-colors block truncate ${isChecked ? 'text-brand-500/70' : 'text-gray-400 group-hover:text-brand-500/70'}`}>
                            {service.category || 'Clinical'}
                        </span>
                    </div>
                </div>
            </label>
        );
    };

    const toggleService = (serviceName) => {
        setSelectedServices(prev => 
            prev.includes(serviceName) 
                ? prev.filter(s => s !== serviceName) 
                : [...prev, serviceName]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (updateDoctorServices) {
                // Find all the matching service IDs from allServices
                const serviceIdsToSave = allServices
                    .filter(s => selectedServices.includes(s.name))
                    .map(s => s.id)
                    .filter(Boolean);
                
                await updateDoctorServices(doctor.id, serviceIdsToSave);
                showToast('Authorized services updated successfully!');
            } else {
                doctor.services = selectedServices.map(name => ({ name }));
                doctor.service_count = selectedServices.length;
                showToast('Authorized services updated successfully!');
            }
        } catch (err) {
            showToast('Failed to update services.', 'error');
        } finally {
            setIsSaving(false);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        showToast("Changes discarded. You've exited edit mode.", 'notice', 'Notice');
        setSelectedServices(currentServices.map(s => s.name));
        setIsEditing(false);
    };

    return (
        <div className='space-y-4'>
            {/* Services & Skills Mapping */}
            <div className='p-4 sm:p-5 border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03]'>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6'>
                    <div>
                        <h4 className='text-[clamp(16px,2.5vw,18px)] font-bold text-gray-900 dark:text-white'>
                            Authorized Services & Skills
                        </h4>
                        <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mt-1'>
                            {selectedServices.length} Clinical Tasks currently authorized for routing logic.
                        </p>
                    </div>

                {!isEditing ? (
                    <div className='hidden lg:block'>
                        <Button 
                            variant='outline'
                            onClick={() => {
                                setIsEditing(true);
                                showToast("You're currently in edit mode! Let's finish these updates.", 'notice', 'Notice');
                            }}
                            className='flex items-center justify-center gap-2 rounded-lg px-4 h-11 text-sm font-bold w-full sm:w-[160px] hover:border-brand-500 hover:text-brand-500 transition-all active:scale-95 font-outfit shadow-sm'
                        >
                            Edit Services
                        </Button>
                    </div>
                ) : (
                    <div className='hidden lg:block'>
                        <Button 
                            variant='outline'
                            onClick={() => showToast('Currently on edit mode', 'notice', 'Notice')}
                            className='flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold xl:w-auto border-brand-200 text-brand-500 bg-brand-50/30 font-outfit cursor-default'
                        >
                            <Info size={18} />
                            Editing Active
                        </Button>
                    </div>
                )}
                </div>

                {isEditing ? (
                    <div className='space-y-8 animate-in fade-in duration-300'>
                        {/* Currently Authorized Section */}
                        {categorizedServices.authorized.length > 0 && (
                            <div className='space-y-3'>
                                <h5 className='text-xs font-black uppercase tracking-widest text-brand-500 flex items-center gap-2'>
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                    Currently Authorized
                                </h5>
                                <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 auto-rows-fr'>
                                    {categorizedServices.authorized.map(renderServiceCheckbox)}
                                </div>
                            </div>
                        )}

                        {/* General Services Section */}
                        {categorizedServices.general.length > 0 && (
                            <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800/50'>
                                <h5 className='text-xs font-black uppercase tracking-widest text-gray-400'>
                                    Available General Services
                                </h5>
                                <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 auto-rows-fr'>
                                    {categorizedServices.general.map(renderServiceCheckbox)}
                                </div>
                            </div>
                        )}

                        {/* Specialized Services Section */}
                        {categorizedServices.specialized.length > 0 && (
                            <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800/50'>
                                <h5 className='text-xs font-black uppercase tracking-widest text-gray-400'>
                                    Available Specialized Services
                                </h5>
                                <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 auto-rows-fr'>
                                    {categorizedServices.specialized.map(renderServiceCheckbox)}
                                </div>
                            </div>
                        )}
                        
                        {/* Action Buttons at the Bottom */}
                        <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                            <button 
                                onClick={handleCancel}
                                className='px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className='flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr'>
                            {selectedServices.length > 0 ? selectedServices.map((service, i) => (
                                <div 
                                    key={i}
                                    className='h-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-800/80 hover:border-brand-500/50 transition-colors group bg-gray-50/50 dark:bg-white/[0.01]'
                                >
                                    <div className='flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden'>
                                        <div className='w-4 h-4 sm:w-5 sm:h-5 rounded bg-brand-500 flex items-center justify-center text-white shrink-0'>
                                            <CheckCircle2 size={10} sm:size={12} strokeWidth={3} />
                                        </div>
                                        <div className="min-w-0 max-w-full">
                                            <p className='text-[clamp(11px,2.5vw,14px)] font-semibold text-gray-800 dark:text-white/90 truncate'>{service}</p>
                                            <span className='text-[clamp(8px,2vw,9px)] font-bold uppercase tracking-widest text-brand-500/80 block truncate'>
                                                Authorized
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className='col-span-full py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl'>
                                    <AlertCircle size={32} className='text-gray-300 mb-3' />
                                    <p className='text-gray-500 dark:text-gray-400 text-sm'>No authorized services configured for this doctor.</p>
                                </div>
                            )}
                        </div>

                        {!isEditing && (
                            <div className='block lg:hidden'>
                                <Button 
                                    variant='outline'
                                    onClick={() => {
                                        setIsEditing(true);
                                        showToast("You're currently in edit mode! Let's finish these updates.", 'info', 'Notice');
                                    }}
                                    className='flex w-full items-center justify-center gap-2 rounded-lg px-4 h-11 text-sm font-bold hover:border-brand-500 hover:text-brand-500 transition-all active:scale-95 font-outfit'
                                >
                                    Edit Services
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorProfileDetail;
