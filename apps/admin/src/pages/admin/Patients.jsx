import React from 'react';
import { useParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const Patients = () => {
    const { tab, id } = useParams();
    const activeTab = tab || 'profile';

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb 
                pageTitle={id ? "Patient Details" : "Patients & Users"} 
                parentName={id ? "Patients & Users" : null}
                parentPath={id ? "/patients" : null}
                className='mb-4' 
            />
            
            <div className='grow flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-white/[0.03] p-12 text-center'>
                <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight'>
                        {activeTab} - {id ? 'Patient Record' : 'Registry View'}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
                        The patient directory submodule ({activeTab}) is ready for implementation.
                    </p>
                    <div className='mt-6 px-4 py-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg inline-block border border-brand-100 dark:border-brand-500/20'>
                        <span className='text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest leading-none'>
                            Active Context: {id ? `Patient # ${id}` : 'All Patients'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patients;
