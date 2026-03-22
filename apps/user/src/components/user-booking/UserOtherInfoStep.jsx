import { useState } from 'react';
import { User, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserOtherInfoStep = ({ formData, onUpdate, onNext, onBack }) => {
    const { user } = useAuth();
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.booked_for_name.trim()) {
            newErrors.booked_for_name = 'Name is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    const handleChange = (field, value) => {
        onUpdate({ [field]: value }); // ✅ FIX: Pass object, not separate params
        // Clear field error on change
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Who is this appointment for?</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Enter the name of the person this appointment is being booked for. Confirmation will
                be sent to your account email.
            </p>

            <div className='space-y-5 max-w-lg'>
                {/* Person's Name */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5'>
                        <User
                            size={16}
                            className='text-sky-500'
                        />
                        Name <span className='text-red-400'>*</span>
                    </label>
                    <input
                        type='text'
                        value={formData.booked_for_name}
                        onChange={(e) => handleChange('booked_for_name', e.target.value)}
                        placeholder='Jane Doe'
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm
                                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                                    transition-colors ${
                                        errors.booked_for_name
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-slate-200 bg-white'
                                    }`}
                    />
                    {errors.booked_for_name && (
                        <p className='text-sm text-red-500 mt-1'>{errors.booked_for_name}</p>
                    )}
                </div>

                {/* Account Email (Read-only) */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5'>
                        <Mail
                            size={16}
                            className='text-sky-500'
                        />
                        Confirmation Email (Your Account)
                    </label>
                    <input
                        type='email'
                        value={user?.email || ''}
                        disabled
                        className='w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 cursor-not-allowed'
                    />
                    <p className='text-xs text-slate-500 mt-1.5'>
                        Confirmation will be sent to your account email, not theirs.
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className='mt-8 flex justify-between'>
                <button
                    onClick={onBack}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5'
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl 
                               transition-colors shadow-lg shadow-sky-500/25'
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserOtherInfoStep;
