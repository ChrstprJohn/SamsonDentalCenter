import React from 'react';
import { Mail, Phone, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const InputGroup = ({ label, icon: Icon, error, children }) => (
    <div className='space-y-1.5 group text-left'>
        <label
            className={cn(
                'block text-[11px] font-bold uppercase tracking-[0.05em] transition-colors',
                error ? 'text-red-500' : 'text-slate-500 group-focus-within:text-red-600',
            )}
        >
            {label}
        </label>
        <div className='relative'>
            <div
                className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300',
                    error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-red-600',
                )}
            >
                <Icon size={18} strokeWidth={2.5} />
            </div>
            {children}
        </div>
        {error && (
            <p className='text-red-500 text-xs font-medium text-right animate-in slide-in-from-top-1'>
                {error}
            </p>
        )}
    </div>
);

const inputClassName = (error, value) =>
    cn(
        'w-full rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300',
        error
            ? 'bg-red-50/30 border border-red-300 text-red-900 placeholder:text-red-300 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15 hover:border-slate-300',
        value && !error && 'bg-white border-green-500/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/15',
    );

const StepContactAuth = ({ data, errors, updateField, onNext, onBack, loading }) => {
    return (
        <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
            <div className='text-center mb-6'>
                <h3 className='text-xl font-black text-slate-900'>Contact & Security</h3>
                <p className='text-slate-500 text-xs'>Almost there, just secure your account</p>
            </div>

            <div className='space-y-4'>
                <InputGroup label='Email Address' icon={Mail} error={errors.email}>
                    <input
                        type='email'
                        value={data.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={inputClassName(errors.email, data.email)}
                        placeholder='yourname@example.com'
                    />
                </InputGroup>

                <InputGroup label='Phone Number' icon={Phone} error={errors.phone}>
                    <input
                        type='tel'
                        value={data.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={inputClassName(errors.phone, data.phone)}
                        placeholder='09123456789'
                    />
                </InputGroup>

                <InputGroup label='Password' icon={Lock} error={errors.password}>
                    <input
                        type='password'
                        value={data.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        className={inputClassName(errors.password, data.password)}
                        placeholder='••••••••'
                    />
                </InputGroup>

                <InputGroup label='Confirm Password' icon={Lock} error={errors.confirmPassword}>
                    <input
                        type='password'
                        value={data.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        className={inputClassName(errors.confirmPassword, data.confirmPassword)}
                        placeholder='••••••••'
                    />
                </InputGroup>
            </div>

            <div className='flex gap-3 mt-4'>
                <Button
                    onClick={onBack}
                    variant='outline'
                    className='flex-1 border-slate-200 text-slate-600 font-bold rounded-xl py-3.5'
                >
                    <ChevronLeft className='mr-2 h-4 w-4' strokeWidth={3} />
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={loading}
                    className='flex-[2] !bg-red-600 hover:!bg-red-700 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-red-600/25 border-0 font-bold rounded-xl py-3.5'
                >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                    {!loading && <ChevronRight className='ml-2 h-4 w-4' strokeWidth={3} />}
                </Button>
            </div>
        </div>
    );
};

export default StepContactAuth;
