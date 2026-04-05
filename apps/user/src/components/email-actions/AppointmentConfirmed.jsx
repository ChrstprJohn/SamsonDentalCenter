import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AppointmentConfirmed = () => {
    const [searchParams] = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    // REDIRECT LOGIC: If user is logged in, they don't need the public landing page
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/patient', { replace: true });
        }
    }, [user, authLoading, navigate]);

    if (authLoading) return null; // Wait for auth to decide

    const apptId = searchParams.get('id');

    return (
        <div className="max-w-md mx-auto py-20 px-4 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm scale-in duration-500">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3 font-display tracking-tight">Verification Confirmed!</h1>
            <p className="text-slate-500 mb-10 leading-relaxed max-w-sm mx-auto">
                We've verified your email and received your booking request. Our team will review it and send a final confirmation once approved.
            </p>

            {apptId && (
                <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-slate-400" size={18} />
                        <span className="text-sm font-semibold text-slate-600">Appointment ID</span>
                    </div>
                    <span className="text-sm font-mono text-slate-900 font-bold tracking-wider">
                        #{apptId.slice(0, 8).toUpperCase()}
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <button 
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-sky-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    Return Home
                    <Home size={18} />
                </button>
            </div>
        </div>
    );
};

export default AppointmentConfirmed;
