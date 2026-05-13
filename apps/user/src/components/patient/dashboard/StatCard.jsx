import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', link = null, loading = false }) => {
    const valueRef = useRef(null);
    const [displayValue, setDisplayValue] = useState('0');
    const prevValue = useRef(0);

    const colorClasses = {
        brand:   'bg-brand-50   text-brand-600   dark:bg-brand-500/10   dark:text-brand-400',
        success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
        warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
        info:    'bg-info-50    text-info-600    dark:bg-info-500/10    dark:text-info-400',
    };

    useEffect(() => {
        if (!loading && typeof value === 'string' && !isNaN(value)) {
            const target = parseInt(value, 10);
            const obj = { val: prevValue.current };
            
            gsap.to(obj, {
                val: target,
                duration: 1,
                ease: "power2.out",
                onUpdate: () => {
                    setDisplayValue(Math.floor(obj.val).toString());
                }
            });
            prevValue.current = target;
        } else if (!loading) {
            setDisplayValue(value);
        }
    }, [value, loading]);

    if (loading) {
        return (
            <div className='relative rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex items-center gap-3 p-4 min-h-[110px] animate-pulse'>
                <div className='w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0' />
                <div className='flex-grow space-y-2'>
                    <div className='h-6 w-12 bg-gray-100 dark:bg-gray-800 rounded' />
                    <div className='h-4 w-20 bg-gray-50 dark:bg-gray-800/50 rounded' />
                </div>
            </div>
        );
    }

    return (
        <div className='relative rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex items-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 min-h-[100px] sm:min-h-[110px] h-full transition-colors hover:border-gray-300 dark:hover:border-gray-700'>
            {/* Icon */}
            <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0 ${colorClasses[color] || colorClasses.brand}`}>
                {Icon && <Icon size={18} className="sm:w-[20px] sm:h-[20px]" />}
            </div>

            {/* Content */}
            <div className='flex-grow min-w-0'>
                <div className='flex items-center justify-between gap-1'>
                    <h4 className='text-xl sm:text-2xl lg:text-[28px] font-bold text-gray-900 dark:text-white truncate leading-tight tabular-nums tracking-tight'>
                        {displayValue}
                    </h4>
                    {link && (
                        <Link
                            to={link}
                            className='hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0'
                        >
                            View <ArrowUpRight size={14} />
                        </Link>
                    )}
                </div>

                <div className='flex flex-col'>
                    <span className='text-[11px] sm:text-xs lg:text-[13px] text-gray-500 dark:text-gray-400 truncate font-bold tracking-wider px-0.5 mt-0.5'>
                        {title}
                    </span>
                    {subtitle && (
                        <p className='text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 flex-wrap'>
                            <span className='truncate'>{subtitle}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Mobile tap overlay for linked cards */}
            {link && (
                <Link to={link} className='absolute inset-0 sm:hidden z-10' aria-label={`View ${title}`} />
            )}
        </div>
    );
};

export default StatCard;
