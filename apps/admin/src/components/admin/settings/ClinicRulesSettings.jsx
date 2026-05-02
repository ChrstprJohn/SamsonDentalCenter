import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Calendar, Hourglass } from 'lucide-react';
import { Button, Label, Switch, Input } from '../../ui';
import { useSettings } from '../../../hooks/useSettings';
import { FormSkeleton } from '../../ui/Skeletons';

const ClinicRulesSettings = () => {
    const { settings, loading, error, updating, updateSettings } = useSettings();
    const [formData, setFormData] = useState({
        booking_lead_time_hours: 24,
        booking_max_horizon_days: 60,
        slot_duration_minutes: 30,
        waitlist_enabled: true
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                booking_lead_time_hours: settings.booking_lead_time_hours || 24,
                booking_max_horizon_days: settings.booking_max_horizon_days || 60,
                slot_duration_minutes: settings.slot_duration_minutes || 30,
                waitlist_enabled: settings.waitlist_enabled ?? true
            });
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseInt(value) || 0
        }));
    };

    const handleSubmit = async () => {
        try {
            await updateSettings(formData);
            alert('Settings updated successfully!');
        } catch (err) {
            alert('Failed to update settings: ' + err.message);
        }
    };

    if (loading) return <FormSkeleton />;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h4 className='text-lg font-bold text-gray-900 dark:text-white'>
                            Global Booking Rules
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            System-wide operational constraints
                        </p>
                    </div>
                </div>

                <div className='space-y-8'>
                    {/* Booking Lead Time */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                        <div className='flex items-start gap-4'>
                            <div className='p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 shadow-sm'>
                                <Hourglass size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Booking Lead Time</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Minimum hours required before a patient can book.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Input 
                                type="number" 
                                name="booking_lead_time_hours"
                                value={formData.booking_lead_time_hours}
                                onChange={handleChange}
                                className="w-24 h-10 text-center font-bold"
                            />
                            <span className="text-xs font-medium text-gray-500">Hours</span>
                        </div>
                    </div>

                    {/* Booking Horizon */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                        <div className='flex items-start gap-4'>
                            <div className='p-2.5 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 shadow-sm'>
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Booking Horizon</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>How many days in advance patients can see availability.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Input 
                                type="number" 
                                name="booking_max_horizon_days"
                                value={formData.booking_max_horizon_days}
                                onChange={handleChange}
                                className="w-24 h-10 text-center font-bold"
                            />
                            <span className="text-xs font-medium text-gray-500">Days</span>
                        </div>
                    </div>

                    {/* Slot Duration */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                        <div className='flex items-start gap-4'>
                            <div className='p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 shadow-sm'>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Slot Duration</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Standard duration for each appointment time-slot.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Input 
                                type="number" 
                                name="slot_duration_minutes"
                                value={formData.slot_duration_minutes}
                                onChange={handleChange}
                                className="w-24 h-10 text-center font-bold"
                            />
                            <span className="text-xs font-medium text-gray-500">Minutes</span>
                        </div>
                    </div>

                    {/* Waitlist Toggle */}
                    <div className='flex items-center justify-between p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                        <div className='flex items-start gap-4'>
                            <div className='p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 shadow-sm'>
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Waitlist System</h5>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Enable waitlist for fully booked days.</p>
                            </div>
                        </div>
                        <Switch 
                            checked={formData.waitlist_enabled} 
                            onCheckedChange={(checked) => setFormData(p => ({ ...p, waitlist_enabled: checked }))}
                        />
                    </div>
                </div>

                <div className='mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end'>
                    <Button 
                        onClick={handleSubmit}
                        disabled={updating}
                        className='px-10 h-12 rounded-xl text-sm font-black bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 disabled:opacity-50'
                    >
                        {updating ? 'Updating...' : 'Save Rule Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClinicRulesSettings;
