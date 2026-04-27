import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Save, Info } from 'lucide-react';
import Button from '../../../ui/Button';
import { useToast } from '../../../../context/ToastContext.jsx';
import useServices from '../../../../hooks/useServices';

const DoctorServicesDetail = ({ doctor, updateDoctorServices }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { services: allServices = [] } = useServices();
    
    const currentServices = doctor.services || [];
    const [selectedServices, setSelectedServices] = useState(
        currentServices.map(s => s.name)
    );

    React.useEffect(() => {
        setSelectedServices((doctor.services || []).map(s => s.name));
    }, [doctor.services]);

    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    const categorizedServices = useMemo(() => {
        const fallbackId = (index) => `temp-${index}`;
        
        const mappedServices = allServices.map((s, index) => ({
            id: s.id,
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
                        : 'border-gray-200 dark:border-gray-800/80 hover:border-brand-500/50 hover:bg-white dark:hover:bg-white/[0.03] bg-gray-50/30 dark:bg-white/[0.01]'
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
                        <p className={`text-[clamp(11px,1.2vw,13px)] font-bold text-gray-800 dark:text-white/90 truncate transition-all duration-300`}>{service.name}</p>
                        <span className={`text-[clamp(9px,1vw,10px)] font-bold uppercase tracking-widest transition-colors block truncate ${isChecked ? 'text-brand-500/70' : 'text-gray-400 group-hover:text-brand-500/70'}`}>
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
                const serviceIdsToSave = allServices
                    .filter(s => selectedServices.includes(s.name))
                    .map(s => s.id)
                    .filter(Boolean);
                
                await updateDoctorServices(doctor.id, serviceIdsToSave);
                showToast('Authorized services updated successfully!');
            } else {
                showToast('Mock: Services updated!');
            }
        } catch (err) {
            showToast('Failed to update services.', 'error');
        } finally {
            setIsSaving(false);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        showToast("Changes discarded.", 'notice');
        setSelectedServices(currentServices.map(s => s.name));
        setIsEditing(false);
    };

    return (
        <div className='p-[clamp(16px,3vw,24px)] border border-gray-200 rounded-[clamp(12px,2vw,16px)] dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm transition-all duration-300'>
            <div className='flex flex-col gap-[clamp(16px,2vw,24px)] lg:flex-row lg:items-start lg:justify-between mb-[clamp(16px,3vw,24px)]'>
                <div>
                    <h4 className='text-[clamp(14px,1.5vw,16px)] font-bold text-gray-900 dark:text-white uppercase tracking-tight'>
                        Authorized Services & Skills
                    </h4>
                    <p className='text-[clamp(10px,1vw,11px)] font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest'>
                        {selectedServices.length} Clinical Tasks currently authorized
                    </p>
                </div>

                {!isEditing ? (
                    <Button 
                        variant='outline'
                        onClick={() => setIsEditing(true)}
                        className='flex items-center justify-center gap-2 rounded-lg px-4 h-11 text-sm font-bold sm:w-[160px] hover:border-brand-500 hover:text-brand-500 transition-all active:scale-95 shadow-sm font-outfit uppercase tracking-widest text-[9px]'
                    >
                        Edit Services
                    </Button>
                ) : (
                    <div className='flex items-center gap-2 text-brand-500 bg-brand-50/50 p-2 rounded-lg'>
                        <Info size={16} />
                        <span className='text-[9px] font-black uppercase tracking-widest'>Edit Mode Active</span>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className='space-y-8 animate-in fade-in duration-300'>
                    {categorizedServices.authorized.length > 0 && (
                        <div className='space-y-[clamp(8px,1vw,12px)]'>
                            <h5 className='text-[clamp(9px,1vw,10px)] font-black uppercase tracking-widest text-brand-500 flex items-center gap-[clamp(4px,0.5vw,6px)]'>
                                <CheckCircle2 size={12} strokeWidth={3} />
                                Currently Authorized
                            </h5>
                            <div className='grid grid-cols-2 lg:grid-cols-3 gap-[clamp(8px,1vw,12px)]'>
                                {categorizedServices.authorized.map(renderServiceCheckbox)}
                            </div>
                        </div>
                    )}
                    {/* General/Specialized... omitted for brevity in this scratch but should match logic */}
                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-[clamp(8px,1vw,12px)]'>
                        {categorizedServices.general.map(renderServiceCheckbox)}
                        {categorizedServices.specialized.map(renderServiceCheckbox)}
                    </div>
                    
                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800'>
                        <button onClick={handleCancel} className='px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all'>Cancel</button>
                        <button onClick={handleSave} disabled={isSaving} className='px-6 py-2 text-[9px] font-bold uppercase tracking-widest bg-brand-500 text-white rounded-lg shadow-lg shadow-brand-500/20 active:scale-95 transition-all'>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-[clamp(8px,1vw,12px)] auto-rows-fr'>
                    {selectedServices.length > 0 ? selectedServices.map((service, i) => (
                        <div key={i} className='h-full flex items-center justify-between p-[clamp(10px,1.5vw,14px)] rounded-[clamp(8px,1vw,12px)] border border-gray-200 dark:border-gray-800/80 bg-gray-50/30 dark:bg-white/[0.01] transition-all duration-300'>
                            <div className='flex items-center gap-[clamp(6px,1vw,10px)] min-w-0'>
                                <div className='w-4 h-4 rounded bg-brand-500 flex items-center justify-center text-white shrink-0'>
                                    <CheckCircle2 size={10} strokeWidth={3} />
                                </div>
                                <div className="min-w-0">
                                    <p className='text-[clamp(11px,1.2vw,13px)] font-bold text-gray-800 dark:text-white/90 truncate transition-all duration-300'>{service}</p>
                                    <span className='text-[clamp(8px,1vw,9px)] font-bold uppercase tracking-widest text-brand-500/70 transition-all duration-300'>Authorized</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className='col-span-full py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl'>
                            <AlertCircle size={24} className='text-gray-300 mb-2' />
                            <p className='text-[11px] text-gray-400 font-bold uppercase tracking-widest'>No services configured</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorServicesDetail;
