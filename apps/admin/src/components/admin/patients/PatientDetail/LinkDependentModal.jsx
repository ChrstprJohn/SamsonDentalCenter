import React, { useState, useEffect } from 'react';
import { Search, User, CheckCircle2, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { Modal, Button, Input, Label } from '../../../ui';
import { api } from '../../../../utils/api';

const LinkDependentModal = ({ 
    isOpen, 
    onClose, 
    patientId, 
    patientEmail, 
    token, 
    onSuccess 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [initialResults, setInitialResults] = useState([]);
    const [selectedDependent, setSelectedDependent] = useState(null);
    const [selectedRelationship, setSelectedRelationship] = useState('');
    const [otpValue, setOtpValue] = useState('');
    const [linkStep, setLinkStep] = useState('search'); // 'search', 'otp', 'success'
    const [isLinking, setIsLinking] = useState(false);

    const resetState = () => {
        setLinkStep('search');
        setSelectedRelationship('');
        setSelectedDependent(null);
        setOtpValue('');
        setSearchQuery('');
        setSearchResults([]);
        setIsLinking(false);
    };

    const handleClose = () => {
        onClose();
        resetState();
    };

    // Fetch initial offline patients when modal opens
    useEffect(() => {
        const fetchInitial = async () => {
            if (isOpen && linkStep === 'search') {
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
    }, [isOpen, linkStep, token, patientId]);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await api.get(`/admin/patients?search=${query}`, token);
            setSearchResults(res.patients.filter(p => !p.is_registered && !p.primary_profile_id && p.id !== patientId));
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInitializeLink = async () => {
        try {
            setIsLinking(true);
            await api.post(`/admin/patients/${patientId}/request-dependency-consent`, { 
                dependent_id: selectedDependent.id,
                relationship: selectedRelationship
            }, token);
            setLinkStep('otp');
        } catch (err) {
            alert(err.message);
        } finally {
            setIsLinking(false);
        }
    };

    const handleCompleteBinding = async () => {
        setIsLinking(true);
        try {
            await api.post(`/admin/patients/${patientId}/verify-dependency-consent`, { otp: otpValue }, token);
            setLinkStep('success');
            onSuccess(); // Refresh parent data
        } catch (err) {
            alert(err.message);
        } finally {
            setIsLinking(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            className='max-w-[550px] w-full m-auto'
            title={linkStep === 'search' ? "Identity Binding: Link Dependent" : linkStep === 'otp' ? "Verification Required" : "Identity Linked"}
            subtitle={linkStep === 'search' ? "Locate an existing offline record to link to this primary account." : linkStep === 'otp' ? "A security code has been dispatched to the primary account email." : "The patient records have been successfully synchronized."}
            footer={
                <>
                    {linkStep === 'search' && (
                        <>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button 
                                disabled={!selectedDependent || !selectedRelationship || isLinking}
                                onClick={handleInitializeLink}
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
                                onClick={handleCompleteBinding}
                            >
                                {isLinking ? <Loader2 className="animate-spin" size={18} /> : 'Complete Binding'}
                            </Button>
                        </>
                    )}
                    {linkStep === 'success' && (
                        <Button 
                            onClick={handleClose}
                            className="w-full bg-brand-500 text-white font-black uppercase shadow-xl shadow-brand-500/20 px-8 h-12"
                        >
                            Close Only
                        </Button>
                    )}
                </>
            }
        >
            <div className='space-y-6 animate-in fade-in zoom-in-95 duration-500'>
                {linkStep === 'search' && (
                    <div className='space-y-4'>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">1. Select Relationship</Label>
                            <select 
                                value={selectedRelationship}
                                onChange={(e) => setSelectedRelationship(e.target.value)}
                                className="w-full h-14 px-4 bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all rounded-2xl outline-none text-sm font-bold text-gray-900 dark:text-white appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '1.5em'
                                }}
                            >
                                <option value="" disabled>Choose Relationship...</option>
                                <option value="Child">Child</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className='space-y-2'>
                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">2. Locate Dependent</Label>
                            <div className='relative group'>
                                <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors' size={18} />
                                <Input 
                                    placeholder='Search Registry by Name or Phone...' 
                                    className='pl-12 h-14 bg-gray-50/50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 focus:border-brand-500 transition-all rounded-2xl'
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
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
                                    Enter the 6-digit verification code sent to <span className='text-brand-600 dark:text-white underline decoration-brand-500/30 underline-offset-4'>{patientEmail}</span> to authorize linking <span className='text-brand-600 dark:text-white'>{selectedDependent?.full_name}</span>.
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
                                <span className="text-brand-500">{selectedDependent?.full_name}</span> is now fully synchronized with this family account.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default LinkDependentModal;
