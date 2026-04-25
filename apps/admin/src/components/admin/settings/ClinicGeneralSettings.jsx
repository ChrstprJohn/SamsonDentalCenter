import React from 'react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Button, Input, Label } from '../../ui';

const ClinicGeneralSettings = () => {
    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                            General Clinic Identity
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            Powers the patient-facing website and communications
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                        <div>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>
                                Clinic Name
                            </Label>
                            <Input defaultValue="Samson Dental Clinic" className="font-bold" />
                        </div>
                        <div>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>
                                Professional Slogan
                            </Label>
                            <Input defaultValue="Excellence in Dental Care" />
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <div>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>
                                Contact Email
                            </Label>
                            <Input defaultValue="hello@samsondental.com" />
                        </div>
                        <div>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>
                                Hotline / Phone
                            </Label>
                            <Input defaultValue="+63 921 234 5678" />
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>
                        Physical Address
                    </Label>
                    <textarea 
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-3 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        defaultValue="123 Dental Lane, Oral City, Metro Manila, Philippines"
                        rows={3}
                    />
                </div>

                <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end'>
                    <Button className='px-8 h-11 rounded-lg text-sm font-black bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-sm'>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClinicGeneralSettings;
