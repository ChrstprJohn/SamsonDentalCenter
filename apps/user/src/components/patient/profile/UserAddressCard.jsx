import { useState } from 'react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Label from '../../ui/Label';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export default function UserAddressCard() {
    const { user, updateProfile } = useAuth();
    const { showToast } = useToast();
    const { isOpen, openModal, closeModal } = useModal();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData(e.target);
            const country = formData.get('country');
            const city = formData.get('city');
            const postal_code = formData.get('postal_code');
            
            await updateProfile({ 
                country,
                city,
                postal_code
            });
            showToast('Address updated successfully!');
            closeModal();
        } catch (error) {
            console.error('Failed to update address:', error);
            showToast(error.message || 'Failed to update address. Please try again.', 'error', 'Update Failed');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='p-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                <div>
                    <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white lg:mb-6 mb-4'>
                        Address
                    </h4>

                    <div className='grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
                        <div>
                            <p className='mb-1.5 text-[clamp(11px,0.8vw,12px)] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                                Country
                            </p>
                            <p className='text-[clamp(14px,1vw,15px)] font-semibold text-gray-800 dark:text-white/90'>
                                {user?.country || 'Philippines'}
                            </p>
                        </div>

                        <div>
                            <p className='mb-1.5 text-[clamp(11px,0.8vw,12px)] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                                City/State
                            </p>
                            <p className='text-[clamp(14px,1vw,15px)] font-semibold text-gray-800 dark:text-white/90'>
                                {user?.city || 'Manila, Metro Manila'}
                            </p>
                        </div>

                        <div>
                            <p className='mb-1.5 text-[clamp(11px,0.8vw,12px)] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                                Postal Code
                            </p>
                            <p className='text-[clamp(14px,1vw,15px)] font-semibold text-gray-800 dark:text-white/90'>
                                {user?.postal_code || '1000'}
                            </p>
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

            <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[500px] m-4'>
                <div className='relative w-full overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 p-6 sm:p-8'>
                    <div className='px-2 pr-14'>
                        <h4 className='mb-2 text-[clamp(20px,2.5vw,24px)] font-semibold text-gray-800 dark:text-white/90'>
                            Edit Address
                        </h4>
                        <p className='mb-6 text-[clamp(13px,1vw,14px)] text-gray-500 dark:text-gray-400 lg:mb-7'>
                            Update your address details.
                        </p>
                    </div>
                    <form className='flex flex-col h-full overflow-hidden' onSubmit={handleSave}>
                        <div className='px-2 overflow-y-auto custom-scrollbar max-h-[400px]'>
                            <div className='grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2'>
                                <div>
                                    <Label className="text-[clamp(12px,0.8vw,13px)] font-bold uppercase tracking-wider opacity-70">Country</Label>
                                    <Input name="country" className="text-[clamp(14px,1vw,15px)]" type='text' defaultValue={user?.country || 'Philippines'} />
                                </div>

                                <div>
                                    <Label className="text-[clamp(12px,0.8vw,13px)] font-bold uppercase tracking-wider opacity-70">City/State</Label>
                                    <Input name="city" className="text-[clamp(14px,1vw,15px)]" type='text' defaultValue={user?.city || 'Manila, Metro Manila'} />
                                </div>

                                <div>
                                    <Label className="text-[clamp(12px,0.8vw,13px)] font-bold uppercase tracking-wider opacity-70">Postal Code</Label>
                                    <Input name="postal_code" className="text-[clamp(14px,1vw,15px)]" type='text' defaultValue={user?.postal_code || '1000'} />
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
                            <Button variant='outline' onClick={closeModal} disabled={isSaving}>
                                Close
                            </Button>
                            <Button type='submit' disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
