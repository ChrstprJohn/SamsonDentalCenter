import { supabaseAdmin } from '../config/supabase.js';
import { assignDentist } from './dentist-assignment.service.js';
import { getAvailableSlots, getSuggestedSlots } from './slot.service.js';
import {
    createConfirmationToken,
    sendGuestConfirmationEmail,
    sendBookingSuccessEmail,
    sendCancellationEmail,
    sendRescheduleEmail,
} from './email-confirmation.service.js';
import { APPOINTMENT_STATUS, SERVICE_TIER, APPROVAL_STATUS } from '../utils/constants.js';

/**
 * Book an appointment for a guest (no user account).
 * Status starts as PENDING — guest must confirm via email link.
 *
 * @param {string} serviceId - The service UUID
 * @param {string} date - Appointment date 'YYYY-MM-DD'
 * @param {string} time - Appointment time 'HH:MM'
 * @param {string} guestEmail - Guest email address
 * @param {string} guestPhone - Guest phone number
 * @param {string} guestName - Guest full name
 * @returns {object} Appointment details or alternatives
 */
export const bookAppointmentGuest = async (
    serviceId,
    date,
    time,
    guestEmail,
    guestPhone,
    guestName,
) => {
    // ── 0. Validate date is in the future ──
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
        throw { status: 400, message: 'Cannot book appointments in the past.' };
    }

    // ── 1. Get service duration (and check if it exists before proceeding!) ──
    const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

    if (serviceError || !service) {
        throw { status: 404, message: 'Service not found.' };
    }

    // ── 1b. GUEST BOOKING RESTRICTION: Only General services allowed ──
    if (service.tier === SERVICE_TIER.SPECIALIZED) {
        throw {
            status: 403,
            message: 'Specialized services require an account to book. Please sign up or log in.',
            requires_account: true,
        };
    }

    // Calculate endTime ONCE here to avoid calling the function multiple times
    const endTime = addMinutesToTime(time, service.duration_minutes);

    // ── 2. Check availability ──
    const availability = await getAvailableSlots(date, serviceId);
    const isAvailable = availability.available_slots.includes(time);

    if (!isAvailable) {
        const suggestions = await getSuggestedSlots(date, serviceId, time);
        return {
            booked: false,
            message: `Slot not available.`,
            can_join_waitlist: true,
            ...suggestions,
        };
    }

    // ── 3. Assign dentist ──
    const dentistId = await assignDentist(date, time, endTime);

    if (!dentistId) {
        throw { status: 409, message: 'No dentist available for this slot.' };
    }

    // ── 4. Create appointment as PENDING (not confirmed yet!) ──
    const { data: appointment, error: insertError } = await supabaseAdmin
        .from('appointments')
        .insert({
            patient_id: null, // Guests have no account
            guest_email: guestEmail,
            guest_phone: guestPhone,
            guest_name: guestName,
            dentist_id: dentistId,
            service_id: serviceId,
            appointment_date: date,
            start_time: time,
            end_time: endTime,
            status: APPOINTMENT_STATUS.PENDING, // ← PENDING until email confirmed
        })
        .select(
            `
            *,
            service:services(name, price),
            dentist:dentists(profile:profiles(full_name))
        `,
        )
        .single();

    if (insertError) {
        console.error('Insert Error:', insertError);
        throw { status: 500, message: insertError.message };
    }

    // ── 5. Generate confirmation token & send email ──
    const { token } = await createConfirmationToken(appointment.id);
    await sendGuestConfirmationEmail(guestEmail, guestName, {
        token,
        date: appointment.appointment_date,
        start_time: appointment.start_time,
        service: service.name,
    });

    return {
        booked: true,
        status: 'PENDING',
        message: 'Appointment reserved! Please check your email to confirm your booking.',
        appointment: {
            id: appointment.id,
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            service: appointment.service?.name,
            dentist: appointment.dentist?.profile?.full_name || 'Assigned',
        },
    };
};

