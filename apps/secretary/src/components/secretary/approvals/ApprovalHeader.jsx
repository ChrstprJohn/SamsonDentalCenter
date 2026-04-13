import React from 'react';
import { ListChecks, Clock, Zap } from 'lucide-react';

const StatCard = ({ label, value, colorClass, icon: Icon, animate = true }) => (
    <div className={`group relative bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 p-4 sm:p-5 rounded-2xl shadow-theme-sm flex-shrink-0 w-[42%] sm:flex-1 sm:min-w-[140px] transition-all duration-300 ${animate ? 'hover:shadow-xl sm:hover:-translate-y-1' : ''} overflow-hidden`}>
        {/* Decorative Background Element */}
        <div className={`absolute -right-2 -top-2 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity ${colorClass.replace('text-', 'bg-')}`} />
        
        <div className="relative z-10 flex flex-col items-start gap-2.5 sm:gap-3">
            <div className={`p-2 rounded-xl sm:p-2.5 ${colorClass.replace('text-', 'bg-').replace('500', '50')} dark:bg-white/5 flex items-center justify-center`}>
                <Icon size={14} className={`${colorClass} ${label === 'Urgent' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-0.5">{label}</p>
                <p className={`text-2xl sm:text-3xl font-black tracking-tighter ${colorClass}`}>{value}</p>
            </div>
        </div>
    </div>
);

const ApprovalHeader = ({ totalPending, urgentCount, newCount, staleCount }) => {
    return (
        <div className="mb-5 sm:mb-10 px-4 sm:px-0">
            <div className="flex flex-nowrap sm:flex-wrap gap-4 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                <StatCard 
                    label="Total Request" 
                    value={totalPending} 
                    colorClass="text-brand-500" 
                    icon={ListChecks}
                    animate={false}
                />
                <StatCard 
                    label="Urgent" 
                    value={urgentCount} 
                    colorClass="text-error-500" 
                    icon={Zap}
                    animate={false}
                />
                <StatCard 
                    label="New Request" 
                    value={newCount} 
                    colorClass="text-yellow-500" 
                    icon={Zap}
                    animate={false}
                />
                <StatCard 
                    label="Needs Attention" 
                    value={staleCount} 
                    colorClass="text-warning-500" 
                    icon={Clock}
                    animate={false}
                />
            </div>
        </div>
    );
};

export default ApprovalHeader;
