import React from 'react';
import { Badge } from '../../ui';
import { Clock, CheckCircle2, AlertCircle, XCircle, MoreVertical } from 'lucide-react';

const STATUS_MAP = {
    'WAITING': { label: 'Waiting', color: 'info', icon: Clock },
    'OFFER_PENDING': { label: 'Offered', color: 'warning', icon: AlertCircle },
    'CONFIRMED': { label: 'Claimed', color: 'success', icon: CheckCircle2 },
    'EXPIRED': { label: 'Expired', color: 'error', icon: XCircle },
    'CANCELLED': { label: 'Cancelled', color: 'neutral', icon: XCircle }
};

const WaitlistRow = ({ item, isActive, onClick }) => {
    const status = STATUS_MAP[item.status] || { label: item.status, color: 'neutral', icon: Clock };
    const StatusIcon = status.icon;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return 'Anytime';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    return (
        <div 
            onClick={() => onClick(item.id)}
            className={`group relative flex items-start gap-4 p-4 sm:p-5 cursor-pointer transition-all border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                isActive ? 'bg-brand-50/50 dark:bg-brand-500/[0.03] border-l-4 border-l-brand-500' : 'border-l-4 border-l-transparent'
            }`}
        >
            {/* Status Icon Indicator */}
            <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-gray-100 dark:bg-white/[0.05] text-gray-400'
            }`}>
                <StatusIcon size={20} />
            </div>

            <div className="flex-grow min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-[13px] font-black uppercase tracking-tight truncate ${
                        isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-900 dark:text-white'
                    }`}>
                        {item.service_name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {formatDate(item.joined_at)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                             Requested: {formatDate(item.preferred_date)} {formatTime(item.preferred_time)}
                        </span>
                    </div>
                    <Badge color={status.color} className="shrink-0 scale-90 origin-right">
                        {status.label}
                    </Badge>
                </div>
            </div>

            {/* Mobile context menu hint */}
            <div className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 opacity-20">
                <MoreVertical size={16} />
            </div>
        </div>
    );
};

export default WaitlistRow;
