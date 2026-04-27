import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhilippinePeso, Clock, ChevronRight } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();
    const { isExpanded, isHovered } = useSidebar();
    const isSidebarOpen = isExpanded || isHovered; // Wider cards (2 columns)

    const handleNavigate = (e) => {
        e.stopPropagation();
        navigate(`/services/${service.id}`);
    };

    return (
        <div 
            onClick={handleNavigate}
            className='group relative flex flex-row sm:flex-col bg-white dark:bg-white/5 border-b sm:border border-gray-200 dark:border-gray-800 sm:rounded-xl overflow-hidden hover:bg-gray-50/50 dark:hover:bg-white/[0.02] sm:hover:shadow-2xl sm:hover:shadow-brand-500/10 transition-all duration-500 cursor-pointer'
        >
            {/* Image Container */}
            <div className='relative w-14 h-14 sm:w-full sm:h-48 m-4 sm:m-0 shrink-0 overflow-hidden rounded-lg sm:rounded-none bg-gray-100 dark:bg-gray-800'>
                {service.image_url ? (
                    <img
                        src={service.image_url}
                        alt={service.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/[0.02]'>
                        <span className='text-gray-300 dark:text-gray-700 font-black uppercase tracking-widest text-[10px]'>
                            {service.name.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block' />
            </div>

            <div className='py-4 pr-4 sm:p-6 flex flex-col grow bg-transparent min-w-0 justify-center'>
                <div className='flex items-start justify-between sm:mb-4 gap-2'>
                    <div className='flex flex-col min-w-0'>
                        {/* Tier */}
                        <span className={`text-[clamp(9px,1.2vw,11px)] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-0.5 sm:mb-1.5 transition-all duration-300 ease-in-out`}>
                            {service.tier}
                        </span>
                        
                        {/* Name */}
                        <h4 className={`text-[clamp(14px,1.8vw,18px)] font-black text-gray-900 dark:text-white font-outfit leading-tight group-hover:text-brand-500 transition-colors uppercase tracking-tight truncate sm:whitespace-normal transition-all duration-300 ease-in-out`}>
                            {service.name}
                        </h4>

                        {/* Mobile Duration */}
                        <div className='sm:hidden flex items-center gap-1.5 mt-1 text-gray-400'>
                            <Clock size={10} />
                            <span className='text-[9px] font-bold uppercase tracking-widest'>
                                {service.duration}
                            </span>
                        </div>
                    </div>
                    <div className='sm:hidden flex items-center self-center text-gray-300'>
                        <ChevronRight size={18} />
                    </div>
                </div>

                {/* Duration (Desktop) */}
                <div className='hidden sm:flex items-center gap-[clamp(4px,0.5vw,6px)] mt-auto pt-5 border-t border-gray-200 dark:border-white/5 text-gray-400'>
                    <Clock size={14} />
                    <span className={`text-[clamp(10px,1.2vw,12px)] font-bold font-outfit uppercase tracking-widest transition-all duration-300 ease-in-out`}>
                        {service.duration}
                    </span>
                </div>

                {/* Mobile Meta (Status/Duration only) */}
                <div className='hidden sm:hidden flex items-center gap-4 mt-1'>
                    {/* Price hidden as requested */}
                </div>
                
                <div className='hidden sm:flex mt-4 items-center justify-end text-[9px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-600 transition-colors'>
                    View Detail <ChevronRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
