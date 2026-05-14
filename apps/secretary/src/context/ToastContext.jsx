import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, X, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    
    // Provide nice helpers
    return {
        ...context,
        success: (message, title) => context.showToast(message, 'success', title),
        error: (message, title) => context.showToast(message, 'error', title),
        info: (message, title) => context.showToast(message, 'info', title),
        warning: (message, title) => context.showToast(message, 'warning', title),
    };
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', title) => {
        const id = Math.random().toString(36).substr(2, 9);
        const defaultTitle = type === 'success' ? 'Success' : type === 'error' ? 'Attention Required' : 'Information';
        setToasts((prev) => [...prev, { id, message, type, title: title || defaultTitle }]);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-24 right-4 sm:right-10 z-[999999] flex flex-col gap-3 w-[85vw] sm:w-auto sm:max-w-sm pointer-events-none">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.4)] p-4 sm:p-5 flex gap-4 items-center ring-1 ring-black/5 pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-500 overflow-hidden relative group"
                    >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                            toast.type === 'success' ? 'bg-success-500 shadow-success-500/20' : 
                            toast.type === 'error' ? 'bg-error-500 shadow-error-500/20' : 
                            'bg-amber-500 shadow-amber-500/20'
                        } text-white transition-transform group-hover:scale-110 duration-300`}>
                            {toast.type === 'success' ? <Check size={20} className="sm:size-6" /> : 
                             toast.type === 'error' ? <AlertCircle size={20} className="sm:size-6" /> : 
                             <Info size={20} className="sm:size-6" />}
                        </div>
                        <div className="flex-grow min-w-0">
                            <h4 className="text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                                {toast.title}
                            </h4>
                            <p className="text-[12px] sm:text-[14px] font-bold text-gray-900 dark:text-white leading-tight break-words">
                                {toast.message}
                            </p>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                removeToast(toast.id);
                            }} 
                            className="p-2 text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors relative z-20 cursor-pointer pointer-events-auto"
                            aria-label="Close notification"
                        >
                            <X size={18} />
                        </button>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800/50">
                            <div 
                                className={`h-full opacity-60 ${
                                    toast.type === 'success' ? 'bg-success-500' : 
                                    toast.type === 'error' ? 'bg-error-500' : 
                                    'bg-amber-500'
                                } animate-toast-progress`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
