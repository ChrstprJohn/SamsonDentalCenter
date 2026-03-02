import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');

    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(email, pass);
    };

    const handleToggleSignup = () => {
        navigate('/register');
    };

    const handleContinueAsGuest = () => {
        navigate('/book');
    };
    return (
        <div className='animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full justify-center'>
            <div className='mb-6 text-center'>
                <h2 className='text-2xl font-brand font-black text-slate-900 mb-1 tracking-tight'>
                    Welcome Back
                </h2>
                <p className='text-slate-400 text-xs font-medium'>
                    Sign in to your account to continue.
                </p>
            </div>

            <form
                className='space-y-4'
                onSubmit={handleFormSubmit}
            >
                <div className='relative group'>
                    <label
                        className={`block text-[11px] font-bold uppercase tracking-widest mb-1.5 transition-colors text-left ${emailError ? 'text-red-500' : 'text-slate-400 group-focus-within:text-sky-500'}`}
                    >
                        Email Address
                    </label>
                    <div className='relative'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                            <Mail size={16} />
                        </div>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError('');
                            }}
                            className={`w-full bg-slate-50/50 border rounded-xl pl-11 pr-4 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${emailError ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                            placeholder='email@address.com'
                        />
                    </div>
                    {emailError && (
                        <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                            {emailError}
                        </p>
                    )}
                </div>

                <div className='relative group'>
                    <label
                        className={`block text-[11px] font-bold uppercase tracking-widest mb-1.5 transition-colors text-left ${passError ? 'text-red-500' : 'text-slate-400 group-focus-within:text-sky-500'}`}
                    >
                        Password
                    </label>
                    <div className='relative'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                            <Lock size={16} />
                        </div>
                        <input
                            type='password'
                            value={pass}
                            onChange={(e) => {
                                setPass(e.target.value);
                                if (passError) setPassError('');
                            }}
                            className={`w-full bg-slate-50/50 border rounded-xl pl-11 pr-4 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${passError ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                            placeholder='••••••••'
                        />
                    </div>
                    {passError && (
                        <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                            {passError}
                        </p>
                    )}
                </div>

                {error && !emailError && !passError && (
                    <div className='text-red-500 text-[11px] font-bold bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-center justify-end space-x-2 animate-in zoom-in-95 duration-200'>
                        <span>{error}</span>
                        <AlertCircle size={14} />
                    </div>
                )}

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all text-xs uppercase tracking-widest mt-2 shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center space-x-2'
                >
                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                    <ChevronRight size={18} />
                </button>
            </form>

            <div className='mt-6 pt-5 border-t border-slate-50 text-center'>
                <p className='text-slate-400 text-xs font-medium'>
                    New patient?{' '}
                    <button
                        onClick={handleToggleSignup}
                        className='text-sky-500 font-bold hover:underline ml-1'
                    >
                        Create Account
                    </button>
                </p>
                <div className='flex items-center my-3'>
                    <div className='flex-1 h-px bg-slate-50'></div>
                    <span className='px-3 text-[9px] font-bold text-slate-200 tracking-widest'>
                        OR
                    </span>
                    <div className='flex-1 h-px bg-slate-50'></div>
                </div>
                <button
                    onClick={handleContinueAsGuest}
                    className='w-full bg-white border border-slate-100 text-slate-400 font-bold py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all text-[9px] uppercase tracking-widest flex items-center justify-center space-x-2 group'
                >
                    <span>Continue as Guest</span>
                    <ArrowRight
                        size={14}
                        className='transition-transform group-hover:translate-x-1'
                    />
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
