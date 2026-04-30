import React from 'react';
import { Modal, Input, Label, Button } from '../../../ui';

const EditProfileModal = ({ isOpen, onClose, formData, setFormData, onSave }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className='max-w-[500px] w-full m-auto'>
            <div className='p-8 bg-white dark:bg-gray-900 rounded-xl'>
                <h4 className='text-lg font-black uppercase tracking-tight mb-6'>Edit Personal Identity</h4>
                <div className='space-y-6'>
                    <div className="grid grid-cols-2 gap-4">
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>First Name</Label>
                            <Input 
                                value={formData.first_name} 
                                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                                placeholder='e.g. Maria'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Last Name</Label>
                            <Input 
                                value={formData.last_name} 
                                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                                placeholder='e.g. Santos'
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Middle Name</Label>
                            <Input 
                                value={formData.middle_name} 
                                onChange={(e) => setFormData(prev => ({ ...prev, middle_name: e.target.value }))}
                                placeholder='Optional'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Suffix</Label>
                            <Input 
                                value={formData.suffix} 
                                onChange={(e) => setFormData(prev => ({ ...prev, suffix: e.target.value }))}
                                placeholder='e.g. Jr., III'
                            />
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                        <Button variant='outline' onClick={onClose}>Cancel</Button>
                        <Button onClick={onSave} className='bg-brand-500 text-white px-8 font-black uppercase shadow-xl shadow-brand-500/20'>Save Changes</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditProfileModal;
