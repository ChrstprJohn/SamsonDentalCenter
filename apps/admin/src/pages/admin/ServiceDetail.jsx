import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { useServicesContext } from '../../context/ServicesContext';
import ServiceDetailView from '../../components/services/ServiceDetailView';
import { ArrowLeft } from 'lucide-react';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { services, loading } = useServicesContext();

    const service = services.find((s) => s.id === parseInt(id));

    if (loading) {
        return (
            <div className='flex items-center justify-center h-full'>
                <div className='animate-pulse text-gray-400 font-medium capitalize text-xs'>
                    Fetching Service...
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className='flex flex-col items-center justify-center h-full text-center'>
                <h2 className='text-2xl font-medium text-gray-900 dark:text-white font-outfit capitalize'>
                    Service Not Found
                </h2>
                <button
                    onClick={() => navigate('/services')}
                    className='mt-4 flex items-center gap-2 text-brand-500 font-bold hover:underline'
                >
                    <ArrowLeft size={18} />
                    Back to Catalog
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full bg-gray-50/50 dark:bg-gray-900'>
            <div className='border-b border-gray-200 dark:border-gray-800 sm:border-none mb-0 sm:mb-4'>
                <PageBreadcrumb
                    pageTitle={service.name}
                    parentName='Services Catalog'
                    parentPath='/services'
                />
            </div>

            <ServiceDetailView
                service={service}
                onBack={() => navigate('/services')}
            />
        </div>
    );
};

export default ServiceDetail;
