import { useState } from 'react';
import { User, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserOtherInfoStep = ({ formData, book_for_others, onUpdate, setBookForOthersMode, onNext, onBack }) => {
    const { user } = useAuth();
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (book_for_others && !formData.booked_for_name.trim()) {
            newErrors.booked_for_name = 'Name is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    const handleChange = (field, value) => {
        onUpdate({ [field]: value });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Patient Information</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Please confirm who this appointment is for.
            </p>

            <div className='space-y-6 max-w-lg'>
                {/* 🎠 Who is it for? Custom Slider Toggle */}
                <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                    <label className='block text-sm font-semibold text-slate-700 mb-4'>
                        Who is this appointment for?
                    </label>
                    <div className='flex p-1 bg-slate-200/50 rounded-xl relative'>
                        {/* Sliding Background */}
                        <div
                            className={`absolute inset-y-1 w-1/2 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${
                                book_for_others ? 'translate-x-[98%]' : 'translate-x-0'
                            }`}
                        />
                        
                        <button
                            type='button'
                            onClick={() => setBookForOthersMode(false)}
                            className={`flex-1 py-2 text-sm font-medium z-10 rounded-lg transition-colors ${
                                !book_for_others ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Myself
                        </button>
                        <button
                            type='button'
                            onClick={() => setBookForOthersMode(true)}
                            className={`flex-1 py-2 text-sm font-medium z-10 rounded-lg transition-colors ${
                                book_for_others ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Someone Else
                        </button>
                    </div>
                </div>

                {/* Conditional Form Fields */}
                <div className='space-y-5 animate-in fade-in slide-in-from-top-2 duration-300'>
                    {!book_for_others ? (
                        /* Case: Myself (Autofilled) */
                        <div className='space-y-5 p-4 border border-brand-100 bg-brand-50/30 rounded-2xl'>
                            <div>
                                <label className='flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider mb-2'>
                                    <User size={14} />
                                    Your Profile Name
                                </label>
                                <div className='px-4 py-3 bg-white border border-brand-100 rounded-xl text-sm text-slate-700 font-medium'>
                                    {user?.full_name || user?.name || 'Authorized User'}
                                </div>
                            </div>
                            <div>
                                <label className='flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider mb-2'>
                                    <Mail size={14} />
                                    Email Address
                                </label>
                                <div className='px-4 py-3 bg-white border border-brand-100 rounded-xl text-sm text-slate-500'>
                                    {user?.email}
                                </div>
                            </div>
                            <p className='text-[10px] text-brand-600 italic'>
                                * This appointment will be linked directly to your patient records.
                            </p>
                        </div>
                    ) : (
                        /* Case: Someone Else (Input) */
                        <div className='space-y-5 p-4 border border-amber-100 bg-amber-50/30 rounded-2xl'>
                            <div>
                                <label className='flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2'>
                                    <User size={14} />
                                    Appointee's Full Name <span className='text-red-400'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={formData.booked_for_name}
                                    onChange={(e) => handleChange('booked_for_name', e.target.value)}
                                    placeholder="Enter person's full name"
                                    className={`w-full px-4 py-3 border rounded-xl text-sm
                                                focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400
                                                transition-all ${
                                                    errors.booked_for_name
                                                        ? 'border-red-300 bg-red-50'
                                                        : 'border-amber-100 bg-white'
                                                }`}
                                    autoFocus
                                />
                                {errors.booked_for_name && (
                                    <p className='text-xs text-red-500 mt-1 font-medium'>{errors.booked_for_name}</p>
                                )}
                            </div>
                            <div>
                                <label className='flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2'>
                                    <Mail size={14} />
                                    Email (Notifications sent to you)
                                </label>
                                <div className='px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm text-slate-400 italic'>
                                    {user?.email}
                                </div>
                            </div>
                            <p className='text-[10px] text-amber-700 italic'>
                                * You are booking on behalf of someone else. You will receive all email communications.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className='mt-10 flex justify-between'>
                <button
                    onClick={onBack}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5 transition-colors'
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className='bg-brand-500 hover:bg-brand-600 text-white font-semibold px-10 py-3 rounded-xl 
                               transition-all shadow-lg shadow-brand-500/25 active:scale-95'
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default UserOtherInfoStep;
