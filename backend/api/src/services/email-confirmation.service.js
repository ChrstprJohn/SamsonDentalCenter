import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { APPOINTMENT_STATUS, CLINIC_CONFIG } from '../utils/constants.js';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a secure confirmation token and save it to the database.
 *
 * @param {string} appointmentId - The appointment UUID
 * @returns {object} { token } - The generated token
 */
export const createConfirmationToken = async (appointmentId) => {
    const token = crypto.randomBytes(32).toString('hex');

    // Token expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + CLINIC_CONFIG.GUEST_CONFIRM_EXPIRY_HOURS);

    const { error } = await supabaseAdmin.from('appointment_confirmation_tokens').insert({
        appointment_id: appointmentId,
        token,
        expires_at: expiresAt.toISOString(),
    });

    if (error) {
        console.error('Failed to create confirmation token:', error.message);
        throw { status: 500, message: 'Failed to create confirmation token.' };
    }

    return { token };
};

/**
 * Send a confirmation email to a guest with a verification link.
 *
 * @param {string} email - Guest email address
 * @param {string} name - Guest name
 * @param {object} details - { token, date, start_time, service }
 */
export const sendGuestConfirmationEmail = async (email, name, details) => {
    const { token, date, start_time, service } = details;

    const confirmUrl = `${FRONTEND_URL}/email/confirm?token=${token}`;

    // Alternative if you want the backend to handle it directly:
    // const confirmUrl = `${process.env.API_URL}/api/appointments/confirm-email?token=${token}`;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Primera Denta <noreply@primeradenta.com>',
            to: email,
            subject: 'Confirm Your Dental Appointment — Primera Denta',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0ea5e9;">Confirm Your Appointment</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for booking with <strong>Primera Denta</strong>!</p>
                    <p>Here are your appointment details:</p>
                    <table style="border-collapse: collapse; margin: 16px 0;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Service:</td>
                            <td style="padding: 8px;">${service}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Date:</td>
                            <td style="padding: 8px;">${date}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Time:</td>
                            <td style="padding: 8px;">${start_time}</td>
                        </tr>
                    </table>
                    <p><strong>⚠️ Your appointment is not confirmed yet!</strong></p>
                    <p>Please click the button below to confirm:</p>
                    <a href="${confirmUrl}"
                       style="display: inline-block; background: #0ea5e9; color: white;
                              padding: 12px 24px; text-decoration: none; border-radius: 8px;
                              font-weight: bold; margin: 16px 0;">
                        ✅ Confirm My Appointment
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        This link expires in ${CLINIC_CONFIG.GUEST_CONFIRM_EXPIRY_HOURS} hours.
                        If you did not make this booking, you can ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 12px;">
                        Primera Denta Dental Clinic<br/>
                        7 Himalayan Rd, Tandang Sora, Quezon City
                    </p>
                </div>
            `,
        });
        console.log(`📧 Confirmation email sent to ${email}`);
    } catch (err) {
        console.error('Failed to send confirmation email:', err.message);
        // Don't throw — appointment was created, email failure shouldn't block everything
        // The guest can request a resend later
    }
};

/**
 * Confirm an appointment via email token.
 * Called when guest clicks the confirmation link.
 *
 * @param {string} token - The confirmation token from the email link
 * @returns {object} { confirmed, appointment }
 */
export const confirmAppointmentByToken = async (token) => {
    // ── 1. Find the token ──
    const { data: tokenRecord, error: tokenError } = await supabaseAdmin
        .from('appointment_confirmation_tokens')
        .select('*, appointment:appointments(id, status, appointment_date, start_time)')
        .eq('token', token)
        .single();

    if (tokenError || !tokenRecord) {
        throw { status: 404, message: 'Invalid confirmation link. It may have already been used.' };
    }

    // ── 2. Check if token is expired ──
    if (new Date(tokenRecord.expires_at) < new Date()) {
        throw {
            status: 410,
            message: 'This confirmation link has expired. Please book a new appointment.',
        };
    }

    // ── 3. Check appointment status ──
    if (tokenRecord.appointment?.status !== APPOINTMENT_STATUS.PENDING) {
        // Already confirmed or cancelled
        return {
            confirmed: false,
            message: `Appointment is already ${tokenRecord.appointment?.status.toLowerCase()}.`,
        };
    }

    // ── 4. Update appointment to CONFIRMED ──
    const { data: updatedAppointment, error: updateError } = await supabaseAdmin
        .from('appointments')
        .update({
            status: APPOINTMENT_STATUS.CONFIRMED,
            confirmed_at: new Date().toISOString(),
        })
        .eq('id', tokenRecord.appointment_id)
        .select(
            `
            *,
            service:services(name, price),
            dentist:dentists(profile:profiles(full_name))
        `,
        )
        .single();

    if (updateError) {
        throw { status: 500, message: 'Failed to confirm appointment.' };
    }

    // ── 5. Send booking success email to guest ──
    await sendBookingSuccessEmail(updatedAppointment.guest_email, updatedAppointment.guest_name, {
        date: updatedAppointment.appointment_date,
        start_time: updatedAppointment.start_time,
        end_time: updatedAppointment.end_time,
        service: updatedAppointment.service?.name,
        dentist: updatedAppointment.dentist?.profile?.full_name || 'Assigned',
    });

    // ── 6. Delete used token (one-time use) ──
    await supabaseAdmin.from('appointment_confirmation_tokens').delete().eq('id', tokenRecord.id);

    return {
        confirmed: true,
        message: 'Your appointment is confirmed! See you soon.',
        appointment: {
            id: updatedAppointment.id,
            date: updatedAppointment.appointment_date,
            start_time: updatedAppointment.start_time,
            end_time: updatedAppointment.end_time,
            service: updatedAppointment.service?.name,
            dentist: updatedAppointment.dentist?.profile?.full_name || 'Assigned',
        },
    };
};

/**
 * Resend confirmation email for a PENDING guest appointment.
 * Useful if the guest didn't receive the first email.
 *
 * @param {string} appointmentId - The appointment UUID
 * @param {string} email - Guest email (must match the one on file)
 */
export const resendConfirmationEmail = async (appointmentId, email) => {
    // ── 1. Find the appointment ──
    const { data: appointment } = await supabaseAdmin
        .from('appointments')
        .select('*, service:services(name)')
        .eq('id', appointmentId)
        .eq('guest_email', email)
        .eq('status', APPOINTMENT_STATUS.PENDING)
        .single();

    if (!appointment) {
        throw { status: 404, message: 'No pending appointment found for this email.' };
    }

    // ── 2. Delete old token(s) for this appointment ──
    await supabaseAdmin
        .from('appointment_confirmation_tokens')
        .delete()
        .eq('appointment_id', appointmentId);

    // ── 3. Generate new token and send email ──
    const { token } = await createConfirmationToken(appointmentId);
    await sendGuestConfirmationEmail(email, appointment.guest_name, {
        token,
        date: appointment.appointment_date,
        start_time: appointment.start_time,
        service: appointment.service?.name,
    });

    return { message: 'Confirmation email resent. Please check your inbox.' };
};

/**
 * Send a "Booking Confirmed" email after successful booking.
 * Used for:
 *   - Authenticated patients (immediately after booking)
 *   - Guests (after they click the confirmation link)
 *
 * @param {string} email - Patient/guest email
 * @param {string} name - Patient/guest name
 * @param {object} details - { date, start_time, end_time, service, dentist }
 */
export const sendBookingSuccessEmail = async (email, name, details) => {
    const { date, start_time, end_time, service, dentist } = details;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Primera Denta <noreply@primeradenta.com>',
            to: email,
            subject: '✅ Appointment Confirmed — Primera Denta',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #22c55e;">Your Appointment is Confirmed! ✅</h2>
                    <p>Hi ${name},</p>
                    <p>Your appointment at <strong>Primera Denta</strong> has been confirmed.</p>
                    <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
                        <tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${service}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${date}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Time:</td><td style="padding: 8px;">${start_time} - ${end_time}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Dentist:</td><td style="padding: 8px;">${dentist}</td></tr>
                    </table>
                    <p>� <strong>Location:</strong> 7 Himalayan Rd, Tandang Sora, Quezon City</p>
                    <p style="color: #666; font-size: 14px;">
                        If you need to cancel or reschedule, please do so at least 24 hours before your appointment.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 12px;">Primera Denta Dental Clinic</p>
                </div>
            `,
        });
        console.log(`📧 Booking success email sent to ${email}`);
    } catch (err) {
        console.error('Failed to send booking success email:', err.message);
        // Don't throw — booking was successful, email failure shouldn't break it
    }
};

