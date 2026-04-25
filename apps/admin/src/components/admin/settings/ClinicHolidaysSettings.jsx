import React from 'react';
import { Calendar, Trash2, Plus } from 'lucide-react';
import { Button } from '../../ui';

const ClinicHolidaysSettings = () => {
    const holidays = [
        { id: 1, name: 'Christmas Day', date: 'Dec 25, 2026' },
        { id: 2, name: 'New Year\'s Day', date: 'Jan 01, 2027' },
        { id: 3, name: 'Chinese New Year', date: 'Feb 17, 2027' },
    ];

    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                            Clinic Closure Dates
                        </h4>
                        <p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold'>
                            Public holidays and clinic-wide breaks
                        </p>
                    </div>
                    <Button className='flex items-center gap-2 h-10 px-4 rounded-lg bg-brand-500 text-white text-xs font-black uppercase tracking-tight'>
                        <Plus size={16} /> Add Holiday
                    </Button>
                </div>

                <div className='grid grid-cols-1 gap-3'>
                    {holidays.map(holiday => (
                        <div key={holiday.id} className='flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-500/30 transition-all bg-white dark:bg-white/[0.02]'>
                            <div className='flex items-center gap-4'>
                                <div className='w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400'>
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h5 className='text-sm font-bold text-gray-900 dark:text-white'>{holiday.name}</h5>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>{holiday.date}</p>
                                </div>
                            </div>
                            <button className='p-2 text-gray-400 hover:text-red-500 transition-colors'>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className='mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 flex items-start gap-3'>
                    <div className='mt-0.5 text-blue-600'>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <p className='text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed'>
                        On these dates, no appointment slots will be generated and the patient booking calendar will show the clinic as completely closed.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClinicHolidaysSettings;
