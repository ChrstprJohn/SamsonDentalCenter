import { useState } from 'react';

const InfoStep = ({ formData, onUpdate, onNext, onBack }) => {
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else {
            // ✅ Validate phone format: sanitize to digits only, then check length (10-11 digits)
            const sanitizedPhone = formData.phone.replace(/\D/g, '');
            if (!/^\d{10,11}$/.test(sanitizedPhone)) {
                newErrors.phone = 'Please enter a valid phone number (10-11 digits).';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    const handleChange = (field, value) => {
        onUpdate(field, value);
        // Clear field error on change
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Your Information</h2>
            <p className='text-slate-500 text-sm mb-6'>
                We need a few details to complete your booking. A confirmation email will be sent to
                the address you provide.
            </p>

            <div className='space-y-5 max-w-lg'>
                {/* Full Name */}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                        Full Name <span className='text-red-400'>*</span>
                    </label>
                    <input
                        type='text'
                        value={formData.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder='Juan Dela Cruz'
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm
                                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                                    transition-colors ${
                                        errors.full_name
                                            ? 'border-red-300 bg-red-50/50'
                                            : 'border-slate-200'
                                    }`}
                    />
                    {errors.full_name && (
                        <p className='text-red-500 text-xs mt-1'>{errors.full_name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                        Email Address <span className='text-red-400'>*</span>
                    </label>
                    <input
                        type='email'
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder='juan@email.com'
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm
                                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                                    transition-colors ${
                                        errors.email
                                            ? 'border-red-300 bg-red-50/50'
                                            : 'border-slate-200'
                                    }`}
                    />
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                    <p className='text-xs text-slate-400 mt-1'>
                        A confirmation email will be sent to this address.
                    </p>
                </div>

                {/* Phone */}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                        Phone Number <span className='text-red-400'>*</span>
                    </label>
                    <input
                        type='tel'
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder='09171234567'
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm
                                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                                    transition-colors ${
                                        errors.phone
                                            ? 'border-red-300 bg-red-50/50'
                                            : 'border-slate-200'
                                    }`}
                    />
                    {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>}
                </div>
            </div>

            {/* Navigation */}
            <div className='flex justify-between mt-8'>
                <button
                    onClick={onBack}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5'
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold
                               px-6 py-2.5 rounded-xl transition-colors'
                >
                    Next: Review →
                </button>
            </div>
        </div>
    );
};

export default InfoStep;
