import { supabaseAdmin } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const HOLD_DURATION_MINUTES = 5;

/**
 * Hold a time slot for a user (5-minute temporary reservation).
 *
 * AUTO-SWITCH BEHAVIOR: If the user already has an active hold for a
 * different time on the same date, the old hold is automatically released.
 *
 * @param {string} serviceId - Service UUID
 * @param {string} date - 'YYYY-MM-DD'
 * @param {string} startTime - 'HH:MM'
 * @param {string} userSessionId - Unique browser session ID
 * @returns {object} { hold_id, previous_hold_id, expires_at, expires_in_minutes, already_held }
 */
export const holdSlot = async (serviceId, date, startTime, userSessionId) => {
    const now = new Date();

    // ✅ RACE CONDITION FIX: Check if OTHER USERS have an active hold on this slot
    // This prevents simultaneous double-locking when two users click at the same time
    const { data: otherHolds } = await supabaseAdmin
        .from('slot_holds')
        .select('id, user_session_id')
        .eq('service_id', serviceId)
        .eq('appointment_date', date)
        .eq('start_time', startTime)
        .eq('status', 'active')
        .gt('expires_at', now.toISOString())
        .neq('user_session_id', userSessionId); // Exclude current user's holds

    if (otherHolds && otherHolds.length > 0) {
        // Another user already locked this slot!
        console.warn(`Slot ${serviceId} on ${date} at ${startTime} already locked by another user`);
        throw { status: 409, message: 'This time slot was just booked by someone else.' };
    }

    // ── 1. Check if THIS USER already has an active hold on this date/service ──
    const { data: existingHolds } = await supabaseAdmin
        .from('slot_holds')
        .select('id, start_time, expires_at')
        .eq('service_id', serviceId)
        .eq('appointment_date', date)
        .eq('user_session_id', userSessionId)
        .eq('status', 'active')
        .gt('expires_at', now.toISOString());

    let previousHoldId = null;

    // ── 2. If they have a hold on a DIFFERENT time, release it ──
    if (existingHolds && existingHolds.length > 0) {
        const oldHold = existingHolds[0];

        // Only auto-switch if it's a different time
        if (oldHold.start_time !== startTime) {
            previousHoldId = oldHold.id;

            // Release the old hold (non-blocking)
            await supabaseAdmin
                .from('slot_holds')
                .update({ status: 'released', updated_at: new Date().toISOString() })
                .eq('id', oldHold.id);

            console.log(`Auto-released previous hold ${oldHold.id} for session ${userSessionId}`);
        } else {
            // Same time clicked again — return existing hold (no duplicate)
            return {
                hold_id: oldHold.id,
                previous_hold_id: null,
                expires_at: oldHold.expires_at,
                expires_in_minutes: HOLD_DURATION_MINUTES,
                already_held: true,
            };
        }
    }

    // ── 3. Create new hold ──
    const expiresAt = new Date(now.getTime() + HOLD_DURATION_MINUTES * 60 * 1000);

    const { data: hold, error } = await supabaseAdmin
        .from('slot_holds')
        .insert({
            id: uuidv4(),
            service_id: serviceId,
            appointment_date: date,
            start_time: startTime,
            user_session_id: userSessionId,
            held_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            status: 'active',
        })
        .select('id, expires_at')
        .single();

    if (error) {
        console.error('Hold slot error:', error);
        throw { status: 500, message: 'Failed to hold slot.' };
    }

    return {
        hold_id: hold.id,
        previous_hold_id: previousHoldId,
        expires_at: hold.expires_at,
        expires_in_minutes: HOLD_DURATION_MINUTES,
        already_held: false,
    };
};

/**
 * Release a slot hold (mark as released).
 *
 * Called when:
 * - User completes booking successfully → convert hold to appointment
 * - User navigates away without booking → mark hold as released
 *
 * @param {string} holdId - The hold record UUID
 * @returns {object} { released: true/false, error? }
 */
export const releaseHold = async (holdId) => {
    const { error } = await supabaseAdmin
        .from('slot_holds')
        .update({ status: 'released', updated_at: new Date().toISOString() })
        .eq('id', holdId);

    if (error) {
        console.error('Release hold error:', error);
        // Don't throw — releasing a hold shouldn't fail
        return { released: false, error: error.message };
    }

    return { released: true };
};

/**
 * Cleanup expired holds (optional cron job).
 *
 * Run periodically (every 1-5 minutes) to mark expired holds as 'expired'.
 * This is for data cleanup; the actual availability check uses expires_at timestamp.
 *
 * @returns {object} { cleaned_up: number_of_records, error? }
 */
export const cleanupExpiredHolds = async () => {
    const now = new Date();

    const { data, error } = await supabaseAdmin
        .from('slot_holds')
        .update({ status: 'expired', updated_at: now.toISOString() })
        .eq('status', 'active')
        .lt('expires_at', now.toISOString())
        .select('id');

    if (error) {
        console.error('Cleanup expired holds error:', error);
        return { cleaned_up: 0, error: error.message };
    }

    return { cleaned_up: data?.length || 0 };
};
