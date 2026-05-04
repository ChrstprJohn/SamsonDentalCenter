import React, { useState, useEffect } from 'react';
import { Shield, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button, Label } from '../../ui';
import { useSettings } from '../../../hooks/useSettings';
import { useToast } from '../../../context/ToastContext';
import { FormSkeleton } from '../../ui/Skeletons';

const ClinicLegalSettings = () => {
    const { settings, loading, error, updating, updateSettings } = useSettings();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        privacy_policy_text: '',
        terms_of_service_text: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                privacy_policy_text: settings.privacy_policy_text || '',
                terms_of_service_text: settings.terms_of_service_text || ''
            });
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await updateSettings(formData);
            showToast('Legal documents updated successfully!', 'success');
            setIsEditing(false);
        } catch (err) {
            showToast('Failed to update legal settings: ' + err.message, 'error');
        }
    };

    if (loading) return <FormSkeleton />;
    if (error) return <div className="p-4 text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className='space-y-6 sm:space-y-8 pb-20 w-full'>
            {/* LEGAL CONTENT SECTION */}
            <div className='w-full p-4 sm:p-6 lg:p-10 border border-gray-300 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10'>
                    <div>
                        <h4 className='text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase font-outfit'>
                            Legal & Compliance
                        </h4>
                        <p className='text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mt-0.5 font-bold'>
                            Manage your clinic's legal agreements and privacy policies
                        </p>
                    </div>
                    {!isEditing ? (
                        <Button 
                            onClick={() => {
                                setIsEditing(true);
                                showToast('Entering Legal Edit Mode', 'info');
                            }}
                            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                        >
                            <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                            Edit Documents
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    if (settings) {
                                        setFormData({
                                            privacy_policy_text: settings.privacy_policy_text || '',
                                            terms_of_service_text: settings.terms_of_service_text || ''
                                        });
                                    }
                                    showToast('Legal changes discarded', 'info');
                                }}
                                className="rounded-xl px-3 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs font-black uppercase tracking-widest border-gray-200 dark:border-white/10 dark:text-gray-400"
                            >
                                Discard Changes
                            </Button>
                            <Button 
                                onClick={handleSubmit}
                                disabled={updating}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-3 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all active:scale-95"
                            >
                                {updating ? 'Saving...' : 'Save Documents'}
                            </Button>
                        </div>
                    )}
                </div>
                {isEditing && (
                    <div className="mb-10 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        <p className="text-[10px] sm:text-xs font-black text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                            You are in edit mode. Changes will be saved globally for all patients.
                        </p>
                    </div>
                )}

                <div className='space-y-12'>
                    {/* Privacy Policy */}
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <Shield size={16} className="text-purple-500" />
                                <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Privacy Policy</h6>
                            </div>
                            <button className='text-[10px] font-bold text-brand-500 flex items-center gap-1 hover:underline uppercase tracking-tighter'>
                                Preview <ExternalLink size={10} />
                            </button>
                        </div>
                        <div className={`p-1 rounded-2xl border transition-all ${!isEditing ? 'border-gray-200 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                            <textarea 
                                name="privacy_policy_text"
                                disabled={!isEditing}
                                value={formData.privacy_policy_text}
                                onChange={handleChange}
                                className="w-full bg-transparent border-none p-4 sm:p-6 text-sm font-medium focus:ring-0 outline-none transition-all min-h-[300px] text-gray-900 dark:text-white disabled:text-gray-400"
                                placeholder="Enter Privacy Policy (Markdown supported)..."
                            />
                        </div>
                    </div>

                    {/* Terms of Service */}
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <FileText size={16} className="text-blue-500" />
                                <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Terms of Service</h6>
                            </div>
                            <button className='text-[10px] font-bold text-brand-500 flex items-center gap-1 hover:underline uppercase tracking-tighter'>
                                Preview <ExternalLink size={10} />
                            </button>
                        </div>
                        <div className={`p-1 rounded-2xl border transition-all ${!isEditing ? 'border-gray-200 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                            <textarea 
                                name="terms_of_service_text"
                                disabled={!isEditing}
                                value={formData.terms_of_service_text}
                                onChange={handleChange}
                                className="w-full bg-transparent border-none p-4 sm:p-6 text-sm font-medium focus:ring-0 outline-none transition-all min-h-[300px] text-gray-900 dark:text-white disabled:text-gray-400"
                                placeholder="Enter Terms of Service (Markdown supported)..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicLegalSettings;
