import React from 'react';
import { Edit2, Calendar, User, Heart } from 'lucide-react';
import { Button } from '../../ui';

const DependentCard = ({ dependent, onEdit }) => {
    const { 
        full_name, 
        first_name, 
        last_name, 
        relationship, 
        date_of_birth, 
        sex 
    } = dependent;

    const formattedDob = date_of_birth ? new Date(date_of_birth).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'N/A';

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            {/* Header: Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xl font-black shadow-sm shrink-0">
                    {first_name?.[0]}{last_name?.[0]}
                </div>
                <div className="min-w-0">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight truncate">
                        {full_name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Heart size={12} className="text-brand-500 fill-brand-500" />
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            {relationship}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Birthday</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <Calendar size={14} className="text-gray-300" />
                        <span className="truncate">{formattedDob}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sex</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <User size={14} className="text-gray-300" />
                        <span>{sex || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50">
                <Button 
                    onClick={() => onEdit(dependent)}
                    variant="outline"
                    className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[13px] font-black border-gray-100 dark:border-gray-800 hover:border-brand-500 hover:text-brand-500 group-hover:bg-brand-50/50 dark:group-hover:bg-brand-500/5 transition-all"
                >
                    <Edit2 size={16} />
                    Edit Profile
                </Button>
            </div>
        </div>
    );
};

export default DependentCard;
