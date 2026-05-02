import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Mail, ShieldAlert } from 'lucide-react';
import { Button, Label, Switch } from '../../ui';
import { useSettings } from '../../../hooks/useSettings';
import { FormSkeleton } from '../../ui/Skeletons';

const ClinicNotificationsSettings = () => {
    const { settings, loading, error, updating, updateSettings } = useSettings();
    const [formData, setFormData] = useState({
        sms_notifications_enabled: true,
        email_notifications_enabled: true
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                sms_notifications_enabled: settings.sms_notifications_enabled ?? true,
                email_notifications_enabled: settings.email_notifications_enabled ?? true
            });
        }
    }, [settings]);

    const handleSubmit = async () => {
        try {
            await updateSettings(formData);
            alert('Notification settings updated successfully!');
        } catch (err) {
            alert('Failed to update notification settings: ' + err.message);
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
                            Communication Channels
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            Global toggles for automated patient notifications
                        </p>
                    </div>
                    <div className='p-2 rounded-lg bg-amber-50 dark:bg-amber-500/5 text-amber-600 border border-amber-100 dark:border-amber-500/10 flex items-center gap-2'>
                        <ShieldAlert size={14} />
                        <span className='text-[10px] font-black uppercase tracking-tighter'>System Critical</span>
                    </div>
                </div>

                <div className='space-y-6'>
                    {/* SMS Toggle */}
                    <div className='flex items-center justify-between p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                        <div className='flex items-start gap-4'>
                            <div className='p-2.5 rounded-xl bg-green-100 dark:bg-green-500/10 text-green-600 shadow-sm'>
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>SMS Gateway</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Enable automated SMS for appointment reminders and OTPs.</p>
                            </div>
                        </div>
                        <Switch 
                            checked={formData.sms_notifications_enabled}
                            onChange={(checked) => setFormData(p => ({ ...p, sms_notifications_enabled: checked }))}
                        />
                    </div>

                    {/* Email Toggle */}
                    <div className='flex items-center justify-between p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                        <div className='flex items-start gap-4'>
                            <div className='p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 shadow-sm'>
                                <Mail size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Email Gateway</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Enable automated email confirmations and newsletters.</p>
                            </div>
                        </div>
                        <Switch 
                            checked={formData.email_notifications_enabled}
                            onChange={(checked) => setFormData(p => ({ ...p, email_notifications_enabled: checked }))}
                        />
                    </div>

                    <div className='mt-6 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.01] border border-dashed border-gray-200 dark:border-gray-800'>
                        <div className='flex items-center gap-3 text-gray-400'>
                            <Bell size={16} />
                            <p className='text-[10px] font-bold uppercase tracking-widest'>Note: Disabling these will prevent patients from receiving any automated alerts.</p>
                        </div>
                    </div>
                </div>

                <div className='mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end'>
                    <Button 
                        onClick={handleSubmit}
                        disabled={updating}
                        className='px-10 h-12 rounded-xl text-sm font-black bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 disabled:opacity-50'
                    >
                        {updating ? 'Updating...' : 'Save Notification Config'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClinicNotificationsSettings;
