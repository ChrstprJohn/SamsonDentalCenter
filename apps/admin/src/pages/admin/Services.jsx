import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Plus, Search, DollarSign, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Input, Button } from '../../ui';

const Services = () => {
    const services = [
        { id: 1, name: 'Oral Prophylaxis (Cleaning)', tier: 'general', cost: '₱ 1,500', duration: '45 mins', auto_approve: true },
        { id: 2, name: 'Composite Restoration (Filling)', tier: 'general', cost: '₱ 2,000', duration: '60 mins', auto_approve: true },
        { id: 3, name: 'Root Canal Therapy', tier: 'specialized', cost: '₱ 8,000+', duration: '120 mins', auto_approve: false },
        { id: 4, name: 'Orthodontic Braces', tier: 'specialized', cost: '₱ 45,000+', duration: 'Custom', auto_approve: false },
    ];

    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                <PageBreadcrumb pageTitle="Services Catalog" />
                <Button className='flex items-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white text-sm font-black uppercase tracking-tight shadow-lg shadow-brand-500/20'>
                    <Plus size={18} /> Add New Service
                </Button>
            </div>

            <div className='bg-white dark:bg-white/[0.03] sm:rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col'>
                {/* Search / Filter Area */}
                <div className='p-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md flex flex-col sm:flex-row gap-4'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                        <Input placeholder="Search treatments..." className='pl-10 h-11' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' className='h-11 px-4 text-xs font-bold uppercase'>Tiers</Button>
                        <Button variant='outline' className='h-11 px-4 text-xs font-bold uppercase'>Pricing</Button>
                    </div>
                </div>

                {/* Table Header */}
                <div className='hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800'>
                    <div className='col-span-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Treatment Name</div>
                    <div className='col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center'>Tier</div>
                    <div className='col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right'>Est. Cost</div>
                    <div className='col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right'>Duration</div>
                    <div className='col-span-1'></div>
                </div>

                {/* Services List */}
                <div className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                    {services.map(service => (
                        <div key={service.id} className='group grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-all cursor-pointer'>
                            <div className='col-span-5'>
                                <h4 className='text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors'>{service.name}</h4>
                                <div className='flex items-center gap-2 mt-1'>
                                    {service.auto_approve ? 
                                        <span className='flex items-center gap-1 text-[9px] font-bold text-success-600 uppercase tracking-wider'><ShieldCheck size={10}/> Auto-Approve</span> :
                                        <span className='flex items-center gap-1 text-[9px] font-bold text-amber-600 uppercase tracking-wider'><ShieldAlert size={10}/> Manual Approval</span>
                                    }
                                </div>
                            </div>
                            <div className='col-span-2 flex justify-center'>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                    service.tier === 'general' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                }`}>
                                    {service.tier}
                                </span>
                            </div>
                            <div className='col-span-2 text-right'>
                                <span className='text-sm font-bold text-gray-900 dark:text-white'>{service.cost}</span>
                            </div>
                            <div className='col-span-2 text-right flex items-center justify-end gap-2 text-gray-500'>
                                <Clock size={14} />
                                <span className='text-xs font-medium'>{service.duration}</span>
                            </div>
                            <div className='col-span-1 flex justify-end'>
                                <Button variant='ghost' size='sm' className='text-xs font-bold text-brand-500'>Edit</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notice */}
                <div className='p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 text-center'>
                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]'>
                        Showing all {services.length} active service definitions
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Services;
