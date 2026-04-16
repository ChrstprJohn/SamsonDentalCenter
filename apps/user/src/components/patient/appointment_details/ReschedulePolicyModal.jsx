import React from 'react';
import { Phone, Mail, Clock, AlertTriangle } from 'lucide-react';

const ReschedulePolicyModal = ({ show, onClose, onConfirm, mode = 'warning' }) => {
    if (!show) return null;

    const isWarning = mode === 'warning';

    const contactItems = [
        {
            icon: Phone,
            label: 'Call Us',
            display: '09123456789',
            href: 'tel:09123456789',
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-500/10'
        },
        {
            icon: Mail,
            label: 'Email Us',
            display: 'samsondentalcenter@gmail.com',
            href: 'mailto:samsondentalcenter@gmail.com',
            color: 'text-brand-600',
            bg: 'bg-brand-50 dark:bg-brand-500/10'
        }
    ];

    return (
        <div 
            className='fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm'
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className='relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-[fadeIn_0.15s_ease-out] overflow-hidden'>
                {/* Visual Header Bar */}
                <div className={`h-1.5 w-full ${isWarning ? 'bg-amber-500' : 'bg-brand-500'}`} />
                
                <div className='p-6 sm:p-10 space-y-8'>
                    {/* Icon & Title */}
                    <div className='flex flex-col items-center text-center space-y-5'>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                            isWarning 
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500' 
                                : 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                        }`}>
                            {isWarning ? <AlertTriangle size={32} /> : <Clock size={32} />}
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-2xl font-black text-slate-900 dark:text-white font-outfit'>
                                {isWarning ? 'Reschedule Policy' : 'Already Rescheduled'}
                            </h3>
                            <p className='text-[14px] sm:text-[15px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-[320px] mx-auto'>
                                {isWarning 
                                    ? "You can only reschedule this appointment once through the portal. Further changes will require contacting our clinic directly."
                                    : "This appointment has already been rescheduled once. For further adjustments, please reach out to our team."
                                }
                            </p>
                        </div>
                    </div>

                    {/* Contact List (Only for Blocked mode) */}
                    {!isWarning && (
                        <div className='space-y-3'>
                            {contactItems.map((item, idx) => (
                                <a 
                                    key={idx}
                                    href={item.href}
                                    className='flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-200 dark:hover:border-brand-500/50 hover:bg-white dark:hover:bg-brand-500/5 transition-all group'
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                                        <item.icon size={20} className={item.color} />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest'>{item.label}</p>
                                        <p className='text-[13px] font-bold text-slate-900 dark:text-white truncate'>{item.display}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className='flex gap-3'>
                        <button
                            onClick={onClose}
                            className='flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-[15px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95'
                        >
                            {isWarning ? 'Go Back' : 'Close'}
                        </button>
                        {isWarning && (
                            <button
                                onClick={onConfirm}
                                className='flex-1 px-6 py-4 rounded-2xl bg-brand-500 text-[15px] font-black text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all active:scale-95'
                            >
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReschedulePolicyModal;
