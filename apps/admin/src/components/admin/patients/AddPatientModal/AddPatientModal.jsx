import React, { useState, useRef } from 'react';
import { UserCheck, ArrowRight, AlertCircle, User, CheckCircle2, UserSearch } from 'lucide-react';
import { api } from '../../../../utils/api';
import { Modal } from '../../../ui/Modal';
import Button from '../../../ui/Button';

// Sub-components
import RegistrationForm from './RegistrationForm';
import DuplicateResolver from './DuplicateResolver';
import SuccessState from './SuccessState';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded, token }) => {
    const scrollRef = useRef(null);
    const [step, setStep] = useState('form'); // 'form' | 'duplicates' | 'success'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        email: '',
        phone: '',
        date_of_birth: '',
    });
    const [duplicates, setDuplicates] = useState([]);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [createdPatient, setCreatedPatient] = useState(null);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [selectedPrimaryId, setSelectedPrimaryId] = useState(null);
    const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null); // null | 'STRIP_EMAIL' | 'LINK_DEPENDENT'


    const [acknowledgedPhoneConflict, setAcknowledgedPhoneConflict] = useState(false);


    const validateForm = () => {
        const errors = {};
        const nameRegex = /^[A-Za-z\s.'-]+$/; // No numbers allowed

        if (!formData.first_name) errors.first_name = 'First name is required';
        else if (!nameRegex.test(formData.first_name)) errors.first_name = 'Numbers are not allowed in names';

        if (!formData.last_name) errors.last_name = 'Last name is required';
        else if (!nameRegex.test(formData.last_name)) errors.last_name = 'Numbers are not allowed in names';

        if (formData.middle_name && !nameRegex.test(formData.middle_name)) {
            errors.middle_name = 'Numbers are not allowed in names';
        }

        if (!formData.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required';
        } else {
            const selectedDate = new Date(formData.date_of_birth);
            const today = new Date();
            if (selectedDate > today) {
                errors.date_of_birth = 'Date of birth cannot be in the future';
            }
        }

        if (!formData.phone) {
            errors.phone = 'Phone number is required for registration';
        }

        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Please provide a valid email address';
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleCheckDuplicates = async (e) => {
        if (e) e.preventDefault();
        
        const errors = {};
        const nameRegex = /^[A-Za-z\s.'-]+$/;
        if (!formData.first_name) errors.first_name = 'First name is required';
        else if (!nameRegex.test(formData.first_name)) errors.first_name = 'Numbers are not allowed in names';
        if (!formData.last_name) errors.last_name = 'Last name is required';
        else if (!nameRegex.test(formData.last_name)) errors.last_name = 'Numbers are not allowed in names';
        if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
        if (!formData.phone) errors.phone = 'Phone number is required';

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError('Please correct the highlighted fields before continuing.');
            
            setTimeout(() => {
                const firstErrorField = Object.keys(errors)[0];
                const element = document.getElementById(firstErrorField);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus({ preventScroll: true });
                }
            }, 10);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const query = new URLSearchParams({
                first_name: formData.first_name,
                last_name: formData.last_name,
                date_of_birth: formData.date_of_birth,
                phone: formData.phone,
                email: formData.email,
            }).toString();

            const response = await api.get(`/admin/patients/check-duplicates?${query}`, token);
            
            if (response.duplicates && response.duplicates.length > 0) {
                setDuplicates(response.duplicates);
                setStep('duplicates');
            } else {
                await handleCreatePatient();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePatient = async (primaryProfileId = null, resolution = null) => {
        // ... previous logic
        const hasNameConflict = duplicates.some(d => 
            d.first_name?.toLowerCase() === formData.first_name?.toLowerCase() && 
            d.last_name?.toLowerCase() === formData.last_name?.toLowerCase()
        );
        
        if (!primaryProfileId && hasNameConflict && !resolution) {
            setIsConflictModalOpen(true);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = { ...formData };
            console.log(' [DEBUG] Submitting Patient Data:', data);
            
            if (primaryProfileId) {
                // LINK_DEPENDENT: Adding a new profile to an existing registered email
                data.primary_profile_id = primaryProfileId;
                data.resolution = 'LINK_DEPENDENT';
                data.otp = otp;
                data.email = null; // Important: Strip email to avoid unique constraint
            } else if (resolution === 'FORCE_OFFLINE') {
                // FORCE_OFFLINE: Register without the conflicting email
                data.email = null;
                data.resolution = 'FORCE_OFFLINE';
            } else if (resolution === 'NAME_OVERRIDE' || duplicates.length > 0) {
                // OVERRIDE: Register with duplicate phone/name
                data.resolution = 'OVERRIDE';
            }
            
            const response = await api.post('/admin/walk-in/quick', data, token);
            setCreatedPatient(response.patient);
            setStep('success');
            if (onPatientAdded) onPatientAdded(response.patient);
            setIsConflictModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (profileId) => {
        setLoading(true);
        setError(null);
        try {
            await api.post(`/admin/patients/${profileId}/request-dependency-consent`, {}, token);
            setOtpSent(true);
            setSelectedPrimaryId(profileId);
            setStep('verification');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep('form');
        setFormData({
            first_name: '', last_name: '', middle_name: '',
            suffix: '', email: '', phone: '', date_of_birth: '',
        });
        setDuplicates([]);
        setError(null);
        setFieldErrors({});
        setCreatedPatient(null);
        setOtp('');
        setOtpSent(false);
        setSelectedPrimaryId(null);
        setAcknowledgedPhoneConflict(false);
        setConfirmType(null);
        onClose();
    };

    const ModalFooter = (
        <>
            {step === 'form' ? (
                <>
                    <Button variant="outline" onClick={resetAndClose} disabled={loading}>Cancel</Button>
                    <Button 
                        onClick={handleCheckDuplicates} 
                        loading={loading}
                        className="px-8 shadow-lg shadow-brand-500/20"
                    >
                        Check for Duplicates
                    </Button>
                </>
            ) : step === 'duplicates' ? (
                <div className="flex w-full items-center justify-between">
                    <Button variant="outline" onClick={() => setStep('form')} className="border-none shadow-none text-gray-500 font-bold hover:bg-gray-50">
                        Return to change details
                    </Button>
                    
                    <div className="flex items-center gap-3">
                        {(() => {
                            const hasEmailConflict = duplicates.some(d => d.email?.toLowerCase() === formData.email?.toLowerCase());
                            const activeAccount = duplicates.find(d => d.email?.toLowerCase() === formData.email?.toLowerCase() && d.is_registered);

                            if (hasEmailConflict) {
                                return (
                                    <>
                                        <Button 
                                            variant="outline"
                                            onClick={() => setConfirmType('FORCE_OFFLINE')}
                                            loading={loading}
                                            className="border-gray-200 text-gray-600 font-black uppercase tracking-tight px-6"
                                        >
                                            Save as Offline Profile
                                        </Button>
                                        {/* Removed Add as Dependent on email conflict per user request */}
                                    </>
                                );
                            }

                            if (step === 'verification') {
                                return (
                                    <div className="flex w-full items-center justify-between">
                                        <Button variant="outline" onClick={() => {
                                            setStep('duplicates');
                                            setOtpSent(false);
                                        }} className="border-none shadow-none text-gray-500 font-bold hover:bg-gray-50">
                                            Back to Similarity Check
                                        </Button>
                                        <Button 
                                            onClick={() => handleCreatePatient(selectedPrimaryId, 'LINK_DEPENDENT')}
                                            disabled={!otp || loading}
                                            loading={loading}
                                            className="bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/25 px-8 font-black uppercase tracking-tight"
                                        >
                                            Verify & Link Dependency
                                            <ArrowRight size={18} className="ml-2" />
                                        </Button>
                                    </div>
                                );
                            }

                            return (
                                <Button 
                                    onClick={() => handleCreatePatient()} 
                                    loading={loading}
                                    className="shadow-xl shadow-brand-500/25 px-8 font-black uppercase tracking-tight"
                                >
                                    Continue as New Profile
                                    <ArrowRight size={18} className="ml-2" />
                                </Button>
                            );
                        })()}
                    </div>
                </div>
            ) : (
                <div className="flex w-full gap-3">
                    <Button variant="outline" onClick={resetAndClose} className="flex-1">Close</Button>
                    <Button 
                        onClick={() => {
                            window.location.href = `/patients/profile/${createdPatient?.id}`;
                            resetAndClose();
                        }}
                        className="flex-1"
                        startIcon={<UserCheck size={20} />}
                    >
                        Open Patient Profile
                    </Button>
                </div>
            )}
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={resetAndClose}
            title={step === 'form' ? "Create Patient Profile" : step === 'duplicates' ? "Fuzzy Match Intercept" : "Profile Created"}
            subtitle={step === 'form' ? "Ensure the patient doesn't already have an existing profile before creating a new one." : step === 'duplicates' ? "Possible duplicates found. Please review before proceeding." : "The patient profile has been successfully generated."}
            footer={ModalFooter}
            className={step === 'duplicates' ? "max-w-6xl" : "max-w-2xl"}
        >
            <div ref={scrollRef} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                {error && (
                    <div className="p-4 bg-error-50 dark:bg-error-500/10 border border-error-100 dark:border-error-500/20 rounded-2xl flex items-start gap-3 text-error-600 dark:text-error-400 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {step === 'form' && (
                    <RegistrationForm 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        fieldErrors={fieldErrors}
                    />
                )}

                {step === 'duplicates' && (
                    <DuplicateResolver 
                        formData={formData}
                        duplicates={duplicates}
                        otp={otp}
                        setOtp={setOtp}
                        otpSent={otpSent}
                        setOtpSent={setOtpSent}
                        handleSendOtp={handleSendOtp}
                        handleCreatePatient={handleCreatePatient}
                        loading={loading}
                        selectedPrimaryId={selectedPrimaryId}
                    />

                )}

                {step === 'verification' && (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white dark:bg-gray-900">
                        <div className="max-w-md mx-auto space-y-8 py-10 animate-in fade-in zoom-in-95 duration-500">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-green-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 rotate-3">
                                    <CheckCircle2 size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Security Verification</h3>
                                    <p className="text-sm text-gray-500 font-bold px-6 leading-relaxed">
                                        A 6-digit verification code has been sent to the primary account.
                                        Please enter it below to authorize this linkage.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Authorization Code</label>
                                    <input 
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full h-16 text-center text-3xl font-black tracking-[1em] rounded-3xl border-2 border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex items-start gap-4">
                                    <AlertCircle size={18} className="text-brand-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-brand-700/80 dark:text-brand-400 font-bold leading-relaxed uppercase tracking-wide">
                                        This verification ensures that dependents are only added with the explicit consent of the primary account holder.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <SuccessState createdPatient={createdPatient} />
                )}
            </div>

            {/* Conflict Confirmation Modal */}
            <Modal
                isOpen={isConflictModalOpen}
                onClose={() => setIsConflictModalOpen(false)}
                title="Review Similar Records"
                subtitle="We found existing patients with matching names."
                className="max-w-md"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsConflictModalOpen(false)}>I need to check</Button>
                        <Button 
                            onClick={() => handleCreatePatient(null, 'NAME_OVERRIDE')}
                            loading={loading}
                            className="bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/20 font-black uppercase tracking-widest"
                        >
                            Proceed Registration
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className="w-16 h-16 rounded-3xl bg-brand-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/20">
                        <UserSearch size={32} />
                    </div>
                    <div className="space-y-2">
                        <h6 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Confirm Data Accuracy</h6>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed px-4">
                            You are about to create a new profile for <span className="text-brand-500">{formData.first_name} {formData.last_name}</span>. 
                            <br/><br/>
                            Have you reviewed the similar records found to ensure this is not a duplicate creation?
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Action Confirmation Modal */}
            <Modal
                isOpen={!!confirmType}
                onClose={() => setConfirmType(null)}
                title={confirmType === 'FORCE_OFFLINE' ? "Confirm Offline Registration" : "Confirm Dependency Link"}
                subtitle={confirmType === 'FORCE_OFFLINE' ? "You are about to create a profile without an associated email account." : "You are about to link this patient to an existing account."}
                className="max-w-md"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setConfirmType(null)}>Cancel</Button>
                        <Button 
                            onClick={() => {
                                if (confirmType === 'FORCE_OFFLINE') handleCreatePatient(null, 'FORCE_OFFLINE');
                                else handleSendOtp(selectedPrimaryId);
                                setConfirmType(null);
                            }}
                            loading={loading}
                            className={confirmType === 'FORCE_OFFLINE' ? "bg-brand-600 shadow-lg shadow-brand-500/20" : "bg-green-600 shadow-lg shadow-green-500/20"}
                        >
                            {confirmType === 'FORCE_OFFLINE' ? "Create Stub Profile" : "Send Verification Code"}
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl ${
                        confirmType === 'FORCE_OFFLINE' ? 'bg-brand-500 text-white shadow-brand-500/20' : 'bg-green-500 text-white shadow-green-500/20'
                    }`}>
                        {confirmType === 'FORCE_OFFLINE' ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
                    </div>
                    <div className="space-y-3">
                        <h6 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {confirmType === 'FORCE_OFFLINE' ? "No Portal Access" : "Secure Account Linkage"}
                        </h6>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed px-4">
                            {confirmType === 'FORCE_OFFLINE' ? (
                                <>
                                    This patient will be created as a <strong>Stub Profile</strong> (Offline). 
                                    <br/><br/>
                                    <strong>Impact:</strong> They will NOT have access to the Patient Portal and cannot manage appointments online until an email is linked to their profile in the future.
                                </>
                            ) : (
                                <>
                                    An OTP will be sent to <span className="text-brand-500">{formData.email}</span>. 
                                    Once verified, this patient will be managed through that primary account.
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </Modal>
        </Modal>
    );
};

export default AddPatientModal;
