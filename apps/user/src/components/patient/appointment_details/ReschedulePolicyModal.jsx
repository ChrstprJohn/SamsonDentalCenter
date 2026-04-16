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
                            <h3 className='text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-outfit text-center'>
                                {isWarning ? 'Reschedule Policy' : 'Already Rescheduled'}
                            </h3>
                            <p className='mt-2 text-center text-[13px] sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto'>
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

                            <div className='space-y-4 font-medium text-[13px] sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 rounded-2xl'>
                                <p className='flex items-center gap-3'>
                                    <span className='w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 shrink-0'>
                                        <Phone size={14} />
                                    </span>
                                    <span className='text-gray-900 dark:text-white font-black'>09123456789</span>
                                </p>
                                <p className='flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800'>
                                    <span className='w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 shrink-0'>
                                        <Mail size={14} />
                                    </span>
                                    <span className='text-gray-900 dark:text-white font-black'>samsondentalcenter@gmail.com</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className='flex gap-3'>
                        <button
                            onClick={onClose}
                            className='flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-[15px] font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95'
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
