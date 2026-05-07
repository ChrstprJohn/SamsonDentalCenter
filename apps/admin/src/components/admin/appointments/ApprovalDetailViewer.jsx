import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../utils/api';
import { 
    ChevronLeft, 
    MessageSquare,
    Loader2,
    FileText
} from 'lucide-react';

// Reusing secretary-style sub-components for design consistency
import ReviewTimeline from '../patients/PatientDetail/RequestReview/ReviewTimeline';
import PatientProfileCard from '../patients/PatientDetail/RequestReview/PatientProfileCard';
import RecentHistoryList from '../patients/PatientDetail/RequestReview/RecentHistoryList';
import RequestDetailsCard from '../patients/PatientDetail/RequestReview/RequestDetailsCard';
import ConflictChecker from '../patients/PatientDetail/RequestReview/ConflictChecker';
import DecisionActions from '../patients/PatientDetail/RequestReview/DecisionActions';

/**
 * ApprovalDetailViewer [POLISHED - SECRETARY STYLE]
 * Redesigned to match the high-fidelity RequestReviewView aesthetic.
 * Removes tabs, uses a flexible height container, and places actions at the bottom.
 */
const ApprovalDetailViewer = ({ appointmentId, onBack, onStatusChange }) => {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (appointmentId) {
            fetchAggregatedData();
        }
    }, [appointmentId]);

    const fetchAggregatedData = async () => {
        try {
            setLoading(true);
            const result = await api.get(`/admin/appointments-approval/${appointmentId}/detail`, token);
            setData(result);
        } catch (err) {
            console.error('Failed to fetch approval details:', err);
            alert('Failed to load request context.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reason) => {
        try {
            setActionLoading(true);
            await api.patch(`/admin/appointments-approval/${appointmentId}/approve`, { note: reason }, token);
            showToast("Appointment Approved Successfully!", "success", "Approval Success");
            onStatusChange?.();
        } catch (err) {
            showToast(err.message || 'Approval failed', 'error', 'Error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (reason) => {
        try {
            setActionLoading(true);
            await api.patch(`/admin/appointments-approval/${appointmentId}/reject`, { reason }, token);
            showToast("Appointment Rejected Successfully.", "success", "Rejection Success");
            onStatusChange?.();
        } catch (err) {
            showToast(err.message || 'Rejection failed', 'error', 'Error');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl">
                <Loader2 className="animate-spin text-brand-500 mb-4" size={32} />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aggregating Context...</p>
            </div>
        );
    }

    if (!data || !data.appointment) return null;

    const { appointment, patientMetrics, doctorSchedule, dailyAppointments } = data;

    // Map metrics to the format expected by secretary components
    const patientStats = {
        completed: patientMetrics.completed_count,
        noShow: patientMetrics.no_show_count,
        cancelled: patientMetrics.total_bookings - patientMetrics.completed_count - patientMetrics.no_show_count,
    };

    // Format schedule for ConflictChecker
    const scheduleForChecker = {
        appointments: dailyAppointments,
        base_schedule: doctorSchedule
    };

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 font-outfit">
            {/* Header: Back Button & Title */}
            <div className="p-4 sm:p-6 lg:px-10 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent sticky top-0 z-20 backdrop-blur-md">
                <button 
                    onClick={onBack} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-500"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h4 className="text-sm sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        Review Approval Request
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Verify Patient Integrity & Provider Availability
                    </p>
                </div>
            </div>

            {/* Content Container: Flexible Height */}
            <div className="p-4 sm:p-6 lg:p-10 space-y-10 min-h-[400px] max-h-none overflow-visible">
                
                {/* 1. Timeline */}
                <ReviewTimeline 
                    createdAt={appointment.created_at} 
                    status={appointment.status} 
                    updatedAt={appointment.updated_at} 
                />

                {/* 2. Main Grid Layout (Secretary Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column: Profile & Details */}
                    <div className="space-y-10">
                        <PatientProfileCard 
                            patient={appointment.patient || { 
                                full_name: appointment.guest_name, 
                                email: appointment.guest_email, 
                                phone: appointment.guest_phone 
                            }}
                            stats={patientStats}
                        />
                        
                        <RequestDetailsCard 
                            appointment={appointment}
                        />

                        {/* Patient Request Notes */}
                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01] space-y-3">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare size={14} /> Patient Request Notes
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 italic font-medium leading-relaxed">
                                {appointment.notes || "The patient did not provide any specific notes for this booking."}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Attendance History */}
                    <RecentHistoryList 
                        history={data.patientHistory || []} 
                        loading={loading}
                    />
                </div>

                {/* 3. Conflict Checker (Full Width) */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <ConflictChecker 
                        schedule={scheduleForChecker}
                        requestedSlot={{ start: appointment.start_time, end: appointment.end_time }}
                        loading={loading}
                    />
                </div>

                {/* 4. Decision Actions (At the bottom, not fixed) */}
                <div className="pt-10">
                    <DecisionActions 
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onCancel={onBack}
                        actionLoading={actionLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default ApprovalDetailViewer;
