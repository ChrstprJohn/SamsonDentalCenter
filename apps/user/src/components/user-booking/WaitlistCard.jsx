import { Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

import { Trash2, Clock, CheckCircle, AlertCircle, Lock, Calendar, Plus } from 'lucide-react';

const WaitlistCard = ({ entry, onRemove, onAccept, onDecline, loadingId }) => {
    const isOfferPending = entry.status === 'OFFER_PENDING';
    const timeLeftMs = new Date(entry.offer_expires_at) - new Date();
    const minutesLeft = Math.ceil(timeLeftMs / 1000 / 60);

    return (
        <div className={`bg-amber-50/20 rounded-[32px] border border-amber-100/50 p-8 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden ${isOfferPending ? 'ring-2 ring-amber-400 border-transparent shadow-xl shadow-amber-100/50' : ''}`}>
            {/* Lock Icon Overlay / Status Indicator */}
            <div className="absolute top-8 right-8 text-amber-300 group-hover:text-amber-500 transition-colors">
                <Lock size={18} />
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/60 text-amber-700 text-[10px] font-black uppercase tracking-[0.1em] rounded-lg mb-4">
                {isOfferPending ? <AlertCircle size={12} /> : <Clock size={12} />}
                {isOfferPending ? 'Offer Pending' : 'Active Waitlist'}
            </div>

            {/* Main Content */}
            <div className="mb-8">
                <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight group-hover:text-amber-700 transition-colors">
                    {entry.service_name || entry.service?.name || 'Teeth Whitening Session'}
                </h3>
                <p className="text-sm font-bold text-slate-400">
                    Requested for: {entry.preferred_date || 'Any Morning Slot'}
                </p>
            </div>

            {/* Offer Timer Section */}
            {isOfferPending && (
                <div className="bg-amber-100/40 rounded-2xl p-4 mb-6 border border-amber-100">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-800 uppercase tracking-widest">Time Remaining</span>
                        <span className="text-xl font-black text-amber-600 animate-pulse">{minutesLeft > 0 ? `${minutesLeft} min` : 'Expired'}</span>
                    </div>
                </div>
            )}

            {/* Position Footer */}
            <div className="pt-6 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
                <div className="flex items-center gap-2">
                    <span className="opacity-50 text-[14px]">⌛</span>
                    Position: <span className="font-black">#{entry.position || '2'} in queue</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                    Added {new Date(entry.joined_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
            </div>

            {/* Action Buttons for Offer Pending */}
            {isOfferPending && (
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={() => onAccept(entry.id)}
                        disabled={loadingId === entry.id}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-amber-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Accept Slot
                    </button>
                    <button
                        onClick={() => onDecline(entry.id)}
                        disabled={loadingId === entry.id}
                        className="px-6 py-4 border-2 border-amber-200 text-amber-700 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Decline
                    </button>
                </div>
            )}

            {/* Delete Option (Visible on Hover for Waiting) */}
            {!isOfferPending && (
                <button
                    onClick={() => onRemove(entry.id)}
                    disabled={loadingId === entry.id}
                    className="absolute bottom-4 right-4 p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    );
};

export default WaitlistCard;
