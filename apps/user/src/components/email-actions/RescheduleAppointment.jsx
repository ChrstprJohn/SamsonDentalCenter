import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, RefreshCcw, ArrowRight, AlertTriangle } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import useSlots from '../../hooks/useSlots';
import useSlotHold from '../../hooks/useSlotHold';

// ⚙️ Constant for Hold Duration (5 Minutes)
const RESCHEDULE_HOLD_MS = 300000; 

const RescheduleAppointment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const { user, loading: authLoading } = useAuth();

    // REDIRECT LOGIC: If user is logged in, redirect to dashboard reschedule flow
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/patient', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const [currentAppt, setCurrentAppt] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [rescheduling, setRescheduling] = useState(false);
    const [error, setError] = useState(null);

    // Initial load: fetch current appt details via token
    useEffect(() => {
        const fetchInfo = async () => {
            if (!token) { setError('Missing rescheduling token.'); return; }
            try {
                const data = await api.get(`/appointments/guest/reschedule?token=${token}`);
                setCurrentAppt(data.current_appointment);
                setSelectedDate(data.current_appointment.date);
            } catch (err) { setError(err.message || 'Invalid or expired link.'); }
        };
        fetchInfo();
    }, [token]);

    // ✅ Slot Hold Protection (mirrors booking wizard)
    const slotHold = useSlotHold('reschedule-session'); 

    // Dynamic slot fetching
    const { slots, loading: slotsLoading } = useSlots(selectedDate, currentAppt?.service_id);

    const handleSlotClick = async (slot) => {
        const isAvailable = slot.available > 0 || (slotHold.activeHold?.time === slot.rawTime);
        if (!isAvailable) return;

        // ✅ Hold logic (protected for 5 mins)
        try {
            const holdSuccess = await slotHold.holdSlot(selectedDate, slot.rawTime, currentAppt.service_id);
            if (holdSuccess) {
                setSelectedTime(slot.rawTime);
                setError(null);
            } else {
                setError('This slot was just taken. Please pick another.');
            }
        } catch (err) {
            setError('Failed to hold slot. Try again.');
        }
    };

    const handleConfirm = async () => {
        setRescheduling(true);
        try {
            const data = await api.post(`/appointments/guest/reschedule?token=${token}`, {
                date: selectedDate,
                time: selectedTime,
            });
            slotHold.clearHold(); // Release hold on success
            navigate('/email/rescheduled', { 
                state: { 
                    newAppt: data.new_appointment,
                    isUser: !!data.user 
                },
                replace: true
            });
        } catch (err) {
            setError(err.message || 'Failed to move appointment.');
            setRescheduling(false);
        }
    };

    if (error && !currentAppt) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">Link Invalid</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
                <button onClick={() => navigate('/')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">
                    Return Home
                </button>
            </div>
        );
    }

    if (!currentAppt) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading rescheduling interface...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display flex items-center gap-3">
                    <RefreshCcw className="text-sky-500 w-8 h-8" /> Reschedule Session
                </h1>
                <p className="text-slate-500">Pick a new time for your <strong>{currentAppt.service}</strong> appointment.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start mb-12">
                {/* Date Selection */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block">1. Select New Date</label>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        min={new Date().toISOString().split('T')[0]} 
                        onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-slate-900 outline-none" 
                    />
                </div>

                {/* Time Selection */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block">2. Select New Time</label>
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                        {slotsLoading ? (
                            <div className="col-span-2 text-center py-10 text-slate-400 font-medium animate-pulse">Checking availability...</div>
                        ) : slots.length === 0 ? (
                            <div className="col-span-2 text-center py-10 text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">No slots available for this day.</div>
                        ) : (
                             slots.map(s => {
                                const isHeldByMe = slotHold.activeHold?.time === s.rawTime;
                                const isAvailable = s.available > 0 || isHeldByMe;
                                
                                return (
                                    <button 
                                        key={s.rawTime} 
                                        onClick={() => handleSlotClick(s)}
                                        disabled={!isAvailable}
                                        className={`py-4 px-3 rounded-2xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                                            selectedTime === s.rawTime ? 'bg-slate-900 text-white shadow-lg ring-4 ring-slate-900/10' : 
                                            (isAvailable ? 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-600 border border-slate-100' : 'bg-slate-100 text-slate-300 cursor-not-allowed')
                                        }`}
                                    >
                                        {s.displayTime}
                                        {isAvailable && <span className="text-[9px] opacity-70">{s.available} left</span>}
                                    </button>
                                );
                             })
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle size={18} /> {error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/5 p-6 rounded-3xl border border-slate-900/5">
                <div className="flex items-center gap-3">
                    {slotHold.activeHold ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                             <Clock size={14} className="animate-spin-slow" /> Slot held for 5 mins
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 font-medium italic">Select a new slot to protect it from others.</p>
                    )}
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => navigate(-1)} className="flex-1 sm:flex-initial px-8 py-4 bg-white border border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all">Cancel</button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={!selectedTime || rescheduling} 
                        className="flex-1 sm:flex-initial px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                    >
                        {rescheduling ? 'Moving Appointment...' : 'Confirm Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAppointment;
