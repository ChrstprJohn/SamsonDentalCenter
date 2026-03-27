import { Lock, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Modal that appears when a guest tries to book a specialized service.
 * Requires authentication with options to login or register.
 *
 * @param {object} service - Service object with { id, name, tier }
 * @param {function} onClose - Called when modal is closed
 */
const SpecializedServiceModal = ({ service, onClose }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Redirect to login with intended service in query param
        navigate(`/login?redirect=/patient/book?service=${service.id}`);
        onClose();
    };

    const handleRegister = () => {
        // Redirect to register with intended service in query param
        navigate(`/register?redirect=/patient/book?service=${service.id}`);
        onClose();
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl max-w-md w-full p-8 relative'>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors'
                    aria-label='Close'
                >
                    <X size={20} />
                </button>

                {/* Lock Icon */}
                <div className='bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <Lock
                        size={24}
                        className='text-amber-600'
                    />
                </div>

                {/* Title */}
                <h3 className='text-xl font-bold text-slate-900 text-center mb-2'>
                    Account Required
                </h3>

                {/* Service name + explanation */}
                <p className='text-sm text-slate-600 text-center mb-6'>
                    <strong className='text-sky-600'>{service.name}</strong> is a specialized
                    service that requires an account to book. This helps us:
                </p>

                {/* Benefits list */}
                <ul className='space-y-2.5 mb-8'>
                    <li className='flex gap-3 text-sm text-slate-600'>
                        <span className='text-sky-500 font-bold shrink-0'>✓</span>
                        <span>Keep your medical history secure & private</span>
                    </li>
                    <li className='flex gap-3 text-sm text-slate-600'>
                        <span className='text-sky-500 font-bold shrink-0'>✓</span>
                        <span>Send personalized prep instructions before your visit</span>
                    </li>
                    <li className='flex gap-3 text-sm text-slate-600'>
                        <span className='text-sky-500 font-bold shrink-0'>✓</span>
                        <span>Manage all your appointments in one dashboard</span>
                    </li>
                </ul>

                {/* Action buttons */}
                <div className='space-y-2.5'>
                    <button
                        onClick={handleLogin}
                        className='w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700
                                   text-white font-semibold py-3 px-4 rounded-xl
                                   transition-colors flex items-center justify-center gap-2
                                   shadow-lg shadow-sky-500/20'
                    >
                        Login to Your Account
                        <ArrowRight size={16} />
                    </button>

                    <button
                        onClick={handleRegister}
                        className='w-full border-2 border-sky-500 text-sky-600 hover:bg-sky-50
                                   active:bg-sky-100 font-semibold py-3 px-4 rounded-xl
                                   transition-colors'
                    >
                        Create New Account
                    </button>
                </div>

                {/* Secondary action */}
                <button
                    onClick={onClose}
                    className='w-full mt-4 text-slate-600 hover:text-slate-900
                               text-sm font-medium py-2 transition-colors'
                >
                    Continue browsing other services
                </button>
            </div>
        </div>
    );
};

export default SpecializedServiceModal;
