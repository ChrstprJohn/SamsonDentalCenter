import React, { useState } from 'react';
import {
    Clock,
    ShieldCheck,
    ShieldAlert,
    Image as ImageIcon,
    PhilippinePeso,
    ChevronRight,
} from 'lucide-react';
import { Badge } from '../ui';

const ServiceCard = ({ service, onClick }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            onClick={() => onClick(service)}
            role='button'
            tabIndex={0}
            className='group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all duration-300 flex flex-col h-full text-left'
        >
            {/* Image Section */}
            <div className='relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0'>
                {service.image_url && !imgError ? (
                    <img
                        src={service.image_url}
                        alt={service.name}
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className='flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/80 w-full h-full'>
                        <ImageIcon
                            size={48}
                            strokeWidth={1}
                        />
                        <span className='mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400'>
                            No Photo
                        </span>
                    </div>
                )}

                {/* Tier Badge overlay */}
                <div className='absolute top-4 right-4 z-10'>
                    <Badge
                        variant={service.tier === 'specialized' ? 'purple' : 'blue'}
                        className='backdrop-blur-md bg-white/90 dark:bg-gray-900/90 shadow-sm border-0'
                    >
                        {service.tier}
                    </Badge>
                </div>
                {/* Gradient Overlay for seamless text transition */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
            </div>

            {/* Content Section */}
            <div className='p-6 flex flex-col grow bg-white dark:bg-gray-900'>
                <div className='flex justify-between items-start gap-3 mb-4'>
                    <h4 className='text-base font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight font-outfit line-clamp-2'>
                        {service.name}
                    </h4>
                </div>

                <div className='space-y-4 mt-auto'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1.5 text-brand-600 dark:text-brand-400'>
                            <PhilippinePeso
                                size={16}
                                strokeWidth={2.5}
                            />
                            <span className='text-xl font-black font-outfit'>{service.cost}</span>
                        </div>
                        <div className='flex items-center justify-center min-w-[70px] h-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700'>
                            <Clock
                                size={12}
                                className='text-gray-400 mr-1.5'
                            />
                            <span className='text-[11px] font-bold text-gray-600 dark:text-gray-300'>
                                {service.duration}
                            </span>
                        </div>
                    </div>

                    <div className='pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between h-10'>
                        <div className='flex items-center gap-1.5'>
                            {service.auto_approve ? (
                                <div className='flex items-center gap-1.5 text-[10px] font-black text-success-600 uppercase tracking-widest bg-success-50 dark:bg-success-500/10 px-2 py-1 rounded-md'>
                                    <ShieldCheck size={12} />
                                    <span>Auto-Approve</span>
                                </div>
                            ) : (
                                <div className='flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md'>
                                    <ShieldAlert size={12} />
                                    <span>Approval Req.</span>
                                </div>
                            )}
                        </div>

                        {/* Jakob's Law / Zeigarnik Effect: Show clear progression state on hover */}
                        <div className='opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-500'>
                            Edit <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
