import React from 'react';
import { Mail, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const StepOTPVerification = ({ email, otp, updateOTP, onVerify, onBack, onResend, loading, error }) => {
    return (
        <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center'>
            <div className='mb-6'>
                <div className='w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <Mail className='text-red-600' size={32} />
                </div>
                <h3 className='text-xl font-black text-slate-900'>Verify Email</h3>
                <p className='text-slate-500 text-xs mt-1'>
                    We sent a 6-digit code to <span className='text-slate-900 font-bold'>{email}</span>
                </p>
            </div>

            <div className='space-y-4'>
                <div className='flex justify-center gap-2'>
                    <input
                        type='text'
                        maxLength={6}
                        value={otp}
                        onChange={(e) => updateOTP(e.target.value.replace(/[^0-9]/g, ''))}
                        className='w-full max-w-[200px] text-center text-3xl font-black tracking-[0.5em] py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-red-600 focus:ring-4 focus:ring-red-600/10 outline-none transition-all'
                        placeholder='000000'
                    />
                </div>
                
                {error && (
                    <p className='text-red-500 text-xs font-medium animate-shake'>
                        {error}
                    </p>
                )}

                <p className='text-slate-400 text-[11px] font-medium'>
                    Didn't receive the code?{' '}
                    <button 
                        onClick={onResend}
                        className='text-red-600 font-bold hover:underline ml-1 disabled:opacity-50'
                        disabled={loading}
                    >
                        Resend Code
                    </button>
                </p>
            </div>

            <div className='flex flex-col gap-3 mt-4'>
                <Button
                    onClick={onVerify}
                    disabled={loading || otp.length < 6}
                    className='w-full !bg-red-600 hover:!bg-red-700 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-red-600/25 border-0 font-bold rounded-xl py-3.5'
                >
                    {loading ? 'Verifying...' : 'Verify & Create Account'}
                    {!loading && <ChevronRight className='ml-2 h-4 w-4' strokeWidth={3} />}
                </Button>
                
                <button
                    onClick={onBack}
                    className='text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors'
                >
                    Change Email
                </button>
            </div>
        </div>
    );
};

export default StepOTPVerification;
