import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Input, Label, Button } from '../../ui';
import { X, CheckCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';

// ── Toast rendered via portal so it floats above everything ──
const Toast = ({ toast, onDismiss }) => {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onDismiss, 4000);
        return () => clearTimeout(t);
    }, [toast, onDismiss]);

    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return createPortal(
        <div className='fixed top-[4.5rem] sm:top-24 right-4 sm:right-6 z-[9999999] flex flex-col gap-3 pointer-events-none'>
            <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 flex gap-4 items-center shadow-lg animate-in slide-in-from-right-10 fade-in duration-500 max-w-[calc(100vw-2rem)] sm:max-w-sm'>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {isSuccess
                        ? <Check size={22} className='text-white' />
                        : <AlertCircle size={22} className='text-white' />
                    }
                </div>
                <div>
                    <h4 className={`text-[11px] font-black uppercase tracking-widest ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isSuccess ? 'Success' : 'Error'}
                    </h4>
                    <p className='text-sm font-bold text-gray-900 dark:text-white leading-snug'>{toast.message}</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

const AddDoctorModal = ({ isOpen, onClose, onAdd }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        email: '',
        phone: ''
    });

    const showToast = (type, message) => setToast({ type, message });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        showToast('success', 'Sending invitation...'); // instant feedback per design spec
        try {
            await onAdd(formData);
            showToast('success', `Invitation dispatched to ${formData.email}`);
            setTimeout(() => {
                onClose();
                setFormData({ first_name: '', last_name: '', middle_name: '', suffix: '', email: '', phone: '' });
            }, 1200);
        } catch (error) {
            const msg = error?.message || 'Failed to onboard doctor.';
            const isConflict = msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exist') || (error?.status === 409);
            showToast('error', isConflict ? 'This email is already registered in the system.' : msg);
        } finally {
            setIsSaving(false);
        }
    };

    const isValid = formData.first_name && formData.last_name && formData.email;

    return (
        <>
            <Toast toast={toast} onDismiss={() => setToast(null)} />
            <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className='max-w-[640px] w-[95%] sm:w-full m-auto shadow-none'>
            <div className='relative w-full flex flex-col rounded-2xl bg-white dark:bg-gray-950 max-h-[85vh] shadow-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden'>
                {/* Header - Fixed/Sticky */}
                <div className='sticky top-0 z-20 px-8 pt-7 pb-4 shrink-0 bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-800/20'>
                    <div className='flex items-center justify-between mb-1'>
                        <div className='flex items-center gap-2.5'>
                            <div className='bg-brand-500/10 p-1.5 rounded-lg'>
                                <CheckCircle size={18} className='text-brand-500' />
                            </div>
                            <h4 className='text-lg font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                                Onboard Doctor
                            </h4>
                        </div>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={onClose}
                            className='text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors h-8 w-8 -mr-2'
                        >
                            <X size={18} />
                        </Button>
                    </div>
                    <p className='text-[11px] text-gray-500 dark:text-gray-400 font-medium ml-9 uppercase tracking-wider opacity-80'>
                        Professional Access Initialization
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col flex-grow'>
                    {/* Content */}
                    <div className='flex-grow px-8 py-6 space-y-8'>
                        {/* Identity Section */}
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2'>
                                <div className='h-3 w-1 bg-brand-500 rounded-full' />
                                <h5 className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400'>
                                    Professional Identity
                                </h5>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4'>
                                <div className='space-y-1'>
                                    <Label className='text-[9px] font-bold uppercase tracking-wider text-gray-400'>First Name</Label>
                                    <Input 
                                        name='first_name' 
                                        value={formData.first_name} 
                                        onChange={handleInputChange} 
                                        placeholder='Maria'
                                        className='h-10 rounded-lg text-sm font-bold border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'
                                        required 
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <Label className='text-[9px] font-bold uppercase tracking-wider text-gray-400'>Last Name</Label>
                                    <Input 
                                        name='last_name' 
                                        value={formData.last_name} 
                                        onChange={handleInputChange} 
                                        placeholder='Santos'
                                        className='h-10 rounded-lg text-sm font-bold border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'
                                        required 
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <Label className='text-[9px] font-bold uppercase tracking-wider text-gray-400'>Middle Name</Label>
                                    <Input 
                                        name='middle_name' 
                                        value={formData.middle_name} 
                                        onChange={handleInputChange} 
                                        placeholder='Optional'
                                        className='h-10 rounded-lg text-sm font-medium border-gray-200 dark:border-gray-800'
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <Label className='text-[9px] font-bold uppercase tracking-wider text-gray-400'>Suffix</Label>
                                    <Input 
                                        name='suffix' 
                                        value={formData.suffix} 
                                        onChange={handleInputChange} 
                                        placeholder='DMD, Jr.'
                                        className='h-10 rounded-lg text-sm font-medium border-gray-200 dark:border-gray-800'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2'>
                                <div className='h-3 w-1 bg-brand-500 rounded-full' />
                                <h5 className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400'>
                                    Contact Credentials
                                </h5>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <div className='space-y-1'>
                                    <Label className='text-[9px] font-bold uppercase tracking-wider text-gray-400 text-brand-600 dark:text-brand-400'>Work Email</Label>
                                    <Input 
                                        name='email' 
                                        type='email' 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        placeholder='doctor@primeradental.com' 
                                        className='h-10 rounded-lg text-sm font-bold border-gray-200 dark:border-gray-800 bg-brand-50/10 dark:bg-brand-500/[0.02]'
                                        required 
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <Label className='text-[9px] font-bold uppercase tracking-wider text-gray-400'>Phone Number</Label>
                                    <Input 
                                        name='phone' 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                        placeholder='09XX XXX XXXX' 
                                        className='h-10 rounded-lg text-sm font-bold border-gray-200 dark:border-gray-800'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions - Sticky */}
                    <div className='sticky bottom-0 z-20 px-8 py-5 shrink-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800/50 flex flex-col sm:flex-row items-center gap-3 mt-auto'>
                        <Button 
                            variant='outline' 
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className='w-full sm:w-auto px-6 h-10 rounded-xl text-xs font-black text-gray-400 dark:text-gray-500 hover:bg-white dark:hover:bg-gray-900 border-gray-200 dark:border-gray-800 active:scale-95 transition-all font-outfit uppercase tracking-widest'
                        >
                            Cancel
                        </Button>
                        
                        <div className='w-full sm:w-auto flex items-center justify-end flex-grow gap-3'>
                            <Button 
                                type="submit"
                                loading={isSaving}
                                disabled={!isValid}
                                className='w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-black text-xs px-8 h-10 rounded-xl min-w-[200px] active:scale-95 transition-all font-outfit shadow-theme-xs flex items-center justify-center gap-2 group uppercase tracking-widest'
                            >
                                Register Account <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
        </>
    );
};

export default AddDoctorModal;
