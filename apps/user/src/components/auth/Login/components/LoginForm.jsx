import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const InputGroup = ({ label, icon: Icon, error, children }) => (
    <div className='space-y-1.5 group text-left'>
        <label
            className={cn(
                'block text-xs font-semibold uppercase tracking-wide transition-colors',
                error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600',
            )}
        >
            {label}
        </label>
        <div className='relative'>
            <div
                className={cn(
                    'absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors',
                    error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-600',
                )}
            >
                <Icon size={18} />
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
        'w-full bg-white border rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none transition-all duration-200',
        error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/10'
            : value && value.length > 0
              ? 'border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
              : 'border-slate-200/60 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 placeholder:text-slate-400',
    );

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');

    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        let hasError = false;
        if (!email) {
            setEmailError('Email is required');
            hasError = true;
        }
        if (!pass) {
            setPassError('Password is required');
            hasError = true;
        }

        if (!hasError) {
            onSubmit(email, pass);
        }
    };


    return (
        <div className='flex flex-col h-full'>
            <div className='mb-8 text-center flex-shrink-0'>
                <h2 className='text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight'>
                    Welcome Back
                </h2>
                <p className='text-slate-500 text-sm'>Sign in to your account to continue.</p>
            </div>

            <form
                onSubmit={handleFormSubmit}
                className='space-y-6'
            >
                <InputGroup
                    label='Email Address'
                    icon={Mail}
                    error={emailError}
                >
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                        }}
                        className={inputClassName(emailError, email)}
                        placeholder='name@example.com'
                    />
                </InputGroup>

                <InputGroup
                    label='Password'
                    icon={Lock}
                    error={passError}
                >
                    <input
                        type='password'
                        value={pass}
                        onChange={(e) => {
                            setPass(e.target.value);
                            if (passError) setPassError('');
                        }}
                        className={inputClassName(passError, pass)}
                        placeholder='••••••••'
                    />
                </InputGroup>

                {error && (
                    <div className='p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center justify-between'>
                        <span>{error}</span>
                        <AlertCircle size={14} />
                    </div>
                )}

                <div className='pt-2'>
                    <Button
                        type='submit'
                        disabled={loading}
                        className='w-full'
                        size='lg'
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ChevronRight className='ml-2 h-4 w-4' />}
                    </Button>
                </div>
            </form>

            <div className='flex-shrink-0 pt-8 border-t border-slate-100 text-center mt-8'>
                <p className='text-slate-500 text-sm'>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className='text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors'
                    >
                        Create Account
                    </button>
                </p>
                <div className='mt-4'>
                    <button
                        onClick={() => navigate('/book')}
                        className='text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors'
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
