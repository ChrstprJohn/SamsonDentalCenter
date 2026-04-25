import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, History, ShieldAlert, CreditCard, User, History as HistoryIcon } from 'lucide-react';
import { Button, Modal, Input, Label, Switch } from '../../ui';
import { useNavigate } from 'react-router-dom';

const PatientDetailView = ({ patientId, onBack, activeTab }) => {
    // Mock data
    const patient = {
        id: patientId || '1',
        full_name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '+63 917 123 4567',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        status: 'Regular',
        next_appointment: 'May 05, 2026 @ 10:00 AM',
        total_visits: 12,
        balance: '₱ 0.00',
        join_date: 'Sep 2023'
    };

    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'records', label: 'Records' },
        { id: 'financial', label: 'Financial' },
        { id: 'security', label: 'Security' },
    ];

    return (
        <div className='flex flex-col grow min-h-0 bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden no-scrollbar'>
            {/* Top Navigation */}
            <div className='sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800'>
                <div className='px-4 sm:px-6 py-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={onBack}
                            className='p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors'
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight font-outfit'>
                                {patient.full_name}
                            </h3>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1'>
                                Patient Registry
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sub-navigation Tabs */}
                <div className='px-4 sm:px-6 flex items-center gap-6'>
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => navigate(`/patients/${t.id}/${patient.id}`)}
                            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative ${
                                activeTab === t.id 
                                    ? 'text-brand-500' 
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                        >
                            {t.label}
                            {activeTab === t.id && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full' />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className='grow overflow-y-auto no-scrollbar'>
                <div className='p-4 sm:p-6 lg:p-8 space-y-6'>
                    {/* Header Card */}
                    <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                        <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                            <div className='flex flex-col items-center w-full gap-6 xl:flex-row xl:items-center'>
                                <div className='shrink-0'>
                                    <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-white/5'>
                                        {patient.avatar_url ? (
                                            <img src={patient.avatar_url} alt={patient.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className='text-gray-400' size={32} />
                                        )}
                                    </div>
                                </div>
                                <div className='text-center xl:text-left'>
                                    <h4 className='mb-1 text-[clamp(18px,2.2vw,22px)] font-bold text-gray-900 dark:text-white font-outfit'>
                                        {patient.full_name}
                                    </h4>
                                    <div className='flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                        <p className='text-[clamp(13px,1.2vw,14px)] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-widest'>
                                            {patient.status} Patient
                                        </p>
                                        <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block'></div>
                                        <span className={`px-2 py-0.5 rounded-lg text-[clamp(11px,1vw,12px)] font-bold uppercase tracking-wider bg-success-100 text-success-600 dark:bg-success-500/10 dark:text-success-400`}>
                                            Verified Account
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {(!activeTab || activeTab === 'profile') && (
                                <Button
                                    variant='outline'
                                    onClick={() => setIsEditModalOpen(true)}
                                    className='h-11 px-6 text-sm font-bold shadow-sm'
                                >
                                    Edit Basic Information
                                </Button>
                            )}
                        </div>

                        {/* Contact Meta */}
                        <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                            <div className='flex flex-wrap gap-6'>
                                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                    <Mail size={16} className='text-gray-400' /> {patient.email}
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                    <Phone size={16} className='text-gray-400' /> {patient.phone}
                                </div>
                            </div>
                            <Button
                                variant='outline'
                                onClick={() => setIsEditContactModalOpen(true)}
                                className='h-11 px-6 text-sm font-bold shadow-sm'
                            >
                                <Mail size={16} className='mr-2' /> Update Records
                            </Button>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className='min-h-120 md:min-h-140'>
                        {(!activeTab || activeTab === 'profile') && (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                                <div className='lg:col-span-2 space-y-6'>
                                    <div className='p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-brand-50/30 dark:bg-brand-500/5'>
                                        <h4 className='text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                            <Calendar size={14} /> Upcoming Appointment
                                        </h4>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-sm font-bold text-gray-900 dark:text-white'>{patient.next_appointment}</p>
                                            <Button variant='ghost' className='text-[10px] font-black uppercase text-brand-600'>View Details</Button>
                                        </div>
                                    </div>
                                    <div className='p-6 rounded-2xl border border-gray-100 dark:border-gray-800'>
                                        <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>Patient Summary</h4>
                                        <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                                            Patient has been active since {patient.join_date}. Total of {patient.total_visits} visits recorded across all services.
                                        </p>
                                    </div>
                                </div>
                                <div className='space-y-6'>
                                    <div className='p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[10px] font-bold text-gray-400 uppercase'>Outstanding</span>
                                            <span className='text-sm font-black text-gray-900 dark:text-white'>{patient.balance}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[10px] font-bold text-gray-400 uppercase'>Attendence</span>
                                            <span className='text-sm font-black text-success-600'>100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'records' && (
                            <div className='space-y-4'>
                                <h4 className='text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                    <HistoryIcon size={14} /> Medical & Treatment History
                                </h4>
                                {[1, 2].map(i => (
                                    <div key={i} className='p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/[0.01] flex items-center justify-between'>
                                        <div>
                                            <p className='text-sm font-bold text-gray-900 dark:text-white'>General Cleaning & Pasta</p>
                                            <p className='text-[10px] text-gray-500 font-bold mt-1 uppercase'>Dr. Samson • Mar 12, 2026</p>
                                        </div>
                                        <Button variant='outline' size='sm' className='text-[10px] font-black uppercase'>View Note</Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'financial' && (
                            <div className='p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center py-20'>
                                <CreditCard size={40} className='mx-auto text-gray-300 dark:text-gray-700 mb-4' />
                                <h4 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight'>Billing History</h4>
                                <p className='text-xs text-gray-500 mt-2'>No outstanding invoices for this patient.</p>
                            </div>
                        )}

                        {activeTab === 'security' && (
                             <div className='space-y-6'>
                                <div className='p-6 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10'>
                                    <h4 className='text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                                        <ShieldAlert size={14} /> Account Restrictions
                                    </h4>
                                    <p className='text-[11px] text-red-700 dark:text-red-400 font-medium leading-relaxed mb-4'>
                                        Setting a restriction will prevent this patient from booking appointments online.
                                    </p>
                                    <Button variant='outline' className='h-11 border-red-200 text-red-600 text-xs font-black uppercase hover:bg-red-50'>Restrict Online Booking</Button>
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals Skeletons */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className='max-w-[450px] w-full m-auto'>
                <div className='p-8 bg-white dark:bg-gray-900 rounded-xl'>
                    <h4 className='text-lg font-black uppercase tracking-tight mb-6'>Edit Patient Data</h4>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Full Name</Label>
                            <Input defaultValue={patient.full_name} className='h-11' />
                        </div>
                        <div className='flex justify-end gap-3 pt-6'>
                            <Button variant='outline' onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button className='bg-brand-500 text-white px-6'>Save</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isEditContactModalOpen} onClose={() => setIsEditContactModalOpen(false)} className='max-w-[450px] w-full m-auto'>
                <div className='p-8 bg-white dark:bg-gray-900 rounded-xl'>
                    <h4 className='text-lg font-black uppercase tracking-tight mb-6'>Contact Update</h4>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Email Address</Label>
                            <Input defaultValue={patient.email} className='h-11' />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Phone Number</Label>
                            <Input defaultValue={patient.phone} className='h-11' />
                        </div>
                        <div className='flex justify-end gap-3 pt-6'>
                            <Button variant='outline' onClick={() => setIsEditContactModalOpen(false)}>Cancel</Button>
                            <Button className='bg-brand-500 text-white px-6'>Save</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PatientDetailView;
