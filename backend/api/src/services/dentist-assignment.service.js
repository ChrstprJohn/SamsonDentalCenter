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
export const assignDentist = async (date, startTime, endTime, serviceTier = 'general', filterSessionId = null) => {
    const dayOfWeek = new Date(date).getDay();

    // ── 1. Get dentists matching the service tier ──
    const tierFilter =
        serviceTier === 'specialized' ? ['specialized', 'both'] : ['general', 'both'];

    const { data: tierDentists } = await supabaseAdmin
        .from('dentists')
        .select('id, tier')
        .in('tier', tierFilter)
        .eq('is_active', true);

    if (!tierDentists || tierDentists.length === 0) {
        return null; // No dentists for this tier
    }

    // Map for quick tier lookup
    const dentistTierMap = {};
    tierDentists.forEach((d) => {
        dentistTierMap[d.id] = d.tier;
    });

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
        // Normalize DB 'HH:MM:SS' to 'HH:MM' for reliable string comparison
        const dsStart = ds.start_time.slice(0, 5);
        const dsEnd = ds.end_time.slice(0, 5);
        return dsStart <= startTime && dsEnd >= endTime;
    });

    if (eligibleDentists.length === 0) {
        return null; // No dentist covers this time
    }

    // ── 4. Check which of these dentists are NOT booked at this time ──
    const eligibleDentistIds = eligibleDentists.map((d) => d.dentist_id);

    // Check dentist availability blocks (leave, sick, etc.)
    const { data: blocks } = await supabaseAdmin
        .from('dentist_availability_blocks')
        .select('dentist_id')
        .eq('block_date', date)
        .in('dentist_id', eligibleDentistIds);

    const blockedIds = (blocks || []).map((b) => b.dentist_id);
    const unblockedDentistIds = eligibleDentistIds.filter((id) => !blockedIds.includes(id));

    if (unblockedDentistIds.length === 0) {
        return null; // All are blocked/on leave
    }

    const { data: conflictingAppointments } = await supabaseAdmin
        .from('appointments')
        .select('dentist_id')
        .eq('appointment_date', date)
        .not('status', 'in', '("CANCELLED","LATE_CANCEL")')
        .in('dentist_id', unblockedDentistIds)
        .lt('start_time', endTime)
        .gt('end_time', startTime);

    const busyByAppointmentIds = (conflictingAppointments || []).map((a) => a.dentist_id);
    
    // ✅ NEW: Check which of these dentists are HELD at this time
    let holdQuery = supabaseAdmin
        .from('slot_holds')
        .select('dentist_id')
        .eq('appointment_date', date)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .in('dentist_id', unblockedDentistIds)
        .lt('start_time', endTime);
    
    if (filterSessionId) {
        holdQuery = holdQuery.neq('user_session_id', filterSessionId);
    }
    
    const { data: conflictingHolds } = await holdQuery;
    
    const busyByHoldIds = (conflictingHolds || [])
        .filter(h => h.dentist_id !== null)
        .map((h) => h.dentist_id);

    const freeDentists = unblockedDentistIds.filter(
        (id) => !busyByAppointmentIds.includes(id) && !busyByHoldIds.includes(id)
    );

    if (freeDentists.length === 0) {
        return null; // All dentists booked at this time
    }

    // ── 5. Among free dentists, pick based on PRIORITY then LEAST BUSY ──
    // Priority Rank: 0 (Match), 1 (Both)
    const getPriorityRank = (dentistId) => {
        const tier = dentistTierMap[dentistId];
        if (tier === serviceTier) return 0; // Perfect match (general->general or specialized->specialized)
        if (tier === 'both') return 1; // "Both" is secondary
        return 2; // Fallback
    };

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

    // Sort by: 1. Priority Rank (Match > Both), 2. Appointment count (Least busy)
    const candidates = freeDentists.map((id) => ({
        id,
        rank: getPriorityRank(id),
        count: countMap[id],
    }));

    candidates.sort((a, b) => {
        if (a.rank !== b.rank) return a.rank - b.rank;
        if (a.count !== b.count) return a.count - b.count;
        return Math.random() - 0.5; // ✅ Randomize among equal candidates to avoid concurrent collisions
    });

    return candidates[0].id;
};
