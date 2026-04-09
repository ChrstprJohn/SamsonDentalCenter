import React from 'react';
import { ChevronLeft, Star, Mail, Trash2, Reply, Archive } from 'lucide-react';
import { Badge } from '../../ui';

const NotificationDetailView = ({ notification, onBack, onToggleStar, onToggleRead, onDelete }) => {
    if (!notification) return null;

    const { id, title, message, category, time, isStarred, fullMessage } = notification;

    return (
        <div className='flex flex-col h-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-theme-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
            {/* Action Bar */}
            <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={onBack}
                        className='p-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors'
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className='h-6 w-px bg-gray-100 dark:bg-gray-800'></div>
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
                
                <Badge color='info'>{category}</Badge>
            </div>

            {/* Content Area */}
            <div className='p-6 sm:p-10 overflow-y-auto space-y-8'>
                <div className='space-y-4'>
                    <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white font-outfit leading-tight'>
                        {title}
                    </h2>
                    <div className='flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-6'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold'>
                                {category.charAt(0)}
                            </div>
                            <div>
                                <p className='text-sm font-bold text-gray-800 dark:text-white'>{category} Team</p>
                                <p className='text-[11px] text-gray-400'>To: Patient Account</p>
                            </div>
                        </div>
                        <span className='text-xs text-gray-400 font-medium'>{time}</span>
                    </div>
                </div>

                <div className='prose prose-sm dark:prose-invert max-w-none'>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-base whitespace-pre-wrap'>
                        {fullMessage || message}
                    </p>
                    
                    <p className='mt-12 text-sm text-gray-400 italic'>
                        Best regards,<br />
                        The PrimeraDental System
                    </p>
                </div>

                {/* Quick Actions */}
                <div className='flex items-center gap-4 pt-10'>
                    <button className='inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white text-sm font-bold rounded-2xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20'>
                        <Reply size={18} />
                        Reply Now
                    </button>
                    <button className='inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-gray-300 text-sm font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all'>
                        <Archive size={18} />
                        Archive Notification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailView;
