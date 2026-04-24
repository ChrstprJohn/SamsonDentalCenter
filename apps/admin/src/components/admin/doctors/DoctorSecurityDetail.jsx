import React from 'react';
import { Shield, Lock, UserX, RefreshCw } from 'lucide-react';
import { Button } from '../../ui';

const DoctorSecurityDetail = ({ doctor }) => {
    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                            Security & Account Management
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            Authorized Admin Actions Only
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Password Reset */}
                    <div className='p-5 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                                <Lock size={20} />
                            </div>
                            <h5 className='font-bold text-gray-900 dark:text-white'>Credential Reset</h5>
                        </div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-6'>
                            Send a secure password reset link to <span className='font-bold text-gray-700 dark:text-gray-300'>{doctor.email}</span>.
                        </p>
                        <Button variant='outline' className='w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2'>
                            <RefreshCw size={14} /> Send Reset Link
                        </Button>
                    </div>

                    {/* Account Status */}
                    <div className='p-5 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400'>
                                <UserX size={20} />
                            </div>
                            <h5 className='font-bold text-gray-900 dark:text-white'>Account Access</h5>
                        </div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-6'>
                            Temporarily disable this doctor's access to the portal. Current status: <span className={`font-bold ${doctor.is_active ? 'text-success-600' : 'text-red-500'}`}>{doctor.is_active ? 'ACTIVE' : 'DISABLED'}</span>.
                        </p>
                        <Button variant='outline' className={`w-full text-xs font-bold py-2.5 border-red-100 dark:border-red-500/20 ${doctor.is_active ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-success-600 hover:bg-success-50'}`}>
                            {doctor.is_active ? 'Deactivate Account' : 'Reactivate Account'}
                        </Button>
                    </div>
                </div>

                <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-800'>
                    <div className='flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10'>
                        <Shield className='text-amber-600 shrink-0' size={20} />
                        <p className='text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed'>
                            <span className='font-bold uppercase block mb-0.5'>Audit Notice:</span>
                            All security actions performed on this account are recorded in the System Audit Log including your administrative ID and timestamp.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorSecurityDetail;
