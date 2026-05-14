import React from 'react';
import { Info, Copy, Check, Tag, Globe, Settings, Sparkles } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const VariableHelper = ({ required = [], optional = [], description }) => {
    const { showToast } = useToast();
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(`{{${text}}}`);
        showToast(`Copied {{${text}}}`);
    };

    const globalVars = [
        { key: 'clinicName', desc: 'Samson Dental Center' },
        { key: 'clinicAddress', desc: 'Upper Session Road, Baguio City' },
        { key: 'clinicPhone', desc: 'Primary contact number' },
        { key: 'clinicYear', desc: 'Current year (2026)' },
    ];

    return (
        <aside className="w-full bg-transparent flex flex-col overflow-y-auto no-scrollbar h-full">
            <div className="p-6 space-y-8">
                {/* Description Section */}
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Info className="w-3.5 h-3.5 text-brand-500" />
                        Template Context
                    </h4>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        {description || "No description provided for this specific communication flow."}
                    </p>
                </div>

                {/* Required Variables */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Tag className="w-3.5 h-3.5 text-red-500" />
                            Mandatory Data
                        </h4>
                        <div className="group relative">
                            <Info className="w-3.5 h-3.5 text-gray-300 hover:text-brand-500 cursor-help transition-colors" />
                            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl font-medium leading-relaxed">
                                These tags are <span className="text-red-400 font-bold">REQUIRED</span> for this specific email to work. If removed, the system cannot send the email.
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {required.length > 0 ? required.map(tag => (
                            <button
                                key={tag}
                                onClick={() => copyToClipboard(tag)}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 group hover:border-red-500 hover:shadow-md hover:shadow-red-500/5 transition-all"
                            >
                                <code className="text-xs font-bold text-red-500">{"{{"}{tag}{"}}"}</code>
                                <Copy className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-500" />
                            </button>
                        )) : (
                            <p className="text-[10px] text-gray-400 font-medium italic px-1">No mandatory variables required.</p>
                        )}
                    </div>
                </div>

                {/* Optional Variables */}
                {optional.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Dynamic Context
                        </h4>
                        <div className="space-y-2">
                            {optional.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => copyToClipboard(tag)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 group hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/5 transition-all"
                                >
                                    <code className="text-xs font-bold text-amber-600">{"{{"}{tag}{"}}"}</code>
                                    <Copy className="w-3.5 h-3.5 text-gray-300 group-hover:text-amber-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Global Variables */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Globe className="w-3.5 h-3.5 text-brand-500" />
                            System Globals
                        </h4>
                        <div className="group relative">
                            <Info className="w-3.5 h-3.5 text-gray-300 hover:text-brand-500 cursor-help transition-colors" />
                            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl font-medium leading-relaxed">
                                These tags are <span className="text-brand-400 font-bold">ALWAYS</span> available and pull information directly from your Clinic Settings.
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {globalVars.map(item => (
                            <button
                                key={item.key}
                                onClick={() => copyToClipboard(item.key)}
                                className="w-full flex flex-col p-4 rounded-xl bg-white border border-gray-100 group hover:border-brand-500 hover:shadow-md hover:shadow-brand-500/5 transition-all text-left"
                            >
                                <div className="flex items-center justify-between w-full mb-1.5">
                                    <code className="text-xs font-bold text-brand-600">{"{{"}{item.key}{"}}"}</code>
                                    <Copy className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-500" />
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default VariableHelper;

