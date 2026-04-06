import { useState } from 'react';
import { ArrowRight, UserCircle, Contact, Info } from 'lucide-react';

const InfoStep = ({ formData, onUpdate, onNext, onBack }) => {
    const [errors, setErrors] = useState({});
    
    // Internal state synced with parent fields for the breakdown
    const [nameParts, setNameParts] = useState({
        first: formData.first_name || '',
        last: formData.last_name || '',
        middle: formData.middle_name || '',
        suffix: formData.suffix_name || ''
    });

    const validate = () => {
        const newErrors = {};

        if (!nameParts.first.trim()) newErrors.first = 'First name is required.';
        if (!nameParts.last.trim()) newErrors.last = 'Last name is required.';
        
        if (!formData.email?.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else {
            const sanitizedPhone = formData.phone.replace(/\D/g, '');
            if (!/^\d{10,11}$/.test(sanitizedPhone)) {
                newErrors.phone = 'Please enter a valid phone number.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    const handleFieldChange = (field, value) => {
        onUpdate(field, value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleNamePartChange = (part, value) => {
        const updated = { ...nameParts, [part]: value };
        setNameParts(updated);

        const fullName = [updated.first, updated.middle, updated.last, updated.suffix]
            .filter(Boolean)
            .join(' ');
        
        onUpdate(part + '_name', value);
        onUpdate('full_name', fullName);

        if (errors[part]) {
            setErrors(prev => ({ ...prev, [part]: undefined }));
        }
    };

    const getInputClasses = (fieldError) => {
        const base = "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-[clamp(14px,1vw,15px)] shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 transition-colors bg-white dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 font-medium";
        if (fieldError) {
            return `${base} border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
        }
        return `${base} text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
    };

    const labelClasses = "mb-1.5 block text-[clamp(12px,0.8vw,13px)] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest opacity-80 leading-none";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase'>
                    Your Information
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium'>
                    Please provide your contact details. We'll use this information to send you a booking confirmation and reminders.
                </p>
            </div>

            {/* Premium Card - Full-width stretched container */}
            <div className='w-full bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-theme-sm overflow-hidden'>
                
                {/* Section: Personal Details */}
                <section>
                    {/* Header with icon and title - No underline border */}
                    <div className="px-6 py-6 sm:px-10 flex items-center gap-3">
                        <UserCircle size={20} className="text-brand-500" />
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white/90 uppercase tracking-widest">Personal Details</h3>
                    </div>

                    <div className="px-6 pb-10 sm:px-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {/* Last Name */}
                            <div>
                                <label className={labelClasses}>Last Name <span className='text-brand-500'>*</span></label>
                                <input
                                    type='text'
                                    value={nameParts.last}
                                    onChange={(e) => handleNamePartChange('last', e.target.value)}
                                    placeholder='Dela Cruz'
                                    className={getInputClasses(errors.last)}
                                />
                                {errors.last && <p className='text-error-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.last}</p>}
                            </div>

                            {/* First Name */}
                            <div>
                                <label className={labelClasses}>First Name <span className='text-brand-500'>*</span></label>
                                <input
                                    type='text'
                                    value={nameParts.first}
                                    onChange={(e) => handleNamePartChange('first', e.target.value)}
                                    placeholder='Juan'
                                    className={getInputClasses(errors.first)}
                                />
                                {errors.first && <p className='text-error-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.first}</p>}
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label className={labelClasses}>Middle Name <span className="opacity-40 font-normal italic">(optional)</span></label>
                                <input
                                    type='text'
                                    value={nameParts.middle}
                                    onChange={(e) => handleNamePartChange('middle', e.target.value)}
                                    placeholder='Santos'
                                    className={getInputClasses()}
                                />
                            </div>

                            {/* Suffix */}
                            <div>
                                <label className={labelClasses}>Suffix <span className="opacity-40 font-normal italic">(optional)</span></label>
                                <input
                                    type='text'
                                    value={nameParts.suffix}
                                    onChange={(e) => handleNamePartChange('suffix', e.target.value)}
                                    placeholder='Jr., III'
                                    className={getInputClasses()}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Contact Information */}
                <section>
                    {/* Header with icon and title - No underline border */}
                    <div className="px-6 py-6 sm:px-10 flex items-center gap-3">
                        <Contact size={20} className="text-brand-500" />
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white/90 uppercase tracking-widest">Contact Information</h3>
                    </div>

                    <div className="px-6 pb-10 sm:px-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {/* Email Address */}
                            <div>
                                <label className={labelClasses}>Email address <span className='text-brand-500'>*</span></label>
                                <input
                                    type='email'
                                    value={formData.email}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    placeholder='juan@email.com'
                                    className={getInputClasses(errors.email)}
                                />
                                {errors.email && <p className='text-error-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.email}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className={labelClasses}>Phone Number <span className='text-brand-500'>*</span></label>
                                <input
                                    type='tel'
                                    value={formData.phone}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    placeholder='09171234567'
                                    className={getInputClasses(errors.phone)}
                                />
                                {errors.phone && <p className='text-error-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Information Banner (Exclusive Guest Communication) */}
                        <div className="mt-8 bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100/50 dark:border-brand-500/10 rounded-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-500 overflow-hidden">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                                        <Info size={22} />
                                    </div>
                                    <h4 className="text-[14px] sm:text-base font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">Please double-check your email address</h4>
                                </div>
                                <p className="text-[12px] sm:text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium min-w-0 break-words">
                                    Since you are booking as a guest, the address provided above is our **exclusive way** to send your appointment confirmation, clinic approvals, and important status updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Navigation Footer */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-800'>
                <button
                    onClick={onBack}
                    className='w-full sm:w-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[13px] sm:text-sm px-6 py-3 sm:px-8 transition-colors uppercase tracking-widest'
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className='w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl transition-all shadow-theme-md flex items-center justify-center gap-2 sm:gap-2.5 text-[14px] sm:text-base uppercase tracking-widest'
                >
                    Continue to Review
                    <ArrowRight size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    );
};

export default InfoStep;
