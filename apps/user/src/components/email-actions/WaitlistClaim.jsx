import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Zap, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

/**
 * 📧 WaitlistClaim Component
 * Handles the "Claim Slot" landing from emails.
 * Enforces the 25-minute claim window.
 */
const WaitlistClaim = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const { user, loading: authLoading } = useAuth();

    // REDIRECT LOGIC: Removed for testing/standalone support
    // (In future, logged-in users might be handled differently)
    /*
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/patient/waitlist', { replace: true });
        }
    }, [user, authLoading, navigate]);
    */

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [claiming, setClaiming] = useState(false);

    // Initial load: fetch offer details using the claim token
    useEffect(() => {
        const fetchOffer = async () => {
            if (!token) { 
                setError('Waitlist claim token is missing.'); 
                setLoading(false); 
                return; 
            }
            try {
                // Verification endpoint returns the slot details if valid/not expired
                const data = await api.get(`/waitlist/offer?token=${token}`);
                setOffer(data.offer);
                setError(null);
            } catch (err) {
                setError(err.message || 'The claim window may have expired or the slot is already taken.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffer();
    }, [token]);

    const handleClaim = async () => {
        setClaiming(true);
        try {
            // Confirm the claim (books appt and handles cleanup)
            const result = await api.post(`/waitlist/confirm?token=${token}`);
            
            // Navigate to success receipt
            navigate('/email/confirmed', { 
                state: { 
                    appt: result.appointment, 
                    message: 'Slot claimed successfully! ✨',
                    isUser: !!user 
                },
                replace: true
            });
        } catch (err) {
            setError(err.message || 'Could not claim slot. It may have expired.');
            setClaiming(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Verifying Waitlist Offer...</p>
            </div>
        );
    }
    
    // Error state: Show expired/invalid message
    if (error && !offer) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-10 h-10 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-3 font-display">Claim Window Ended</h1>
                <p className="text-slate-500 mb-10 leading-relaxed text-sm">
                    Sorry! The <strong>25-minute claim window</strong> for this slot has closed, or the slot was already claimed by another patient on the waitlist.
                </p>
                <button 
                    onClick={() => navigate(user ? '/patient' : '/')} 
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    {user ? 'Go to My Dashboard' : 'Return Home'}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-12 px-6">
            <div className="bg-sky-50 border border-sky-100 rounded-[2.5rem] p-8 shadow-sm text-center relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                <div className="w-20 h-20 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sky-500/20 relative z-10 animate-bounce-slow">
                    <Zap size={36} fill="currentColor" />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display tracking-tight uppercase">Slot Available!</h1>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 text-[10px] font-extrabold rounded-full mb-10 border border-sky-200 uppercase tracking-widest shadow-inner">
                    <Clock size={14} className="animate-pulse" /> Expires in 25 Minutes
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 text-left space-y-6 mb-10 border border-sky-200/50 shadow-inner">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Service</p>
                        <p className="text-slate-900 font-bold text-xl">{offer.service}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">New Appointment Time</p>
                        <p className="text-sky-600 font-black text-3xl mb-1">{offer.displayTime}</p>
                        <p className="text-sm text-slate-500 font-medium">{offer.date}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                    <button 
                        onClick={handleClaim} 
                        disabled={claiming} 
                        className="w-full py-5 bg-sky-600 text-white font-black rounded-2xl shadow-[0_10px_30px_-10px_rgba(2,132,199,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(2,132,199,0.6)] hover:bg-sky-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95"
                    >
                        {claiming ? 'Claiming Your Slot...' : 'Claim This Slot Now'}
                    </button>
                    <p className="text-[10px] text-slate-400 px-6 leading-relaxed italic font-medium">
                        Quick action needed! By claiming this, your previous entry will be converted into a confirmed booking.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WaitlistClaim;
