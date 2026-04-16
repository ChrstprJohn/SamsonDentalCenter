import React from 'react';
import { WifiOff, AlertCircle, Search, RefreshCw, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Optimized ErrorState Component
 * Distinguishes between:
 * 1. Network/Connection Issues
 * 2. 404 / Not Found
 * 3. General Server Errors
 */
const ErrorState = ({ error, onRetry, title, parentName, parentPath }) => {
    const navigate = useNavigate();
    const isOffline = !navigator.onLine || 
                     error?.toLowerCase().includes('fetch') || 
                     error?.toLowerCase().includes('network') ||
                     error?.toLowerCase().includes('failed to fetch');
    
    const isNotFound = error?.toLowerCase().includes('not found') || 
                       error?.toLowerCase().includes('404');

    const config = isOffline ? {
        icon: WifiOff,
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        title: 'Connection Lost',
        message: "We're having trouble reaching our servers. Please check your internet connection and try again.",
        action: 'Retry Connection'
    } : isNotFound ? {
        icon: Search,
        color: 'text-gray-400',
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        title: title || 'Not Found',
        message: "We couldn't find the information you're looking for. It may have been moved or deleted.",
        action: 'Go Back'
    } : {
        icon: AlertCircle,
        color: 'text-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        title: 'Technical Difficulties',
        message: "Something went wrong on our end. We're working to fix it as soon as possible.",
        action: 'Try Again'
    };

    const Icon = config.icon;

    return (
        <div className='flex-grow flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-gray-900 sm:rounded-[2.5rem] border-t sm:border border-gray-100 dark:border-gray-800 sm:shadow-theme-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
            <div className={`w-20 h-20 ${config.bg} ${config.color} rounded-[2rem] flex items-center justify-center mb-8 shadow-theme-sm transition-transform hover:scale-105 duration-300`}>
                <Icon size={40} strokeWidth={2.5} />
            </div>

            <div className='text-center space-y-3 max-w-sm mb-10'>
                <h3 className='text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                    {config.title}
                </h3>
                <p className='text-[13px] sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed px-4'>
                    {config.message}
                </p>
                {error && !isOffline && !isNotFound && (
                    <div className='mt-2 inline-block px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-[10px] sm:text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider'>
                        Error Ref: {error.slice(0, 40)}{error.length > 40 ? '...' : ''}
                    </div>
                )}
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-10 sm:px-0'>
                {parentPath && (
                    <button
                        onClick={() => navigate(parentPath)}
                        className='order-2 sm:order-1 flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-theme-xs active:scale-95'
                    >
                        <Undo2 size={18} />
                        Back to {parentName || 'List'}
                    </button>
                )}
                
                <button
                    onClick={isNotFound ? () => navigate(parentPath || -1) : onRetry}
                    className='order-1 sm:order-2 flex items-center justify-center gap-2 px-10 py-4 bg-brand-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95'
                >
                    {isNotFound ? <Undo2 size={18} /> : <RefreshCw size={18} />}
                    {isNotFound ? 'Return' : config.action}
                </button>
            </div>
        </div>
    );
};

export default ErrorState;
