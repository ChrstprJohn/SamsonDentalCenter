import React from 'react';
import { ShieldCheck, Calendar, Clock, MapPin } from 'lucide-react';

const DoctorProfileDetail = ({ doctor }) => {
    return (
        <div className='space-y-[clamp(12px,2vw,16px)]'>
            {/* Quick Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(12px,2vw,16px)]'>
                <div className='p-[clamp(12px,2vw,16px)] border border-gray-100 dark:border-gray-800 rounded-[clamp(10px,1.5vw,16px)] bg-white dark:bg-white/[0.02] transition-all duration-300'>
                    <div className='flex items-center gap-[clamp(8px,1vw,12px)] mb-[clamp(6px,1vw,8px)]'>
                        <div className='w-[clamp(28px,3vw,32px)] h-[clamp(28px,3vw,32px)] rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500'>
                            <ShieldCheck size={16} />
                        </div>
                        <span className='text-[clamp(9px,1vw,10px)] font-bold text-gray-400 uppercase tracking-widest'>Verification</span>
                    </div>
                    <p className='text-[clamp(11px,1.2vw,12px)] font-bold text-gray-900 dark:text-white uppercase transition-all duration-300'>Licensed Dental Pro</p>
                </div>

                <div className='p-[clamp(12px,2vw,16px)] border border-gray-100 dark:border-gray-800 rounded-[clamp(10px,1.5vw,16px)] bg-white dark:bg-white/[0.02] transition-all duration-300'>
                    <div className='flex items-center gap-[clamp(8px,1vw,12px)] mb-[clamp(6px,1vw,8px)]'>
                        <div className='w-[clamp(28px,3vw,32px)] h-[clamp(28px,3vw,32px)] rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500'>
                            <Calendar size={16} />
                        </div>
                        <span className='text-[clamp(9px,1vw,10px)] font-bold text-gray-400 uppercase tracking-widest'>Joined</span>
                    </div>
                    <p className='text-[clamp(11px,1.2vw,12px)] font-bold text-gray-900 dark:text-white uppercase transition-all duration-300'>Apr 2024</p>
                </div>
            </div>

            {/* Biography Card - Redundant but kept for structure if needed elsewhere, but user says focus on main idea */}
            <div className='p-[clamp(16px,2vw,20px)] border border-gray-200 rounded-[clamp(12px,2vw,16px)] dark:border-gray-800 bg-white dark:bg-white/[0.03] transition-all duration-300'>
                <h4 className='text-[clamp(10px,1.2vw,12px)] font-black uppercase tracking-tight text-gray-900 dark:text-white mb-[clamp(12px,1.5vw,16px)]'>Professional Statement</h4>
                <p className='text-[clamp(12px,1.2vw,13px)] text-gray-500 dark:text-gray-400 leading-relaxed font-medium transition-all duration-300'>
                    {doctor.bio || 'Credentials and professional history details are currently being processed.'}
                </p>
            </div>
        </div>
    );
};

export default DoctorProfileDetail;
