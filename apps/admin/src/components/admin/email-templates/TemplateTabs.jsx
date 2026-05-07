import React from 'react';

const TemplateTabs = ({ categories, activeTab, onTabChange }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-4">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onTabChange(cat)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                        activeTab === cat
                            ? 'bg-white text-brand-600 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default TemplateTabs;