/**
 * Book an appointment for a patient (authenticated user).
 *
 * TWO-TIER LOGIC:
 * - General services  → Auto-assign dentist → Status: CONFIRMED (instant)
 * - Specialized services → No dentist yet → Status: PENDING + approval_status: 'pending'
 *
 * @param {string} patientId - The patient's profile UUID
 * @param {string} serviceId - The service UUID
 * @param {string} date - 'YYYY-MM-DD'
 * @param {string} time - 'HH:MM'
 * @param {boolean} sendEmail - Whether to send confirmation email (default true)
 * @param {string|null} bookedForName - Name of the person being booked for. NULL = self.
 * @returns {object} Appointment details or alternatives
 */
export const bookAppointment = async (
    patientId,
    serviceId,
    date,
    time,
    sendEmail = true,
    bookedForName = null,
) => {
    // ── 0. Check if patient is restricted (3+ no-shows or 3+ cancellations) ──
    const { data: patient } = await supabaseAdmin
        .from('profiles')
        .select(
            'email, full_name, is_booking_restricted, max_advance_booking_days, deposit_required, no_show_count, cancellation_count',
        )
        .eq('id', patientId)
        .single();

    if (patient?.is_booking_restricted) {
        // Check if restriction has expired
        if (patient.restriction_until && new Date(patient.restriction_until) < new Date()) {
            // Auto-unlock: restriction period is over
            await supabaseAdmin
                .from('profiles')
                .update({ is_booking_restricted: false, restriction_reason: null })
                .eq('id', patientId);
        } else {
            // Check max advance booking days (e.g., only 3 days ahead)
            if (patient.max_advance_booking_days) {
                const maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + patient.max_advance_booking_days);
                if (new Date(date) > maxDate) {
                    throw {
                        status: 403,
                        message: `Due to missed appointments, you can only book up to ${patient.max_advance_booking_days} days in advance.`,
                        restriction: true,
                        no_show_count: patient.no_show_count,
                    };
                }
            }
        }
    }

    // ── 1. Get service info (including TIER) ──
    const { data: service } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

    if (!service) {
        throw { status: 404, message: 'Service not found.' };
    }

    const endTime = addMinutesToTime(time, service.duration_minutes);
    const isSpecialized = service.tier === SERVICE_TIER.SPECIALIZED;

    // ═══════════════════════════════════════════════
    // 🔴 SPECIALIZED BRANCH — Requires admin approval
    // ═══════════════════════════════════════════════
    if (isSpecialized) {
        // Don't check slot availability or assign dentist yet
        // Admin will handle that during the approval step

        const { data: appointment, error } = await supabaseAdmin
            .from('appointments')
            .insert({
                patient_id: patientId,
                dentist_id: null, // ← Not assigned yet! Admin assigns during approval
                service_id: serviceId,
                appointment_date: date,
                start_time: time,
                end_time: endTime,
                status: APPOINTMENT_STATUS.PENDING,
                service_tier: SERVICE_TIER.SPECIALIZED,
                approval_status: APPROVAL_STATUS.PENDING,
                booked_for_name: bookedForName || null,
            })
            .select(
                `
        *,
        service:services(name, duration_minutes, price)
      `,
            )
            .single();

        if (error) {
            if (error.code === '23505') {
                throw {
                    status: 409,
                    message: 'This slot was just taken. Please try another time.',
                };
            }
            throw { status: 500, message: error.message };
        }

        // TODO: Notify supervisor about new specialized request
        // await createNotification(supervisorUserId, 'NEW_REQUEST', ...)

        return {
            booked: true,
            status: 'PENDING',
            requires_approval: true,
            message:
                'Your appointment request has been submitted! The clinic will review and confirm your schedule within 24 hours.',
            appointment: {
                id: appointment.id,
                date: appointment.appointment_date,
                start_time: appointment.start_time,
                end_time: appointment.end_time,
                service: appointment.service?.name,
                service_tier: 'specialized',
                status: 'PENDING',
                approval_status: 'pending',
            },
        };
    }

    // ═══════════════════════════════════════════════
    // 🟢 GENERAL BRANCH — Auto-accept (existing flow)
    // ═══════════════════════════════════════════════

    // ── 2. Check if the requested slot is available ──
    const availability = await getAvailableSlots(date, serviceId);
    const isAvailable = availability.available_slots.includes(time);

    if (!isAvailable) {
        // Slot NOT available → return alternatives
        const suggestions = await getSuggestedSlots(date, serviceId, time);
        return {
            booked: false,
            message: `The slot at ${time} on ${date} is not available.`,
            can_join_waitlist: true,
            ...suggestions,
        };
    }

    // ── 3. Auto-assign a dentist (tier-aware) ──
    const dentistId = await assignDentist(date, time, endTime, SERVICE_TIER.GENERAL);

    if (!dentistId) {
        throw {
            status: 409,
            message:
                'No dentist available for this slot. This should not happen — please contact support.',
        };
    }

    // ── 4. Create the appointment ──
    const { data: appointment, error } = await supabaseAdmin
        .from('appointments')
        .insert({
            patient_id: patientId,
            dentist_id: dentistId,
            service_id: serviceId,
            appointment_date: date,
            start_time: time,
            end_time: endTime,
            status: APPOINTMENT_STATUS.CONFIRMED,
            service_tier: SERVICE_TIER.GENERAL,
            // NULL = booked for self, a name = booked for someone else
            booked_for_name: bookedForName || null,
        })
        .select(
            `
      *,
      service:services(name, duration_minutes, price),
      dentist:dentists(
        id,
        profile:profiles(full_name)
      )
    `,
        )
        .single();

    if (error) {
        // This catches the unique index violation (double booking)
        if (error.code === '23505') {
            throw { status: 409, message: 'This slot was just taken. Please try another time.' };
        }
        throw { status: 500, message: error.message };
    }

    // ── 5. Send booking success email to authenticated patient ──
    if (patient?.email && sendEmail) {
        await sendBookingSuccessEmail(patient.email, patient.full_name, {
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            service: appointment.service?.name,
            dentist: appointment.dentist?.profile?.full_name || 'Assigned',
            booked_for_name: bookedForName || null,
        });
    }

    return {
        booked: true,
        message: 'Appointment confirmed!',
        deposit_required: patient?.deposit_required || false,
        appointment: {
            id: appointment.id,
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            status: appointment.status,
            service: appointment.service?.name,
            service_tier: 'general',
            duration: appointment.service?.duration_minutes,
            price: appointment.service?.price,
            dentist: appointment.dentist?.profile?.full_name || 'Assigned',
            booked_for_name: appointment.booked_for_name || null,
        },
    };
};

