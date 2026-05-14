import React from 'react';
import { Mail, ChevronRight, ChevronLeft, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const StepOTPVerification = ({ email, otp, updateOTP, onVerify, onBack, onResend, loading, error }) => {
    return (
        <div className='space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
            {/* Page Title Section */}
            <div className='text-left'>
                <h2 className='text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight'>
                    Verify Email
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium'>
                    We've sent a 6-digit verification code to <span className='text-brand-600 dark:text-brand-400 font-bold'>{email}</span>.
                </p>
            </div>

            {/* Card Wrapper */}
            <div className='w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-theme-md overflow-hidden'>
                <div className="px-5 pt-7 pb-5 sm:px-10 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/50">
                    <KeyRound size={20} className="text-brand-500" />
                    <h3 className="text-[15px] sm:text-lg font-bold text-gray-900 dark:text-white">Final Verification</h3>
                </div>

                <div className="px-5 py-8 sm:px-10 sm:py-12 flex flex-col items-center">
                    <div className='w-20 h-20 bg-brand-50 dark:bg-brand-500/10 rounded-3xl flex items-center justify-center mb-8'>
                        <Mail className='text-brand-600 dark:text-brand-400' size={40} strokeWidth={2.5} />
                    </div>
                    
                    <div className='w-full max-w-[320px] space-y-6'>
                        <div className="relative">
                            <input
                                type='text'
                                maxLength={6}
                                value={otp}
                                onChange={(e) => updateOTP(e.target.value.replace(/[^0-9]/g, ''))}
                                className={cn(
                                    'w-full text-center text-4xl font-black tracking-[0.3em] py-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 outline-none transition-all',
                                    error 
                                        ? 'border-red-500 ring-4 ring-red-500/10' 
                                        : 'border-gray-100 dark:border-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                                )}
                                placeholder='000000'
                            />
                        </div>
                        
                        {error && (
                            <p className='text-red-500 text-[11px] font-bold text-center animate-shake'>
                                {error}
                            </p>
                        )}

                        <p className='text-gray-400 text-[12px] font-bold text-center'>
                            Didn't receive the code?{' '}
                            <button 
                                onClick={onResend}
                                className='text-brand-600 hover:underline ml-1 disabled:opacity-50'
                                disabled={loading}
                            >
                                Resend Code
                            </button>
                        </p>
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
                        Back to Security
                    </button>
                    <button
                        type="button"
                        onClick={onVerify}
                        disabled={loading || otp.length < 6}
                        className={cn(
                            'flex-1 sm:flex-none sm:min-w-[240px] font-black px-2 py-3.5 sm:px-10 sm:py-4 rounded-2xl transition-all shadow-theme-md flex items-center justify-center gap-1 sm:gap-2.5 text-[11px] sm:text-base',
                            loading || otp.length < 6
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-brand-500 hover:bg-brand-600 active:scale-95 text-white'
                        )}
                    >
                        {loading ? 'Verifying...' : 'Complete Registration'}
                        {!loading && <ChevronRight size={16} className="w-3.5 h-3.5 sm:w-5 sm:h-5" strokeWidth={3} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepOTPVerification;
