import { supabaseAdmin } from '../config/supabase.js';

/**
 * Auto-assign the best available dentist for a given date and time slot.
 *
 * Strategy: "Tier Filter + Least Busy"
 *   1. Filter dentists by service tier (general → general/both, specialized → specialized/both)
 *   2. Among matching dentists, find who works on that day
 *   3. Remove dentists already booked at that time
 *   4. Pick the least busy one
 *
 * @param {string} date - 'YYYY-MM-DD'
 * @param {string} startTime - 'HH:MM'
 * @param {string} endTime - 'HH:MM'
 * @param {string} serviceTier - 'general' or 'specialized' (default: 'general')
 * @returns {string|null} dentist ID or null if nobody is free
 */
export const assignDentist = async (date, startTime, endTime, serviceTier = 'general') => {
    const dayOfWeek = new Date(date).getDay();

    // ── 1. Get dentists matching the service tier ──
    const tierFilter =
        serviceTier === 'specialized' ? ['specialized', 'both'] : ['general', 'both'];

    const { data: tierDentists } = await supabaseAdmin
        .from('dentists')
        .select('id')
        .in('tier', tierFilter)
        .eq('is_active', true);

    if (!tierDentists || tierDentists.length === 0) {
        return null; // No dentists for this tier
    }

    const tierDentistIds = tierDentists.map((d) => d.id);

    // ── 2. Get which of those dentists work on this day ──
    const { data: workingDentists } = await supabaseAdmin
        .from('dentist_schedule')
        .select('dentist_id, start_time, end_time')
        .in('dentist_id', tierDentistIds)
        .eq('day_of_week', dayOfWeek)
        .eq('is_working', true);

    if (!workingDentists || workingDentists.length === 0) {
        return null; // No matching dentists working
    }

    // ── 3. Filter: dentist's shift must cover the requested time ──
    const eligibleDentists = workingDentists.filter((ds) => {
        return ds.start_time <= startTime && ds.end_time >= endTime;
    });

    if (eligibleDentists.length === 0) {
        return null; // No dentist covers this time
    }

    // ── 4. Check which of these dentists are NOT booked at this time ──
    const dentistIds = eligibleDentists.map((d) => d.dentist_id);

    // Check dentist availability blocks (leave, sick, etc.)
    const { data: blocks } = await supabaseAdmin
        .from('dentist_availability_blocks')
        .select('dentist_id')
        .eq('block_date', date)
        .in('dentist_id', dentistIds);

    const blockedIds = (blocks || []).map((b) => b.dentist_id);
    const unblockedDentistIds = dentistIds.filter((id) => !blockedIds.includes(id));

    if (unblockedDentistIds.length === 0) {
        return null; // All are blocked/on leave
    }

    const { data: conflictingAppointments } = await supabaseAdmin
        .from('appointments')
        .select('dentist_id')
        .eq('appointment_date', date)
        // ✅ Only exclude actual cancellations. PENDING and CONFIRMED both count as booked slots.
        // Waitlist entries are in a separate table (waitlist), not appointments.
        .not('status', 'in', '("CANCELLED","LATE_CANCEL")')
        // IMPORTANT: Include PENDING appointments in conflicts!
        // PENDING = unconfirmed but slot is reserved, must not double-book
        .in('dentist_id', unblockedDentistIds)
        // Check for time overlap
        .lt('start_time', endTime)
        .gt('end_time', startTime);

    const busyDentistIds = (conflictingAppointments || []).map((a) => a.dentist_id);
    const freeDentists = unblockedDentistIds.filter((id) => !busyDentistIds.includes(id));

    if (freeDentists.length === 0) {
        return null; // All dentists booked at this time
    }

    // ── 5. Among free dentists, pick the LEAST BUSY one ──
    const { data: dayCounts } = await supabaseAdmin
        .from('appointments')
        .select('dentist_id')
        .eq('appointment_date', date)
        .not('status', 'in', '("CANCELLED","LATE_CANCEL")')
        .in('dentist_id', freeDentists);

    // Count appointments per dentist
    const countMap = {};
    freeDentists.forEach((id) => {
        countMap[id] = 0;
    });
    (dayCounts || []).forEach((a) => {
        if (countMap[a.dentist_id] !== undefined) {
            countMap[a.dentist_id]++;
        }
    });

    // Sort by count (ascending) and pick the first (least busy)
    const sorted = Object.entries(countMap).sort((a, b) => a[1] - b[1]);

    return sorted[0][0]; // Return dentist_id of least busy
};
