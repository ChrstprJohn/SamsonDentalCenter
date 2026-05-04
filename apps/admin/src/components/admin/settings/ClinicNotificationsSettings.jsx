import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Mail, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import { Button, Label, Switch } from '../../ui';
import { useSettings } from '../../../hooks/useSettings';
import { useToast } from '../../../context/ToastContext';
import { FormSkeleton } from '../../ui/Skeletons';

const ClinicNotificationsSettings = () => {
    const { settings, loading, error, updating, updateSettings } = useSettings();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        sms_notifications_enabled: true,
        email_notifications_enabled: true,
        reminder_24h_enabled: true,
        reminder_48h_enabled: true,
        reminder_send_time: '08:00'
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                sms_notifications_enabled: settings.sms_notifications_enabled ?? true,
                email_notifications_enabled: settings.email_notifications_enabled ?? true,
                reminder_24h_enabled: settings.reminder_24h_enabled ?? true,
                reminder_48h_enabled: settings.reminder_48h_enabled ?? true,
                reminder_send_time: settings.reminder_send_time || '08:00'
            });
        }
    }, [settings]);

    const handleSubmit = async () => {
        try {
            await updateSettings(formData);
            showToast('Notification channels updated successfully!', 'success');
            setIsEditing(false);
        } catch (err) {
            showToast('Failed to update notification settings: ' + err.message, 'error');
        }
    };

    if (loading) return <FormSkeleton />;
    if (error) return <div className="p-4 text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className='space-y-6 sm:space-y-8 pb-20 w-full'>
            {/* 1. COMMUNICATION CHANNELS SECTION */}
            <div className='w-full p-4 sm:p-6 lg:p-10 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10'>
                    <div>
                        <h4 className='text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase font-outfit'>
                            Notification Channels
                        </h4>
                        <p className='text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mt-0.5 font-bold'>
                            Global toggles for automated patient communications
                        </p>
                    </div>
                    {!isEditing ? (
                        <Button 
                            onClick={() => setIsEditing(true)}
                            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                        >
                            <Bell size={12} className="sm:w-3.5 sm:h-3.5" />
                            Manage Channels
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    if (settings) {
                                        setFormData({
                                            sms_notifications_enabled: settings.sms_notifications_enabled ?? true,
                                            email_notifications_enabled: settings.email_notifications_enabled ?? true,
                                            reminder_24h_enabled: settings.reminder_24h_enabled ?? true,
                                            reminder_48h_enabled: settings.reminder_48h_enabled ?? true,
                                            reminder_send_time: settings.reminder_send_time || '08:00'
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
                                {updating ? 'Saving...' : 'Save Config'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className='space-y-12'>
                    {/* Primary Gateways */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldAlert size={16} className="text-amber-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Gateway Control</h6>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6'>
                            {/* SMS Gateway */}
                            <div className={`flex flex-col p-4 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className='p-2 sm:p-2.5 rounded-xl bg-green-100 dark:bg-green-500/10 text-green-600 shadow-sm'>
                                            <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <h5 className='text-xs sm:text-sm font-bold text-gray-900 dark:text-white'>SMS Gateway</h5>
                                            <p className='text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Automated text reminders</p>
                                        </div>
                                    </div>
                                    <Switch 
                                        disabled={!isEditing}
                                        checked={formData.sms_notifications_enabled}
                                        onChange={(checked) => setFormData(p => ({ ...p, sms_notifications_enabled: checked }))}
                                        className={!isEditing ? 'opacity-50' : ''}
                                    />
                                </div>
                                {!formData.sms_notifications_enabled && (
                                    <div className='p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex gap-2 items-start animate-in fade-in slide-in-from-top-1'>
                                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={12} />
                                        <p className='text-[9px] text-red-600 dark:text-red-400 font-bold leading-tight uppercase'>
                                            Reminders and alerts will NOT be sent via text.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Email Gateway */}
                            <div className={`flex flex-col p-4 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className='p-2 sm:p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 shadow-sm'>
                                            <Mail size={18} className="sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <h5 className='text-xs sm:text-sm font-bold text-gray-900 dark:text-white'>Email Gateway</h5>
                                            <p className='text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Confirmations & newsletters</p>
                                        </div>
                                    </div>
                                    <Switch 
                                        disabled={!isEditing}
                                        checked={formData.email_notifications_enabled}
                                        onChange={(checked) => setFormData(p => ({ ...p, email_notifications_enabled: checked }))}
                                        className={!isEditing ? 'opacity-50' : ''}
                                    />
                                </div>
                                {!formData.email_notifications_enabled && (
                                    <div className='p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex gap-2 items-start animate-in fade-in slide-in-from-top-1'>
                                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={12} />
                                        <p className='text-[9px] text-red-600 dark:text-red-400 font-bold leading-tight uppercase'>
                                            Critical OTP and confirmations will be disabled.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Configuration */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock size={16} className="text-brand-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Reminder Schedule</h6>
                        </div>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6'>
                            <div className={`flex flex-col p-4 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className='p-1.5 sm:p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'>
                                        <Bell size={14} className="sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <Switch 
                                        disabled={!isEditing}
                                        checked={formData.reminder_48h_enabled}
                                        onChange={(checked) => setFormData(p => ({ ...p, reminder_48h_enabled: checked }))}
                                        className={!isEditing ? 'opacity-50' : 'scale-75 sm:scale-100'}
                                    />
                                </div>
                                <h5 className='text-[9px] sm:text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight'>48h Reminder</h5>
                                <p className='text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold'>2 days before appt.</p>
                            </div>

                            <div className={`flex flex-col p-4 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className='p-1.5 sm:p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'>
                                        <Bell size={14} className="sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <Switch 
                                        disabled={!isEditing}
                                        checked={formData.reminder_24h_enabled}
                                        onChange={(checked) => setFormData(p => ({ ...p, reminder_24h_enabled: checked }))}
                                        className={!isEditing ? 'opacity-50' : 'scale-75 sm:scale-100'}
                                    />
                                </div>
                                <h5 className='text-[9px] sm:text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight'>24h Reminder</h5>
                                <p className='text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold'>1 day before appt.</p>
                            </div>

                            <div className={`col-span-2 lg:col-span-1 flex flex-col p-4 sm:p-6 rounded-2xl border transition-all ${!isEditing ? 'border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]' : 'border-brand-200 dark:border-brand-500/20 bg-white dark:bg-white/[0.03] shadow-sm'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className='p-1.5 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-500/10 text-slate-600'>
                                        <Clock size={14} className="sm:w-[18px] sm:h-[18px]" />
                                    </div>
                                    <h5 className='text-[9px] sm:text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight'>Daily Send Time</h5>
                                </div>
                                <input 
                                    type="time" 
                                    disabled={!isEditing}
                                    value={formData.reminder_send_time}
                                    onChange={(e) => setFormData(p => ({ ...p, reminder_send_time: e.target.value }))}
                                    className="w-full bg-transparent border-none p-0 text-sm sm:text-lg font-black text-gray-900 dark:text-white focus:ring-0 disabled:text-gray-400"
                                />
                                <p className='text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold'>Executes reminder batch</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicNotificationsSettings;
