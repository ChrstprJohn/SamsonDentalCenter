import { AppError } from '../utils/errors.js';
import { supabaseAdmin } from '../config/supabase.js';
import { APPOINTMENT_STATUS, APPROVAL_STATUS } from '../utils/constants.js';
import { sendBookingSuccessEmail, sendBookingRejectedEmail } from './email-confirmation.service.js';
import { sendApprovalNotice, sendRejectionNotice } from './notification.service.js';
import { voidWaitlistForApprovedAppointment, notifyWaitlist } from './waitlist.service.js';

/**
 * Fetch aggregated context for a specialized appointment approval.
 * Includes: profile, historical metrics, and real-time conflict scanning.
 */
export const getAggregatedApprovalDetails = async (appointmentId) => {
    // 1. Fetch the base appointment with basic relations
    const { data: appointment, error: fetchErr } = await supabaseAdmin
        .from('appointments')
        .select(`
            *,
            patient:profiles!patient_id(*),
            service:services(name, tier),
            dentist:dentists(id, profile:profiles(id, full_name, first_name, last_name, middle_name, suffix))
        `)
        .eq('id', appointmentId)
        .single();

    if (fetchErr || !appointment) {
        throw new AppError('Appointment request not found.', 404);
    }

    // ── FALLBACK: Ensure patient profile is resolved even if join failed ──
    if (!appointment.patient && appointment.patient_id) {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, email, phone, primary_profile_id, is_registered')
            .eq('id', appointment.patient_id)
            .single();
        appointment.patient = profile;
    }

    // 2. Calculate Patient Reliability Metrics
    let patientMetrics = {
        total_bookings: 0,
        completed_count: 0,
        no_show_count: 0,
        cancellation_count: 0,
        reliability_score: 100
    };

    let patientHistory = [];
    if (appointment.patient_id) {
        const { data: history } = await supabaseAdmin
            .from('appointments')
            .select(`
                id, appointment_date, start_time, end_time, status, 
                service:services(name),
                dentist:dentists(profile:profiles(full_name))
            `)
            .eq('patient_id', appointment.patient_id)
            .neq('id', appointmentId)
            .order('appointment_date', { ascending: false })
            .limit(10);

        patientHistory = history || [];
        if (patientHistory.length > 0) {
            patientMetrics.total_bookings = patientHistory.length;
            patientMetrics.completed_count = patientHistory.filter(a => a.status === 'COMPLETED').length;
            patientMetrics.no_show_count = patientHistory.filter(a => a.status === 'NO_SHOW').length;
            patientMetrics.cancellation_count = patientHistory.filter(a => ['CANCELLED', 'LATE_CANCEL'].includes(a.status)).length;

            // Simple weighted reliability score
            const penalty = (patientMetrics.no_show_count * 30) + (patientMetrics.cancellation_count * 10);
            patientMetrics.reliability_score = Math.max(0, 100 - penalty);
        }
    }

    // 3. Real-time Schedule & Conflict Scanning
    let doctorSchedule = null;
    let dailyAppointments = [];
    let patientDailyAppointments = [];
    let conflicts = [];

    if (appointment.dentist_id) {
        const appointmentDate = new Date(appointment.appointment_date);
        const dayOfWeek = appointmentDate.getDay(); // 0=Sunday, 1=Monday...

        // A. Fetch Doctor's Working Hours
        const { data: schedule } = await supabaseAdmin
            .from('dentist_schedule')
            .select('*')
            .eq('dentist_id', appointment.dentist_id)
            .eq('day_of_week', dayOfWeek)
            .single();

        if (schedule) {
            if (schedule.is_using_global) {
                // Inherit from Clinic Schedule
                const { data: clinicSched } = await supabaseAdmin
                    .from('clinic_schedule')
                    .select('*')
                    .eq('day_of_week', dayOfWeek)
                    .single();

                if (clinicSched) {
                    doctorSchedule = {
                        start_time: clinicSched.open_time,
                        end_time: clinicSched.close_time,
                        break_start: clinicSched.lunch_start_time,
                        break_end: clinicSched.lunch_end_time,
                        is_working: clinicSched.is_open
                    };
                }
            } else {
                doctorSchedule = {
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    break_start: schedule.break_start_time,
                    break_end: schedule.break_end_time,
                    is_working: schedule.is_working
                };
            }
        }

        // B. Fetch All Confirmed Appointments for that day
        const { data: dayAppts } = await supabaseAdmin
            .from('appointments')
            .select(`
                id, start_time, end_time, status,
                patient:profiles!patient_id(full_name),
                service:services(name)
            `)
            .eq('dentist_id', appointment.dentist_id)
            .eq('appointment_date', appointment.appointment_date)
            .in('status', ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']);

        dailyAppointments = dayAppts || [];

        // C. Fetch All Appointments for that Patient for that day
        const { data: patientDayAppts } = await supabaseAdmin
            .from('appointments')
            .select(`
                id, start_time, end_time, status,
                service:services(name),
                dentist:dentists(profile:profiles(full_name))
            `)
            .eq('patient_id', appointment.patient_id)
            .eq('appointment_date', appointment.appointment_date)
            .neq('id', appointmentId);

        patientDailyAppointments = patientDayAppts || [];

        // D. Identify specific conflicts
        conflicts = dailyAppointments.filter(a =>
            a.status === 'CONFIRMED' &&
            a.id !== appointmentId &&
            a.start_time < appointment.end_time &&
            a.end_time > appointment.start_time
        );
    }

    return {
        appointment,
        patientMetrics,
        patientHistory,
        conflicts,
        doctorSchedule,
        dailyAppointments,
        patientDailyAppointments,
        is_clear: conflicts.length === 0
    };
};

/**
 * Approve a specialized request.
 */
export const approveAppointment = async (appointmentId, adminId, dentistId = null, note = null) => {
    // 1. Validate current state
    const { data: appointment } = await supabaseAdmin
        .from('appointments')
        .select('*, patient:profiles!patient_id(full_name, email, phone)')
        .eq('id', appointmentId)
        .single();

    if (!appointment || appointment.status !== 'PENDING') {
        throw new AppError('This request is no longer in a pending state.', 400);
    }

    const finalDentistId = dentistId || appointment.dentist_id;
    if (!finalDentistId) {
        throw new AppError('A dentist must be assigned to approve this request.', 400);
    }

    // 2. Perform Transactional Update
    const { data: updated, error: updateErr } = await supabaseAdmin
        .from('appointments')
        .update({
            status: 'CONFIRMED',
            approval_status: 'approved',
            dentist_id: finalDentistId,
            approved_by: adminId,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select(`
            *,
            patient:profiles!patient_id(id, full_name, email, phone, primary_profile_id, is_registered),
            service:services(name, price),
            dentist:dentists(id, profile:profiles(full_name))
        `)
        .single();

    if (updateErr) throw new AppError(updateErr.message, 500);

    // ── 4. Notify Primary for Dependents ──
    let targetPatient = updated.patient;
    if (!targetPatient?.primary_profile_id && updated.patient_id) {
        const { data: latestProfile } = await supabaseAdmin
            .from('profiles')
            .select('id, primary_profile_id, is_registered')
            .eq('id', updated.patient_id)
            .single();
        if (latestProfile) targetPatient = latestProfile;
    }

    const isDependent = !!(targetPatient?.primary_profile_id && !targetPatient?.is_registered);
    const notifyUserId = isDependent ? targetPatient.primary_profile_id : updated.patient_id;
    
    // Fetch Primary Email if needed
    let recipientEmail = updated.patient?.email || updated.guest_email;
    if (!recipientEmail && isDependent) {
        const { data: primary } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('id', targetPatient.primary_profile_id)
            .single();
        recipientEmail = primary?.email;
    }

    const notificationLog = { email: 'SKIPPED', inApp: 'SKIPPED' };
    console.log(`[ApprovalService] Routing: User ${notifyUserId} (isDep: ${isDependent}), Email: ${recipientEmail}`);

    // Channel 1: Email
    try {
        if (recipientEmail) {
            const emailResult = await sendBookingSuccessEmail(
                recipientEmail,
                updated.patient?.full_name || updated.guest_name,
                {
                    appointmentId: updated.id,
                    date: updated.appointment_date,
                    start_time: updated.start_time,
                    end_time: updated.end_time,
                    service: updated.service?.name,
                    dentist: updated.dentist?.profile?.full_name,
                    note: note
                }
            );
            notificationLog.email = emailResult.success ? 'SUCCESS' : `FAILED: ${emailResult.error}`;
            console.log(`[ApprovalService] Email result: ${notificationLog.email}`);
        } else {
            notificationLog.email = 'MISSING_RECIPIENT';
            console.warn(`[ApprovalService] No email found for appointment ${updated.id}`);
        }
    } catch (err) {
        notificationLog.email = `CRASH: ${err.message}`;
        console.error('[ApprovalService] Email Block Crash:', err);
    }

    // Channel 2: In-App
    try {
        if (notifyUserId) {
            const notifyResult = await sendApprovalNotice(notifyUserId, {
                date: updated.appointment_date,
                start_time: updated.start_time,
                end_time: updated.end_time,
                service: updated.service?.name,
                patient_name: updated.patient?.full_name || updated.guest_name
            }, updated.patient?.phone || updated.guest_phone);
            notificationLog.inApp = !!notifyResult.inAppResult ? 'SUCCESS' : 'FAILED';
            console.log(`[ApprovalService] In-App result: ${notificationLog.inApp}`);
        } else {
            notificationLog.inApp = 'SKIPPED_GUEST_OR_WALKIN';
            console.log('[ApprovalService] Skipping In-App: No notifyUserId (Guest or Walk-in)');
        }
    } catch (err) {
        notificationLog.inApp = `CRASH: ${err.message}`;
        console.error('[ApprovalService] In-App Block Crash:', err);
    }

    // Cleanup: Waitlist
    try {
        await voidWaitlistForApprovedAppointment(appointmentId, {
            date: updated.appointment_date,
            start_time: updated.start_time,
            service: updated.service?.name
        });
    } catch (err) {
        console.warn('[ApprovalService] Waitlist cleanup failed:', err.message);
    }

    return { ...updated, notification_log: notificationLog };
};

/**
 * Reject a specialized request with a reason.
 */
export const rejectAppointment = async (appointmentId, adminId, reason) => {
    // 1. Validate
    const { data: appointment } = await supabaseAdmin
        .from('appointments')
        .select('*, patient:profiles!patient_id(full_name, email)')
        .eq('id', appointmentId)
        .single();

    if (!appointment || appointment.status !== 'PENDING') {
        throw new AppError('This request is no longer in a pending state.', 400);
    }

    // 2. Update to REJECTED (maps to CANCELLED in status for slot freeing)
    const { data: updated, error } = await supabaseAdmin
        .from('appointments')
        .update({
            status: 'CANCELLED',
            approval_status: 'rejected',
            rejection_reason: reason,
            approved_by: adminId,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select(`
            *,
            patient:profiles!patient_id(id, full_name, email, phone, primary_profile_id, is_registered),
            service:services(name)
        `)
        .single();

    if (error) throw new AppError(error.message, 500);

    // 3. Notify Primary for Dependents
    let targetPatient = updated.patient;
    if (!targetPatient?.primary_profile_id && updated.patient_id) {
        const { data: latestProfile } = await supabaseAdmin
            .from('profiles')
            .select('id, primary_profile_id, is_registered')
            .eq('id', updated.patient_id)
            .single();
        if (latestProfile) targetPatient = latestProfile;
    }

    const isDependent = !!(targetPatient?.primary_profile_id && !targetPatient?.is_registered);
    const notifyUserId = isDependent ? targetPatient.primary_profile_id : updated.patient_id;
    
    // Fetch Primary Email if needed
    let recipientEmail = updated.patient?.email || updated.guest_email;
    if (!recipientEmail && isDependent) {
        const { data: primary } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('id', targetPatient.primary_profile_id)
            .single();
        recipientEmail = primary?.email;
    }

    const notificationLog = { email: 'SKIPPED', inApp: 'SKIPPED' };
    console.log(`[RejectionService] Routing: User ${notifyUserId} (isDep: ${isDependent}), Email: ${recipientEmail}`);

    // Channel 1: Email
    try {
        if (recipientEmail) {
            const emailResult = await sendBookingRejectedEmail(
                recipientEmail, 
                updated.patient?.full_name || updated.guest_name, 
                {
                    service: updated.service?.name,
                    reason: reason,
                    date: updated.appointment_date,
                    start_time: updated.start_time
                }
            );
            notificationLog.email = emailResult.success ? 'SUCCESS' : `FAILED: ${emailResult.error}`;
            console.log(`[RejectionService] Email result: ${notificationLog.email}`);
        } else {
            notificationLog.email = 'MISSING_RECIPIENT';
            console.warn(`[RejectionService] No email found for rejection notice ${updated.id}`);
        }
    } catch (err) {
        notificationLog.email = `CRASH: ${err.message}`;
        console.error('[RejectionService] Email Block Crash:', err);
    }

    // Channel 2: In-App
    try {
        if (notifyUserId) {
            const notifyResult = await sendRejectionNotice(notifyUserId, {
                date: updated.appointment_date,
                start_time: updated.start_time,
                end_time: updated.end_time,
                service: updated.service?.name,
                patient_name: updated.patient?.full_name || updated.guest_name
            }, reason);
            notificationLog.inApp = !!notifyResult ? 'SUCCESS' : 'FAILED';
            console.log(`[RejectionService] In-App result: ${notificationLog.inApp}`);
        } else {
            notificationLog.inApp = 'SKIPPED_GUEST_OR_WALKIN';
            console.log('[RejectionService] Skipping In-App: No notifyUserId (Guest or Walk-in)');
        }
    } catch (err) {
        notificationLog.inApp = `CRASH: ${err.message}`;
        console.error('[RejectionService] In-App Block Crash:', err);
    }

    // Trigger waitlist notification
    try {
        await notifyWaitlist({
            date: updated.appointment_date,
            start_time: updated.start_time,
            end_time: updated.end_time,
            service_id: updated.service_id,
        });
    } catch (e) {
        console.warn('[RejectionService] Waitlist notification failed:', e.message);
    }

    return { ...updated, notification_log: notificationLog };
};
