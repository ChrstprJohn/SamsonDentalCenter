import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ConfirmAppointment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const { user, loading: authLoading } = useAuth();
    const [status, setStatus] = useState('verifying'); // verifying, error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const verify = async () => {
            if (authLoading) return; // Wait for auth to initialize
            if (!token) {
                setStatus('error');
                setErrorMsg('Missing confirmation token.');
                return;
            }

            try {
                // Call unified verification endpoint
                const data = await api.get(`/appointments/confirm?token=${token}`);
                
                // USER LOGIC: If logged in, skip the success lander and go to dashboard
                if (user) {
                    navigate('/patient', { 
                        replace: true, 
                        state: { message: 'Your appointment is confirmed! ✅' } 
                    });
                    return;
                }

                if (data.appointment) {
                    navigate(`/email/confirmed?id=${data.appointment.id}`, { replace: true });
                }
            } catch (err) {
                // If already confirmed and logged in, redirect to dashboard anyway
                if (err.response?.status === 409 && user) {
                    navigate('/patient', { replace: true });
                    return;
                }
                
                if (err.response?.status === 409) {
                    navigate('/email/already-confirmed', { replace: true });
                } else {
                    setStatus('error');
                    setErrorMsg(err.message || 'Invalid or expired link.');
                }
            }
        };
        verify();
    }, [token, user, authLoading, navigate]);

    if (status === 'error') {
        return <ConfirmError message={errorMsg} />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">Verifying Request</h1>
            <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">Verifying your email and sending request, please wait...</p>
        </div>
    );
};

const ConfirmError = ({ message }) => (
    <div className="text-center py-20 px-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 font-display">Verification Failed</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">{message}</p>
        <button onClick={() => window.location.href = '/'} className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
            Return Home
        </button>
    </div>
);

export default ConfirmAppointment;