/**
 * Get all appointments for a patient.
 */
export const getPatientAppointments = async (patientId, status = null) => {
    let query = supabaseAdmin
        .from('appointments')
        .select(
            `
      *,
      service:services(name, duration_minutes, price),
      dentist:dentists(
        profile:profiles(full_name)
      )
    `,
        )
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        throw { status: 500, message: error.message };
    }

    return data.map((appt) => ({
        id: appt.id,
        date: appt.appointment_date,
        start_time: appt.start_time,
        end_time: appt.end_time,
        status: appt.status,
        service: appt.service?.name,
        price: appt.service?.price,
        dentist: appt.dentist?.profile?.full_name || 'TBD',
        is_walk_in: appt.is_walk_in,
        notes: appt.notes,
        created_at: appt.created_at,
    }));
};

/**
 * Get a single appointment by ID (with ownership check).
 */
export const getAppointmentById = async (appointmentId, patientId) => {
    const { data, error } = await supabaseAdmin
        .from('appointments')
        .select(
            `
      *,
      service:services(name, duration_minutes, price),
      dentist:dentists(
        profile:profiles(full_name)
      )
    `,
        )
        .eq('id', appointmentId)
        .eq('patient_id', patientId)
        .single();

    if (error || !data) {
        throw { status: 404, message: 'Appointment not found.' };
    }

    return data;
};

/**
 * Cancel an appointment.
 *
 * @param {string} appointmentId - The appointment UUID
 * @param {string} patientId - The patient's UUID (for ownership check)
 * @param {string} reason - Optional cancellation reason
 * @returns {object} Cancelled appointment
 */
