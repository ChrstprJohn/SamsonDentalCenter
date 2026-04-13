import React from 'react';
import { ListChecks, Clock, Zap } from 'lucide-react';

const StatCard = ({ label, value, colorClass, icon: Icon }) => (
    <div className="group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 p-5 rounded-[28px] shadow-theme-sm flex-1 min-w-[140px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
        {/* Decorative Background Element */}
        <div className={`absolute -right-2 -top-2 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity ${colorClass.replace('text-', 'bg-')}`} />
        
        <div className="relative z-10 flex flex-col items-start gap-3">
            <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('500', '50')} dark:bg-white/5 flex items-center justify-center`}>
                <Icon size={16} className={colorClass} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-0.5">{label}</p>
                <p className={`text-3xl font-black tracking-tighter ${colorClass}`}>{value}</p>
            </div>
        </div>
    </div>
);

const ApprovalHeader = ({ totalPending, newCount, staleCount }) => {
    return (
        <div className="mb-10 px-4 sm:px-0">
            <div className="flex flex-wrap gap-4">
                <StatCard 
                    label="Total Pending" 
                    value={totalPending} 
                    colorClass="text-brand-500" 
                    icon={ListChecks}
                />
                <StatCard 
                    label="New Request" 
                    value={newCount} 
                    colorClass="text-yellow-500" 
                    icon={Zap}
                />
                <StatCard 
                    label="Stale Request" 
                    value={staleCount} 
                    colorClass="text-error-500" 
                    icon={Clock}
                />
            </div>
        </div>
    );
};

export default ApprovalHeader;
