import React from 'react';
import { Shield, Lock, UserX, RefreshCw } from 'lucide-react';
import { Button } from '../../ui';

const DoctorSecurityDetail = ({ doctor }) => {
    return (
        <div className='animate-in fade-in duration-300'>
            <div className='p-4 sm:p-6 border border-gray-300 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='flex items-center justify-between mb-6 sm:mb-8'>
                    <div>
                        <h4 className='text-base sm:text-lg font-medium text-gray-900 dark:text-white capitalize font-outfit'>
                            Security & Account
                        </h4>
                        <p className='text-[11px] sm:text-[12px] text-gray-500 dark:text-gray-400 capitalize mt-0.5 font-bold'>
                            Authorized Administrative Controls
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Password Reset */}
                    <div className='p-4 border border-gray-200 dark:border-white/5 rounded-2xl bg-gray-50/20 dark:bg-white/[0.01]'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                                <Lock size={18} />
                            </div>
                            <h5 className='text-[11px] font-medium text-gray-900 dark:text-white capitalize'>Credential Reset</h5>
                        </div>
                        <p className='text-[11px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed'>
                            Initiate a secure password reset sequence for the email: <span className='font-medium text-gray-900 dark:text-white'>{doctor.email}</span>.
                        </p>
                        <Button variant='outline' className='w-full h-9 sm:h-10 text-[12px] font-medium capitalize border-gray-200 dark:border-white/5 rounded-xl'>
                            <RefreshCw size={12} className='mr-2' /> Send Link
                        </Button>
                    </div>

                    {/* Account Status */}
                    <div className='p-4 border border-gray-200 dark:border-white/5 rounded-2xl bg-gray-50/20 dark:bg-white/[0.01]'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400'>
                                <UserX size={18} />
                            </div>
                            <h5 className='text-[11px] font-medium text-gray-900 dark:text-white capitalize'>Account Access</h5>
                        </div>
                        <p className='text-[11px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed'>
                            Temporarily disable clinical access. Status: <span className={`font-medium ${doctor.is_active ? 'text-success-600' : 'text-red-500'}`}>{doctor.is_active ? 'ACTIVE' : 'LOCKED'}</span>.
                        </p>
                        <Button variant='outline' className={`w-full h-9 sm:h-10 text-[12px] font-medium capitalize  rounded-xl ${doctor.is_active ? 'text-red-600 border-red-500/20' : 'text-success-600 border-success-500/20'}`}>
                            {doctor.is_active ? 'Restrict Access' : 'Restore Access'}
                        </Button>
                    </div>
                </div>

                <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10'>
                        <Shield className='text-amber-500 shrink-0' size={18} />
                        <div>
                            <p className='text-[11px] font-medium text-amber-600 dark:text-amber-500 capitalize mb-0.5'>Audit Notice</p>
                            <p className='text-[12px] text-amber-700 dark:text-amber-400/80 font-medium leading-relaxed'>
                                All actions are recorded in the Audit Log with your ID and timestamp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorSecurityDetail;