/**
 * Send a "Cancellation" email after a patient cancels their appointment.
 * Informational only — no action required from the patient.
 *
 * Used for:
 *   - Authenticated patients (fetch email from profiles table)
 *   - Guests (use appointment.guest_email)
 *
 * @param {string} email - Patient/guest email
 * @param {string} name - Patient/guest name
 * @param {object} details - { date, start_time, service, isLastMinute }
 */
export const sendCancellationEmail = async (email, name, details) => {
    const { date, start_time, service, isLastMinute } = details;

    const subject = isLastMinute
        ? '⚠️ Appointment Cancelled (Late Cancellation) — Primera Denta'
        : '❌ Appointment Cancelled — Primera Denta';

    const lateNotice = isLastMinute
        ? `<p style="color: #f59e0b; font-weight: bold;">
               ⚠️ This was a late cancellation (less than 24 hours notice).
               Frequent late cancellations may affect your booking privileges.
           </p>`
        : '';

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Primera Denta <noreply@primeradenta.com>',
            to: email,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ef4444;">Appointment Cancelled</h2>
                    <p>Hi ${name},</p>
                    <p>Your appointment at <strong>Primera Denta</strong> has been cancelled.</p>
                    <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
                        <tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${service}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${date}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Time:</td><td style="padding: 8px;">${start_time}</td></tr>
                    </table>
                    ${lateNotice}
                    <p style="color: #666; font-size: 14px;">
                        If you'd like to book a new appointment, visit our website or contact us.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 12px;">Primera Denta Dental Clinic</p>
                </div>
            `,
        });
        console.log(`📧 Cancellation email sent to ${email}`);
    } catch (err) {
        console.error('Failed to send cancellation email:', err.message);
        // Don't throw — cancellation was successful, email failure shouldn't block it
    }
};

/**
 * Send a "Rescheduled" email after a patient reschedules their appointment.
 * Informational only — tells patient their new date/time.
 *
 * @param {string} email - Patient email
 * @param {string} name - Patient name
 * @param {object} details - { oldDate, oldTime, newDate, newTime, service, dentist }
 */
export const sendRescheduleEmail = async (email, name, details) => {
    const { oldDate, oldTime, newDate, newTime, service, dentist } = details;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Primera Denta <noreply@primeradenta.com>',
            to: email,
            subject: '🔄 Appointment Rescheduled — Primera Denta',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0ea5e9;">Appointment Rescheduled</h2>
                    <p>Hi ${name},</p>
                    <p>Your appointment at <strong>Primera Denta</strong> has been moved to a new time.</p>
                    <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Service:</td>
                            <td style="padding: 8px;">${service}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #ef4444;">Old Date:</td>
                            <td style="padding: 8px; text-decoration: line-through; color: #999;">${oldDate} at ${oldTime}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #22c55e;">New Date:</td>
                            <td style="padding: 8px; font-weight: bold;">${newDate} at ${newTime}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Dentist:</td>
                            <td style="padding: 8px;">${dentist}</td>
                        </tr>
                    </table>
                    <p>📍 <strong>Location:</strong> 7 Himalayan Rd, Tandang Sora, Quezon City</p>
                    <p style="color: #666; font-size: 14px;">
                        If you need to cancel or reschedule again, please do so at least 24 hours before your appointment.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 12px;">Primera Denta Dental Clinic</p>
                </div>
            `,
        });
        console.log(`📧 Reschedule email sent to ${email}`);
    } catch (err) {
        console.error('Failed to send reschedule email:', err.message);
        // Don't throw — reschedule was successful, email failure shouldn't block it
    }
};

