import { CheckCircle2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppointmentAlreadyConfirmed = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto py-24 px-4 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3 font-display tracking-tight">Already Confirmed!</h1>
            <p className="text-slate-500 mb-10 leading-relaxed max-w-sm mx-auto">
                No further action is needed. This appointment has already been confirmed and is secured on our schedule.
            </p>

            <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
                <Home size={18} />
                Return to Homepage
            </button>
        </div>
    );
};

export default AppointmentAlreadyConfirmed;
