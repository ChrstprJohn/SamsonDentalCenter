import React from 'react';

const DoctorProfileHeader = ({ doctor, onBack }) => {
    if (!doctor) return null;
    return (
        <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03] relative group shadow-sm">
            <button 
                onClick={onBack}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                Close
            </button>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex flex-col items-center w-full gap-6 xl:flex-row xl:items-center">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-3xl shadow-inner">
                            {doctor.photo_url ? (
                                <img alt={doctor.full_name} className="w-full h-full object-cover" src={doctor.photo_url} />
                            ) : (
                                <img alt={doctor.full_name} className="w-full h-full object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`} />
                            )}
                        </div>
                    </div>
                    <div className="order-3 xl:order-2 text-center xl:text-left">
                        <h4 className="mb-1 text-[clamp(20px,2.5vw,26px)] font-bold text-gray-900 dark:text-white font-outfit tracking-tight">{doctor.full_name}</h4>
                        <div className="flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-3 xl:text-left">
                            <p className="text-[clamp(14px,1.2vw,15px)] text-brand-600 dark:text-brand-400 font-bold">{doctor.title || (doctor.tier === 'specialized' ? 'Specialist' : 'General Dentist')}</p>
                            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <div className="text-[clamp(13px,1.2vw,14px)] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                                <span>License: <span className="text-gray-900 dark:text-white font-black">{doctor.license_number || 'N/A'}</span></span>
                                <div className="h-3.5 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    doctor.is_active 
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                        : 'bg-gray-50 text-gray-500 border border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'
                                }`}>
                                    {doctor.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfileHeader;
