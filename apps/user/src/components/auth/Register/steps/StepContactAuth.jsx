import React from 'react';
import { Lock, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const StepContactAuth = ({ data, errors, updateField, onNext, onBack, loading }) => {
    const labelClasses = "mb-2 block text-[13px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 leading-none";

    const getInputClasses = (fieldError) => {
        const base = "h-11 w-full rounded-xl border appearance-none px-4 py-2.5 text-[13px] sm:text-sm shadow-theme-sm placeholder:text-gray-400 focus:outline-hidden focus:ring-4 transition-all bg-white dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 font-medium";
        if (fieldError) {
            return `${base} border-red-500 focus:border-red-300 focus:ring-red-500/20 dark:text-red-400 dark:border-red-500 dark:focus:border-red-800`;
        }
        return `${base} text-gray-800 border-gray-300 dark:border-gray-700 focus:border-brand-500/50 focus:ring-brand-500/15 hover:border-gray-400 dark:hover:border-gray-600 shadow-theme-xs hover:shadow-theme-sm`;
    };

    return (
        <div className='space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
            {/* Page Title Section */}
            <div className='text-left'>
                <h2 className='text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight'>
                    Account Security
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium'>
                    Create a strong password to protect your personal health information.
                </p>
            </div>

            {/* Card Wrapper */}
            <div className='w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-theme-md overflow-hidden'>
                <div className="px-5 pt-7 pb-5 sm:px-10 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/50">
                    <ShieldCheck size={20} className="text-brand-500" />
                    <h3 className="text-[15px] sm:text-lg font-bold text-gray-900 dark:text-white">Credentials</h3>
                </div>

                <div className="px-5 py-6 sm:px-10 sm:py-10 space-y-6 sm:space-y-8">
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6'>
                        <div>
                            <label className={labelClasses}>Create Password <span className='text-brand-500'>*</span></label>
                            <div className="relative">
                                <input
                                    type='password'
                                    value={data.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    className={cn(getInputClasses(errors.password), 'pl-11')}
                                    placeholder='••••••••'
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={18} />
                                </div>
                            </div>
                            {errors.password && <p className='text-red-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.password}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Confirm Password <span className='text-brand-500'>*</span></label>
                            <div className="relative">
                                <input
                                    type='password'
                                    value={data.confirmPassword}
                                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                                    className={cn(getInputClasses(errors.confirmPassword), 'pl-11')}
                                    placeholder='••••••••'
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={18} />
                                </div>
                            </div>
                            {errors.confirmPassword && <p className='text-red-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.confirmPassword}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-40 px-6 py-4 sm:px-0 sm:py-0 sm:mt-8 sm:pt-4 bg-white/95 dark:bg-gray-900/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-gray-100 dark:border-gray-800 sm:border-t-0 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none transition-all'>
                <div className='flex items-center justify-between gap-4'>
                    <button
                        type="button"
                        onClick={onBack}
                        className='flex-1 sm:flex-none sm:min-w-[120px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[11px] sm:text-sm px-2 py-3.5 sm:px-8 transition-colors bg-gray-50 dark:bg-gray-800 sm:bg-transparent rounded-2xl flex items-center justify-center gap-1.5'
                    >
                        <ChevronLeft size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
                        Back to Identity
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={loading}
                        className={cn(
                            'flex-1 sm:flex-none sm:min-w-[240px] font-black px-2 py-3.5 sm:px-10 sm:py-4 rounded-2xl transition-all shadow-theme-md flex items-center justify-center gap-1 sm:gap-2.5 text-[11px] sm:text-base',
                            loading 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-brand-500 hover:bg-brand-600 active:scale-95 text-white'
                        )}
                    >
                        {loading ? 'Processing...' : 'Continue to Verification'}
                        {!loading && <ChevronRight size={16} className="w-3.5 h-3.5 sm:w-5 sm:h-5" strokeWidth={3} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepContactAuth;
