import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CancelAppointment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const { user, loading: authLoading } = useAuth();

    // REDIRECT LOGIC: If user is logged in, redirect to dashboard management
    useEffect(() => {
        if (!authLoading && user) {
            // Future-proofing: could redirect to /patient/appointments/:id
            navigate('/patient', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const [appt, setAppt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!token) {
                setError('Missing cancellation token.');
                setLoading(false);
                return;
            }
            try {
                const data = await api.get(`/appointments/guest/cancel?token=${token}`);
                setAppt(data.appointment);
            } catch (err) {
                setError(err.message || 'Invalid or expired link.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [token]);

    const handleCancel = async () => {
        setCancelling(true);
        try {
            await api.post(`/appointments/guest/cancel?token=${token}`);
            navigate('/email/cancelled', { 
                state: { 
                    appt, 
                    isUser: !!user 
                },
                replace: true 
            });
        } catch (err) {
            setError(err.message || 'Failed to cancel appointment.');
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-red-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading appointment details...</p>
            </div>
        );
    }

    if (error && !appt) {
        return (
            <div className="text-center py-20 px-4 max-w-md mx-auto">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">Link Invalid</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
                <button onClick={() => navigate('/')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-12 px-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Trash2 className="text-red-500" size={36} />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-3 font-display tracking-tight">Cancel Appointment?</h1>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    Are you sure you want to cancel your session for <span className="font-bold text-slate-700">{appt.service}</span>? This action is permanent.
                </p>

                <div className="bg-slate-50 rounded-2xl p-5 text-left space-y-3 mb-10 border border-slate-100/50">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 uppercase font-bold tracking-widest">Date</span>
                        <span className="text-slate-900 font-bold">{appt.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 uppercase font-bold tracking-widest">Time Slot</span>
                        <span className="text-slate-900 font-bold">{appt.time}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleCancel} 
                        disabled={cancelling} 
                        className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                        {cancelling ? 'Processing...' : 'Yes, Cancel Appointment'}
                    </button>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} /> Nevermind, Keep It
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelAppointment;
