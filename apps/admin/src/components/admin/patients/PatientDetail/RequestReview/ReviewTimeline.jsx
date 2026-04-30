import React from 'react';
import { Calendar, Clock, Check } from 'lucide-react';

const ReviewTimeline = ({ createdAt }) => {
    return (
        <div className='bg-gray-50/50 dark:bg-white/[0.01] p-6 rounded-2xl border border-gray-100 dark:border-gray-800'>
            <div className='flex items-center justify-between max-w-2xl mx-auto'>
                <div className='flex flex-col items-center gap-2 relative'>
                    <div className='w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20'>
                        <Calendar size={14} />
                    </div>
                    <span className='text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight'>Requested</span>
                    <span className='text-[9px] font-bold text-gray-400 uppercase'>
                        {new Date(createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className='h-px grow bg-gray-200 dark:bg-gray-800 mx-4' />
                <div className='flex flex-col items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center animate-pulse shadow-lg shadow-amber-500/20'>
                        <Clock size={14} />
                    </div>
                    <span className='text-[10px] font-black text-amber-600 uppercase tracking-tight'>In Review</span>
                    <span className='text-[9px] font-bold text-gray-400 uppercase'>Awaiting Action</span>
                </div>
                <div className='h-px grow border-t border-dashed border-gray-200 dark:border-gray-800 mx-4' />
                <div className='flex flex-col items-center gap-2 opacity-30'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 flex items-center justify-center'>
                        <Check size={14} />
                    </div>
                    <span className='text-[10px] font-black text-gray-400 uppercase tracking-tight'>Finalized</span>
                </div>
            </div>
        </div>
    );
};

export default ReviewTimeline;
