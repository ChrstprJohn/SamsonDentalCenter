import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, XCircle, Loader2 } from 'lucide-react';

const PatientDashboard = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await api.get('/appointments/my', token);
            setAppointments(data.appointments || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAppointments();
    }, [token]);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        
        setCancellingId(id);
        try {
            await api.patch(`/appointments/${id}/cancel`, { reason: 'Test cancellation' }, token);
            alert('Appointment cancelled! Waitlist should be notified now.');
            fetchAppointments(); // Refresh list
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-2" />
            <p className="text-slate-500">Loading your appointments...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Appointments</h1>
            
            {appointments.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">You don't have any appointments yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{appt.service?.name}</p>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {appt.appointment_date}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {appt.start_time}</span>
                                    </div>
                                    <p className="text-xs mt-1">
                                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                            appt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                                            appt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {appt.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            
                            {(appt.status === 'CONFIRMED' || appt.status === 'PENDING') && (
                                <button
                                    onClick={() => handleCancel(appt.id)}
                                    disabled={cancellingId === appt.id}
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {cancellingId === appt.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                    Cancel
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