/**
 * Send a reminder email to a GUEST with Reschedule and Cancel links.
 *
 * Called by: The reminder cron job (scheduled-tasks.js), only for guest appointments.
 * Links use tokens from the guest_action_tokens table — no login required.
 *
 * @param {string} email - Guest email address
 * @param {string} name - Guest name
 * @param {object} details - { date, start_time, service, dentist, cancelToken, rescheduleToken, hoursUntil }
 */
export const sendGuestReminderEmail = async (email, name, details) => {
    const { date, start_time, service, dentist, cancelToken, rescheduleToken, hoursUntil } =
        details;

    const cancelUrl = `${FRONTEND_URL}/email/cancel?token=${cancelToken}`;
    const rescheduleUrl = `${FRONTEND_URL}/email/reschedule?token=${rescheduleToken}`;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Primera Denta <noreply@primeradenta.com>',
            to: email,
            subject: `⏰ Reminder: Your Appointment in ${hoursUntil} Hours — Primera Denta`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0ea5e9;">Appointment Reminder</h2>
                    <p>Hi ${name},</p>
                    <p>This is a friendly reminder about your upcoming appointment at <strong>Primera Denta</strong>.</p>

                    <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
                        <tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${service}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${date}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Time:</td><td style="padding: 8px;">${start_time}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Dentist:</td><td style="padding: 8px;">${dentist}</td></tr>
                    </table>

                    <p>📍 <strong>Location:</strong> 7 Himalayan Rd, Tandang Sora, Quezon City</p>

                    <p style="margin-top: 24px;">Need to make changes?</p>

                    <div style="margin: 16px 0;">
                        <a href="${rescheduleUrl}"
                           style="display: inline-block; background: #0ea5e9; color: white;
                                  padding: 12px 24px; text-decoration: none; border-radius: 8px;
                                  font-weight: bold; margin-right: 12px;">
                            📅 Reschedule
                        </a>
                        <a href="${cancelUrl}"
                           style="display: inline-block; background: #ef4444; color: white;
                                  padding: 12px 24px; text-decoration: none; border-radius: 8px;
                                  font-weight: bold;">
                            ❌ Cancel
                        </a>
                    </div>

                    <p style="color: #666; font-size: 14px;">
                        These links expire when your appointment starts. If you cannot make it,
                        please cancel at least 24 hours before your appointment.
                    </p>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 12px;">Primera Denta Dental Clinic</p>
                </div>
            `,
        });
        console.log(`📧 Guest reminder email (${hoursUntil}h) sent to ${email}`);
    } catch (err) {
        console.error('Failed to send guest reminder email:', err.message);
    }
};

/**
 * Send a plain reminder email to an authenticated patient.
 *
 * No action links — patients manage reschedule/cancel from their website dashboard.
 * This is just a "heads up" nudge via email (alongside the in-app notification).
 *
 * @param {string} email - Patient email
 * @param {string} name - Patient name
 * @param {object} details - { date, start_time, service, dentist, hoursUntil }
 */
export const sendPatientReminderEmail = async (email, name, details) => {
    const { date, start_time, service, dentist, hoursUntil } = details;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Primera Denta <noreply@primeradenta.com>',
            to: email,
            subject: `⏰ Reminder: Your Appointment in ${hoursUntil} Hours — Primera Denta`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0ea5e9;">Appointment Reminder</h2>
                    <p>Hi ${name},</p>
                    <p>This is a friendly reminder about your upcoming appointment at <strong>Primera Denta</strong>.</p>

                    <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
                        <tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${service}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${date}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Time:</td><td style="padding: 8px;">${start_time}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Dentist:</td><td style="padding: 8px;">${dentist}</td></tr>
                    </table>

                    <p>📍 <strong>Location:</strong> 7 Himalayan Rd, Tandang Sora, Quezon City</p>

                    <p style="color: #666; font-size: 14px;">
                        Need to cancel or reschedule? Log in to your account on our website to manage your appointments.
                    </p>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 12px;">Primera Denta Dental Clinic</p>
                </div>
            `,
        });
        console.log(`📧 Patient reminder email (${hoursUntil}h) sent to ${email}`);
    } catch (err) {
        console.error('Failed to send patient reminder email:', err.message);
    }
};

