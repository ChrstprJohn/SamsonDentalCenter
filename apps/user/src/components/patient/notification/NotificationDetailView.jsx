import React from 'react';
import { ChevronLeft, Star, Mail, Trash2, Reply, Archive } from 'lucide-react';
import { Badge } from '../../ui';

const NotificationDetailView = ({ notification, onBack, onToggleStar, onToggleRead, onDelete }) => {
    if (!notification) return null;

    const { id, title, message, category, time, isStarred, fullMessage } = notification;

    return (
        <div className='flex-grow flex flex-col h-full bg-white dark:bg-gray-900 sm:rounded-3xl border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
            {/* Action Bar */}
            <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                <button 
                    onClick={onBack}
                    className='p-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors'
                >
                    <ChevronLeft size={20} />
                </button>
                
                <div className='flex items-center gap-2'>
                    <button 
                        onClick={() => onToggleStar(id)}
                        className={`p-2 rounded-xl transition-colors ${isStarred ? 'text-amber-400 bg-amber-50 dark:bg-amber-400/10' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]'}`}
                    >
                        <Star size={18} fill={isStarred ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                        className='p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors'
                        onClick={() => onDelete(id)}
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        className='p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors'
                        onClick={() => onToggleRead(id)}
                    >
                        <Mail size={18} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className='p-5 sm:p-8 md:p-10 overflow-y-auto grow no-scrollbar pb-24 sm:pb-8 md:pb-10'>
                <div className='space-y-4 sm:space-y-6'>
                    <h2 className='text-[22px] sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-outfit leading-tight tracking-tight'>
                        {title}
                    </h2>
                    <div className='flex items-center justify-between border-b border-gray-100/50 dark:border-gray-800 pb-6'>
                        <div className='flex items-center gap-3'>
                            <div className='w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm'>
                                {category.charAt(0)}
                            </div>
                            <div>
                                <p className='text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white'>{category} Team</p>
                                <p className='text-[10px] sm:text-[11px] text-gray-400 font-medium'>To: Patient Account</p>
                            </div>
                        </div>
                        <span className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider'>{time}</span>
                    </div>
                </div>

                <div className='prose prose-sm dark:prose-invert max-w-none pt-4 sm:pt-6'>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base whitespace-pre-wrap'>
                        {fullMessage || message}
                    </p>
                    
                    <p className='mt-10 sm:mt-12 text-[13px] sm:text-sm text-gray-400 italic font-medium'>
                        Best regards,<br />
                        The PrimeraDental System
                    </p>
                </div>

            </div>

            {/* Floating Quick Actions Footer */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-20 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none'>
                <div className='flex items-center gap-3 w-full'>
                    <div className='hidden sm:block sm:w-1/2'></div>
                    <div className='flex flex-1 sm:w-1/2 gap-3 sm:justify-end'>
                        <button className='flex-1 sm:flex-none sm:min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-[12px] sm:text-sm font-bold rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/10'>
                            <Reply size={16} />
                            Reply
                        </button>
                        <button className='flex-1 sm:flex-none sm:min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-gray-300 text-[12px] sm:text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all'>
                            <Archive size={16} />
                            Archive
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailView;
