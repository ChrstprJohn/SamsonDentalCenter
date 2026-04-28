import React from 'react';

const Switch = ({ checked, onChange, disabled }) => {
    return (
        <label className={`flex items-center cursor-pointer group scale-75 sm:scale-90 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="relative">
                <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={checked} 
                    onChange={(e) => !disabled && onChange(e.target.checked)} 
                    disabled={disabled}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors border ${checked ? 'bg-brand-500 border-brand-600' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-gray-800'}`}></div>
                <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${checked ? 'translate-x-4' : 'left-1'}`}></div>
            </div>
        </label>
    );
};

export default Switch;
