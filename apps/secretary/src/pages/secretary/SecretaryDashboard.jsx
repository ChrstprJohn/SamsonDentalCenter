import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DashboardWelcomeBanner from '../../components/patient/dashboard/DashboardWelcomeBanner';
import DashboardStats from '../../components/patient/dashboard/DashboardStats';

const SecretaryDashboard = () => {
    return (
        <div className="flex flex-col h-full">
            <PageBreadcrumb pageTitle='Secretary Dashboard' />
            
            <div className='mt-8 space-y-6'>
                <DashboardWelcomeBanner firstName="Lisa" />
                <DashboardStats />
                
                {/* Future Content */}
                <div className='min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl dark:border-gray-800 mt-8'>
                    <div className='text-center'>
                        <h3 className='text-gray-400 font-medium'>More content coming soon</h3>
                        <p className='text-gray-400 text-sm'>Additional widgets can be placed here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretaryDashboard;
