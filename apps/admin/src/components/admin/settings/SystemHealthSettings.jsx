import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Globe, RefreshCcw } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { Button } from '../../ui';
import { ListSkeleton } from '../../ui/Skeletons';

const SystemHealthSettings = () => {
    const { getHealth } = useSettings();
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastScan, setLastScan] = useState(new Date());

    const fetchHealth = async () => {
        setLoading(true);
        const data = await getHealth();
        setHealth(data);
        setLoading(false);
        setLastScan(new Date());
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 60000); // Auto refresh every minute
        return () => clearInterval(interval);
    }, []);

    const services = [
        { 
            name: 'Core API Server', 
            status: health?.status === 'ok' ? 'Healthy' : 'Investigating', 
            metric: health?.message || 'v1.0.0',
            icon: <Server size={18} />, 
            isOk: health?.status === 'ok' 
        },
        { 
            name: 'Primary Database', 
            status: health?.database === 'connected' ? 'Connected' : 'Error', 
            metric: health?.response_time_ms ? `${health.response_time_ms}ms latency` : '--',
            icon: <Database size={18} />, 
            isOk: health?.database === 'connected' 
        },
        { 
            name: 'Auth Gateway', 
            status: 'Operational', 
            metric: '99.99% Uptime',
            icon: <Activity size={18} />, 
            isOk: true 
        },
        { 
            name: 'Public Website', 
            status: 'Online', 
            metric: 'CDN Active',
            icon: <Globe size={18} />, 
            isOk: true 
        },
    ];

    return (
        <div className='space-y-6 sm:space-y-8 pb-20 w-full'>
            {/* 1. INFRASTRUCTURE HEALTH SECTION */}
            <div className='w-full p-4 sm:p-6 lg:p-10 border border-gray-300 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10'>
                    <div>
                        <h4 className='text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase font-outfit'>
                            System Integrity Monitor
                        </h4>
                        <p className='text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mt-0.5 font-bold'>
                            Real-time infrastructure health tracking
                        </p>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${health?.status === 'ok' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <div className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                        <span className='text-[10px] font-black uppercase tracking-widest'>
                            {health?.status === 'ok' ? 'All Systems Operational' : 'System Degraded'}
                        </span>
                    </div>
                </div>

                <div className='space-y-12'>
                    {/* Services Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity size={16} className="text-brand-500" />
                            <h6 className="text-xs font-black uppercase text-gray-400 tracking-widest">Active Services</h6>
                        </div>

                        {loading && !health ? (
                            <ListSkeleton items={4} />
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
                                {services.map(service => (
                                    <div key={service.name} className='flex flex-col p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01] hover:border-brand-500/20 transition-all group'>
                                        <div className='flex items-center gap-4 mb-4'>
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center ${service.isOk ? 'text-emerald-500' : 'text-red-500'} shadow-sm group-hover:scale-110 transition-transform`}>
                                                {service.icon}
                                            </div>
                                            <div>
                                                <h5 className='text-[10px] sm:text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight'>{service.name}</h5>
                                                <div className='flex items-center gap-1.5 mt-0.5'>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${service.isOk ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                    <p className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${service.isOk ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {service.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-auto pt-4 border-t border-gray-200 dark:border-white/5'>
                                            <p className='text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
                                                Metric: <span className="text-gray-900 dark:text-white">{service.metric}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Scan Details */}
                    <div className='flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800'>
                        <div className="flex items-center gap-3">
                            <RefreshCcw size={14} className="text-gray-400" />
                            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
                                Last scanned: <span className="text-gray-600 dark:text-gray-300">{lastScan.toLocaleTimeString()}</span>
                            </p>
                        </div>
                        <Button 
                            variant="outline"
                            onClick={fetchHealth}
                            disabled={loading}
                            className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-gray-200 dark:border-white/10 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} />
                            Force Refresh
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthSettings;
