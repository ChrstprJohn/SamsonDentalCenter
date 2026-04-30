import React from 'react';
import { History, History as HistoryIcon } from 'lucide-react';

const RecordsTab = () => {
    return (
        <div className='space-y-4'>
            <h4 className='text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                <HistoryIcon size={14} /> Medical & Treatment History
            </h4>
            <div className='p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center py-20'>
                <History size={40} className='mx-auto text-gray-300 dark:text-gray-700 mb-4' />
                <h4 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight'>No History Found</h4>
                <p className='text-xs text-gray-500 mt-2'>Treatment history will appear here once the patient completes their first visit.</p>
            </div>
        </div>
    );
};

export default RecordsTab;
