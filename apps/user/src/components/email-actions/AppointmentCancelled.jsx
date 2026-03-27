import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Home, ArrowRight, Calendar } from 'lucide-react';

const AppointmentCancelled = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Auth-aware logic: prefer active session, fallback to link state
    const isUser = !!user || state?.isUser;
    const appt = state?.appt;

    return (
        <div className="max-w-md mx-auto py-24 px-4 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Trash2 className="w-10 h-10 text-slate-400" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3 font-display tracking-tight">Canceled Successfully</h1>
            <p className="text-slate-500 mb-10 leading-relaxed max-w-sm mx-auto text-sm">
                We've processed your cancellation.{appt ? ` Your ${appt.service} session for ${appt.date} has been released.` : ''}
            </p>

            <div className="flex flex-col gap-3">
                {isUser ? (
                    <button 
                        onClick={() => navigate('/patient')}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Go to My Dashboard
                        <ArrowRight size={18} />
                    </button>
                ) : (
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-sky-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Return Home
                        <Home size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AppointmentCancelled;
