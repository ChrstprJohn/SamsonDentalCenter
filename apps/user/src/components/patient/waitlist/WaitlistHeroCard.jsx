import React from 'react';
import { Calendar, Bell, Sparkles, Inbox, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WaitlistHeroCard = ({ heroEntry, stats }) => {
    const navigate = useNavigate();
    
    // Determine the main state
    const hasOffer = heroEntry?.status === 'OFFER_PENDING' || heroEntry?.status === 'NOTIFIED';
    const isWaiting = heroEntry?.status === 'WAITING';
    const isEmpty = !heroEntry;

    if (isEmpty) {
        return (
            <div className="w-full px-4 sm:px-0 mt-2 mb-2 sm:mt-0 sm:mb-6">
                <h3 className="text-sm font-black text-gray-700 dark:text-white uppercase tracking-tight mb-4 sm:hidden">
                    My Waitlist
                </h3>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 mb-3">
                        <Inbox size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">No active waitlist requests</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[240px]">
                        Join the waitlist from an individual service to get notified of earlier openings.
                    </p>
                </div>
            </div>
        );
    }

    if (hasOffer) {
        return (
            <div className="w-full px-4 sm:px-0 mt-2 mb-2 sm:mt-0 sm:mb-6">
                <h3 className="text-sm font-black text-gray-700 dark:text-white uppercase tracking-tight mb-4 sm:hidden">
                    My Waitlist
                </h3>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    
                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <Sparkles size={28} className="sm:size-32" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-90 leading-none mb-1">Active Offer Found!</span>
                                <h4 className="text-xl sm:text-2xl font-black leading-none">
                                    {heroEntry.service_name}
                                </h4>
                                <p className="text-xs opacity-90 mt-1.5 font-bold">
                                    Slot available on {heroEntry.preferred_date} {heroEntry.preferred_time}
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => navigate(`?id=${heroEntry.id}`)}
                            className="bg-white text-indigo-600 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Claim Now
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default: Waiting State
    return (
        <div className="w-full px-4 sm:px-0 mt-2 mb-2 sm:mt-0 sm:mb-6">
            <h3 className="text-sm font-black text-gray-700 dark:text-white uppercase tracking-tight mb-4 sm:hidden">
                My Waitlist
            </h3>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                        <Calendar size={28} className="sm:size-32" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Currently in line</span>
                        <h4 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-none">
                            {heroEntry.service_name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                            Position: <span className="font-bold text-gray-900 dark:text-white">#{heroEntry.position || '1'} in line</span>
                        </p>
                    </div>
                </div>
                
                <button 
                    disabled
                    className="bg-gray-50 dark:bg-gray-700 text-gray-400 px-4 py-2.5 rounded-2xl text-[10px] font-black flex items-center gap-2 transition-all cursor-not-allowed uppercase tracking-widest"
                >
                    <Bell size={14} />
                    Enable Alerts
                </button>
            </div>
        </div>
    );
};

export default WaitlistHeroCard;
