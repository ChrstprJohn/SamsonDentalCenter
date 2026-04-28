import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const SetPasswordPage = () => {
    const navigate = useNavigate();
    const { login: storeLogin } = useAuth();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tokens, setTokens] = useState({ access_token: null, refresh_token: null });

    // Supabase puts tokens in the URL hash fragment after redirect
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (!access_token || !refresh_token) {
            setError('Invalid or expired invitation link. Please contact your administrator.');
            return;
        }

        setTokens({ access_token, refresh_token });
        // Clean the hash from the URL
        window.history.replaceState(null, '', window.location.pathname);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const data = await api.post('/auth/set-password', {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                password,
            });

            // Store token + user in context (mirrors login flow)
            localStorage.setItem('token', data.token);
            window.location.href = '/'; // Hard redirect to re-initialize auth
        } catch (err) {
            setError(err.message || 'Failed to set password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4'>
            <div className='w-full max-w-md'>
                {/* Card */}
                <div className='bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden'>
                    {/* Header */}
                    <div className='bg-brand-500/10 px-8 py-6 border-b border-gray-800'>
                        <div className='flex items-center gap-3 mb-1'>
                            <div className='bg-brand-500 w-8 h-8 rounded-lg flex items-center justify-center'>
                                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                    <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' fill='currentColor' className='text-white' />
                                </svg>
                            </div>
                            <div>
                                <h1 className='text-white font-black text-lg tracking-tight font-outfit'>
                                    Set Your Password
                                </h1>
                                <p className='text-gray-400 text-[11px] uppercase tracking-wider font-medium'>
                                    Primera Dental — Doctor Portal
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className='px-8 py-7'>
                        {error && !tokens.access_token ? (
                            // Invalid link state
                            <div className='text-center py-6'>
                                <div className='text-red-400 text-sm font-medium mb-4'>{error}</div>
                                <p className='text-gray-500 text-xs'>
                                    Contact your administrator to resend the invitation.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className='space-y-5'>
                                <p className='text-gray-400 text-sm mb-6 leading-relaxed'>
                                    Welcome to the team. Create a secure password to activate your account.
                                </p>

                                {error && (
                                    <div className='bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm'>
                                        {error}
                                    </div>
                                )}

                                <div className='space-y-1.5'>
                                    <label className='block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                                        New Password
                                    </label>
                                    <input
                                        type='password'
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder='Minimum 8 characters'
                                        required
                                        className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 h-11 text-white text-sm font-medium placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all'
                                    />
                                </div>

                                <div className='space-y-1.5'>
                                    <label className='block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                                        Confirm Password
                                    </label>
                                    <input
                                        type='password'
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        placeholder='Re-enter password'
                                        required
                                        className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 h-11 text-white text-sm font-medium placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all'
                                    />
                                </div>

                                <button
                                    type='submit'
                                    disabled={loading || !tokens.access_token}
                                    className='w-full h-11 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 mt-2 font-outfit'
                                >
                                    {loading ? 'Activating Account...' : 'Activate Account'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <p className='text-center text-gray-600 text-xs mt-5'>
                    Already have a password?{' '}
                    <a href='/login' className='text-brand-400 hover:text-brand-300 font-medium'>
                        Sign in here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SetPasswordPage;
