import { useAuth } from '../../context/AuthContext';
import { RefreshCcw, Home, ArrowRight, Calendar } from 'lucide-react';

const AppointmentRescheduled = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Auth-aware logic: prefer active session, fallback to link state
    const isUser = !!user || state?.isUser;
    const newAppt = state?.newAppt;

    return (
        <div className="max-w-md mx-auto py-24 px-4 text-center">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm scale-in duration-500">
                <RefreshCcw className="w-10 h-10 text-sky-500" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3 font-display tracking-tight">Moved Successfully!</h1>
            <p className="text-slate-500 mb-10 leading-relaxed max-w-sm mx-auto text-sm">
                Your appointment has been rescheduled. We've sent a new confirmation email with your updated time.
            </p>

            {newAppt && (
                <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 uppercase font-bold tracking-widest">New Date</span>
                        <span className="text-slate-900 font-bold">{newAppt.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 uppercase font-bold tracking-widest">New Time</span>
                        <span className="text-sky-600 font-extrabold">{newAppt.time}</span>
                    </div>
                </div>
            )}

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
                        className="w-full flex items-center justify-center gap-2 py-4 bg-sky-50 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Return Home
                        <Home size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AppointmentRescheduled;