/**
 * Create a pair of action tokens (cancel + reschedule) for a guest appointment.
 * Called by the reminder cron job before sending the guest reminder email.
 *
 * @param {string} appointmentId - The appointment UUID
 * @param {string} appointmentDate - 'YYYY-MM-DD' — tokens expire at appointment time
 * @param {string} appointmentTime - 'HH:MM' — tokens expire at appointment time
 * @returns {object} { cancelToken, rescheduleToken }
 */
export const createGuestActionTokens = async (appointmentId, appointmentDate, appointmentTime) => {
    const cancelToken = crypto.randomBytes(32).toString('hex');
    const rescheduleToken = crypto.randomBytes(32).toString('hex');

    // Tokens expire at the appointment start time (no point rescheduling/cancelling after)
    const expiresAt = new Date(`${appointmentDate}T${appointmentTime}`);

    const { error } = await supabaseAdmin.from('guest_action_tokens').insert([
        {
            appointment_id: appointmentId,
            token: cancelToken,
            action: 'cancel',
            expires_at: expiresAt.toISOString(),
        },
        {
            appointment_id: appointmentId,
            token: rescheduleToken,
            action: 'reschedule',
            expires_at: expiresAt.toISOString(),
        },
    ]);

    if (error) {
        console.error('Failed to create guest action tokens:', error.message);
        throw { status: 500, message: 'Failed to create action tokens.' };
    }

    return { cancelToken, rescheduleToken };
};

