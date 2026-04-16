import { useState } from 'react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Label from '../../ui/Label';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export default function UserInfoCard() {
    const { user, updateProfile } = useAuth();
    const { showToast } = useToast();
    const { isOpen, openModal, closeModal } = useModal();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData(e.target);
            const first_name = formData.get('first_name').trim();
            const last_name = formData.get('last_name').trim();
            const middle_name = formData.get('middle_name').trim();
            const suffix = formData.get('suffix').trim();
            
            await updateProfile({ 
                first_name, 
                last_name, 
                middle_name, 
                suffix
            });
            showToast('Personal information updated!');
            closeModal();
        } catch (error) {
            console.error('Failed to update personal info:', error);
            showToast(error.message || 'Failed to update info. Please try again.', 'error', 'Update Failed');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='p-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                <div className="flex-1">
                    <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white lg:mb-6 mb-4'>
                        Personal Information
                    </h4>

                    <div className='grid grid-cols-1 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8'>
                        <div>
                            <p className='mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400'>Last Name</p>
                            <p className='text-sm font-semibold text-gray-800 dark:text-white/90'>{user?.last_name || '—'}</p>
                        </div>
                        <div>
                            <p className='mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400'>First Name</p>
                            <p className='text-sm font-semibold text-gray-800 dark:text-white/90'>{user?.first_name || '—'}</p>
                        </div>
                        <div>
                            <p className='mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400'>Middle Name</p>
                            <p className='text-sm font-semibold text-gray-800 dark:text-white/90'>{user?.middle_name || '—'}</p>
                        </div>
                        <div>
                            <p className='mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400'>Suffix</p>
                            <p className='text-sm font-semibold text-gray-800 dark:text-white/90'>{user?.suffix || '—'}</p>
                        </div>
                    </div>
                </div>

                <Button
                    variant='outline'
                    onClick={openModal}
                    className='flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold shadow-theme-xs lg:inline-flex lg:w-auto hover:shadow-lg hover:border-brand-500 hover:text-brand-500'
                >
                    <svg
                        className='fill-current'
                        width='18'
                        height='18'
                        viewBox='0 0 18 18'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                            fill='currentColor'
                        />
                    </svg>
                    Edit
                </Button>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[480px] w-[95%] sm:w-full m-auto'>
                <div className='no-scrollbar relative w-full overflow-y-auto rounded-[2rem] bg-white p-6 dark:bg-gray-900 sm:p-8'>
                    <div className='pr-8 sm:pr-12'>
                        <h4 className='mb-1 text-xl font-bold text-gray-900 dark:text-white'>
                            Edit Information
                        </h4>
                        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>
                            Update your personal and contact details.
                        </p>
                    </div>
                    <form className='flex flex-col gap-6' onSubmit={handleSave}>
                        <div className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className="col-span-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 block">First Name</Label>
                                    <Input 
                                        name="first_name"
                                        className="text-sm font-medium h-12 rounded-xl" 
                                        defaultValue={user?.first_name}
                                        required
                                        placeholder="First"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 block">Last Name</Label>
                                    <Input 
                                        name="last_name"
                                        className="text-sm font-medium h-12 rounded-xl" 
                                        defaultValue={user?.last_name}
                                        required
                                        placeholder="Last"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 block">Middle Name</Label>
                                    <Input 
                                        name="middle_name"
                                        className="text-sm font-medium h-12 rounded-xl" 
                                        defaultValue={user?.middle_name}
                                        placeholder="Middle"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 block">Suffix</Label>
                                    <Input 
                                        name="suffix"
                                        className="text-sm font-medium h-12 rounded-xl" 
                                        defaultValue={user?.suffix}
                                        placeholder="Jr/Sr/etc"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 mt-2 sm:justify-end'>
                            <Button variant='outline' type="button" onClick={closeModal} className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-bold" disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button type='submit' className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-bold" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
