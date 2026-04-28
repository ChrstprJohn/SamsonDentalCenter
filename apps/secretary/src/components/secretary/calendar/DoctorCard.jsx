import React from 'react';

const DoctorCard = ({ doc, onSchedule, onEdit }) => {
    return (
        <div 
            onClick={onSchedule} 
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-white/[0.03] cursor-pointer hover:shadow-lg transition-all group relative"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-xl shadow-inner">
                            {doc.photo_url ? (
                                <img alt={doc.full_name} className="w-full h-full object-cover" src={doc.photo_url} />
                            ) : (
                                <img alt={doc.full_name} className="w-full h-full object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`} />
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{doc.full_name}</h3>
                        <p className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                            {doc.title || (doc.tier === 'specialized' ? 'Specialist' : 'General Dentist')}
                        </p>
                    </div>
                </div>
                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    doc.is_active 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                        : 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'
                }`}>
                    {doc.is_active ? 'Active' : 'Inactive'}
                </div>
            </div>
            
            <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-4 h-4 opacity-70" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
                    {doc.phone || '+1 (555) 000-0000'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4 opacity-70" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
                    {doc.email || 'clinician@samson.com'}
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
