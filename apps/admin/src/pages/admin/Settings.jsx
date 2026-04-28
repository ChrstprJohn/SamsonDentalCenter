import React from 'react';
import { useParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const Settings = () => {
    const { tab } = useParams();
    const activeTab = tab || 'general';

    const tabDisplayNames = {
        general: 'General Details',
        rules: 'Global Rules',
        holidays: 'Clinic Holidays',
        health: 'System Health'
    };

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb pageTitle="Clinic Settings" className='mb-4' />
            
            <div className='grow flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-white/[0.03] p-12 text-center'>
                <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight'>
                        {tabDisplayNames[activeTab] || activeTab}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
                        This configuration panel is now driven by the global sidebar. Currently under architectural review.
                    </p>
                    <div className='mt-6 px-4 py-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg inline-block border border-brand-100 dark:border-brand-500/20'>
                        <span className='text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest leading-none'>
                            Active Tab: {activeTab}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
