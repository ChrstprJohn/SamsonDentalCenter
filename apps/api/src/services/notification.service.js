import { AppError } from '../utils/errors.js';
import { supabaseAdmin } from '../config/supabase.js';
import { formatDateLong, formatTimePretty, formatDateTimeRange } from '../utils/time.js';
import { sendSMS } from './sms.service.js';

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
 * @param {object} metadata - Optional structured data for frontend rendering
 */
export const sendNotification = async (
    userId,
    type,
    title,
    message,
    channel = 'in_app',
    metadata = null,
) => {
    // ── 0. Safety Check for In-App ──
    // Guests don't have user IDs and thus can't receive in-app notifications.
    if (channel === 'in_app' && !userId) {
        return null; // Skip silently
    }

    // ── 1. Save to Database (if userId exists) ──
    let data = null;
    if (userId) {
        const messageContent = metadata
            ? JSON.stringify({ ...metadata, _isJSON: true, _title: title, _fallback: message })
            : message;

        const { data: insertData, error } = await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: userId,
                type,
                channel,
                title,
                message: messageContent,
                sent_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to send notification record:', error.message);
            // We continue so SMS can still be attempted if applicable
        } else {
            data = insertData;
        }
    }

    // ── 2. External Channels (SMS/Email) ──
    let smsResult = null;
    if (channel === 'sms' && metadata?.phone) {
        const identifier = userId || 'Guest';
        console.log(`[Notification] Triggering SMS for ${identifier} to ${metadata.phone}`);
        smsResult = await sendSMS(metadata.phone, message);
    }

    return { ...data, smsResult };
};

// ─────────────────────────────────────────────
// Typed helpers — call these from other modules
// ─────────────────────────────────────────────

/**
 * Appointment confirmed notification.
 */
export const sendConfirmation = async (userId, appointmentDetails) => {
    const { date, start_time, end_time, service } = appointmentDetails;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);
    return sendNotification(
        userId,
        'CONFIRMATION',
        'Appointment Confirmed!',
        `Your ${service} appointment is confirmed for ${formattedRange}.`,
        'in_app',
        { service, date, start_time, end_time },
    );
};

/**
 * Appointment request received.
 */
export const sendRequestReceived = async (userId, appointmentDetails) => {
    const { date, start_time, end_time, service } = appointmentDetails;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);
    return sendNotification(
        userId,
        'GENERAL',
        'Request Received & Under Review',
        `Your request for ${service} on ${formattedRange} has been received. Our team is currently reviewing your schedule to ensure a dentist is available. We will notify you once it is officially confirmed.`,
        'in_app',
        { service, date, start_time, end_time, status: 'review' },
    );
};

/**
 * Appointment approved.
 */
export const sendApprovalNotice = async (userId, appointmentDetails, phone = null) => {
    const { date, start_time, end_time, service } = appointmentDetails;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);

    const message = `Good news! Your ${service} appointment on ${formattedRange} has been approved. See you at the clinic!`;

    // 1. In-App Notification
    const inAppResult = await sendNotification(
        userId,
        'CONFIRMATION',
        'Appointment Approved!',
        message,
        'in_app',
        { service, date, start_time, end_time, action: 'approved' },
    );

    /* 
    // 2. SMS Notification (if phone provided)
    let smsResult = null;
    if (phone) {
        smsResult = await sendNotification(
            userId,
            'CONFIRMATION',
            'Appointment Approved!',
            message,
            'sms',
            { phone, service, date, start_time, end_time }
        );
    }
    */

    return { inAppResult, smsResult };
};

/**
 * Appointment rejected.
 */
export const sendRejectionNotice = async (userId, appointmentDetails, reason) => {
    const { date, start_time, end_time, service } = appointmentDetails;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);
    return sendNotification(
        userId,
        'CANCELLATION',
        'Appointment Declined',
        `Your request for ${service} on ${formattedRange} was declined. Reason: ${reason}`,
        'in_app',
        { service, date, start_time, end_time, reason, action: 'rejected' },
    );
};

/**
 * Appointment reminder (24h or 48h before).
 */
