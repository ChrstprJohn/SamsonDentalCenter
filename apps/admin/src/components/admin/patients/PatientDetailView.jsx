import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, History, ShieldAlert, CreditCard, User, UserCheck, History as HistoryIcon, Loader2, Users, Search, CheckCircle2 } from 'lucide-react';
import { Button, Modal, Input, Label, Switch } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const PatientDetailView = ({ patientId, onBack, activeTab }) => {
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingLink, setLoadingLink] = useState(false);
    const [linkStatus, setLinkStatus] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
    const [isRestricting, setIsRestricting] = useState(false);
    
    // Family / Dependencies State
    const [dependents, setDependents] = useState([]);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [initialResults, setInitialResults] = useState([]);
    const [selectedDependent, setSelectedDependent] = useState(null);
    const [otpValue, setOtpValue] = useState('');
    const [linkStep, setLinkStep] = useState('search'); // 'search', 'otp', 'success'
    const [isLinking, setIsLinking] = useState(false);

    const [editFormData, setEditFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
    });

    const fetchPatient = async () => {
        try {
            const data = await api.get(`/admin/patients/${patientId}`, token);
            setPatient(data);
            setEditFormData({
                full_name: data.full_name || '',
                email: data.email || '',
                phone: data.phone || '',
            });
            
            // Fetch dependents
            const allPatients = await api.get('/admin/patients', token);
            const filtered = allPatients.patients.filter(p => p.primary_profile_id === patientId);
            setDependents(filtered);
            
        } catch (err) {
            console.error('Failed to fetch patient:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchPatient();
    }, [patientId, token]);

    // Fetch initial offline patients when modal opens
    useEffect(() => {
        const fetchInitial = async () => {
            if (isLinkModalOpen && linkStep === 'search') {
                setIsInitialLoading(true);
                try {
                    const res = await api.get('/admin/patients', token);
                    const stubs = res.patients.filter(p => !p.is_registered && !p.primary_profile_id && p.id !== patientId);
                    setInitialResults(stubs.slice(0, 10));
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsInitialLoading(false);
                }
            }
        };
        fetchInitial();
    }, [isLinkModalOpen, linkStep, token, patientId]);

    const handleSaveProfile = async () => {
        try {
            const updated = await api.patch(`/admin/patients/${patientId}`, {
                full_name: editFormData.full_name
            }, token);
            setPatient(prev => ({ ...prev, ...updated.patient }));
            setIsEditModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSaveContact = async () => {
        try {
            const updated = await api.patch(`/admin/patients/${patientId}`, {
                email: editFormData.email,
                phone: editFormData.phone
            }, token);
            setPatient(prev => ({ ...prev, ...updated.patient }));
            setIsEditContactModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleToggleRestriction = async () => {
        setIsRestricting(true);
        try {
            const updated = await api.patch(`/admin/patients/${patientId}/restriction`, {
                restricted: !patient.is_booking_restricted,
                reason: !patient.is_booking_restricted ? 'Restricted by administrator' : null
            }, token);
            setPatient(prev => ({ ...prev, ...updated }));
        } catch (err) {
            alert(err.message);
        } finally {
            setIsRestricting(false);
        }
    };

    const handleSendSetupLink = async () => {
        setLoadingLink(true);
        setLinkStatus(null);
        try {
            await api.post(`/admin/patients/${patientId}/send-setup-link`, {}, token);
            setLinkStatus({ type: 'success', message: 'Setup link sent!' });
        } catch (err) {
            setLinkStatus({ type: 'error', message: err.message });
        } finally {
            setLoadingLink(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'records', label: 'Records' },
        { id: 'financial', label: 'Financial' },
        { id: 'family', label: 'Family' },
        { id: 'security', label: 'Security' },
    ];

    if (loading) {
        return (
            <div className='flex items-center justify-center grow bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800'>
                <Loader2 className='animate-spin text-brand-500' size={40} />
            </div>
        );
    }

    if (!patient) return null;

    return (
        <div className='flex flex-col grow min-h-0 bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden no-scrollbar'>
            {/* Top Navigation */}
            <div className='sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800'>
                <div className='px-4 sm:px-6 py-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={onBack}
                            className='p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors'
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight font-outfit'>
                                {patient.full_name}
                            </h3>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1'>
                                Patient Registry
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sub-navigation Tabs */}
                <div className='px-4 sm:px-6 flex items-center gap-6'>
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => navigate(`/patients/${t.id}/${patient.id}`)}
                            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative ${
                                activeTab === t.id 
                                    ? 'text-brand-500' 
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                        >
                            {t.label}
                            {activeTab === t.id && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full' />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className='grow overflow-y-auto no-scrollbar'>
                <div className='p-4 sm:p-6 lg:p-8 space-y-6'>
                    {/* Header Card */}
                    <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                        <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                            <div className='flex flex-col items-center w-full gap-6 xl:flex-row xl:items-center'>
                                <div className='shrink-0'>
                                    <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-white/5'>
                                        {patient.avatar_url ? (
                                            <img src={patient.avatar_url} alt={patient.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className='text-gray-400' size={32} />
                                        )}
                                    </div>
                                </div>
                                <div className='text-center xl:text-left'>
                                    <h4 className='mb-1 text-[clamp(18px,2.2vw,22px)] font-bold text-gray-900 dark:text-white font-outfit'>
                                        {patient.full_name}
                                    </h4>
                                    <div className='flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                        <p className='text-[clamp(13px,1.2vw,14px)] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-widest'>
                                            {patient.status} Patient
                                        </p>
                                        <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block'></div>
                                        <span className={`px-2 py-0.5 rounded-lg text-[clamp(11px,1vw,12px)] font-bold uppercase tracking-wider ${patient.is_registered ? 'bg-success-100 text-success-600 dark:bg-success-500/10 dark:text-success-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                                            {patient.is_registered ? 'Verified Account' : 'Stub Profile'}
                                        </span>
                                        {patient.is_booking_restricted && (
                                            <span className="px-2 py-0.5 rounded-lg text-[clamp(11px,1vw,12px)] font-bold uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                                Restricted
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {(!activeTab || activeTab === 'profile') && (
                                <Button
                                    variant='outline'
                                    onClick={() => setIsEditModalOpen(true)}
                                    className='h-11 px-6 text-sm font-bold shadow-sm'
                                >
                                    Edit Basic Information
                                </Button>
                            )}
                        </div>

                        {/* Contact Meta */}
                        <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                            <div className='flex flex-wrap gap-6'>
                                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                    <Mail size={16} className='text-gray-400' /> {patient.email || 'No email set'}
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                    <Phone size={16} className='text-gray-400' /> {patient.phone || 'No phone set'}
                                </div>
                            </div>
                            <Button
                                variant='outline'
                                onClick={() => setIsEditContactModalOpen(true)}
                                className='h-11 px-6 text-sm font-bold shadow-sm'
                            >
                                <Mail size={16} className='mr-2' /> Update Records
                            </Button>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className='min-h-120 md:min-h-140'>
                        {(!activeTab || activeTab === 'profile') && (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                                <div className='lg:col-span-2 space-y-6'>
                                    <div className='p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-brand-50/30 dark:bg-brand-500/5'>
                                        <h4 className='text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                            <Calendar size={14} /> Upcoming Appointment
                                        </h4>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-sm font-bold text-gray-900 dark:text-white'>{patient.next_appointment || 'No upcoming appointments'}</p>
                                            <Button variant='ghost' className='text-[10px] font-black uppercase text-brand-600'>View Details</Button>
                                        </div>
                                    </div>
                                    <div className='p-6 rounded-2xl border border-gray-100 dark:border-gray-800'>
                                        <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>Patient Summary</h4>
                                        <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                                            Patient has been active since {new Date(patient.created_at).toLocaleDateString()}. Total of {patient.total_visits || 0} visits recorded across all services.
                                        </p>
                                    </div>
                                </div>
                                <div className='space-y-6'>
                                    <div className='p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[10px] font-bold text-gray-400 uppercase'>Outstanding</span>
                                            <span className='text-sm font-black text-gray-900 dark:text-white'>{patient.balance || '₱ 0.00'}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[10px] font-bold text-gray-400 uppercase'>Attendence</span>
                                            <span className='text-sm font-black text-success-600'>100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'records' && (
                            <div className='space-y-4'>
                                <h4 className='text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                    <HistoryIcon size={14} /> Medical & Treatment History
                                </h4>
                                <div className='p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center py-20'>
                                    <History size={40} className='mx-auto text-gray-300 dark:text-gray-700 mb-4' />
                                    <h4 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight'>No History Found</h4>
                                    <p className='text-xs text-gray-500 mt-2'>Treatment history will appear here once the patient completes their first visit.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'financial' && (
                            <div className='p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center py-20'>
                                <CreditCard size={40} className='mx-auto text-gray-300 dark:text-gray-700 mb-4' />
                                <h4 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight'>Billing History</h4>
                                <p className='text-xs text-gray-500 mt-2'>No outstanding invoices for this patient.</p>
                            </div>
                        )}

                        {activeTab === 'security' && (
                             <div className='space-y-6'>
                                 {/* Account Portal Status */}
                                 <div className='p-6 rounded-2xl bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10'>
                                     <h4 className='text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                         <User size={14} /> Portal Access
                                     </h4>
                                     <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                         <div>
                                             <p className='text-sm font-bold text-gray-900 dark:text-white'>
                                                 {patient.is_registered ? 'Account Active' : 'Account Not Set Up'}
                                             </p>
                                             <p className='text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-sm font-medium'>
                                                 {patient.is_registered 
                                                     ? 'This patient has registered an account and can book appointments online.' 
                                                     : 'This is a stub profile. Send a setup link to allow the patient to access the portal.'}
                                             </p>
                                         </div>
                                         {!patient.is_registered && (
                                             <Button 
                                                 onClick={handleSendSetupLink}
                                                 disabled={loadingLink || !patient.email}
                                                 className='bg-brand-500 text-white font-bold h-11 px-6 text-xs uppercase shadow-lg shadow-brand-500/20'
                                             >
                                                 {loadingLink ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} className='mr-2' />}
                                                 Send Setup Link
                                             </Button>
                                         )}
                                     </div>
                                     {linkStatus && (
                                         <p className={`text-[10px] font-bold mt-3 uppercase tracking-wider ${linkStatus.type === 'success' ? 'text-success-600' : 'text-red-500'}`}>
                                             {linkStatus.message}
                                         </p>
                                     )}
                                     {!patient.email && !patient.is_registered && (
                                         <p className='text-[10px] text-red-500 font-bold mt-3 italic'>
                                             * Email address required to send setup link. Update contact info to proceed.
                                         </p>
                                     )}
                                 </div>

                                <div className='p-6 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10'>
                                     <h4 className='text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                         <ShieldAlert size={14} /> Account Restrictions
                                     </h4>
                                     <p className='text-[11px] text-red-700 dark:text-red-400 font-medium leading-relaxed mb-4'>
                                         Setting a restriction will prevent this patient from booking appointments online.
                                     </p>
                                     <Button 
                                        variant='outline' 
                                        onClick={handleToggleRestriction}
                                        disabled={isRestricting}
                                        className={`h-11 border-red-200 text-red-600 text-xs font-black uppercase hover:bg-red-50 ${patient.is_booking_restricted ? 'bg-red-500 text-white hover:bg-red-600 border-none' : ''}`}
                                    >
                                        {isRestricting ? <Loader2 size={16} className="animate-spin" /> : patient.is_booking_restricted ? 'Lift Booking Restriction' : 'Restrict Online Booking'}
                                    </Button>
                                </div>
                             </div>
                        )}

                        {activeTab === 'family' && (
                            <div className='space-y-6'>
                                <div className='flex items-center justify-between'>
                                    <h4 className='text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2'>
                                        <Users size={14} /> Dependents & Family Members
                                    </h4>
                                    <Button 
                                        onClick={() => {
                                            setLinkStep('search');
                                            setIsLinkModalOpen(true);
                                        }}
                                        disabled={!patient.email}
                                        className='h-10 px-4 bg-brand-500 text-white font-bold text-[10px] uppercase tracking-widest'
                                    >
                                        Add Dependent
                                    </Button>
                                </div>

                                {dependents.length > 0 ? (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {dependents.map(dep => (
                                            <div 
                                                key={dep.id}
                                                onClick={() => navigate(`/patients/profile/${dep.id}`)}
                                                className='p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-brand-500/50 transition-all cursor-pointer bg-white dark:bg-white/[0.02] group'
                                            >
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center'>
                                                        <User size={18} className='text-gray-400 group-hover:text-brand-500 transition-colors' />
                                                    </div>
                                                    <div>
                                                        <p className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight'>{dep.full_name}</p>
                                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5'>
                                                            {dep.phone || 'No phone set'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='p-12 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center'>
                                        <Users size={32} className='mx-auto text-gray-300 dark:text-gray-700 mb-4' />
                                        <h4 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight'>No Dependents Linked</h4>
                                        <p className='text-xs text-gray-500 mt-2 max-w-xs mx-auto'>
                                            You can link Offline Patient records to this primary account to manage their appointments under one login.
                                        </p>
                                    </div>
                                )}

                                {!patient.email && (
                                    <div className='p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 flex items-start gap-3'>
                                        <ShieldAlert size={18} className='text-amber-500 shrink-0 mt-0.5' />
                                        <p className='text-[11px] text-amber-800 dark:text-amber-400 font-medium leading-relaxed'>
                                            <span className='font-bold block uppercase mb-1'>Identity Verification Required</span>
                                            Linking dependents requires an email address for identity verification (OTP consent). Please add an email address to this primary profile first.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className='max-w-[450px] w-full m-auto'>
                <div className='p-8 bg-white dark:bg-gray-900 rounded-xl'>
                    <h4 className='text-lg font-black uppercase tracking-tight mb-6'>Edit Patient Data</h4>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Full Name</Label>
                            <Input 
                                value={editFormData.full_name} 
                                onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                className='h-11' 
                            />
                        </div>
                        <div className='flex justify-end gap-3 pt-6'>
                            <Button variant='outline' onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveProfile} className='bg-brand-500 text-white px-6 font-bold'>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isEditContactModalOpen} onClose={() => setIsEditContactModalOpen(false)} className='max-w-[450px] w-full m-auto'>
                <div className='p-8 bg-white dark:bg-gray-900 rounded-xl'>
                    <h4 className='text-lg font-black uppercase tracking-tight mb-6'>Contact Update</h4>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Email Address</Label>
                            <Input 
                                value={editFormData.email} 
                                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                                className='h-11' 
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Phone Number</Label>
                            <Input 
                                value={editFormData.phone} 
                                onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className='h-11' 
                            />
                        </div>
                        <div className='flex justify-end gap-3 pt-6'>
                            <Button variant='outline' onClick={() => setIsEditContactModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveContact} className='bg-brand-500 text-white px-6 font-bold'>Update Contact</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Link Dependent Modal */}
            <Modal 
                isOpen={isLinkModalOpen} 
                onClose={() => setIsLinkModalOpen(false)} 
                className='max-w-[550px] w-full m-auto'
                title={linkStep === 'search' ? "Identity Binding: Link Dependent" : linkStep === 'otp' ? "Verification Required" : "Identity Linked"}
                subtitle={linkStep === 'search' ? "Locate an existing offline record to link to this primary account." : linkStep === 'otp' ? "A security code has been dispatched to the primary account email." : "The patient records have been successfully synchronized."}
                footer={
                    <>
                        {linkStep === 'search' && (
                            <>
                                <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>Cancel</Button>
                                <Button 
                                    disabled={!selectedDependent || isLinking}
                                    onClick={async () => {
                                        try {
                                            setIsLinking(true);
                                            await api.post(`/admin/patients/${patientId}/request-dependency-consent`, { dependent_id: selectedDependent.id }, token);
                                            setLinkStep('otp');
                                        } catch (err) {
                                            alert(err.message);
                                        } finally {
                                            setIsLinking(false);
                                        }
                                    }}
                                    className="px-8 shadow-lg shadow-brand-500/20"
                                >
                                    {isLinking ? <Loader2 className="animate-spin" size={18} /> : 'Initialize Link'}
                                </Button>
                            </>
                        )}
                        {linkStep === 'otp' && (
                            <>
                                <Button variant="outline" onClick={() => setLinkStep('search')} disabled={isLinking}>Back</Button>
                                <Button 
                                    className="grow bg-brand-500 text-white font-black uppercase shadow-xl shadow-brand-500/20 px-8"
                                    disabled={otpValue.length !== 6 || isLinking}
                                    onClick={async () => {
                                        setIsLinking(true);
                                        try {
                                            await api.post(`/admin/patients/${patientId}/verify-dependency-consent`, { otp: otpValue }, token);
                                            setLinkStep('success');
                                            fetchPatient(); // Refresh list
                                        } catch (err) {
                                            alert(err.message);
                                        } finally {
                                            setIsLinking(false);
                                        }
                                    }}
                                >
                                    {isLinking ? <Loader2 className="animate-spin" size={18} /> : 'Complete Binding'}
                                </Button>
                            </>
                        )}
                        {linkStep === 'success' && (
                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg transition flex-1 px-5 py-3.5 text-sm font-bold bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(`/patients/profile/${selectedDependent.id}`);
                                        setIsLinkModalOpen(false);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg transition flex-1 px-5 py-3.5 text-sm font-bold bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                                >
                                    <UserCheck size={20} />
                                    Open Patient Profile
                                </button>
                            </div>
                        )}
                    </>
                }
            >
                <div className='space-y-6 animate-in fade-in zoom-in-95 duration-500'>
                    {linkStep === 'search' && (
                        <div className='space-y-4'>
                            <div className='relative group'>
                                <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors' size={18} />
                                <Input 
                                    placeholder='Search Registry by Name or Phone...' 
                                    className='pl-12 h-14 bg-gray-50/50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 focus:border-brand-500 transition-all rounded-2xl'
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        const search = async () => {
                                            if (e.target.value.length < 2) {
                                                setSearchResults([]);
                                                return;
                                            }
                                            setIsSearching(true);
                                            try {
                                                const res = await api.get(`/admin/patients?search=${e.target.value}`, token);
                                                setSearchResults(res.patients.filter(p => !p.is_registered && !p.primary_profile_id && p.id !== patientId));
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setIsSearching(false);
                                            }
                                        };
                                        search();
                                    }}
                                />
                            </div>

                            <div className='max-h-[350px] overflow-y-auto space-y-2 no-scrollbar pr-1'>
                                {isSearching || isInitialLoading ? (
                                    <div className='py-12 flex flex-col items-center justify-center gap-3 text-gray-400 font-bold uppercase text-[10px] tracking-widest'>
                                        <Loader2 className='animate-spin text-brand-500' size={24} />
                                        Analyzing Registry Records...
                                    </div>
                                ) : (searchQuery.length >= 2 ? searchResults : initialResults).length > 0 ? (
                                    (searchQuery.length >= 2 ? searchResults : initialResults).map(res => (
                                        <div 
                                            key={res.id}
                                            onClick={() => setSelectedDependent(res)}
                                            className={`p-5 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${
                                                selectedDependent?.id === res.id 
                                                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/5 ring-4 ring-brand-500/10' 
                                                    : 'border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedDependent?.id === res.id ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight'>{res.full_name}</p>
                                                    <p className='text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1'>
                                                        {res.phone || 'No phone'} • {res.date_of_birth ? new Date(res.date_of_birth).toLocaleDateString() : 'No DOB'}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedDependent?.id === res.id && (
                                                <CheckCircle2 className='text-brand-500 animate-in zoom-in-50' size={22} />
                                            )}
                                        </div>
                                    ))
                                ) : searchQuery.length > 2 ? (
                                    <div className="py-12 text-center">
                                        <AlertCircle className="mx-auto text-gray-300 mb-3" size={32} />
                                        <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>No eligible offline stubs found.</p>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center bg-gray-50/30 dark:bg-white/[0.02] rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5">
                                        <Search className="mx-auto text-gray-200 dark:text-gray-800 mb-3" size={32} />
                                        <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest italic'>
                                            Start typing to filter patient registry
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {linkStep === 'otp' && (
                        <div className='space-y-8 py-4'>
                            <div className='text-center space-y-4'>
                                <div className="w-20 h-20 rounded-[2.5rem] bg-brand-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-brand-500/30 rotate-3">
                                    <ShieldAlert size={40} />
                                </div>
                                <div className="p-5 bg-brand-50 dark:bg-brand-500/5 rounded-2xl border border-brand-100 dark:border-brand-500/10">
                                    <p className='text-xs text-brand-800 dark:text-brand-400 font-bold leading-relaxed'>
                                        Enter the 6-digit verification code sent to <span className='text-brand-600 dark:text-white underline decoration-brand-500/30 underline-offset-4'>{patient.email}</span> to authorize linking <span className='text-brand-600 dark:text-white'>{selectedDependent.full_name}</span>.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Consent OTP</label>
                                <Input 
                                    placeholder='000000' 
                                    className='h-16 text-center text-3xl font-black tracking-[1em] rounded-3xl border-2 border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none text-gray-900 dark:text-white uppercase'
                                    maxLength={6}
                                    value={otpValue}
                                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>
                    )}

                    {linkStep === 'success' && (
                        <div className='py-12 text-center space-y-6'>
                            <div className='w-24 h-24 bg-success-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-success-500/30 rotate-6'>
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="space-y-2">
                                <h4 className='text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white'>Process Complete</h4>
                                <p className='text-sm text-gray-500 font-bold max-w-xs mx-auto leading-relaxed'>
                                    <span className="text-brand-500">{selectedDependent.full_name}</span> is now fully synchronized with <span className="text-brand-500">{patient.full_name}</span>'s family account.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default PatientDetailView;

