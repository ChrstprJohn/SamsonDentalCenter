import {
    bookAppointment,
    getPatientAppointments,
    getAppointmentById,
    bookAppointmentGuest,
    cancelAppointment,
    rescheduleAppointment,
} from '../services/appointment.service.js';
import {
    confirmAppointmentByToken,
    resendConfirmationEmail,
    validateGuestActionToken,
    markGuestTokenUsed,
    sendCancellationEmail,
} from '../services/email-confirmation.service.js';
import { notifyWaitlist } from '../services/waitlist.service.js';
import { holdSlot, releaseHold } from '../services/slot-hold.service.js';
import { getTodayPH } from '../utils/timezone.js';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * POST /api/appointments/book-guest
 * Body: { service_id, date, time, email, phone, full_name }
 *
 * Creates appointment as PENDING and sends confirmation email.
 * @param {string} service_id - Service UUID
 * @param {string} date - Appointment date 'YYYY-MM-DD'
 * @param {string} time - Appointment time 'HH:MM'
 * @param {string} email - Guest email address
 * @param {string} phone - Guest phone number
 * @param {string} full_name - Guest full name
 */
export const bookGuest = async (req, res) => {
    try {
        const { service_id, date, time, email, phone, full_name, user_session_id } = req.body;

        // Validation
        if (!service_id || !date || !time || !email || !full_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await bookAppointmentGuest(
            service_id,
            date,
            time,
            email,
            phone,
            full_name,
            user_session_id,
        );
        return res.status(result.booked ? 201 : 409).json(result);
    } catch (err) {
        console.error('Guest booking error:', err);
        return res.status(err.status || 500).json({ error: err.message });
    }
};

/**
 * GET /api/appointments/confirm-email?token=xxx
 * Public endpoint — guest clicks the email link.
 * Validates token → updates appointment status to CONFIRMED.
 *
 * Option A: Return JSON (if frontend handles the redirect)
 * Option B: Redirect to frontend success/error page
 */
export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: 'Missing confirmation token.' });
        }

        const result = await confirmAppointmentByToken(token);

        // Return JSON — frontend (React Router) handles the navigation
        return res.json(result);
    } catch (err) {
        console.error('Email confirmation error:', err);
        return res.status(err.status || 500).json({ error: err.message });
    }
};

/**
 * POST /api/appointments/resend-confirmation
 * Body: { appointment_id, email }
 * Public endpoint — guest can request a new confirmation email.
 */
export const resendConfirmation = async (req, res) => {
    try {
        const { appointment_id, email } = req.body;

        if (!appointment_id || !email) {
            return res.status(400).json({ error: 'appointment_id and email are required.' });
        }

        const result = await resendConfirmationEmail(appointment_id, email);
        return res.json(result);
    } catch (err) {
        console.error('Resend confirmation error:', err);
        return res.status(err.status || 500).json({ error: err.message });
    }
};

/**
 * POST /api/appointments/book-user
 * Body: { service_id, date, time, booked_for_name? }
 *
 * booked_for_name is optional.
 * - Omit or null  → booking for self (uses account name)
 * - Provide a name → booking for someone else (stored in booked_for_name column)
 */
