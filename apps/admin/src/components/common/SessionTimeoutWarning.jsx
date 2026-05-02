import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '../ui';

const SessionTimeoutWarning = ({ secondsRemaining, onExtend, onLogout }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mb-6 relative">
                        <Clock size={40} />
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-md">
                            <AlertTriangle size={18} className="text-amber-500" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                        Session Expiring
                    </h2>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">
                        Your administrative session is about to expire due to inactivity. For your security, you will be logged out in:
                    </p>

                    <div className="text-5xl font-black text-brand-500 font-mono mb-10 tabular-nums">
                        {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <Button 
                            onClick={onLogout}
                            className="h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-black hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} />
                            Log Out
                        </Button>
                        <Button 
                            onClick={onExtend}
                            className="h-14 rounded-2xl bg-brand-500 text-white font-black hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={18} />
                            Stay Active
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionTimeoutWarning;
