import React from 'react';
import { Modal, Input, Label, Button } from '../../../ui';

const EditContactModal = ({ isOpen, onClose, formData, setFormData, onSave }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className='max-w-[450px] w-full m-auto'>
            <div className='p-8 bg-white dark:bg-gray-900 rounded-xl'>
                <h4 className='text-lg font-black uppercase tracking-tight mb-6'>Contact Update</h4>
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Email Address</Label>
                        <Input 
                            value={formData.email} 
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className='h-11' 
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Phone Number</Label>
                        <Input 
                            value={formData.phone} 
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className='h-11' 
                        />
                    </div>
                    <div className='flex justify-end gap-3 pt-6'>
                        <Button variant='outline' onClick={onClose}>Cancel</Button>
                        <Button onClick={onSave} className='bg-brand-500 text-white px-6 font-bold'>Update Contact</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditContactModal;