export const bookUser = async (req, res, next) => {
    try {
        const { service_id, date, time, booked_for_name, user_session_id } = req.body;

        // ── Validate ──
        if (!service_id || !date || !time) {
            return res.status(400).json({
                error: 'service_id, date, and time are required.',
                example: { service_id: 'uuid', date: '2026-03-02', time: '09:00' },
            });
        }

        // Check date is in the future (using Philippine Time)
        const todayPH = getTodayPH();
        if (date < todayPH) {
            return res.status(400).json({ error: 'Cannot book appointments in the past.' });
        }

        // ── Book it ──
        const result = await bookAppointment(
            req.user.id,
            service_id,
            date,
            time,
            true, // sendEmail
            booked_for_name?.trim() || null, // null = for self, name = for someone else
            user_session_id,
        );

        if (result.booked) {
            res.status(201).json(result);
        } else {
            // Slot was not available — return alternatives
            res.status(200).json(result);
        }
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

/**
 * POST /api/appointments/submit-wizard
 * Atomic submission for User Booking Wizard.
 * Body: {
 *   service_id,
 *   booking: { date, time, booked_for_name, user_session_id },
 *   waitlist: { date, time, priority }
 * }
 */
export const submitWizard = async (req, res, next) => {
    try {
        const { service_id, booking, waitlist } = req.body;
        const results = { booking: null, waitlist: null };

        if (!service_id) {
            return res.status(400).json({ error: 'service_id is required.' });
        }

        // 1. Process Booking if requested
        if (booking && booking.date && booking.time) {
            try {
                results.booking = await bookAppointment(
                    req.user.id,
                    service_id,
                    booking.date,
                    booking.time,
                    true, // sendEmail
                    booking.booked_for_name?.trim() || null,
                    booking.user_session_id,
                );
            } catch (err) {
                // If booking fails, we might still want to proceed with waitlist or stop?
                // The user asked for "Atomic", so if one fails, we should probably stop if they intended both.
                // However, usually they only do one or the other per slot.
                // We'll return the error and stop.
                return res.status(err.status || 500).json({
                    error: `Booking failed: ${err.message}`,
                    stage: 'booking',
                });
            }
        }

        // 2. Process Waitlist if requested
        if (waitlist && (waitlist.date || waitlist.preferred_date)) {
            try {
                const { joinWaitlist } = await import('../services/waitlist.service.js');
                results.waitlist = await joinWaitlist(
                    req.user.id,
                    service_id,
                    waitlist.date || waitlist.preferred_date,
                    waitlist.time || waitlist.preferred_time || null,
                    waitlist.priority || 0,
                );
            } catch (err) {
                return res.status(err.status || 500).json({
                    error: `Waitlist failed: ${err.message}`,
                    stage: 'waitlist',
                    booking: results.booking, // Return the success of the first stage if it passed
                });
            }
        }

        res.status(200).json({
            success: true,
            ...results,
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/appointments/my
 * Optional query: ?status=CONFIRMED
 */
export const getMyAppointments = async (req, res, next) => {
    try {
        const { status, sort, page = 1, limit = 10 } = req.query;
        const result = await getPatientAppointments(
            req.user.id,
            status,
            sort,
            Number(page),
            Number(limit),
        );

        res.json({
            appointments: result.appointments,
            total: result.total,
            page: Number(page),
            limit: Number(limit),
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/appointments/:id
 */
export const getOne = async (req, res, next) => {
    try {
        const appointment = await getAppointmentById(req.params.id, req.user.id);
        res.json({ appointment });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/appointments/:id/cancel
 * Body: { reason? }
 */
export const cancel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const result = await cancelAppointment(id, req.user.id, reason);

        // ── Trigger waitlist notification (Module 09) ──
        // When a slot is freed, notify the first person waiting for it
        await notifyWaitlist(result.freed_slot);

        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/appointments/:id/reschedule
 * Body: { date, time }
 */
export const reschedule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;

        if (!date || !time) {
            return res.status(400).json({ error: 'New date and time are required.' });
        }

        const result = await rescheduleAppointment(id, req.user.id, date, time);

        if (result.rescheduled) {
            res.json(result);
        } else {
            res.status(200).json(result); // Alternatives returned
        }
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/appointments/guest/cancel?token=xxx
 * Returns appointment details so the frontend can show "Are you sure?" page.
 */
export const guestCancelInfo = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: 'Token is required.' });

        const result = await validateGuestActionToken(token, 'cancel');
        res.json({
            message: 'Token valid. Confirm cancellation to proceed.',
            appointment: {
                id: result.appointment.id,
                date: result.appointment.appointment_date,
                time: result.appointment.start_time,
                service: result.appointment.service?.name,
                dentist: result.appointment.dentist?.profile?.full_name || 'Assigned',
                guest_name: result.appointment.guest_name,
            },
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * POST /api/appointments/guest/cancel?token=xxx
 * Guest confirms they want to cancel.
 */
export const guestCancelConfirm = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: 'Token is required.' });

        const result = await validateGuestActionToken(token, 'cancel');

        // Cancel the appointment
        const { data: updated, error } = await supabaseAdmin
            .from('appointments')
            .update({
                status: 'CANCELLED',
                cancellation_reason: 'Cancelled by guest via reminder email link.',
                cancelled_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', result.appointment.id)
            .select()
            .single();

        if (error) throw { status: 500, message: error.message };

        // Mark token as used
        await markGuestTokenUsed(result.token_id);

        // Trigger waitlist if someone is waiting
        await notifyWaitlist({
            date: updated.appointment_date,
            start_time: updated.start_time,
            end_time: updated.end_time,
            service_id: updated.service_id,
        });

        // Send cancellation email
        await sendCancellationEmail(result.appointment.guest_email, result.appointment.guest_name, {
            date: updated.appointment_date,
            start_time: updated.start_time,
            service: result.appointment.service?.name || 'Dental appointment',
            isLastMinute: false,
        });

        res.json({
            message: 'Appointment cancelled successfully.',
            cancelled_appointment: {
                id: updated.id,
                date: updated.appointment_date,
                time: updated.start_time,
                status: updated.status,
            },
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/appointments/guest/reschedule?token=xxx
 * Returns appointment details + available slots so the frontend can show a slot picker.
 */
export const guestRescheduleInfo = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: 'Token is required.' });

        const result = await validateGuestActionToken(token, 'reschedule');

        // Get available slots for the same service on the same date
        const { getAvailableSlots } = await import('../services/slot.service.js');
        const slots = await getAvailableSlots(
            result.appointment.appointment_date,
            result.appointment.service?.id,
        );

        res.json({
            message: 'Token valid. Select a new time to reschedule.',
            current_appointment: {
                id: result.appointment.id,
                date: result.appointment.appointment_date,
                time: result.appointment.start_time,
                service: result.appointment.service?.name,
                dentist: result.appointment.dentist?.profile?.full_name || 'Assigned',
                guest_name: result.appointment.guest_name,
            },
            available_slots: slots.all_slots,
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * POST /api/appointments/guest/reschedule?token=xxx
 * Body: { date, time } — the new date and time the guest chose.
 *
 * Flow:
 * 1. Validate the token
 * 2. Book the new slot (as guest, CONFIRMED — they already verified email)
 * 3. Cancel the old appointment
 * 4. Mark token as used
 * 5. Send reschedule email
 */
export const guestRescheduleConfirm = async (req, res, next) => {
    try {
        const { token } = req.query;
        const { date, time } = req.body;

        if (!token) return res.status(400).json({ error: 'Token is required.' });
        if (!date || !time) {
            return res.status(400).json({ error: 'New date and time are required.' });
        }

        const result = await validateGuestActionToken(token, 'reschedule');
        const oldAppt = result.appointment;

        // 1. Check new slot availability
        const { getAvailableSlots } = await import('../services/slot.service.js');
        const availability = await getAvailableSlots(date, oldAppt.service?.id);

        const slotData = availability.all_slots.find((s) => s.time === time);
        if (!slotData || slotData.available === 0) {
            return res.status(409).json({
                error: 'Selected time is not available. Please choose another.',
                available_slots: availability.all_slots
                    .filter((s) => s.available > 0)
                    .map((s) => s.time),
            });
        }

        // 2. Assign dentist for new slot
        const { assignDentist } = await import('../services/dentist-assignment.service.js');
        const endTime = addMinutesToTime(time, oldAppt.service?.duration_minutes || 30);
        const dentistId = await assignDentist(date, time, endTime);

        if (!dentistId) {
            throw { status: 409, message: 'No dentist available for the new slot.' };
        }

        // 3. Create new appointment (CONFIRMED — guest already verified via original booking)
        const { data: newAppointment, error: insertError } = await supabaseAdmin
            .from('appointments')
            .insert({
                patient_id: null,
                guest_email: oldAppt.guest_email,
                guest_phone: oldAppt.guest_phone,
                guest_name: oldAppt.guest_name,
                dentist_id: dentistId,
                service_id: oldAppt.service?.id,
                appointment_date: date,
                start_time: time,
                end_time: endTime,
                status: 'CONFIRMED',
            })
            .select(`*, service:services(name), dentist:dentists(profile:profiles(full_name))`)
            .single();

        if (insertError) throw { status: 500, message: insertError.message };

        // 4. Cancel old appointment
        await supabaseAdmin
            .from('appointments')
            .update({
                status: 'CANCELLED',
                cancellation_reason: 'Rescheduled by guest via reminder email link.',
                cancelled_at: new Date().toISOString(),
            })
            .eq('id', oldAppt.id);

        // 5. Trigger waitlist for the freed old slot
        await notifyWaitlist({
            date: oldAppt.appointment_date,
            start_time: oldAppt.start_time,
            end_time: oldAppt.end_time,
            service_id: oldAppt.service?.id,
        });

        // 6. Mark token as used
        await markGuestTokenUsed(result.token_id);

        // 7. Send reschedule email
        const { sendRescheduleEmail } = await import('../services/email-confirmation.service.js');
        await sendRescheduleEmail(oldAppt.guest_email, oldAppt.guest_name, {
            oldDate: oldAppt.appointment_date,
            oldTime: oldAppt.start_time,
            newDate: newAppointment.appointment_date,
            newTime: newAppointment.start_time,
            service: newAppointment.service?.name || 'Dental appointment',
            dentist: newAppointment.dentist?.profile?.full_name || 'Assigned',
        });

        res.json({
            message: 'Appointment rescheduled successfully!',
            old_appointment: {
                date: oldAppt.appointment_date,
                time: oldAppt.start_time,
                status: 'CANCELLED',
            },
            new_appointment: {
                id: newAppointment.id,
                date: newAppointment.appointment_date,
                time: newAppointment.start_time,
                service: newAppointment.service?.name,
                dentist: newAppointment.dentist?.profile?.full_name || 'Assigned',
                status: 'CONFIRMED',
            },
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

// Helper (same as in appointment.service.js)
function addMinutesToTime(timeStr, minutes) {
    const parts = timeStr.split(':');
    const totalMin = parseInt(parts[0]) * 60 + parseInt(parts[1]) + minutes;
    const hours = Math.floor(totalMin / 60)
        .toString()
        .padStart(2, '0');
    const mins = (totalMin % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
}

/**
 * POST /api/appointments/slots/hold
 * Body: { service_id, date, time, user_session_id }
 *
 * Hold a time slot for 5 minutes while user completes booking form.
 * If user already has a hold on a different time for the same date,
 * the old hold is automatically released (auto-switch behavior).
 */
export const holdSlotHandler = async (req, res) => {
    try {
        const { service_id, date, time, user_session_id } = req.body;

        // Validation
        if (!service_id || !date || !time || !user_session_id) {
            return res.status(400).json({
                error: 'Missing required fields: service_id, date, time, user_session_id',
            });
        }

        const result = await holdSlot(service_id, date, time, user_session_id);
        return res.status(200).json(result);
    } catch (err) {
        console.error('Hold slot error:', err);
        return res.status(err.status || 500).json({ error: err.message });
    }
};

/**
 * POST /api/appointments/slots/release-hold
 * Body: { hold_id }
 *
 * Release a slot hold (mark as released).
 * Called when user navigates away or completes booking.
 */
export const releaseSlotHold = async (req, res) => {
    try {
        const { hold_id } = req.body;

        if (!hold_id) {
            return res.status(400).json({ error: 'Missing hold_id' });
        }

        const result = await releaseHold(hold_id);
        return res.status(200).json(result);
    } catch (err) {
        console.error('Release hold error:', err);
        return res.status(err.status || 500).json({ error: err.message });
    }
};
