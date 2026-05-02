import React, { useState, useEffect } from 'react';
import { Layout, ToggleLeft, Type, Info } from 'lucide-react';
import { Button, Input, Label, Switch } from '../../ui';
import { useSettings } from '../../../hooks/useSettings';
import { FormSkeleton } from '../../ui/Skeletons';

const ClinicWebsiteSettings = () => {
    const { settings, loading, error, updating, updateSettings } = useSettings();
    const [formData, setFormData] = useState({
        hero_banner_text: '',
        hero_banner_enabled: false
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                hero_banner_text: settings.hero_banner_text || '',
                hero_banner_enabled: settings.hero_banner_enabled ?? false
            });
        }
    }, [settings]);

    const handleSubmit = async () => {
        try {
            await updateSettings(formData);
            alert('Website settings updated successfully!');
        } catch (err) {
            alert('Failed to update website settings: ' + err.message);
        }
    };

    if (loading) return <FormSkeleton />;
    if (error) return <div className="p-4 text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h4 className='text-lg font-bold text-gray-900 dark:text-white'>
                            Website Hero Section
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            Manage the main welcome area of your patient portal
                        </p>
                    </div>
                </div>

                <div className='space-y-8'>
                    <div className='flex items-center justify-between p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                        <div className='flex items-start gap-4'>
                            <div className='p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 shadow-sm'>
                                <ToggleLeft size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Enable Hero Banner</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Toggle the visibility of the welcome banner on the home page.</p>
                            </div>
                        </div>
                        <Switch 
                            checked={formData.hero_banner_enabled}
                            onChange={(checked) => setFormData(p => ({ ...p, hero_banner_enabled: checked }))}
                        />
                    </div>

                    <div className={`space-y-4 transition-all duration-300 ${formData.hero_banner_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className='flex items-center gap-2 mb-2'>
                            <Type size={14} className="text-gray-400" />
                            <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                Hero Welcome Text
                            </Label>
                        </div>
                        <Input 
                            value={formData.hero_banner_text}
                            onChange={(e) => setFormData(p => ({ ...p, hero_banner_text: e.target.value }))}
                            className="h-14 text-lg font-bold"
                            placeholder="e.g. Your Smile, Our Priority"
                        />
                        <div className='flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/5 text-blue-600 border border-blue-100 dark:border-blue-500/10'>
                            <Info size={14} />
                            <p className='text-[10px] font-bold uppercase tracking-tight'>Tip: Keep it short and impactful (3-5 words).</p>
                        </div>
                    </div>
                </div>

                <div className='mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end'>
                    <Button 
                        onClick={handleSubmit}
                        disabled={updating}
                        className='px-10 h-12 rounded-xl text-sm font-black bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 disabled:opacity-50'
                    >
                        {updating ? 'Updating...' : 'Save Website Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClinicWebsiteSettings;
