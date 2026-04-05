import { AppError } from '../utils/errors.js';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * Send a notification to a user.
 *
 * Saves to the notifications table (in-app). Ready to extend with email/SMS.
 *
 * @param {string} userId - User's profile UUID
 * @param {string} type - 'CONFIRMATION' | 'REMINDER' | 'CANCELLATION' | 'WAITLIST' | 'RESCHEDULE' | 'NO_SHOW' | 'RESTRICTION' | 'DELAY' | 'FOLLOW_UP' | 'GENERAL'
 * @param {string} title - Short title shown in notification bell
 * @param {string} message - Full message body
 * @param {string} channel - 'in_app' | 'email' | 'sms' (default: 'in_app')
 */
export const sendNotification = async (userId, type, title, message, channel = 'in_app') => {
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .insert({
            user_id: userId,
            type,
            channel,
            title,
            message,
        })
        .select()
        .single();

    if (error) {
        // Don't crash the main flow if notification fails — just log it
        console.error('Failed to send notification:', error.message);
        return null;
    }

    // ── Future: Plug in email/SMS here ──
    // if (channel === 'email') await sendEmail(userId, title, message);
    // if (channel === 'sms')   await sendSMS(userId, message);
    //
    // NOTE: Booking/cancellation/reschedule emails are already handled in
    // email-confirmation.service.js (Module 06) using Resend.
    // This service handles IN-APP notifications (the notification bell in UI).

    return data;
};

// ─────────────────────────────────────────────
// Typed helpers — call these from other modules
// ─────────────────────────────────────────────

/**
 * Appointment confirmed notification.
 */
export const sendConfirmation = async (userId, appointmentDetails) => {
    const { date, start_time, service } = appointmentDetails;
    return sendNotification(
        userId,
        'CONFIRMATION',
        'Appointment Confirmed!',
        `Your ${service} appointment is confirmed for ${date} at ${start_time}.`,
    );
};

/**
 * Appointment reminder (24h or 48h before).
 */
export const sendReminder = async (userId, appointmentDetails, hoursUntil) => {
    const { date, start_time, service } = appointmentDetails;
    return sendNotification(
        userId,
        'REMINDER',
        `Reminder: Appointment in ${hoursUntil} hours`,
        `Don't forget! Your ${service} appointment is on ${date} at ${start_time}.`,
    );
};

/**
 * 48h confirmation reminder — asks patient to confirm they will attend.
 * If no response, supervisor can flag for follow-up.
 */
export const send48hConfirmReminder = async (userId, appointmentDetails) => {
    const { date, start_time, service } = appointmentDetails;
    return sendNotification(
        userId,
        'REMINDER_48H',
        'Please Confirm Your Appointment (48h)',
        `Your ${service} appointment is in 2 days (${date} at ${start_time}). Please confirm you will attend. If you cannot make it, please cancel or reschedule.`,
    );
};

/**
 * Cancellation notification.
 */
export const sendCancellationNotice = async (userId, appointmentDetails) => {
    const { date, start_time, service } = appointmentDetails;
    return sendNotification(
        userId,
        'CANCELLATION',
        'Appointment Cancelled',
        `Your ${service} appointment on ${date} at ${start_time} has been cancelled.`,
    );
};

/**
 * Delay notification — dentist is running late.
 */
export const sendDelayNotification = async (userId, delayDetails) => {
    const { dentist_name, estimated_delay_minutes, original_time } = delayDetails;
    return sendNotification(
        userId,
        'DELAY',
        `Appointment Delayed — ${estimated_delay_minutes} min`,
        `Dr. ${dentist_name} is running approximately ${estimated_delay_minutes} minutes behind schedule. Your appointment at ${original_time} may start late. We apologize for the inconvenience.`,
    );
};

/**
 * Follow-up visit reminder — dentist recommended a follow-up.
 */
export const sendFollowUpReminder = async (userId, followUpDetails) => {
    const { dentist_name, reason, recommended_date, service_name } = followUpDetails;
    return sendNotification(
        userId,
        'FOLLOW_UP',
        'Follow-Up Visit Recommended',
        `Dr. ${dentist_name} has recommended a follow-up ${service_name ? service_name + ' ' : ''}appointment${recommended_date ? ' around ' + recommended_date : ''}. Reason: ${reason}. Please book your follow-up at your convenience.`,
    );
};

// ─────────────────────────────────────────────
// Read / manage notifications
// ─────────────────────────────────────────────

/**
 * Get all notifications for a user (latest first, max 50).
 *
 * @param {string} userId
 * @param {boolean} unreadOnly - If true, return only unread notifications
 */
export const getUserNotifications = async (userId, unreadOnly = false) => {
    let query = supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })
        .limit(50);

    if (unreadOnly) {
        query = query.eq('is_read', false);
    }

    const { data, error } = await query;
    if (error) throw new AppError(error.message, 500);

    return data;
};

/**
 * Mark a single notification as read.
 */
export const markAsRead = async (notificationId, userId) => {
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .update({
            is_read: true,
            read_at: new Date().toISOString(),
        })
        .eq('id', notificationId)
        .eq('user_id', userId) // Security: only your own notifications
        .select()
        .single();

    if (error || !data) {
        throw new AppError('Notification not found.', 404);
    }

    return data;
};

/**
 * Mark ALL unread notifications as read for a user.
 */
export const markAllAsRead = async (userId) => {
    const { error } = await supabaseAdmin
        .from('notifications')
        .update({
            is_read: true,
            read_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (error) throw new AppError(error.message, 500);

    return { message: 'All notifications marked as read.' };
};

/**
 * Get unread notification count — used for the bell badge in the UI.
 */
export const getUnreadCount = async (userId) => {
    const { count, error } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (error) throw new AppError(error.message, 500);

    return { unread_count: count };
};
