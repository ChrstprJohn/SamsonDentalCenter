import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogOut, AlertCircle, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/ThemeContext';
import { api } from '../../../utils/api';
import { Modal } from '../../ui/Modal';
import Button from '../../ui/Button';
import RegisterStepIndicator from './steps/RegisterStepIndicator';
import StepPersonalDetails from './steps/StepPersonalDetails';
import StepContactAuth from './steps/StepContactAuth';
import StepOTPVerification from './steps/StepOTPVerification';

const RegisterContainer = () => {
    const navigate = useNavigate();
    const { setIsDarkModeAllowed } = useTheme();
    const toast = useToast();

    // Force light mode
    useEffect(() => {
        setIsDarkModeAllowed(false);
        return () => setIsDarkModeAllowed(true);
    }, [setIsDarkModeAllowed]);



    // Multi-step State
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);
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
        agreed_to_terms: false,
    });
    const [signupErrors, setSignupErrors] = useState({});
    const [otp, setOtp] = useState('');

    // Scroll to top and clear errors on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        setError(null);
        setSignupErrors({});
    }, [step]);

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

        const validateNames = (name) => /^[a-zA-Z\s-]*$/.test(name);

        if (currentStep === 1) {
            if (!signupData.firstName.trim()) {
                errors.firstName = 'First name is required';
            } else if (!validateNames(signupData.firstName)) {
                errors.firstName = 'Numbers and special characters are not allowed';
            }

            if (!signupData.lastName.trim()) {
                errors.lastName = 'Last name is required';
            } else if (!validateNames(signupData.lastName)) {
                errors.lastName = 'Numbers and special characters are not allowed';
            }

            if (signupData.middleName && !validateNames(signupData.middleName)) {
                errors.middleName = 'Invalid characters in middle name';
            }

            if (!signupData.sex) errors.sex = 'Sex is required';
            if (!signupData.dob) {
                errors.dob = 'Date of birth is required';
            } else {
                const selectedDate = new Date(signupData.dob);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate > today) {
                    errors.dob = 'Date of birth cannot be in the future';
                }
            }

            // Email Validation
            if (!signupData.email.trim()) {
                errors.email = 'Email address is required';
            } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
                errors.email = 'Please enter a valid email address';
            }

            // Phone Validation (Philippine Mobile)
            if (!signupData.phone.trim()) {
                errors.phone = 'Phone number is required';
            } else {
                const sanitizedPhone = signupData.phone.replace(/\D/g, '');
                if (sanitizedPhone.length !== 11) {
                    errors.phone = 'Philippine mobile numbers must be exactly 11 digits';
                } else if (!sanitizedPhone.startsWith('09')) {
                    errors.phone = 'Philippine mobile numbers must start with 09';
                }
            }

            if (!signupData.agreed_to_terms) {
                errors.terms = 'You must agree to the terms and privacy policy';
            }
        } else if (currentStep === 2) {
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

        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the errors in the form before continuing.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

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
            const msg = err.message || 'Failed to send verification code';
            setError(msg);
            toast.error(msg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
            navigate('/login', {
                state: {
                    message: 'Account created! Please sign in with your new credentials.'
                }
            });
        } catch (err) {
            const msg = err.message || 'Verification failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleExit = () => {
        // If data is empty, just navigate
        const hasData = signupData.firstName || signupData.email;
        if (hasData && step < 3) {
            setShowExitModal(true);
        } else {
            navigate('/');
        }
    };

    const breadcrumbLabels = ['Identity', 'Security', 'Verify'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 selection:bg-brand-100 selection:text-brand-900">
            {/* Sticky Navigation Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-theme-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-center relative">
                    {/* Exit Button */}
                    <div className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2'>
                        <button
                            onClick={() => setShowExitModal(true)}
                            className='flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold text-base transition-colors p-2 sm:px-4 sm:py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                            <X size={18} />
                            <span className='hidden sm:inline'>Exit</span>
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <RegisterStepIndicator currentStep={step} labels={breadcrumbLabels} />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10 md:py-16">
                <div className="w-full">
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
                            serverError={error}
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



                </div>
            </main>

            {/* Exit Confirmation Modal */}
            <Modal
                isOpen={showExitModal}
                onClose={() => setShowExitModal(false)}
                className="max-w-md"
                isBottomSheet={true}
            >
                <div className="flex flex-col h-full">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                            <LogOut className="text-amber-600 dark:text-amber-400 rotate-180" size={22} />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-lg font-black text-gray-900 dark:text-white">Discard Registration?</h3>
                            <p className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold">Your progress will be lost</p>
                        </div>
                    </div>

                    <div className="px-6 py-8 flex-1 text-center">
                        <p className="text-[14px] sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-bold italic">
                            Are you sure you want to leave? All entered information will be cleared.
                        </p>
                    </div>

                    <div className="px-5 py-5 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800 flex flex-row gap-3">
                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={() => {
                                setShowExitModal(false);
                                navigate('/');
                            }}
                            className="flex-1 h-11 text-[11px] sm:text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            Discard & Exit
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => setShowExitModal(false)}
                            className="flex-[1.5] h-11 text-[11px] sm:text-sm font-black shadow-lg shadow-primary-500/20"
                        >
                            Continue Sign-up
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RegisterContainer;