export const cancelAppointment = async (
    appointmentId,
    patientId,
    reason = '',
    sendEmail = true,
) => {
    // ── 1. Get the appointment ──
    const { data: appointment, error: fetchError } = await supabaseAdmin
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .eq('patient_id', patientId)
        .single();

    if (fetchError || !appointment) {
        throw { status: 404, message: 'Appointment not found or you do not own it.' };
    }

    // ── 2. Check if it can be cancelled ──
    if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
        throw { status: 400, message: 'This appointment is already cancelled.' };
    }

    if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
        throw { status: 400, message: 'Cannot cancel a completed appointment.' };
    }

    // ── 3. Check if it's a last-minute cancellation ──
    const appointmentDateTime = new Date(
        `${appointment.appointment_date}T${appointment.start_time}`,
    );
    const now = new Date();
    const hoursUntil = (appointmentDateTime - now) / (1000 * 60 * 60);
    const isLastMinute = hoursUntil < 24; // Less than 24 hours notice

    // ── 4. Determine status: LATE_CANCEL (<24h) vs CANCELLED (≥24h) ──
    const cancelStatus = isLastMinute
        ? APPOINTMENT_STATUS.LATE_CANCEL
        : APPOINTMENT_STATUS.CANCELLED;

    // ── 5a. Update status ──
    const { data: updated, error: updateError } = await supabaseAdmin
        .from('appointments')
        .update({
            status: cancelStatus,
            cancellation_reason: reason,
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single();

    if (updateError) {
        throw { status: 500, message: updateError.message };
    }

    // ── 5b. Send cancellation email ──
    // For authenticated patients: fetch their email from profiles
    const { data: patient } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('id', patientId)
        .single();

    // Get service name for the email
    const { data: service } = await supabaseAdmin
        .from('services')
        .select('name')
        .eq('id', appointment.service_id)
        .single();

    if (patient?.email && sendEmail) {
        await sendCancellationEmail(patient.email, patient.full_name, {
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            service: service?.name || 'Dental appointment',
            isLastMinute,
        });
    }

    // ── 6. If late cancel, increment patient's late cancel tracking ──
    if (isLastMinute) {
        // Note: This is tracked for analytics.
        // No-show restrictions are handled separately in Module 10.
        console.log(
            `⚠️ Late cancellation by patient ${patientId} — ${hoursUntil.toFixed(1)}h before appointment`,
        );
    }

    return {
        message: isLastMinute
            ? 'Appointment cancelled (late cancellation — less than 24h notice).'
            : 'Appointment cancelled successfully.',
        was_last_minute: isLastMinute,
        cancel_status: cancelStatus,
        cancelled_appointment: {
            id: updated.id,
            date: updated.appointment_date,
            time: updated.start_time,
            status: updated.status,
        },
        // Module 09 (Waitlist) will use this info to notify waitlisted patients
        freed_slot: {
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            service_id: appointment.service_id,
        },
    };
};

/**
 * Reschedule an appointment to a new date/time.
 *
 * Internally: cancel old → book new.
 *
 * @param {string} appointmentId - The appointment to reschedule
 * @param {string} patientId - The patient's UUID
 * @param {string} newDate - New date 'YYYY-MM-DD'
 * @param {string} newTime - New time 'HH:MM'
 */
export const rescheduleAppointment = async (appointmentId, patientId, newDate, newTime) => {
    // ── 1. Get the original appointment ──
    const { data: original, error } = await supabaseAdmin
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .eq('patient_id', patientId)
        .single();

    if (error || !original) {
        throw { status: 404, message: 'Appointment not found.' };
    }

    if (original.status !== APPOINTMENT_STATUS.CONFIRMED) {
        throw {
            status: 400,
            message: `Cannot reschedule appointment with status: ${original.status}`,
        };
    }

    // ── 2. Try to book the new slot first (sendEmail = false — reschedule email sent instead) ──
    const newBooking = await bookAppointment(
        patientId,
        original.service_id,
        newDate,
        newTime,
        false,
    );

    if (!newBooking.booked) {
        // New slot not available — return alternatives, don't cancel the original
        return {
            rescheduled: false,
            message: 'New slot is not available. Your original appointment is unchanged.',
            original_appointment: {
                id: original.id,
                date: original.appointment_date,
                time: original.start_time,
            },
            ...newBooking, // includes alternatives
        };
    }

    // ── 3. New slot booked! Now cancel the original (sendEmail = false — reschedule email sent instead) ──
    await cancelAppointment(appointmentId, patientId, 'Rescheduled to new time', false);

    // ── 4. Send reschedule email ──
    const { data: patient } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('id', patientId)
        .single();

    // Get service name for the email
    const { data: service } = await supabaseAdmin
        .from('services')
        .select('name')
        .eq('id', original.service_id)
        .single();

    if (patient?.email) {
        await sendRescheduleEmail(patient.email, patient.full_name, {
            oldDate: original.appointment_date,
            oldTime: original.start_time,
            newDate: newBooking.appointment.date,
            newTime: newBooking.appointment.start_time,
            service: service?.name || 'Dental appointment',
            dentist: newBooking.appointment.dentist || 'Assigned',
        });
    }

    return {
        rescheduled: true,
        message: 'Appointment rescheduled successfully!',
        old_appointment: {
            date: original.appointment_date,
            time: original.start_time,
            status: 'CANCELLED',
        },
        new_appointment: newBooking.appointment,
    };
};

/**
 * Book a walk-in appointment (admin only).
 * Walk-ins are always GENERAL tier, assigned immediately, status = CONFIRMED.
 *
 * @param {string} patientId - The patient's profile UUID
 * @param {string} serviceId - The service UUID
 * @param {string|null} time - Preferred time (defaults to next available slot)
 * @param {string|null} notes - Optional admin notes
 * @returns {object} Walk-in appointment details
 */
export const bookWalkIn = async (patientId, serviceId, time = null, notes = null) => {
    const today = new Date().toISOString().split('T')[0];

    // Get service info
    const { data: service } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

    if (!service) {
        throw { status: 404, message: 'Service not found.' };
    }

    // Use provided time or current time rounded to next 30-min slot
    const now = new Date();
    const walkInTime =
        time || `${String(now.getHours()).padStart(2, '0')}:${now.getMinutes() < 30 ? '30' : '00'}`;
    const endTime = addMinutesToTime(walkInTime, service.duration_minutes);

    // Auto-assign dentist (general tier for walk-ins)
    const dentistId = await assignDentist(today, walkInTime, endTime, 'general');

    if (!dentistId) {
        throw {
            status: 409,
            message: 'No dentist available right now for a walk-in.',
        };
    }

    const { data: appointment, error } = await supabaseAdmin
        .from('appointments')
        .insert({
            patient_id: patientId,
            dentist_id: dentistId,
            service_id: serviceId,
            appointment_date: today,
            start_time: walkInTime,
            end_time: endTime,
            status: APPOINTMENT_STATUS.CONFIRMED,
            service_tier: 'general',
            is_walk_in: true,
            notes: notes || 'Walk-in appointment',
        })
        .select(
            `
      *,
      service:services(name, price),
      dentist:dentists(profile:profiles(full_name))
    `,
        )
        .single();

    if (error) {
        if (error.code === '23505') {
            throw { status: 409, message: 'Time slot conflict. Try a different time.' };
        }
        throw { status: 500, message: error.message };
    }

    return {
        message: 'Walk-in booked!',
        appointment: {
            id: appointment.id,
            date: today,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            status: 'CONFIRMED',
            service: appointment.service?.name,
            dentist: appointment.dentist?.profile?.full_name,
            is_walk_in: true,
        },
    };
};

// ── Helper ──

function addMinutesToTime(timeStr, minutes) {
    const parts = timeStr.split(':');
    const totalMin = parseInt(parts[0]) * 60 + parseInt(parts[1]) + minutes;
    const hours = Math.floor(totalMin / 60)
        .toString()
        .padStart(2, '0');
    const mins = (totalMin % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
}
