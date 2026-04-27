import React, { useState } from 'react';
import { PhilippinePeso, Clock, Image as ImageIcon, Plus, Info, Settings, MoreVertical, Pencil, Sliders } from 'lucide-react';
import { Button, Modal, Input, Label, Switch } from '../ui';
import { useToast } from '../../context/ToastContext';
import { useSidebar } from '../../context/SidebarContext';

const ServiceDetailView = ({ service: initialService, onBack }) => {
    const [service, setService] = useState(initialService);
    const [isSaving, setIsSaving] = useState(false);
    const [isOperationalModalOpen, setIsOperationalModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState(service.image_url || '');

    const { showToast } = useToast();
    const { isExpanded, isHovered } = useSidebar();
    const isSidebarOpen = isExpanded || isHovered;

    if (!service) return null;

    const handleSaveImage = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulating save
        setTimeout(() => {
            setService(prev => ({ ...prev, image_url: tempImageUrl }));
            setIsSaving(false);
            setIsImageModalOpen(false);
            showToast('Service photo updated successfully!');
        }, 800);
    };

    const handleSaveOperational = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);

        // Simulating save
        setTimeout(() => {
            setService(prev => ({
                ...prev,
                cost: formData.get('cost'),
                duration: formData.get('duration'),
                tier: formData.get('tier')
            }));
            setIsSaving(false);
            setIsOperationalModalOpen(false);
            showToast('Operational details updated successfully!');
        }, 800);
    };

    const handleSaveContent = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);

        // Simulating save
        setTimeout(() => {
            setService(prev => ({
                ...prev,
                name: formData.get('name'),
                description: formData.get('description'),
            }));
            setIsSaving(false);
            setIsContentModalOpen(false);
            showToast('Service identity updated successfully!');
        }, 800);
    };

    return (
        <div className='grow overflow-y-auto no-scrollbar'>
            <div className='p-4 sm:p-0 space-y-4 sm:space-y-6 w-full'>

                {/* A. Header / Hero Section - Contained on Mobile */}
                <div className='overflow-hidden border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm relative group/hero'>
                    <div className='relative h-48 sm:h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden'>
                        {service.image_url ? (
                            <img
                                src={service.image_url}
                                alt={service.name}
                                className='w-full h-full object-cover opacity-60 dark:opacity-40'
                            />
                        ) : (
                            <div className='w-full h-full bg-gradient-to-br from-brand-500/10 to-brand-500/5 flex items-center justify-center'>
                                <ImageIcon size={64} className='text-brand-500/20' />
                            </div>
                        )}
                        <div className='absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent' />

                        {/* Floating Image Actions - Reverted to Top Right per user request */}
                        <div className='absolute top-4 sm:top-6 right-4 sm:right-6 z-10'>
                            <button
                                onClick={() => {
                                    setTempImageUrl(service.image_url || '');
                                    setIsImageModalOpen(true);
                                }}
                                className='flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] hover:bg-brand-500 hover:text-white transition-all active:scale-95 shadow-2xl shadow-black/10'
                            >
                                <ImageIcon size={14} strokeWidth={2.5} />
                                Update Photo
                            </button>
                        </div>

                        <div className='absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col'>
                            <div className='flex flex-col'>
                                <span className='text-[8px] sm:text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] mb-1 sm:mb-2'>
                                    {service.tier} Service
                                </span>
                                <h1 className={`mb-1 text-[clamp(18px,2.5vw,24px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight leading-tight transition-all duration-300 ease-in-out`}>
                                    {service.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch transition-all duration-300 ease-in-out'>
                    {/* B. Content & Identity Section - Contained on Mobile */}
                    <div className='flex flex-col h-full transition-all duration-300 ease-in-out'>
                        <div className='p-4 sm:p-6 border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm flex flex-col h-full transition-all duration-300 ease-in-out'>
                            <div className='flex items-center justify-between mb-4 sm:mb-6 transition-all duration-300 ease-in-out'>
                                <div className='flex items-center gap-2 sm:gap-3'>
                                    <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500'>
                                        <Info size={16} sm={20} />
                                    </div>
                                    <h3 className={`text-[clamp(14px,1.5vw,18px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight transition-all duration-300 ease-in-out`}>
                                        Service Detail
                                    </h3>
                                </div>
                                <div className='hidden sm:block'>
                                    <Button
                                        variant='outline'
                                        onClick={() => setIsContentModalOpen(true)}
                                        className='flex items-center gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 h-8 sm:h-10 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:border-brand-500 hover:text-brand-500'
                                    >
                                        <Pencil size={14} strokeWidth={2.5} />
                                        <span>Edit</span>
                                    </Button>
                                </div>
                            </div>

                            <div className='space-y-4 sm:space-y-6 flex-grow transition-all duration-300 ease-in-out'>
                                <div className='transition-all duration-300 ease-in-out'>
                                    <Label className={`text-[clamp(8px,1vw,11px)] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1 sm:mb-2 block transition-all duration-300 ease-in-out`}>Display Name</Label>
                                    <p className={`text-[clamp(12px,1.5vw,16px)] font-bold text-gray-900 dark:text-white uppercase tracking-tight transition-all duration-300 ease-in-out`}>{service.name}</p>
                                </div>
                                <div className='transition-all duration-300 ease-in-out'>
                                    <Label className={`text-[clamp(8px,1vw,11px)] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1 sm:mb-2 block transition-all duration-300 ease-in-out`}>Description</Label>
                                    <p className={`text-[clamp(11px,1.2vw,14px)] text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl font-medium transition-all duration-300 ease-in-out`}>
                                        {service.description || 'No description provided for this service.'}
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant='outline'
                                onClick={() => setIsContentModalOpen(true)}
                                className='flex sm:hidden items-center justify-center gap-2 w-full mt-6 rounded-lg h-9 text-[10px] font-black uppercase tracking-widest border-gray-200 dark:border-gray-800 text-gray-500 transition-all duration-300 ease-in-out'
                            >
                                <Pencil size={14} strokeWidth={2.5} />
                                <span>Edit Details</span>
                            </Button>
                        </div>
                    </div>

                    {/* C. Operational Sidebar - Contained on Mobile */}
                    <div className='flex flex-col h-full transition-all duration-300 ease-in-out'>
                        <div className='p-4 sm:p-6 border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm flex flex-col h-full transition-all duration-300 ease-in-out'>
                            <div className='flex items-center justify-between mb-4 sm:mb-6 transition-all duration-300 ease-in-out'>
                                <div className='flex items-center gap-2 sm:gap-3 transition-all duration-300 ease-in-out'>
                                    <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500'>
                                        <Settings size={16} sm={20} />
                                    </div>
                                    <h3 className={`text-[clamp(14px,1.5vw,18px)] font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight transition-all duration-300 ease-in-out`}>
                                        Operations
                                    </h3>
                                </div>
                                <div className='hidden sm:block'>
                                    <Button
                                        variant='outline'
                                        onClick={() => setIsOperationalModalOpen(true)}
                                        className='flex items-center gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 h-8 sm:h-10 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:border-brand-500 hover:text-brand-500 transition-all duration-300 ease-in-out'
                                    >
                                        <Sliders size={14} strokeWidth={2.5} />
                                        <span>Modify</span>
                                    </Button>
                                </div>
                            </div>

                            <div className='space-y-2 sm:space-y-4 flex-grow transition-all duration-300 ease-in-out'>
                                <div className='flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out'>
                                    <div className='flex flex-col'>
                                        <span className={`text-[clamp(8px,1vw,11px)] font-bold text-gray-400 uppercase tracking-widest transition-all duration-300 ease-in-out`}>Avg Duration</span>
                                        <span className={`text-[clamp(14px,2vw,20px)] font-bold text-gray-900 dark:text-white transition-all duration-300 ease-in-out`}>{service.duration}</span>
                                    </div>
                                    <Clock size={14} sm={20} className='text-gray-300 dark:text-gray-700 transition-all duration-300 ease-in-out' />
                                </div>

                                <div className='flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out'>
                                    <div className='flex flex-col'>
                                        <span className={`text-[clamp(8px,1vw,11px)] font-bold text-gray-400 uppercase tracking-widest transition-all duration-300 ease-in-out`}>Tier</span>
                                        <span className={`text-[clamp(9px,1vw,12px)] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.1em] transition-all duration-300 ease-in-out`}>{service.tier}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant='outline'
                                onClick={() => setIsOperationalModalOpen(true)}
                                className='flex sm:hidden items-center justify-center gap-2 w-full mt-6 rounded-lg h-9 text-[10px] font-black uppercase tracking-widest border-gray-200 dark:border-gray-800 text-gray-500 transition-all duration-300 ease-in-out'
                            >
                                <Sliders size={14} strokeWidth={2.5} />
                                <span>Modify Settings</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Edit Modal */}
            <Modal 
                isOpen={isContentModalOpen} 
                onClose={() => setIsContentModalOpen(false)} 
                className='max-w-[500px] w-full'
                footer={
                    <div className='flex gap-3 p-6 sm:p-8'>
                        <Button variant='outline' type='button' onClick={() => setIsContentModalOpen(false)} className='flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs'>Cancel</Button>
                        <Button form='service-content-form' type='submit' disabled={isSaving} className='flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs bg-brand-500 text-white'>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <div className='p-6 sm:p-8 bg-white dark:bg-gray-900'>
                    <div className='mb-6 sm:mb-8'>
                        <h4 className='text-lg sm:text-xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>Edit Service Detail</h4>
                        <p className='text-[10px] sm:text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest'>Modify name and description</p>
                    </div>
                    <form id='service-content-form' onSubmit={handleSaveContent} className='space-y-6'>
                        <div className='space-y-4'>
                            <div>
                                <Label className='text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-2 block'>Display Name</Label>
                                <Input name='name' defaultValue={service.name} required className='h-12 rounded-xl font-bold' />
                            </div>
                            <div>
                                <Label className='text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-2 block'>Detailed Description</Label>
                                <textarea
                                    name='description'
                                    defaultValue={service.description}
                                    className='w-full h-32 p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none'
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Operational Edit Modal */}
            <Modal 
                isOpen={isOperationalModalOpen} 
                onClose={() => setIsOperationalModalOpen(false)} 
                className='max-w-[500px] w-full'
                footer={
                    <div className='flex gap-3 p-6 sm:p-8'>
                        <Button variant='outline' type='button' onClick={() => setIsOperationalModalOpen(false)} className='flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs'>Cancel</Button>
                        <Button form='service-operational-form' type='submit' disabled={isSaving} className='flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs bg-brand-500 text-white'>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <div className='p-6 sm:p-8 bg-white dark:bg-gray-900'>
                    <div className='mb-6 sm:mb-8'>
                        <h4 className='text-lg sm:text-xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>Modify Settings</h4>
                        <p className='text-[10px] sm:text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest'>Update duration and tier</p>
                    </div>
                    <form id='service-operational-form' onSubmit={handleSaveOperational} className='space-y-6'>
                        <div className='space-y-4'>
                            <div>
                                <Label className='text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-2 block'>Base Price (₱)</Label>
                                <Input name='cost' type='number' defaultValue={service.cost} required className='h-12 rounded-xl font-bold' />
                            </div>
                            <div>
                                <Label className='text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-2 block'>Average Duration</Label>
                                <Input name='duration' defaultValue={service.duration} required placeholder='e.g. 1h 30m' className='h-12 rounded-xl font-bold' />
                            </div>
                            <div>
                                <Label className='text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-2 block'>Tier Classification</Label>
                                <select
                                    name='tier'
                                    defaultValue={service.tier}
                                    className='w-full h-12 px-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all'
                                >
                                    <option value='general'>General</option>
                                    <option value='specialized'>Specialized</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Image Management Modal */}
            <Modal 
                isOpen={isImageModalOpen} 
                onClose={() => setIsImageModalOpen(false)} 
                className='max-w-[500px] w-full'
                footer={
                    <div className='flex gap-3 p-6 sm:p-8'>
                        <Button variant='outline' type='button' onClick={() => setIsImageModalOpen(false)} className='flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs'>Cancel</Button>
                        <Button form='service-image-form' type='submit' disabled={isSaving} className='flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs bg-brand-500 text-white'>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <div className='p-6 sm:p-8 bg-white dark:bg-gray-900'>
                    <div className='mb-6 sm:mb-8'>
                        <h4 className='text-lg sm:text-xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>Update Service Image</h4>
                        <p className='text-[10px] sm:text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest'>Select a new photo to upload</p>
                    </div>
                    <form id='service-image-form' onSubmit={handleSaveImage} className='space-y-4'>
                        {/* Preview Area */}
                        <div className='relative h-40 w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 flex items-center justify-center'>
                            {tempImageUrl ? (
                                <img src={tempImageUrl} alt="Preview" className='w-full h-full object-cover' />
                            ) : (
                                <div className='flex flex-col items-center gap-2 text-gray-300'>
                                    <ImageIcon size={32} strokeWidth={1} />
                                    <span className='text-[9px] font-black uppercase tracking-widest'>No Image Preview</span>
                                </div>
                            )}
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-center w-full'>
                                <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] hover:border-brand-500/50 transition-all group'>
                                    <div className='flex flex-col items-center justify-center py-4'>
                                        <svg className='w-8 h-8 mb-2 text-gray-300 group-hover:text-brand-500 transition-colors' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 16'>
                                            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2' />
                                        </svg>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-600 transition-colors'>Click to upload file</p>
                                        <p className='text-[9px] text-gray-400 mt-1 uppercase'>Max. 5MB</p>
                                    </div>
                                    <input type='file' className='hidden' accept='image/*' />
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ServiceDetailView;
