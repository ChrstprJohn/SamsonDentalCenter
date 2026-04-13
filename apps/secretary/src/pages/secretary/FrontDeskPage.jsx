import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const FrontDeskPage = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <PageBreadcrumb pageTitle="Front Desk" />
            </div>
            
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Soon</p>
            </div>
        </div>
    );
};

export default FrontDeskPage;
