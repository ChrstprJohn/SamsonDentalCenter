import { supabaseAdmin } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/errors.js';
import { getAvailableSlots } from './slot.service.js';
import { assignDentist } from './dentist-assignment.service.js';
import { addMinutesToTime } from '../utils/time.js';

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
 * @param {string} [dentistId] - Optional dentist UUID
 * @returns {object} { hold_id, previous_hold_id, expires_at, expires_in_minutes, already_held }
 */
export const holdSlot = async (serviceId, date, startTime, userSessionId, dentistId = null) => {
    const now = new Date();

    // ✅ NEW: Check actual availability (includes doctor schedules, appointments, and OTHER people's holds)
    const availability = await getAvailableSlots(
        date,
        serviceId,
        userSessionId, // filterSessionId ensures we see availability EXCLUDING our own holds
        true,          // skipNextSearch
        dentistId      // optional dentist filter
    );

    const slotInfo = availability.all_slots.find(s => s.time === startTime);
    
    if (!slotInfo || slotInfo.available <= 0) {
        // Slot is either not in the list (closed) or full (held/booked by others)
        console.warn(`Hold attempt failed: Slot ${startTime} on ${date} is not available (available: ${slotInfo?.available || 0})`);
        throw new AppError('This time slot is no longer available.', 409);
    }

    // ── 1. Check if THIS USER already has ANY active hold ──
    const { data: existingHolds } = await supabaseAdmin
        .from('slot_holds')
        .select('id, start_time, appointment_date, expires_at')
        .eq('user_session_id', userSessionId)
        .eq('status', 'active')
        .gt('expires_at', now.toISOString());

    let previousHoldId = null;

    // ── 2. If they have a hold, handle it ──
    if (existingHolds && existingHolds.length > 0) {
        const oldHold = existingHolds[0];

        // If it's for the SAME EXACT SLOT, return existing
        if (oldHold.appointment_date === date && oldHold.start_time === startTime) {
            return {
                hold_id: oldHold.id,
                previous_hold_id: null,
                expires_at: oldHold.expires_at,
                expires_in_minutes: HOLD_DURATION_MINUTES,
                already_held: true,
            };
        }

        // Otherwise (different slot), release the old one to allow the new one
        previousHoldId = oldHold.id;
        await supabaseAdmin
            .from('slot_holds')
            .update({ status: 'released', updated_at: new Date().toISOString() })
            .eq('id', oldHold.id);

        console.log(`Auto-released previous hold ${oldHold.id} for session ${userSessionId}`);
    }

    // ── 3. Create new hold with SOFT-LOCK RETRY ──
    const expiresAt = new Date(now.getTime() + HOLD_DURATION_MINUTES * 60 * 1000);
    const MAX_RETRIES = 3;
    let attempts = 0;
    let hold = null;
    let error = null;
    let finalDentistId = dentistId;

    while (attempts < MAX_RETRIES) {
        attempts++;
        
        // Pick a dentist if none provided (or if previous attempt failed)
        if (!finalDentistId) {
            const { data: service } = await supabaseAdmin.from('services').select('tier, duration_minutes').eq('id', serviceId).single();
            if (service) {
                const hEndTime = addMinutesToTime(startTime, service.duration_minutes);
                finalDentistId = await assignDentist(date, startTime, hEndTime, service.tier, userSessionId);
            }
        }

        if (!finalDentistId && !dentistId) {
            throw new AppError('No specialized dentist available for this slot.', 409);
        }

        // A. Insert the hold
        const myHoldId = uuidv4();
        const { data: insertedHold, error: insertError } = await supabaseAdmin
            .from('slot_holds')
            .insert({
                id: myHoldId,
                service_id: serviceId,
                appointment_date: date,
                start_time: startTime,
                user_session_id: userSessionId,
                dentist_id: finalDentistId,
                held_at: now.toISOString(),
                expires_at: expiresAt.toISOString(),
                status: 'active',
            })
            .select('id, expires_at, dentist_id, created_at')
            .single();
        
        if (insertError) {
            error = insertError;
            break;
        }

        // B. SOFT-LOCK VERIFICATION: Check if anyone else inserted at the SAME time
        // We look for any OTHER active holds for this dentist/slot
        const { data: allHolds } = await supabaseAdmin
            .from('slot_holds')
            .select('id, created_at')
            .eq('appointment_date', date)
            .eq('start_time', startTime)
            .eq('dentist_id', finalDentistId)
            .eq('status', 'active')
            .gt('expires_at', now.toISOString())
            .order('created_at', { ascending: true });

        // If I am NOT the first one in the list, I lost the race.
        if (allHolds && allHolds.length > 1 && allHolds[0].id !== myHoldId) {
            console.warn(`[Race] Session ${userSessionId} lost race for dentist ${finalDentistId}. Retrying...`);
            
            // Delete my hold (quietly)
            await supabaseAdmin.from('slot_holds').delete().eq('id', myHoldId);
            
            finalDentistId = null; // Re-assign next loop
            continue;
        }

        hold = insertedHold;
        break; 
    }

    if (!hold) {
        console.error('Hold slot error after retries:', error);
        throw new AppError('This slot was just taken by another user. Please try again.', 409);
    }

    return {
        hold_id: hold.id,
        previous_hold_id: previousHoldId,
        expires_at: hold.expires_at,
        expires_in_minutes: HOLD_DURATION_MINUTES,
        already_held: false,
        dentist_id: hold.dentist_id,
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
