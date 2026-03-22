import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useWaitlist from '../../hooks/useWaitlist';
import WaitlistCard from '../../components/user-booking/WaitlistCard';
import { AlertCircle, ClipboardList } from 'lucide-react';

const WaitlistManagementPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const {
        waitlist,
        loading: waitlistLoading,
        error,
        leaveWaitlist,
        acceptOffer,
        declineOffer,
    } = useWaitlist();
    const [loadingId, setLoadingId] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login?redirect=/dashboard/waitlist');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-slate-600'>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleRemove = async (waitlistId) => {
        setLoadingId(waitlistId);
        try {
            await leaveWaitlist(waitlistId);
            setMessage({ type: 'success', text: 'Removed from waitlist' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoadingId(null);
        }
    };

    const handleAccept = async (waitlistId) => {
        setLoadingId(waitlistId);
        try {
            const result = await acceptOffer(waitlistId, true);
            if (result.success) {
                setMessage({ type: 'success', text: 'Appointment confirmed!' });
                setTimeout(() => navigate('/dashboard'), 2000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoadingId(null);
        }
    };

    const handleDecline = async (waitlistId) => {
        setLoadingId(waitlistId);
        try {
            await declineOffer(waitlistId);
            setMessage({ type: 'success', text: 'Offer declined' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoadingId(null);
        }
    };

    const waitingCount = waitlist.filter((w) => w.status === 'WAITING').length;
    const offerPendingCount = waitlist.filter((w) => w.status === 'OFFER_PENDING').length;

    return (
        <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4'>
            <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center gap-3 mb-2'>
                        <ClipboardList
                            size={28}
                            className='text-sky-600'
                        />
                        <h1 className='text-3xl font-bold text-slate-900'>My Waitlist</h1>
                    </div>
                    <p className='text-slate-600'>
                        View and manage your waitlist entries. Accept offers before they expire!
                    </p>
                </div>

                {/* Status Cards */}
                {(waitingCount > 0 || offerPendingCount > 0) && (
                    <div className='grid grid-cols-2 gap-4 mb-8'>
                        <div className='bg-white rounded-lg p-4 border border-slate-200'>
                            <p className='text-sm text-slate-600'>Waiting in Queue</p>
                            <p className='text-2xl font-bold text-sky-600'>{waitingCount}</p>
                        </div>
                        <div className='bg-white rounded-lg p-4 border border-slate-200'>
                            <p className='text-sm text-slate-600'>Pending Offers</p>
                            <p className='text-2xl font-bold text-amber-600'>{offerPendingCount}</p>
                        </div>
                    </div>
                )}

                {/* Message Alert */}
                {message && (
                    <div
                        className={`rounded-lg p-4 mb-6 ${
                            message.type === 'success'
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3'>
                        <AlertCircle
                            size={20}
                            className='text-red-600 shrink-0 mt-0.5'
                        />
                        <div>
                            <p className='font-semibold text-red-900'>Error loading waitlist</p>
                            <p className='text-sm text-red-700'>{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {waitlistLoading ? (
                    <div className='text-center py-12'>
                        <div className='w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto'></div>
                        <p className='text-slate-600 mt-4'>Loading waitlist...</p>
                    </div>
                ) : waitlist.length === 0 ? (
                    <div className='bg-white rounded-lg p-8 text-center border border-slate-200'>
                        <ClipboardList
                            size={48}
                            className='mx-auto text-slate-300 mb-4'
                        />
                        <p className='text-slate-600 mb-4'>You're not on any waitlists</p>
                        <button
                            onClick={() => navigate('/dashboard/book')}
                            className='bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2.5 rounded-lg
                                       transition-colors shadow-lg shadow-sky-500/25'
                        >
                            Book an Appointment
                        </button>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {/* Pending Offers First */}
                        {waitlist
                            .filter((w) => w.status === 'OFFER_PENDING')
                            .map((entry) => (
                                <WaitlistCard
                                    key={entry.id}
                                    entry={entry}
                                    onRemove={handleRemove}
                                    onAccept={handleAccept}
                                    onDecline={handleDecline}
                                    loadingId={loadingId}
                                />
                            ))}

                        {/* Waiting Entries */}
                        {waitlist
                            .filter((w) => w.status === 'WAITING')
                            .map((entry) => (
                                <WaitlistCard
                                    key={entry.id}
                                    entry={entry}
                                    onRemove={handleRemove}
                                    onAccept={handleAccept}
                                    onDecline={handleDecline}
                                    loadingId={loadingId}
                                />
                            ))}
                    </div>
                )}

                {/* Info Box */}
                <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <p className='text-sm text-blue-800'>
                        <strong>💡 How it works:</strong> When a slot opens up on your preferred
                        date and time, you'll be notified immediately. You'll have 25 minutes to
                        accept the offer. If you don't respond, the slot goes to the next person on
                        the waitlist.
                    </p>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className='mt-8 text-slate-600 hover:text-slate-900 font-medium'
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default WaitlistManagementPage;
