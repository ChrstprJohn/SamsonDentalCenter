import React from 'react';
import { Timer, ArrowRight, Sparkles } from 'lucide-react';

const WaitlistOfferCard = ({ onClaim }) => {
    return (
        <div className='relative overflow-hidden rounded-3xl border border-brand-100 bg-brand-50/50 p-6 dark:border-brand-500/20 dark:bg-brand-500/5 shadow-theme-sm'>
            {/* Background Decoration */}
            <div className='absolute -right-4 -top-4 text-brand-500/10 pointer-events-none'>
                <Sparkles size={120} />
            </div>

            <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className='space-y-3'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider'>
                        <Sparkles size={12} />
                        New Slot Available!
                    </div>
                    
                    <h2 className='text-2xl font-bold text-gray-800 dark:text-white/90 font-outfit'>
                        Oct 15 at 10:00 AM
                    </h2>
                    
                    <p className='text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed'>
                        A slot for <strong>Dental Cleaning</strong> with <strong>Dr. Sarah Smith</strong> has just opened up. Claim it now to move your appointment earlier!
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row items-center gap-4'>
                    {/* Timer Section */}
                    <div className='flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm'>
                        <Timer size={18} className='text-brand-500 animate-pulse' />
                        <div className='flex flex-col'>
                            <span className='text-[10px] text-gray-400 uppercase font-bold leading-tight'>Expires in</span>
                            <span className='text-sm font-mono font-bold text-gray-800 dark:text-white'>04:59</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={onClaim}
                        className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-2xl hover:bg-brand-600 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-500/20 w-full sm:w-auto'
                    >
                        Claim This Slot <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaitlistOfferCard;