export const sendReminder = async (userId, appointmentDetails, hoursUntil) => {
    const { date, start_time, end_time, service } = appointmentDetails;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);
    return sendNotification(
        userId,
        'REMINDER',
        `Reminder: Appointment in ${hoursUntil} hours`,
        `Don't forget! Your ${service} appointment is on ${formattedRange}.`,
        'in_app',
        { service, date, start_time, end_time, hoursUntil, action: 'reminder' },
    );
};

/**
 * 48h confirmation reminder — asks patient to confirm they will attend.
 * If no response, supervisor can flag for follow-up.
 */
export const send48hConfirmReminder = async (userId, appointmentDetails) => {
    const { date, start_time, end_time, service } = appointmentDetails;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);
    return sendNotification(
        userId,
        'REMINDER_48H',
        'Please Confirm Your Appointment (48h)',
        `Your ${service} appointment is in 2 days (${formattedRange}). Please confirm you will attend.`,
        'in_app',
        { service, date, start_time, end_time, action: 'reminder_48h' },
    );
};

/**
 * Waitlist offer notification — a slot has become available.
 */
export const sendWaitlistOffer = async (userId, waitlistDetails) => {
    const { date, start_time, service, timeout_minutes } = waitlistDetails;
    return sendNotification(
        userId,
        'WAITLIST',
        'A slot is available!',
        `A slot opened up on ${date} at ${start_time}${service ? ' for ' + service : ''}. You have ${timeout_minutes} minutes to confirm.`,
        'in_app',
        { date, start_time, service, timeout_minutes, action: 'waitlist_offer' },
    );
};

/**
 * Cancellation notification.
 */
export const sendCancellationNotice = async (userId, appointmentDetails) => {
    const { date, start_time, end_time, service } = appointmentDetails;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);
    return sendNotification(
        userId,
        'CANCELLATION',
        'Appointment Cancelled',
        `Your ${service} appointment on ${formattedRange} has been cancelled.`,
        'in_app',
        { service, date, start_time, end_time, action: 'cancelled' },
    );
};

/**
 * No-show notification — patient missed their appointment.
 */
export const sendNoShowNotice = async (userId, appointmentDetails) => {
    const { date, start_time, service } = appointmentDetails;
    return sendNotification(
        userId,
        'NO_SHOW',
        'Missed Appointment',
        `You missed your appointment on ${date} at ${start_time}${service ? ' for ' + service : ''}. Would you like to reschedule?`,
        'in_app',
        { date, start_time, service, action: 'no_show' },
    );
};

/**
 * Restriction notification — patient reached no-show threshold.
 */
export const sendRestrictionNotice = async (userId, restrictionDetails) => {
    const { noShowCount, maxAdvanceDays } = restrictionDetails;
    return sendNotification(
        userId,
        'RESTRICTION',
        'Booking Restrictions Applied',
        `Due to ${noShowCount} missed appointments, your booking has been restricted. You can only book up to ${maxAdvanceDays} days in advance and a deposit may be required. Please contact the clinic for more information.`,
        'in_app',
        { noShowCount, maxAdvanceDays, action: 'restricted' },
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
        'in_app',
        { dentist_name, estimated_delay_minutes, original_time, action: 'delay' },
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
        'in_app',
        { dentist_name, reason, recommended_date, service_name, action: 'follow_up' },
    );
};

/**
 * Appointment rescheduled notification.
 */
export const sendRescheduleNotice = async (userId, oldDetails, newDetails) => {
    const { service } = oldDetails;
    const oldRange = formatDateTimeRange(oldDetails.date, oldDetails.start_time, oldDetails.end_time);
    const newRange = formatDateTimeRange(newDetails.date, newDetails.start_time, newDetails.end_time);

    return sendNotification(
        userId,
        'RESCHEDULE',
        'Appointment Rescheduled',
        `Your ${service} appointment has been moved from ${oldRange} to ${newRange}.`,
        'in_app',
        { service, oldDetails, newDetails, action: 'rescheduled' },
    );
};

// ─────────────────────────────────────────────
// Read / manage notifications
// ─────────────────────────────────────────────

