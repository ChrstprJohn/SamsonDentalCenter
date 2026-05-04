import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, Image as ImageIcon, Share2, AlignLeft, Clock } from 'lucide-react';
import { Button, Input, Label } from '../../ui';
import { useSettings } from '../../../hooks/useSettings';
import { useToast } from '../../../context/ToastContext';
import { FormSkeleton } from '../../ui/Skeletons';

const ClinicWebsiteSettings = () => {
    const { settings, loading, error, updating, updateSettings } = useSettings();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        // Core Identity
        clinic_name: '',
        short_description: '',
        
        // Contact Info
        physical_address: '',
        phone_primary: '',
        email_official: '',
        
        // Location & Hours
        business_hours_text: '',
        closed_time_text: '',
        google_maps_link: '',
        
        // Brand Assets
        logo_primary_url: '',
        logo_light_url: '',
        favicon_url: '',
        
        // Social Media
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                clinic_name: settings.clinic_name || '',
                short_description: settings.short_description || '',
                
                physical_address: settings.physical_address || settings.address || '',
                phone_primary: settings.phone_primary || settings.phone || '',
                email_official: settings.email_official || settings.email || '',
                
                business_hours_text: settings.business_hours_text || '',
                closed_time_text: settings.closed_time_text || '',
                google_maps_link: settings.google_maps_link || '',
                
                logo_primary_url: settings.logo_primary_url || '',
                logo_light_url: settings.logo_light_url || '',
                favicon_url: settings.favicon_url || '',
                
                facebook_url: settings.facebook_url || '',
                instagram_url: settings.instagram_url || '',
                twitter_url: settings.twitter_url || '',
                youtube_url: settings.youtube_url || ''
            });
        }
    }, [settings]);

    const handleSubmit = async () => {
        try {
            await updateSettings(formData);
            showToast('Website details updated successfully!', 'success');
            setIsEditing(false);
        } catch (err) {
            showToast('Failed to update website details: ' + err.message, 'error');
        }
    };

    if (loading) return <FormSkeleton />;
    if (error) return <div className="p-4 text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className='space-y-6 sm:space-y-8 pb-20 w-full'>
            {/* 1. IDENTITY & CONTACT SECTION */}
            <div className='w-full p-4 sm:p-6 lg:p-10 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10'>
                    <div>
                        <h4 className='text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase font-outfit'>
                            Clinic Identity & Contact
                        </h4>
                        <p className='text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mt-0.5 font-bold'>
                            Primary clinic branding and communication channels
                        </p>
                    </div>
                    {!isEditing ? (
                        <Button 
                            onClick={() => setIsEditing(true)}
                            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                        >
                            <Building2 size={12} className="sm:w-3.5 sm:h-3.5" />
                            Edit Website Info
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    // Reset to settings
                                    if (settings) {
                                        setFormData({
                                            clinic_name: settings.clinic_name || '',
                                            short_description: settings.short_description || '',
                                            physical_address: settings.physical_address || settings.address || '',
                                            phone_primary: settings.phone_primary || settings.phone || '',
                                            email_official: settings.email_official || settings.email || '',
                                            business_hours_text: settings.business_hours_text || '',
                                            closed_time_text: settings.closed_time_text || '',
                                            google_maps_link: settings.google_maps_link || '',
                                            logo_primary_url: settings.logo_primary_url || '',
                                            logo_light_url: settings.logo_light_url || '',
                                            favicon_url: settings.favicon_url || '',
                                            facebook_url: settings.facebook_url || '',
                                            instagram_url: settings.instagram_url || '',
                                            twitter_url: settings.twitter_url || '',
                                            youtube_url: settings.youtube_url || ''
                                        });
                                    }
                                }}
                                className="rounded-xl px-3 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs font-black uppercase tracking-widest border-gray-200 dark:border-white/10 dark:text-gray-400"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSubmit}
                                disabled={updating}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-3 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all active:scale-95"
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className='space-y-12'>
                    {/* Identity Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 size={16} className="text-brand-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Core Identity</h6>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6'>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Clinic Display Name</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.clinic_name}
                                    onChange={(e) => setFormData(p => ({ ...p, clinic_name: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Short Description (SEO)</Label>
                                <textarea 
                                    disabled={!isEditing}
                                    value={formData.short_description}
                                    onChange={(e) => setFormData(p => ({ ...p, short_description: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm font-medium focus:ring-0 focus:outline-none min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Phone size={16} className="text-green-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Communication Channels</h6>
                        </div>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6'>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Official Email</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.email_official}
                                    onChange={(e) => setFormData(p => ({ ...p, email_official: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Primary Phone</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.phone_primary}
                                    onChange={(e) => setFormData(p => ({ ...p, phone_primary: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`col-span-2 lg:col-span-1 flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Address</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.physical_address}
                                    onChange={(e) => setFormData(p => ({ ...p, physical_address: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. LOCATION & ASSETS SECTION */}
            <div className='w-full p-4 sm:p-6 lg:p-10 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='space-y-12'>
                    {/* Location & Maps */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin size={16} className="text-orange-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Presence & Accessibility</h6>
                        </div>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6'>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Business Hours Text</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.business_hours_text}
                                    onChange={(e) => setFormData(p => ({ ...p, business_hours_text: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Closed Info</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.closed_time_text}
                                    onChange={(e) => setFormData(p => ({ ...p, closed_time_text: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`col-span-2 lg:col-span-1 flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Maps Share Link</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.google_maps_link}
                                    onChange={(e) => setFormData(p => ({ ...p, google_maps_link: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Brand Assets */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon size={16} className="text-purple-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Brand Assets</h6>
                        </div>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6'>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Primary Logo</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.logo_primary_url}
                                    onChange={(e) => setFormData(p => ({ ...p, logo_primary_url: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Dark-Mode Logo</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.logo_light_url}
                                    onChange={(e) => setFormData(p => ({ ...p, logo_light_url: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`col-span-2 lg:col-span-1 flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Favicon URL</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.favicon_url}
                                    onChange={(e) => setFormData(p => ({ ...p, favicon_url: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Presence */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Share2 size={16} className="text-blue-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Social Presence</h6>
                        </div>
                        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Facebook</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.facebook_url}
                                    onChange={(e) => setFormData(p => ({ ...p, facebook_url: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Instagram</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.instagram_url}
                                    onChange={(e) => setFormData(p => ({ ...p, instagram_url: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>Twitter / X</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.twitter_url}
                                    onChange={(e) => setFormData(p => ({ ...p, twitter_url: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                            <div className={`flex flex-col p-3 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <Label className='text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>YouTube</Label>
                                <Input 
                                    disabled={!isEditing}
                                    value={formData.youtube_url}
                                    onChange={(e) => setFormData(p => ({ ...p, youtube_url: e.target.value }))}
                                    className="bg-transparent border-gray-200 dark:border-white/10 font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicWebsiteSettings;
