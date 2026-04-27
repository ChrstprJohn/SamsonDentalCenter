import React, { useState } from 'react';
import { PhilippinePeso, Clock, Image as ImageIcon, Plus, Info, Settings, MoreVertical } from 'lucide-react';
import { Button, Modal, Input, Label, Switch } from '../ui';
import { useToast } from '../../context/ToastContext';

const ServiceDetailView = ({ service: initialService, onBack }) => {
    const [service, setService] = useState(initialService);
    const [isSaving, setIsSaving] = useState(false);
    const [isOperationalModalOpen, setIsOperationalModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState(service.image_url || '');
    
    const { showToast } = useToast();

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
            <div className='space-y-6 w-full'>
                
                {/* A. Header / Hero Section */}
                <div className='overflow-hidden border border-gray-200 rounded-3xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm relative group/hero'>
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
                        
                        {/* Floating Image Actions - Moved to Top Right - Lowered Z-Index to fix nav overlap */}
                        <div className='absolute top-6 right-6 z-10'>
                            <button 
                                onClick={() => {
                                    setTempImageUrl(service.image_url || '');
                                    setIsImageModalOpen(true);
                                }}
                                className='flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-[0.1em] hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all active:scale-95 shadow-2xl shadow-black/10'
                            >
                                <ImageIcon size={16} strokeWidth={2.5} />
                                Update Service Photo
                            </button>
                        </div>

                        <div className='absolute bottom-6 left-6 right-6 flex flex-col'>
                            <div className='flex flex-col'>
                                <span className='text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] mb-2'>
                                    {service.tier} Service
                                </span>
                                <h1 className='text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                                    {service.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch'>
                    {/* B. Content & Identity Section */}
                    <div className='flex flex-col h-full'>
                        <div className='p-6 border border-gray-200 rounded-3xl dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col h-full'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500'>
                                        <Info size={20} />
                                    </div>
                                    <h3 className='text-lg font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                                        Service Details
                                    </h3>
                                </div>
                                <Button 
                                    variant='outline' 
                                    onClick={() => setIsContentModalOpen(true)}
                                    className='rounded-xl px-4 h-10 text-xs font-black uppercase tracking-widest hover:border-brand-500 hover:text-brand-500'
                                >
                                    Edit Identity
                                </Button>
                            </div>
                            
                            <div className='space-y-6'>
                                <div>
                                    <Label className='text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2 block'>Display Name</Label>
                                    <p className='text-md font-bold text-gray-900 dark:text-white'>{service.name}</p>
                                </div>
                                <div>
                                    <Label className='text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2 block'>Description</Label>
                                    <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl font-medium'>
                                        {service.description || 'No description provided for this service.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* More sections could go here (e.g. Media/Gallery) */}
                    </div>

                    {/* C. Operational Sidebar */}
                    <div className='flex flex-col h-full'>
                        <div className='p-6 border border-gray-200 rounded-3xl dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col h-full'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500'>
                                        <Settings size={20} />
                                    </div>
                                    <h3 className='text-lg font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                                        Operations
                                    </h3>
                                </div>
                                <Button 
                                    variant='outline' 
                                    onClick={() => setIsOperationalModalOpen(true)}
                                    className='rounded-xl px-4 h-10 text-xs font-black uppercase tracking-widest hover:border-brand-500 hover:text-brand-500'
                                >
                                    Edit Settings
                                </Button>
                            </div>

                            <div className='space-y-6'>
                                <div className='flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800'>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Base Pricing</span>
                                        <span className='text-lg font-black text-gray-900 dark:text-white font-outfit'>₱{Number(service.cost).toLocaleString()}</span>
                                    </div>
                                    <PhilippinePeso size={20} className='text-gray-300 dark:text-gray-700' />
                                </div>

                                <div className='flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800'>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Average Duration</span>
                                        <span className='text-lg font-bold text-gray-900 dark:text-white'>{service.duration}</span>
                                    </div>
                                    <Clock size={20} className='text-gray-300 dark:text-gray-700' />
                                </div>

                                <div className='flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800'>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Tier Classification</span>
                                        <span className='text-sm font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest'>{service.tier}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Edit Modal */}
            <Modal isOpen={isContentModalOpen} onClose={() => setIsContentModalOpen(false)} className='max-w-[500px] w-full'>
                <div className='p-8 bg-white dark:bg-gray-900 rounded-3xl'>
                    <div className='mb-8'>
                        <h4 className='text-xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>Edit Service Identity</h4>
                        <p className='text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest'>Modify name and description</p>
                    </div>
                    <form onSubmit={handleSaveContent} className='space-y-6'>
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
                                    className='w-full h-32 p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none'
                                />
                            </div>
                        </div>
                        <div className='flex gap-3 pt-4'>
                            <Button variant='outline' type='button' onClick={() => setIsContentModalOpen(false)} className='flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs'>Cancel</Button>
                            <Button type='submit' disabled={isSaving} className='flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs bg-brand-500 text-white'>
                                {isSaving ? 'Saving...' : 'Save Identity'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Operational Edit Modal */}
            <Modal isOpen={isOperationalModalOpen} onClose={() => setIsOperationalModalOpen(false)} className='max-w-[450px] w-full'>
                <div className='p-8 bg-white dark:bg-gray-900 rounded-3xl'>
                    <div className='mb-8'>
                        <h4 className='text-xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>Edit Operations</h4>
                        <p className='text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest'>Modify pricing and classification</p>
                    </div>
                    <form onSubmit={handleSaveOperational} className='space-y-6'>
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
                                    className='w-full h-12 px-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all'
                                >
                                    <option value='general'>General</option>
                                    <option value='specialized'>Specialized</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex gap-3 pt-4'>
                            <Button variant='outline' type='button' onClick={() => setIsOperationalModalOpen(false)} className='flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs'>Cancel</Button>
                            <Button type='submit' disabled={isSaving} className='flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs bg-brand-500 text-white'>
                                {isSaving ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Image Management Modal */}
            <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className='max-w-[500px] w-full'>
                <div className='p-8 bg-white dark:bg-gray-900 rounded-3xl'>
                    <div className='mb-8'>
                        <h4 className='text-xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>Update Service Image</h4>
                        <p className='text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest'>Select a new photo to upload</p>
                    </div>
                    
                    <form onSubmit={handleSaveImage} className='space-y-6'>
                        {/* Preview Area */}
                        <div className='relative aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 flex items-center justify-center'>
                            {tempImageUrl ? (
                                <img src={tempImageUrl} alt="Preview" className='w-full h-full object-cover' />
                            ) : (
                                <div className='flex flex-col items-center gap-3 text-gray-300'>
                                    <ImageIcon size={48} strokeWidth={1} />
                                    <span className='text-[10px] font-black uppercase tracking-widest'>No Image Preview</span>
                                </div>
                            )}
                        </div>

                        <div className='space-y-4'>
                            <div className='flex items-center justify-center w-full'>
                                <label className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] hover:border-brand-500/50 transition-all group'>
                                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                        <svg className='w-10 h-10 mb-4 text-gray-300 group-hover:text-brand-500 transition-colors' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 16'>
                                            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'/>
                                        </svg>
                                        <p className='text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-600 transition-colors'>Click to upload file</p>
                                        <p className='text-[10px] text-gray-400 mt-2'>PNG, JPG or WEBP (MAX. 5MB)</p>
                                    </div>
                                    <input type='file' className='hidden' accept='image/*' />
                                </label>
                            </div>
                        </div>

                        <div className='flex gap-3 pt-4'>
                            <Button variant='outline' type='button' onClick={() => setIsImageModalOpen(false)} className='flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs'>Cancel</Button>
                            <Button type='submit' disabled={isSaving} className='flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs bg-brand-500 text-white shadow-lg shadow-brand-500/20'>
                                {isSaving ? 'Updating...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ServiceDetailView;
