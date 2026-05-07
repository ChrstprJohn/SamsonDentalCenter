import React from 'react';
import { ChevronDown, RefreshCw, PanelRightClose, PanelRight } from 'lucide-react';

const TemplateHeader = ({ 
    templates, 
    selectedKey, 
    onSelect, 
    onRefresh, 
    isRefreshing, 
    showVariables, 
    onToggleVariables 
}) => {
    return (
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Template</span>
                    <div className="relative group mt-1">
                        <select 
                            value={selectedKey || ''} 
                            onChange={(e) => onSelect(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-700 shadow-sm hover:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none cursor-pointer min-w-[200px]"
                        >
                            {templates.map(t => (
                                <option key={t.template_key} value={t.template_key}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform group-hover:text-brand-500" />
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={onToggleVariables}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest ${
                        showVariables 
                        ? 'bg-brand-50 text-brand-600 border-brand-200 shadow-inner' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-brand-500 hover:text-brand-500 shadow-sm'
                    }`}
                >
                    {showVariables ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
                    <span>{showVariables ? "Hide Tags" : "Show Tags"}</span>
                </button>

                <button 
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    title="Refresh templates"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default TemplateHeader;
