import React from 'react';
import { Clock, ShieldCheck, DollarSign } from 'lucide-react';
import { Button, Label, Switch } from '../../ui';

const ClinicRulesSettings = () => {
    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                            Global Booking Rules
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            System-wide operational constraints
                        </p>
                    </div>
                </div>

                <div className='space-y-6'>
                    {/* Operating Hours */}
                    <div className='flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]'>
                        <div className='flex items-start gap-4'>
                            <div className='mt-1 p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600'>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Default Operating Hours</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Sets the standard window for all appointment slots.</p>
                                <div className='mt-3 flex items-center gap-3'>
                                    <div className='px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-bold'>08:00 AM</div>
                                    <span className='text-gray-400'>to</span>
                                    <div className='px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-bold'>05:00 PM</div>
                                </div>
                            </div>
                        </div>
                        <Button variant='outline' size='sm' className='text-[10px] uppercase font-black'>Edit Hours</Button>
                    </div>

                    {/* Deposit Requirements */}
                    <div className='flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]'>
                        <div className='flex items-start gap-4'>
                            <div className='mt-1 p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600'>
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Deposit Requirement</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Mandatory downpayment for specialized treatments.</p>
                            </div>
                        </div>
                        <Switch checked={true} />
                    </div>

                    {/* Auto-Approval */}
                    <div className='flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]'>
                        <div className='flex items-start gap-4'>
                            <div className='mt-1 p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600'>
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Tier 1 Auto-Approval</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Instantly confirm general checkups without manual review.</p>
                            </div>
                        </div>
                        <Switch checked={false} />
                    </div>
                </div>

                <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end'>
                    <Button className='px-8 h-11 rounded-lg text-sm font-black bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-sm'>
                        Update Rules
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClinicRulesSettings;
