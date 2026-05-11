import { useState, useEffect, useRef } from 'react';
import { 
    ChevronDown, 
    UserCircle, 
    Users, 
    Plus, 
    Mail, 
    Phone, 
    Contact, 
    Check, 
    ArrowRight,
    ShieldCheck,
    Calendar,
    Heart,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const UserOtherInfoStep = ({ formData, onUpdate, onNext, onBack }) => {
    const { user, token } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const dropdownRef = useRef(null);

    // Fetch profiles on mount
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const response = await api.get('/profiles', token);
                setProfiles(response.profiles || []);
            } catch (err) {
                console.error('Failed to fetch profiles:', err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchProfiles();
    }, [token]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (profileId) => {
        setIsOpen(false);
        setErrors({});

        if (profileId === 'myself') {
            onUpdate({
                patient_profile_id: '',
                booked_for_first_name: user?.first_name || '',
                booked_for_last_name: user?.last_name || '',
                booked_for_middle_name: user?.middle_name || '',
                booked_for_suffix_name: user?.suffix || '',
                booked_for_birthday: user?.date_of_birth || '',
                booked_for_relationship: 'Self',
                booked_for_sex: user?.sex || '',
                booked_for_phone: user?.phone || ''
            });
        } else if (profileId === 'new') {
            onUpdate({
                patient_profile_id: 'new',
                booked_for_first_name: '',
                booked_for_last_name: '',
                booked_for_middle_name: '',
                booked_for_suffix_name: '',
                booked_for_birthday: '',
                booked_for_relationship: '',
                booked_for_sex: '',
                booked_for_phone: user?.phone || ''
            });
        } else {
            const profile = profiles.find(p => p.id === profileId);
            if (profile) {
                onUpdate({
                    patient_profile_id: profile.id,
                    booked_for_first_name: profile.first_name,
                    booked_for_last_name: profile.last_name,
                    booked_for_middle_name: profile.middle_name,
                    booked_for_suffix_name: profile.suffix,
                    booked_for_birthday: profile.date_of_birth,
                    booked_for_relationship: profile.relationship_to_primary || 'Dependent',
                    booked_for_sex: profile.sex || '',
                    booked_for_phone: user?.phone || ''
                });
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.booked_for_first_name?.trim()) newErrors.first_name = 'Required';
        if (!formData.booked_for_last_name?.trim()) newErrors.last_name = 'Required';
        
        if (formData.patient_profile_id === 'new') {
            if (!formData.booked_for_birthday) newErrors.birthday = 'Required';
            if (!formData.booked_for_relationship) newErrors.relationship = 'Required';
            if (!formData.booked_for_sex) newErrors.sex = 'Required';
        }

        const phone = formData.booked_for_phone?.replace(/\D/g, '');
        if (!phone) {
            newErrors.phone = 'Required';
        } else if (phone.length < 10 || phone.length > 11) {
            newErrors.phone = 'Invalid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    const isReadOnly = formData.patient_profile_id !== 'new';
    const currentSelection = formData.patient_profile_id === 'new' 
        ? 'new' 
        : (formData.patient_profile_id || 'myself');

    const getSelectedLabel = () => {
        if (currentSelection === 'myself') return 'Myself (Primary Account)';
        if (currentSelection === 'new') return '+ Add New Family Member';
        const p = profiles.find(p => p.id === currentSelection);
        return p ? `${p.first_name} ${p.last_name} (${p.relationship_to_primary || 'Dependent'})` : 'Select Patient';
    };

    const labelClasses = "mb-2 block text-[13px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 leading-none";
    const baseInput = "h-11 w-full rounded-xl border appearance-none px-4 py-2.5 text-[13px] sm:text-sm shadow-theme-sm placeholder:text-gray-400 focus:outline-hidden focus:ring-4 transition-all bg-white dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 font-medium";
    
    const getInputClasses = (fieldError) => {
        const base = baseInput;
        if (fieldError) {
            return `${base} border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
        }
        return `${base} text-gray-800 border-gray-300 dark:border-gray-700 focus:border-brand-300 focus:ring-brand-500/15 hover:border-gray-400 dark:hover:border-gray-600 dark:text-white/90 dark:focus:border-brand-800 shadow-theme-xs hover:shadow-theme-sm`;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-[60px] sm:pb-6">
            {/* Header Section */}
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight'>
                    Patient Details
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium'>
                    Enter the details below to confirm who this appointment is for and their contact information.
                </p>
            </div>

            {/* Profile Selection Dropdown */}
            <div className='mb-10 relative' ref={dropdownRef}>
                <label className={labelClasses}>Who are we booking for?</label>
                <button
                    type="button"
                    onClick={() => !loading && setIsOpen(!isOpen)}
                    disabled={loading}
                    className={`w-full flex items-center justify-between p-4 bg-white dark:bg-white/[0.02] border-2 rounded-2xl transition-all shadow-theme-sm group ${
                        isOpen ? 'border-brand-500 ring-4 ring-brand-500/10' : 'border-gray-100 dark:border-gray-800 hover:border-brand-200'
                    } ${loading ? 'opacity-50 cursor-wait' : ''}`}
                >
                    <div className='flex items-center gap-3'>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-brand-500 transition-colors ${
                            currentSelection === 'new' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600' : 'bg-gray-50 dark:bg-white/5'
                        }`}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (currentSelection === 'myself' ? <UserCircle size={24} /> : currentSelection === 'new' ? <Plus size={24} /> : <Users size={24} />)}
                        </div>
                        <span className="text-[15px] font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                            {loading ? 'Loading profiles...' : getSelectedLabel()}
                        </span>
                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
                </button>

                {isOpen && (
                    <div className='absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-[#0f172a] border-2 border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200'>
                        <div className='max-h-[300px] overflow-y-auto p-2 scrollbar-hide'>
                            <button
                                onClick={() => handleSelect('myself')}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-1 ${
                                    currentSelection === 'myself' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <div className='w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center'><UserCircle size={18} /></div>
                                <span className='text-sm font-black uppercase tracking-tight'>Myself (Default)</span>
                                {currentSelection === 'myself' && <Check size={16} className='ml-auto text-brand-500' />}
                            </button>

                            {profiles.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleSelect(p.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-1 ${
                                        currentSelection === p.id ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <div className='w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center'><Users size={18} /></div>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-black uppercase tracking-tight'>{p.first_name} {p.last_name}</span>
                                        <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>{p.relationship_to_primary || 'Dependent'}</span>
                                    </div>
                                    {currentSelection === p.id && <Check size={16} className='ml-auto text-brand-500' />}
                                </button>
                            ))}

                            <div className='h-px bg-slate-100 dark:bg-gray-800 my-1 mx-2' />

                            <button
                                onClick={() => handleSelect('new')}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                                    currentSelection === 'new' ? 'bg-brand-50 text-brand-600' : 'text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/5'
                                }`}
                            >
                                <div className='w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center'><Plus size={18} /></div>
                                <span className='text-sm font-black uppercase tracking-tight'>Add New Family Member</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className='space-y-6'>
                <div className='bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-[32px] overflow-hidden shadow-theme-xs'>
                    <div className='px-5 pt-7 pb-5 sm:px-10 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/50'>
                        <UserCircle size={18} className="text-brand-500" />
                        <h3 className='text-[14px] sm:text-lg font-bold text-gray-900 dark:text-white'>Patient Identity</h3>
                    </div>
                    <div className='p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8'>
                        <div>
                            <label className={labelClasses}>First Name</label>
                            <input 
                                type="text" 
                                readOnly={isReadOnly}
                                value={formData.booked_for_first_name}
                                onChange={(e) => onUpdate({ booked_for_first_name: e.target.value })}
                                className={getInputClasses('first_name')}
                                placeholder="Patient's First Name"
                            />
                            {errors.first_name && <p className='text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1'>{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className={labelClasses}>Last Name</label>
                            <input 
                                type="text" 
                                readOnly={isReadOnly}
                                value={formData.booked_for_last_name}
                                onChange={(e) => onUpdate({ booked_for_last_name: e.target.value })}
                                className={getInputClasses('last_name')}
                                placeholder="Patient's Last Name"
                            />
                            {errors.last_name && <p className='text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1'>{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className={labelClasses}>Middle Name (Optional)</label>
                            <input 
                                type="text" 
                                readOnly={isReadOnly}
                                value={formData.booked_for_middle_name || ''}
                                onChange={(e) => onUpdate({ booked_for_middle_name: e.target.value })}
                                className={getInputClasses('middle_name')}
                                placeholder="Optional"
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Suffix (Optional)</label>
                            <input 
                                type="text" 
                                readOnly={isReadOnly}
                                value={formData.booked_for_suffix_name || ''}
                                onChange={(e) => onUpdate({ booked_for_suffix_name: e.target.value })}
                                className={getInputClasses('suffix_name')}
                                placeholder="e.g. Jr., III"
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Date of Birth</label>
                            <div className='relative'>
                                <input 
                                    type="date" 
                                    readOnly={isReadOnly}
                                    value={formData.booked_for_birthday}
                                    onChange={(e) => onUpdate({ booked_for_birthday: e.target.value })}
                                    className={getInputClasses('birthday') + " pr-4"}
                                />
                                <Calendar size={14} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none' />
                            </div>
                            {errors.birthday && <p className='text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1'>{errors.birthday}</p>}
                        </div>
                        <div>
                            <label className={labelClasses}>Sex</label>
                            {isReadOnly ? (
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={formData.booked_for_sex === 'M' ? 'Male' : formData.booked_for_sex === 'F' ? 'Female' : 'Other'}
                                    className={getInputClasses('sex')}
                                />
                            ) : (
                                <select 
                                    value={formData.booked_for_sex}
                                    onChange={(e) => onUpdate({ booked_for_sex: e.target.value })}
                                    className={getInputClasses('sex')}
                                >
                                    <option value="" disabled>Select Sex</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            )}
                            {errors.sex && <p className='text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1'>{errors.sex}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClasses}>Relationship</label>
                            {isReadOnly ? (
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={formData.booked_for_relationship}
                                    className={getInputClasses('relationship')}
                                />
                            ) : (
                                <select 
                                    value={formData.booked_for_relationship}
                                    onChange={(e) => onUpdate({ booked_for_relationship: e.target.value })}
                                    className={getInputClasses('relationship')}
                                >
                                    <option value="" disabled>Select Relationship</option>
                                    <option value="Child">Child</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Other">Other</option>
                                </select>
                            )}
                            {errors.relationship && <p className='text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1'>{errors.relationship}</p>}
                        </div>
                    </div>
                </div>

                <div className='bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-[32px] overflow-hidden shadow-theme-xs'>
                    <div className='px-5 pt-7 pb-5 sm:px-10 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/50'>
                        <Contact size={18} className="text-brand-500" />
                        <h3 className='text-[14px] sm:text-lg font-bold text-gray-900 dark:text-white'>Contact Information</h3>
                    </div>
                    <div className='p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div>
                            <label className={labelClasses}>Notification Email</label>
                            <div className='relative'>
                                <input 
                                    type="email" 
                                    readOnly 
                                    value={user?.email || ''}
                                    className={`${baseInput} bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-gray-800 text-gray-500 dark:text-white/40 cursor-not-allowed pr-10`}
                                />
                                <Mail size={14} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none' />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Contact Phone</label>
                            <div className='relative'>
                                <input 
                                    type="tel" 
                                    value={formData.booked_for_phone || ''}
                                    onChange={(e) => onUpdate({ booked_for_phone: e.target.value })}
                                    className={getInputClasses('phone') + " pr-10"}
                                    placeholder="0917 123 4567"
                                />
                                <Phone size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-400' : 'text-gray-300'}`} />
                            </div>
                            {errors.phone && <p className='text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1'>{errors.phone}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className='fixed bottom-0 left-0 right-0 sm:relative z-40 px-6 py-4 sm:px-0 sm:py-0 sm:mt-6 sm:pt-2 bg-white/95 dark:bg-gray-900/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-gray-100 dark:border-gray-800 sm:border-t-0 shadow-theme-md sm:shadow-none transition-all'>
                <div className='flex items-center gap-3 w-full sm:justify-between'>
                    <button 
                        onClick={onBack} 
                        className='flex-1 sm:flex-none sm:min-w-[120px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[11px] sm:text-sm px-6 py-3.5 sm:px-8 transition-colors bg-gray-50 dark:bg-gray-800 sm:bg-transparent rounded-2xl border border-transparent shadow-theme-xs'
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleNext} 
                        className='flex-[2] sm:flex-none sm:min-w-[240px] bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl transition-all shadow-theme-md flex items-center justify-center gap-2 sm:gap-2.5 text-[12px] sm:text-base'
                    >
                        Review Booking <ArrowRight size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserOtherInfoStep;
