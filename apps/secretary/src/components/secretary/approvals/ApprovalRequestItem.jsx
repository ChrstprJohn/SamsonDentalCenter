import React from 'react';
import { Clock, Calendar } from 'lucide-react';

const ApprovalRequestItem = ({ request, isActive, onClick }) => {
    const { patient, service, requestedDate, createdAt } = request;
    
    // Calculate if stale (> 24h)
    const createdDate = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
    const isStale = hoursDiff > 24;

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 border-2 ${
                isActive 
                    ? 'bg-brand-50 border-brand-500 shadow-theme-sm' 
                    : 'bg-white border-transparent hover:bg-gray-50 border-gray-100 dark:bg-white/[0.03] dark:border-gray-800'
            }`}
        >
            <div className="flex justify-between items-start mb-1.5">
                <h3 className={`font-bold text-sm transition-colors ${isActive ? 'text-brand-600' : 'text-gray-900 dark:text-white'}`}>
                    {patient.name}
                </h3>
                <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    isStale ? 'bg-error-50 text-error-600' : 'bg-warning-50 text-warning-600'
                }`}>
                    {isStale ? 'Stale' : 'New'}
                </div>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                {service}
            </p>
            
            <div className="flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1">
                    <Calendar className="size-3 text-gray-400" />
                    <span>{new Date(requestedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="size-3 text-gray-400" />
                    <span>{hoursDiff < 1 ? 'Just now' : `${Math.floor(hoursDiff)}h ago`}</span>
                </div>
            </div>
        </button>
    );
};

export default ApprovalRequestItem;
