import React from 'react';

const Switch = ({ checked, onChange, label, className = '' }) => {
    return (
        <label className={`flex items-center cursor-pointer group ${className}`}>
            <div className="relative">
                <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors border ${checked ? 'bg-brand-500 border-brand-600' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-gray-800'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${checked ? 'translate-x-4' : ''}`}></div>
            </div>
            {label && (
                <span className="ml-3 text-[12px] font-bold capitalize text-gray-500 group-hover:text-brand-500 transition-colors">
                    {label}
                </span>
            )}
        </label>
    );
};

export default Switch;
