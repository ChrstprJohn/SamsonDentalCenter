import React from 'react';
import { Activity, Server, Database, Globe } from 'lucide-react';

const SystemHealthSettings = () => {
    const services = [
        { name: 'Core API Server', status: 'Healthy', latency: '24ms', icon: <Server size={18} />, color: 'text-success-600' },
        { name: 'Primary Database', status: 'Healthy', load: '12%', icon: <Database size={18} />, color: 'text-success-600' },
        { name: 'Auth Gateway', status: 'Healthy', uptime: '99.9%', icon: <Activity size={18} />, color: 'text-success-600' },
        { name: 'Public Website', status: 'Healthy', regions: '5 Active', icon: <Globe size={18} />, color: 'text-success-600' },
    ];

    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                            System Integrity Monitor
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            Real-time infrastructure health tracking
                        </p>
                    </div>
                    <div className='flex items-center gap-2 px-3 py-1 bg-success-100 dark:bg-success-500/10 rounded-full'>
                        <div className='w-2 h-2 rounded-full bg-success-500 animate-pulse' />
                        <span className='text-[10px] font-black text-success-600 dark:text-success-400 uppercase tracking-widest'>All Systems Operational</span>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {services.map(service => (
                        <div key={service.name} className='flex items-center justify-between p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]'>
                            <div className='flex items-center gap-4'>
                                <div className='w-11 h-11 rounded-lg bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 shadow-sm'>
                                    {service.icon}
                                </div>
                                <div>
                                    <h5 className='text-sm font-bold text-gray-900 dark:text-white'>{service.name}</h5>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${service.color}`}>{service.status}</p>
                                        <div className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700' />
                                        <p className='text-[10px] text-gray-500 dark:text-gray-400 font-bold'>{service.latency || service.load || service.uptime || service.regions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-800'>
                    <p className='text-[10px] text-gray-400 text-center font-bold uppercase tracking-[0.2em]'>
                        Last scanned: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthSettings;
