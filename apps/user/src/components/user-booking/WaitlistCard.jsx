import { Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const WaitlistCard = ({ entry, onRemove, onAccept, onDecline, loadingId }) => {
    const isOfferPending = entry.status === 'OFFER_PENDING';
    const timeLeftMs = new Date(entry.offer_expires_at) - new Date();
    const minutesLeft = Math.ceil(timeLeftMs / 1000 / 60);

    return (
        <div className='border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <h3 className='font-semibold text-slate-900'>{entry.service_name}</h3>
                    <p className='text-sm text-slate-600'>
                        {entry.preferred_date} at {entry.preferred_time}
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    {entry.status === 'WAITING' && (
                        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium'>
                            <Clock size={12} />
                            Waiting
                        </span>
                    )}
                    {isOfferPending && (
                        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium'>
                            <AlertCircle size={12} />
                            Offer Pending
                        </span>
                    )}
                </div>
            </div>

            {entry.status === 'WAITING' && (
                <div className='bg-slate-50 rounded-lg p-3 mb-4'>
                    <p className='text-sm text-slate-700'>
                        Position: <span className='font-bold text-sky-600'>#{entry.position}</span>
                    </p>
                    <p className='text-xs text-slate-500 mt-1'>
                        Joined {new Date(entry.joined_at).toLocaleDateString()}
                    </p>
                </div>
            )}

            {isOfferPending && (
                <div className='bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4'>
                    <p className='text-sm font-semibold text-amber-900 mb-2'>⏰ Offer expires in</p>
                    <p className='text-2xl font-bold text-amber-600'>
                        {minutesLeft > 0 ? `${minutesLeft} min` : 'Expired'}
                    </p>
                </div>
            )}

            <div className='flex gap-2 flex-wrap'>
                {entry.status === 'WAITING' && (
                    <button
                        onClick={() => onRemove(entry.id)}
                        disabled={loadingId === entry.id}
                        className='flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium
                                   px-3 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50'
                    >
                        <Trash2 size={16} />
                        Remove
                    </button>
                )}

                {isOfferPending && (
                    <>
                        <button
                            onClick={() => onDecline(entry.id)}
                            disabled={loadingId === entry.id}
                            className='flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg
                                       hover:bg-slate-50 font-medium text-sm transition-colors disabled:opacity-50'
                        >
                            Decline
                        </button>
                        <button
                            onClick={() => onAccept(entry.id)}
                            disabled={loadingId === entry.id}
                            className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600
                                       text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50
                                       shadow-lg shadow-emerald-500/25'
                        >
                            <CheckCircle size={16} />
                            Accept
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default WaitlistCard;
