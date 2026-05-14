import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../common/Carousel';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../../../context/ThemeContext';
import { api } from '../../../utils/api';
import StepPersonalDetails from './steps/StepPersonalDetails';
import StepContactAuth from './steps/StepContactAuth';
import StepOTPVerification from './steps/StepOTPVerification';

const RegisterContainer = () => {
    const navigate = useNavigate();
    const { setIsDarkModeAllowed } = useTheme();

    // Force light mode
    useEffect(() => {
        setIsDarkModeAllowed(false);
        return () => setIsDarkModeAllowed(true);
    }, [setIsDarkModeAllowed]);

    // Multi-step State
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [signupData, setSignupData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        sex: '',
        dob: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [signupErrors, setSignupErrors] = useState({});
    const [otp, setOtp] = useState('');

    const updateField = (field, value) => {
        setSignupData(prev => ({ ...prev, [field]: value }));
        if (signupErrors[field]) {
            setSignupErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validateStep = (currentStep) => {
        const errors = {};
        if (currentStep === 1) {
            if (!signupData.firstName.trim()) errors.firstName = 'First name is required';
            if (!signupData.lastName.trim()) errors.lastName = 'Last name is required';
            if (!signupData.sex) errors.sex = 'Sex is required';
            if (!signupData.dob) errors.dob = 'Birthday is required';
        } else if (currentStep === 2) {
            if (!signupData.email.trim()) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
                errors.email = 'Email is invalid';
            }
            if (!signupData.phone.trim()) errors.phone = 'Phone is required';
            if (!signupData.password) {
                errors.password = 'Password is required';
            } else if (signupData.password.length < 8) {
                errors.password = 'Minimum 8 characters';
            }
            if (signupData.password !== signupData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }
        setSignupErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInitiateRegistration = async () => {
        if (!validateStep(2)) return;

        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/register/initiate', {
                email: signupData.email,
                password: signupData.password,
                first_name: signupData.firstName,
                last_name: signupData.lastName,
                middle_name: signupData.middleName,
                suffix: signupData.suffix,
                sex: signupData.sex,
                date_of_birth: signupData.dob,
                phone: signupData.phone
            });
            setStep(3);
        } catch (err) {
            setError(err.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/register/verify', {
                email: signupData.email,
                otp_code: otp
            });
            // Success! 
            navigate('/login', { 
                state: { 
                    message: 'Account created! Please sign in with your new credentials.' 
                } 
            });
        } catch (err) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen md:h-screen flex flex-col md:flex-row bg-slate-50'>
            {/* Left — Carousel (60%) */}
            <Carousel className='md:w-[60%] lg:w-[60%]' />

            {/* Right — Form (40%) */}
            <div className='flex-grow md:w-[40%] lg:w-[40%] flex flex-col relative bg-white shadow-2xl z-10'>
                {/* Close Button */}
                <button
                    onClick={() => navigate('/')}
                    className='absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors duration-200 z-50'
                    aria-label='Close'
                >
                    <X size={24} />
                </button>

                <div className='flex-grow overflow-y-auto w-full h-full custom-scrollbar'>
                    <div className='min-h-full flex flex-col justify-center w-full px-6 sm:px-8 py-6 md:py-8 pb-12'>
                        <div className='w-full max-w-lg mx-auto'>
                            {/* Step Indicator */}
                            <div className='flex items-center justify-center gap-2 mb-8'>
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={cn(
                                            'h-1.5 rounded-full transition-all duration-500',
                                            s === step ? 'w-8 bg-red-600' : (s < step ? 'w-4 bg-red-200' : 'w-4 bg-slate-100')
                                        )}
                                    />
                                ))}
                            </div>

                            {step === 1 && (
                                <StepPersonalDetails
                                    data={signupData}
                                    errors={signupErrors}
                                    updateField={updateField}
                                    onNext={() => validateStep(1) && setStep(2)}
                                />
                            )}

                            {step === 2 && (
                                <StepContactAuth
                                    data={signupData}
                                    errors={signupErrors}
                                    updateField={updateField}
                                    onNext={handleInitiateRegistration}
                                    onBack={() => setStep(1)}
                                    loading={loading}
                                />
                            )}

                            {step === 3 && (
                                <StepOTPVerification
                                    email={signupData.email}
                                    otp={otp}
                                    updateOTP={setOtp}
                                    onVerify={handleVerifyOTP}
                                    onBack={() => setStep(2)}
                                    onResend={handleInitiateRegistration}
                                    loading={loading}
                                    error={error}
                                />
                            )}

                            {error && step !== 3 && (
                                <div className='mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium text-center animate-in fade-in zoom-in'>
                                    {error}
                                </div>
                            )}

                            <p className='text-slate-500 text-xs mt-8 text-center font-medium'>
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className='text-red-600 font-bold hover:underline transition-colors'
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterContainer;