/**
 * Validate a guest action token and return the appointment info.
 * Used by the frontend pages /guest/cancel and /guest/reschedule.
 *
 * @param {string} token - The token from the email link
 * @param {string} expectedAction - 'cancel' or 'reschedule'
 * @returns {object} { valid, appointment }
 */
export const validateGuestActionToken = async (token, expectedAction) => {
    const { data: tokenRecord, error } = await supabaseAdmin
        .from('guest_action_tokens')
        .select(
            `
            *,
            appointment:appointments(
                id, appointment_date, start_time, end_time, status,
                guest_email, guest_name, guest_phone,
                service:services(id, name, duration_minutes),
                dentist:dentists(profile:profiles(full_name))
            )
        `,
        )
        .eq('token', token)
        .eq('action', expectedAction)
        .single();

    if (error || !tokenRecord) {
        throw { status: 404, message: 'Invalid or expired link.' };
    }

    // Check if already used
    if (tokenRecord.used_at) {
        throw { status: 410, message: 'This link has already been used.' };
    }

    // Check if expired
    if (new Date() > new Date(tokenRecord.expires_at)) {
        throw { status: 410, message: 'This link has expired.' };
    }

    // Check appointment status
    if (tokenRecord.appointment?.status !== 'CONFIRMED') {
        throw {
            status: 400,
            message: `Cannot ${expectedAction} — appointment is already ${tokenRecord.appointment?.status}.`,
        };
    }

    return {
        valid: true,
        token_id: tokenRecord.id,
        appointment: tokenRecord.appointment,
    };
};

/**
 * Mark a guest action token as used (one-time use).
 *
 * @param {string} tokenId - The token UUID
 */
export const markGuestTokenUsed = async (tokenId) => {
    await supabaseAdmin
        .from('guest_action_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenId);
};
