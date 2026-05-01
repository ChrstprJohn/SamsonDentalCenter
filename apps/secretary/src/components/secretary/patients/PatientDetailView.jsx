import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, User, FileText, History } from 'lucide-react';
import PatientProfileDetail from './profile/PatientProfileDetail';

const PatientDetailView = ({ patient, onBack }) => {
    const [activeTab, setActiveTab] = useState('profile');

    if (!patient) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'history', label: 'Medical History', icon: History },
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
                                Patient File
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sub-navigation Tabs */}
                <div className='px-4 sm:px-6 flex items-center gap-6'>
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                                activeTab === t.id 
                                    ? 'text-brand-500' 
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                        >
                            <t.icon size={14} />
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
                    {/* Header / Profile Section */}
                    <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                        <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                            <div className='flex flex-col items-center w-full gap-6 xl:flex-row xl:items-center'>
                                <div className='relative shrink-0'>
                                    <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-2xl shadow-inner'>
                                        {patient.photo_url ? (
                                            <img src={patient.photo_url} alt={patient.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            (patient.full_name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                </div>
                                <div className='order-3 xl:order-2 text-center xl:text-left'>
                                    <h4 className='mb-1 text-[clamp(18px,2.2vw,22px)] font-bold text-gray-900 dark:text-white font-outfit'>
                                        {patient.full_name}
                                    </h4>
                                    <div className='flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                        <p className='text-[clamp(13px,1.2vw,14px)] text-brand-600 dark:text-brand-400 font-bold'>
                                            ID: {patient.patient_id}
                                        </p>
                                        <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block'></div>
                                        <div className='text-[clamp(13px,1.2vw,14px)] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2'>
                                            <span>Last Visit: <span className='text-gray-900 dark:text-white font-black'>{patient.last_visit || 'N/A'}</span></span>
                                            <div className='h-3.5 w-px bg-gray-300 dark:bg-gray-700 mx-1'></div>
                                            <span className={`px-2 py-0.5 rounded-lg text-[clamp(11px,1vw,12px)] font-bold uppercase tracking-wider ${
                                                patient.is_active ? 'bg-success-100 text-success-600 dark:bg-success-500/10 dark:text-success-400' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                Status : {patient.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    {activeTab === 'profile' && (
                                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-2xl font-medium leading-relaxed'>
                                            {patient.notes || 'No additional notes for this patient.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact info in Header Card */}
                        {activeTab === 'profile' && (
                            <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                                <div className='flex flex-wrap gap-6'>
                                    <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                        <Mail size={16} className='text-gray-400' /> {patient.email || 'No email provided'}
                                    </div>
                                    <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                        <Phone size={16} className='text-gray-400' /> {patient.phone || 'No phone provided'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dynamic Child Content */}
                    <div className='min-h-120 md:min-h-140'>
                        {activeTab === 'profile' && <PatientProfileDetail patient={patient} />}
                        {activeTab === 'appointments' && (
                            <div className='flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl'>
                                <Calendar size={48} className='text-gray-300 mb-4' />
                                <h4 className='text-lg font-bold text-gray-800 dark:text-white'>Appointment History</h4>
                                <p className='text-sm text-gray-500 max-w-[280px]'>Detailed appointment history will be displayed here.</p>
                            </div>
                        )}
                        {activeTab === 'history' && (
                            <div className='flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl'>
                                <History size={48} className='text-gray-300 mb-4' />
                                <h4 className='text-lg font-bold text-gray-800 dark:text-white'>Full Medical History</h4>
                                <p className='text-sm text-gray-500 max-w-[280px]'>Comprehensive clinical records will be displayed here.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PatientDetailView;