/**
 * Get all notifications for a user (paged).
 *
 * @param {string} userId
 * @param {boolean} unreadOnly - If true, return only unread notifications
 * @param {boolean} includeArchived - If true, include archived notifications
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 */
export const getUserNotifications = async (
    userId,
    unreadOnly = false,
    includeArchived = false,
    page = 1,
    limit = 10,
) => {
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (unreadOnly) {
        query = query.eq('is_read', false);
    }

    if (!includeArchived) {
        query = query.eq('is_archived', false);
    }

    const { data, count, error } = await query;
    if (error) throw new AppError(error.message, 500);

    return { notifications: data, total: count };
};

/**
 * Toggle read status of a single notification.
 */
export const toggleNotificationRead = async (userId, notificationId) => {
    // 1. Fetch the notification to check current status
    const { data: notification, error: fetchError } = await supabaseAdmin
        .from('notifications')
        .select('is_read')
        .eq('id', notificationId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !notification) {
        throw new AppError('Notification not found', 404);
    }

    // 2. Toggle the read status
    const newReadStatus = !notification.is_read;
    const { error: updateError } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: newReadStatus })
        .eq('id', notificationId)
        .eq('user_id', userId);

    if (updateError) {
        throw new AppError('Failed to update notification status', 500);
    }

    return { id: notificationId, is_read: newReadStatus };
};

/**
 * Archive or unarchive a notification.
 */
export const toggleNotificationArchive = async (userId, notificationId) => {
    // 1. Fetch the notification to check current status
    const { data: notification, error: fetchError } = await supabaseAdmin
        .from('notifications')
        .select('is_archived')
        .eq('id', notificationId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !notification) {
        throw new AppError('Notification not found', 404);
    }

    // 2. Toggle the archive status
    const newArchiveStatus = !notification.is_archived;
    const { error: updateError } = await supabaseAdmin
        .from('notifications')
        .update({ is_archived: newArchiveStatus })
        .eq('id', notificationId)
        .eq('user_id', userId);

    if (updateError) {
        throw new AppError('Failed to update notification status', 500);
    }

    return { id: notificationId, is_archived: newArchiveStatus };
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

/**
 * Toggle read status of a single notification (manual version).
 */
export const toggleRead = async (notificationId, userId, isRead) => {
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .update({
            is_read: isRead,
            read_at: isRead ? new Date().toISOString() : null,
        })
        .eq('id', notificationId)
        .eq('user_id', userId)
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
 * Toggle starred status.
 */
export const toggleStar = async (notificationId, userId, isStarred) => {
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .update({ is_starred: isStarred })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();
    if (error) throw new AppError(error.message, 500);
    return data;
};

/**
 * Toggle archived status (manual version).
 */
export const toggleArchive = async (notificationId, userId, isArchived) => {
    const updateData = { is_archived: isArchived };

    // If archiving, automatically unstar
    if (isArchived) {
        updateData.is_starred = false;
    }

    const { data, error } = await supabaseAdmin
        .from('notifications')
        .update(updateData)
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();
    if (error) throw new AppError(error.message, 500);
    return data;
};

/**
 * Get notification stats for a user.
 */
export const getNotificationStats = async (userId) => {
    const [starred, unread, general, waitlist, cancellation] = await Promise.all([
        supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_starred', true)
            .eq('is_archived', false),
        supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false)
            .eq('is_archived', false),
        supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_archived', false)
            .in('type', [
                'GENERAL',
                'CONFIRMATION',
                'REMINDER',
                'REMINDER_48H',
                'APPROVAL',
                'DELAY',
                'FOLLOW_UP',
                'RESCHEDULE',
                'RESTRICTION',
            ]),
        supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('type', 'WAITLIST')
            .eq('is_archived', false),
        supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_archived', false)
            .in('type', ['CANCELLATION', 'REJECTION', 'NO_SHOW']),
    ]);

    return {
        starred: starred.count || 0,
        unread: unread.count || 0,
        general: general.count || 0,
        waitlist: waitlist.count || 0,
        cancellation: cancellation.count || 0,
    };
};
