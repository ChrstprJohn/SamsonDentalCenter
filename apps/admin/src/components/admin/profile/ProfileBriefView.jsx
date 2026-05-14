import React, { useState } from 'react';
import { Button, Modal, Input, Label } from '../../ui';
import { useToast } from '../../../context/ToastContext.jsx';

const ProfileBriefView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();
    
    // Mock user state
    const [user, setUser] = useState({
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@primeradental.com',
        role: 'Administrator',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    });

    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar_url);

    const AVATARS = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack'
    ];

    const handleOpenModal = () => {
        setSelectedAvatar(user.avatar_url);
        console.log('Opening Admin Profile Modal...');
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = async (e) => {
        e.preventDefault();
        showToast('Admin profile updated successfully!');
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const formData = new FormData(e.target);
        setUser(prev => ({
            ...prev,
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            avatar_url: selectedAvatar
        }));
        
        setIsSaving(false);
        handleCloseModal();
    };

    return (
        <div className='flex flex-col items-center justify-center text-center'>
            <div className='w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500 mb-4 overflow-hidden border border-gray-100 dark:border-gray-800'>
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}
            </div>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-1 font-outfit capitalize'>
                {user.first_name} {user.last_name}
            </h3>
            <p className='text-xs font-bold text-brand-500 capitalize mb-3'>
                {user.role}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed'>
                Manage your administrative account settings, update your profile information, and secure your credentials.
            </p>
            <Button 
                variant='outline'
                onClick={handleOpenModal}
                className='mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold lg:inline-flex lg:w-auto hover:border-brand-500 hover:text-brand-500 transition-all active:scale-95'
            >
                Edit Profile
            </Button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} className='max-w-[720px] w-[95%]'>
                <div className='no-scrollbar relative w-full overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900 sm:p-10'>
                    <div className='mb-8'>
                        <h4 className='text-2xl font-medium text-gray-900 dark:text-white font-outfit capitalize'>
                            Edit Account Settings
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            Update your personal information and profile picture.
                        </p>
                    </div>

                    <form onSubmit={handleSave} className='flex flex-col gap-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                            {/* Left Side: Avatar */}
                            <div className='lg:col-span-4 flex flex-col items-center gap-6'>
                                <div className='relative group cursor-pointer'>
                                    <div className='w-32 h-32 rounded-full overflow-hidden border-2 border-brand-500/20 dark:border-brand-500/30 flex items-center justify-center bg-gray-50 dark:bg-white/[0.02] shadow-inner'>
                                        {selectedAvatar ? (
                                            <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                
                                <div className='w-full'>
                                    <Label className='text-[12px] font-bold capitalize text-gray-400 mb-3 block text-center'>
                                        Available Profiles
                                    </Label>
                                    <div className='grid grid-cols-3 gap-2 px-2'>
                                        {AVATARS.map((url, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setSelectedAvatar(url)}
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all p-1 ${selectedAvatar === url ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover rounded" />
                                                {selectedAvatar === url && (
                                                    <div className="absolute inset-0 bg-brand-500/10 flex items-center justify-center">
                                                        <div className="bg-brand-500 text-white rounded-full p-0.5 scale-75">
                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            className='aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors group'
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                            </svg>
                                            <span className='text-[11px] font-bold capitalize'>Custom</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Details */}
                            <div className='lg:col-span-8 space-y-5'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='col-span-1'>
                                        <Label className='text-[12px] font-bold capitalize text-gray-400 mb-2 block'>
                                            First Name
                                        </Label>
                                        <Input 
                                            name="first_name"
                                            defaultValue={user.first_name}
                                            required
                                            placeholder="Enter first name"
                                            className="font-medium h-12 rounded-lg"
                                        />
                                    </div>
                                    <div className='col-span-1'>
                                        <Label className='text-[12px] font-bold capitalize text-gray-400 mb-2 block'>
                                            Last Name
                                        </Label>
                                        <Input 
                                            name="last_name"
                                            defaultValue={user.last_name}
                                            required
                                            placeholder="Enter last name"
                                            className="font-medium h-12 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className='text-[12px] font-bold capitalize text-gray-400 mb-2 block'>
                                        Email Address
                                    </Label>
                                    <Input 
                                        name="email"
                                        type="email"
                                        defaultValue={user.email}
                                        required
                                        placeholder="admin@example.com"
                                        className="font-medium h-12 rounded-lg"
                                    />
                                    <p className='text-[11px] text-gray-400 mt-2 italic'>
                                        Primary email used for communications and notifications.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className='flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 justify-end'>
                            <Button 
                                variant='outline'
                                type="button"
                                onClick={() => {
                                    handleCloseModal();
                                    showToast("Changes discarded. You've exited edit mode.", 'notice', 'Notice');
                                }}
                                disabled={isSaving}
                                className='px-8 h-12 rounded-lg font-bold'
                            >
                                Cancel
                            </Button>
                            <Button 
                                type='submit'
                                disabled={isSaving}
                                className='px-10 h-12 rounded-lg font-bold min-w-[140px]'
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ProfileBriefView;
