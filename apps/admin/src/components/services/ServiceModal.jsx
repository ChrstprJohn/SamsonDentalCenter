import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image as ImageIcon } from 'lucide-react';
import { Input, Button, Label } from '../ui';

const PRESET_DURATIONS = ['15m', '30m', '1h', '1h 30m'];

const ServiceModal = ({ isOpen, onClose, initialData = null }) => {
    // State initialization prioritizing initialData for edit mode
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');
    const [tier, setTier] = useState('general');
    const [imageUrl, setImageUrl] = useState('');

    // Duration state
    const [modalDuration, setModalDuration] = useState('30m');
    const [modalIsCustomDuration, setModalIsCustomDuration] = useState(false);
    const [modalCustomDurationVal, setModalCustomDurationVal] = useState('');

    // Pre-fill data when modal opens and initialData changes
    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setCost(initialData.cost || '');
            setTier(initialData.tier || 'general');
            setImageUrl(initialData.image_url || '');

            const duration = initialData.duration || '30m';
            if (PRESET_DURATIONS.includes(duration)) {
                setModalDuration(duration);
                setModalIsCustomDuration(false);
                setModalCustomDurationVal('');
            } else {
                setModalDuration('custom');
                setModalIsCustomDuration(true);
                setModalCustomDurationVal(duration);
            }
        } else if (isOpen && !initialData) {
            // Reset for "Add" mode
            setName('');
            setDescription('');
            setCost('');
            setTier('general');
            setImageUrl('');
            setModalDuration('30m');
            setModalIsCustomDuration(false);
            setModalCustomDurationVal('');
        }
    }, [isOpen, initialData]);

    const handleDurationSelect = (val) => {
        setModalIsCustomDuration(false);
        setModalDuration(val);
    };

    const handleCustomDurationSelect = () => {
        setModalIsCustomDuration(true);
        setModalDuration('custom');
    };

    if (!isOpen) return null;

    return createPortal(
        <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6'>
            <div
                className='absolute inset-0 bg-gray-900/60 backdrop-blur-sm'
                onClick={onClose}
            ></div>
            <div className='relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-in fade-in zoom-in-95 duration-200'>
                {/* Left Side: Photo Management */}
                <div className='w-full md:w-[300px] bg-gray-50 border-r border-gray-100 p-8 flex flex-col relative shrink-0 overflow-y-auto no-scrollbar'>
                    <div className='mt-4'>
                        <h3 className='text-lg font-black text-gray-900 uppercase tracking-tight font-outfit mb-2'>
                            Service Identity
                        </h3>
                        <p className='text-xs text-gray-500 font-medium leading-relaxed mb-6'>
                            Upload a primary image representing this treatment.
                        </p>

                        <div className='aspect-square w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all hover:border-brand-400 hover:bg-brand-50/50 group cursor-pointer mb-6 overflow-hidden relative'>
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt='Preview'
                                    className='absolute inset-0 w-full h-full object-cover'
                                />
                            ) : (
                                <>
                                    <div className='w-12 h-12 bg-gray-50 group-hover:bg-brand-100 rounded-full flex items-center justify-center mb-3 transition-colors'>
                                        <ImageIcon
                                            className='text-gray-400 group-hover:text-brand-500 transition-colors'
                                            size={24}
                                        />
                                    </div>
                                    <span className='text-xs font-bold text-gray-900'>
                                        Upload Photo
                                    </span>
                                </>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                Or Use Image URL
                            </Label>
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder='https://...'
                                className='bg-white border-gray-200 text-xs focus:border-brand-500'
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Details */}
                <div className='w-full flex-1 bg-white flex flex-col relative min-h-0'>
                    {/* Scrollable Canvas for Form */}
                    <div className='p-6 md:p-8 overflow-y-auto flex-1 min-h-0 no-scrollbar'>
                        <div className='mb-6'>
                            <h2 className='text-xl font-black text-gray-900 font-outfit uppercase tracking-tight'>
                                {initialData ? 'Edit Service' : 'Add New Service'}
                            </h2>
                        </div>

                        <div className='space-y-5'>
                            {/* Identity Group */}
                            <div className='space-y-2'>
                                <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                    Treatment Name
                                </Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='e.g., Premium Teeth Whitening'
                                    className='h-11 font-bold text-sm bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 transition-all'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                    Description
                                </Label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className='w-full h-20 p-3 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-medium outline-none transition-all resize-none'
                                    placeholder='Explain the treatment...'
                                ></textarea>
                            </div>

                            {/* Operational Parameters */}
                            <div className='bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-5'>
                                <div className='grid grid-cols-2 gap-5'>
                                    <div className='space-y-2'>
                                        <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                            Category Tier
                                        </Label>
                                        <div className='flex gap-1 p-1 bg-gray-100 rounded-xl'>
                                            <button
                                                onClick={() => setTier('general')}
                                                className={`flex-1 h-9 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                                    tier === 'general'
                                                        ? 'bg-white shadow-sm text-brand-600'
                                                        : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                            >
                                                General
                                            </button>
                                            <button
                                                onClick={() => setTier('specialized')}
                                                className={`flex-1 h-9 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                                    tier === 'specialized'
                                                        ? 'bg-white shadow-sm text-purple-600'
                                                        : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                            >
                                                Specialized
                                            </button>
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                            Est. Cost (PHP)
                                        </Label>
                                        <div className='relative'>
                                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-black'>
                                                ₱
                                            </span>
                                            <Input
                                                value={cost}
                                                onChange={(e) => setCost(e.target.value)}
                                                placeholder='0.00'
                                                className='h-11 pl-8 font-black text-gray-900 bg-white border-gray-200 focus:border-brand-500 shadow-sm'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='space-y-2 relative'>
                                    <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                        Standard Duration
                                    </Label>
                                    <div className='flex flex-wrap gap-2'>
                                        {PRESET_DURATIONS.map((dur) => (
                                            <button
                                                key={dur}
                                                onClick={() => handleDurationSelect(dur)}
                                                className={`px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                    modalDuration === dur
                                                        ? 'bg-gray-900 text-white shadow-md'
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 shadow-sm'
                                                }`}
                                            >
                                                {dur}
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleCustomDurationSelect}
                                            className={`px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                modalIsCustomDuration
                                                    ? 'bg-brand-50 border border-brand-200 text-brand-600'
                                                    : 'bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50'
                                            }`}
                                        >
                                            Custom
                                        </button>
                                    </div>

                                    {modalIsCustomDuration && (
                                        <div className='flex items-center gap-3 mt-3 animate-in fade-in slide-in-from-top-1'>
                                            <Input
                                                value={modalCustomDurationVal}
                                                onChange={(e) =>
                                                    setModalCustomDurationVal(e.target.value)
                                                }
                                                placeholder='e.g., 2h 30m'
                                                className='h-10 w-[140px] bg-white border-brand-200 focus:border-brand-500 focus:ring-brand-500 font-bold shadow-sm'
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Sticky Footer */}
                    <div className='px-6 py-5 md:px-8 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0'>
                        <Button
                            variant='outline'
                            onClick={onClose}
                            className='h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest border-gray-200 text-gray-600 bg-white hover:bg-gray-100 shadow-sm'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onClose}
                            className='h-11 px-8 rounded-xl bg-brand-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:bg-brand-600'
                        >
                            {initialData ? 'Update Action' : 'Save Service'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default ServiceModal;
