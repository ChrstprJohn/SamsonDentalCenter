import { supabaseAdmin } from '../config/supabase.js';
import { CLINIC_CONFIG } from '../utils/constants.js';
import { AppError } from '../utils/errors.js';
import { generateTimeSlots, timesOverlap, timeToMinutes, minutesToTime, addMinutesToTime } from '../utils/time.js';

/**
 * Get all time slots for a given date and service (including full ones).
 * Frontend can filter based on availability:
 * - For booking: show only slots where available > 0
 * - For waitlist: show all slots (including where available === 0)
 *
 * @param {string} date - Format: 'YYYY-MM-DD' (e.g., '2026-03-01')
 * @param {string} serviceId - The service UUID
 * @returns {object} { all_slots: [{time, available}, ...], date, service, total_available, total_full }
 */

/*
SAMPLE DATA THAT WILL BE RETURNED
{
  "all_slots": [
    { "time": "08:00", "available": 2 },
    { "time": "08:30", "available": 1 },
    { "time": "09:00", "available": 0 },
    { "time": "09:30", "available": 2 }
  ],
  "date": "2026-03-01",
  "service": "Teeth Cleaning",
  "duration_minutes": 30,
  "total_available": 3,
  "total_full": 1
}
*/

export const getAvailableSlots = async (
    date,
    serviceId,
    filterSessionId = null,
    skipNextSearch = false,
    dentistId = null,
    excludeAppointmentId = null,
) => {
    // ✅ NEW: Check if date is today (same-day booking prevention)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate.getTime() === today.getTime()) {
        // Same day booking not allowed
        return handleNoSlots(
            date,
            'N/A',
            0,
            'Same-day bookings are not allowed. Please select a future date.',
            serviceId,
            filterSessionId,
            skipNextSearch,
        );
    }

    // ── 1. Get the service to know its duration ──
    const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

    if (serviceError || !service) {
        throw new AppError('Service not found.', 404);
    }

    const durationMinutes = service.duration_minutes;

    // ── 2. Check if the clinic is open on that day ──
    const dayOfWeek = new Date(date).getDay(); // 0=Sun, 1=Mon, ...

    const { data: clinicDay } = await supabaseAdmin
        .from('clinic_schedule')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .single();

    if (!clinicDay || !clinicDay.is_open) {
        return handleNoSlots(
            date,
            service.name,
            durationMinutes,
            'Clinic is closed on this day.',
            serviceId,
            filterSessionId,
            skipNextSearch,
        );
    }

    // ── 3. Get all active dentists who can perform this service ──
    // Strategy: 
    // - If dentist has entry in dentist_services, they MUST match the serviceId.
    // - If dentist has NO entry in dentist_services, fall back to tier-based check.
    
    // First, get all active dentists
    const { data: allDentists } = await supabaseAdmin
        .from('dentists')
        .select('id, tier')
        .eq('is_active', true);

    if (!allDentists || allDentists.length === 0) {
        return handleNoSlots(date, service.name, durationMinutes, 'No active dentists.', serviceId, filterSessionId, skipNextSearch);
    }

    // Get dentists who have ANY explicit skills listed
    const { data: dentistsWithSkills } = await supabaseAdmin
        .from('dentist_services')
        .select('dentist_id');
    const skilledDentistIds = new Set((dentistsWithSkills || []).map(ds => ds.dentist_id));

    // Get dentists who explicitly have THIS service skill
    const { data: dentistsWithThisService } = await supabaseAdmin
        .from('dentist_services')
        .select('dentist_id')
        .eq('service_id', serviceId);
    const serviceMatchIds = new Set((dentistsWithThisService || []).map(ds => ds.dentist_id));

    // Filter dentists based on Skillset Hierarchy
    const eligibleDentists = allDentists.filter(d => {
        // Tie to a specific dentist if dentistId is provided
        if (dentistId && d.id !== dentistId) return false;

        if (skilledDentistIds.has(d.id)) {
            // ENROLLED in granular system: must have explicit match
            return serviceMatchIds.has(d.id);
        } else {
            // LEGACY/FALLBACK: Match by tier
            if (service.tier === 'general') {
                return ['general', 'both'].includes(d.tier);
            } else if (service.tier === 'specialized') {
                return ['specialized', 'both'].includes(d.tier);
            }
            return false;
        }
    });

    if (!eligibleDentists || eligibleDentists.length === 0) {
        return handleNoSlots(
            date,
            service.name,
            durationMinutes,
            'No dentists available.',
            serviceId,
            filterSessionId,
            skipNextSearch,
        );
    }

    const dentistIds = eligibleDentists.map((d) => d.id);

    // Get each dentist's schedule for that day
    const { data: dentistSchedules } = await supabaseAdmin
        .from('dentist_schedule')
        .select('*')
        .in('dentist_id', dentistIds)
        .eq('day_of_week', dayOfWeek)
        .eq('is_working', true);

    if (!dentistSchedules || dentistSchedules.length === 0) {
        return handleNoSlots(
            date,
            service.name,
            durationMinutes,
            'No dentists working on this day.',
            serviceId,
            filterSessionId,
            skipNextSearch,
        );
    }

    // ── 4. Check dentist availability blocks (leave, sick, etc.) ──
    const { data: blocks } = await supabaseAdmin
        .from('dentist_availability_blocks')
        .select('dentist_id, start_time, end_time')
        .eq('block_date', date);

    // Filter out dentists who are blocked for the ENTIRE day (no start/end time)
    const fullDayBlockedIds = (blocks || [])
        .filter((b) => !b.start_time && !b.end_time)
        .map((b) => b.dentist_id);

    const activeSchedules = dentistSchedules.filter(
        (s) => !fullDayBlockedIds.includes(s.dentist_id),
    );

    if (activeSchedules.length === 0) {
        return handleNoSlots(
            date,
            service.name,
            durationMinutes,
            'No dentists available on this day (blocked/on leave).',
            serviceId,
            filterSessionId,
            skipNextSearch,
        );
    }

    // ── 5. Get existing appointments on that date (not cancelled) ──
    // ✅ NOTE: Waitlist entries are in a separate table (waitlist), not appointments.
    // So we don't need to filter for WAITLISTED status — appointments only include
    // PENDING (awaiting approval) or CONFIRMED (secured slots).
    let apptQuery = supabaseAdmin
        .from('appointments')
        .select('id, dentist_id, start_time, end_time')
        .eq('appointment_date', date)
        .not('status', 'in', '("CANCELLED","LATE_CANCEL","RESCHEDULED")');

    if (excludeAppointmentId) {
        apptQuery = apptQuery.neq('id', excludeAppointmentId);
    }
    const { data: existingAppointments } = await apptQuery;

    // ── 5b. Get active slot holds on that date (GLOBAL capacity check) ──
    const now = new Date();
    let holdQuery = supabaseAdmin
        .from('slot_holds')
        .select('start_time, service:services(duration_minutes), user_session_id')
        .eq('appointment_date', date)
        .eq('status', 'active')
        .gt('expires_at', now.toISOString());

    if (filterSessionId) {
        holdQuery = holdQuery.neq('user_session_id', filterSessionId);
    }
    const { data: activeHolds } = await holdQuery;

    // Combine appointments for dentist-specific occupied list
    const existingAppts = (existingAppointments || []).map((a) => ({
        start_time: a.start_time,
        end_time: a.end_time,
        dentist_id: a.dentist_id,
    }));

    // ── 6. Generate ALL possible time slots from clinic hours (once) ──
    // Use the first active schedule's hours as the clinic hours
    const firstSchedule = activeSchedules[0];
    const clinicStartTime = firstSchedule.start_time;
    const clinicEndTime = firstSchedule.end_time;
    const allPossibleSlots = generateTimeSlots(clinicStartTime, clinicEndTime, durationMinutes);

    // ── 7. For each possible slot, count how many dentists have it available ──
    const allSlots = new Map(); // Map to store {time: {time, available}}

    // Initialize all slots with 0 available
    allPossibleSlots.forEach((slot) => {
        allSlots.set(slot, { time: slot, available: 0 });
    });

    // For each dentist, increment the available count for their free slots
    for (const schedule of activeSchedules) {
        const dentistId = schedule.dentist_id;
        const dentistStartTime = schedule.start_time;
        const dentistEndTime = schedule.end_time;

        // Get this dentist's partial blocks
        const dentistBlocks = (blocks || []).filter(
            (b) => b.dentist_id === dentistId && (b.start_time || b.end_time),
        );

        // Get this dentist's existing appointments
        const dentistAppts = existingAppts.filter((a) => a.dentist_id === dentistId);

        // Generate all possible slots for this dentist
        const possibleSlots = generateTimeSlots(dentistStartTime, dentistEndTime, durationMinutes);

        const freeSlots = possibleSlots.filter((slot) => {
            const slotEnd = addMinutesToTime(slot, durationMinutes);

            // Check if this slot overlaps with any existing appointment
            const hasAppointmentConflict = dentistAppts.some((appt) =>
                timesOverlap(slot, slotEnd, appt.start_time, appt.end_time),
            );
            if (hasAppointmentConflict) return false;

            // Check if this slot overlaps with any partial day block (leave/training)
            const hasBlockConflict = dentistBlocks.some((block) => {
                const bStart = block.start_time || '00:00';
                const bEnd = block.end_time || '23:59';
                return timesOverlap(slot, slotEnd, bStart, bEnd);
            });
            if (hasBlockConflict) return false;

            return true;
        });

        // Increment availability count for this dentist's free slots
        freeSlots.forEach((slot) => {
            if (allSlots.has(slot)) {
                allSlots.get(slot).available += 1;
            }
        });
    }

    // ── 7b. Subtract holds from available count (GLOBAL clinic capacity) ──
    const holdUnits = (activeHolds || []).map((h) => ({
        start_time: h.start_time,
        end_time: addMinutesToTime(h.start_time, h.service.duration_minutes),
    }));

    sortedHoldSlots: for (const slot of allSlots.keys()) {
        const slotEnd = addMinutesToTime(slot, durationMinutes);
        const holdCount = holdUnits.filter((hold) =>
            timesOverlap(slot, slotEnd, hold.start_time, hold.end_time),
        ).length;

        if (holdCount > 0) {
            const slotData = allSlots.get(slot);
            slotData.available = Math.max(0, slotData.available - holdCount);
        }
    }

    // ── 8. Sort and build response with all slots ──
    const sortedSlots = Array.from(allSlots.values()).sort((a, b) => a.time.localeCompare(b.time));

    const totalAvailable = sortedSlots.filter((s) => s.available > 0).length;
    const totalFull = sortedSlots.filter((s) => s.available === 0).length;

    const response = {
        all_slots: sortedSlots,
        date,
        service: service.name,
        duration_minutes: durationMinutes,
        total_available: totalAvailable,
        total_full: totalFull,
    };

    // ✅ If no slots available, find the next available date (unless we are already searching)
    if (totalAvailable === 0 && !skipNextSearch) {
        response.next_available_date = await findNextAvailableDate(
            filterSessionId,
            dentistId,
            excludeAppointmentId,
        );
    }

    return response;
};

/**
 * Handle returns when no slots are available (unifies the suggestion logic)
 */
async function handleNoSlots(
    date,
    serviceName,
    durationMinutes,
    message,
    serviceId,
    filterSessionId,
    skipNextSearch,
) {
    const response = {
        all_slots: [],
        date,
        service: serviceName,
        duration_minutes: durationMinutes,
        total_available: 0,
        total_full: 0,
        message,
    };

    if (!skipNextSearch) {
        response.next_available_date = await findNextAvailableDate(date, serviceId, filterSessionId);
    }

    return response;
}

/**
 * Find the next available date with at least one free slot.
 * Searches up to 14 days into the future.
 */
export const findNextAvailableDate = async (
    startDate,
    serviceId,
    filterSessionId = null,
    dentistId = null,
    excludeAppointmentId = null,
) => {
    try {
        // 1. Get service details
        const { data: service } = await supabaseAdmin
            .from('services')
            .select('tier, name')
            .eq('id', serviceId)
            .single();
        if (!service) return null;

        // 2. Get clinic open days
        const { data: clinicSchedule } = await supabaseAdmin
            .from('clinic_schedule')
            .select('day_of_week')
            .eq('is_open', true);
        const openClinicDays = new Set((clinicSchedule || []).map((d) => d.day_of_week));
        if (openClinicDays.size === 0) return null;

        // 3. Get QUALIFIED active dentists for this specific service
        const { data: allDentists } = await supabaseAdmin
            .from('dentists')
            .select('id, tier')
            .eq('is_active', true);

        if (!allDentists || allDentists.length === 0) return null;

        // Skillset check (matches getAvailableSlots logic)
        const { data: dentistsWithSkills } = await supabaseAdmin
            .from('dentist_services')
            .select('dentist_id');
        const skilledIds = new Set((dentistsWithSkills || []).map(ds => ds.dentist_id));

        const { data: dentistsWithThisService } = await supabaseAdmin
            .from('dentist_services')
            .select('dentist_id')
            .eq('service_id', serviceId);
        const matchIds = new Set((dentistsWithThisService || []).map(ds => ds.dentist_id));

        const qualifiedDentists = allDentists.filter(d => {
            if (dentistId && d.id !== dentistId) return false;
            if (skilledIds.has(d.id)) {
                return matchIds.has(d.id);
            } else {
                return service.tier === 'general' 
                    ? ['general', 'both'].includes(d.tier)
                    : ['specialized', 'both'].includes(d.tier);
            }
        });

        if (qualifiedDentists.length === 0) return null;
        const qIds = qualifiedDentists.map(d => d.id);

        // 4. Get days of week where these QUALIFIED dentists work
        const { data: workingDays } = await supabaseAdmin
            .from('dentist_schedule')
            .select('day_of_week')
            .eq('is_working', true)
            .in('dentist_id', qIds);
        const openDentistDays = new Set((workingDays || []).map((d) => d.day_of_week));

        // Combined intersection: skip any day where either the clinic is closed OR no dentists work
        const allowedDays = new Set([...openClinicDays].filter((x) => openDentistDays.has(x)));

        const start = new Date(startDate);

        // 5. Search forward for up to 30 days (prevent timeouts)
        for (let i = 1; i <= 30; i++) {
            const nextDate = new Date(start);
            nextDate.setDate(nextDate.getDate() + i);

            const dayOfWeek = nextDate.getDay();
            if (!allowedDays.has(dayOfWeek)) continue;

            // ✅ Use local parts to avoid timezone shifting
            const year = nextDate.getFullYear();
            const month = String(nextDate.getMonth() + 1).padStart(2, '0');
            const day = String(nextDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            try {
                // Use skipNextSearch=true to prevent infinite loops and deep recursion
                const result = await getAvailableSlots(
                    dateStr,
                    serviceId,
                    filterSessionId,
                    true,
                    dentistId,
                    excludeAppointmentId,
                );
                if (result.total_available > 0) {
                    return dateStr;
                }
            } catch (e) {
                // Silently skip check errors for a specific day
            }
        }
    } catch (err) {
        console.error('Error in findNextAvailableDate:', err);
    }
    return null;
};

/**
 * Get suggested alternative slots when the requested time is not available.
 * Looks at the same day and nearby days.
 */

/*
SAMPLE DATA THAT WILL BE RETURNED
{
  same_day_alternatives: [
    { time: "13:30", date: "2026-02-20", diff: 30 },
    { time: "15:00", date: "2026-02-20", diff: 60 },
    { time: "16:00", date: "2026-02-20", diff: 120 },
    { time: "11:00", date: "2026-02-20", diff: 180 },
    { time: "10:00", date: "2026-02-20", diff: 240 }
  ],
  next_days_alternatives: [
    { time: "14:30", date: "2026-02-21", diff: 30 },
    { time: "15:30", date: "2026-02-21", diff: 90 },
    { time: "09:00", date: "2026-02-21", diff: 300 },
    { time: "14:15", date: "2026-02-22", diff: 15 },
    { time: "13:00", date: "2026-02-22", diff: 60 },
    { time: "12:00", date: "2026-02-22", diff: 120 },
    { time: "14:45", date: "2026-02-23", diff: 45 },
    { time: "11:30", date: "2026-02-23", diff: 150 },
    { time: "10:30", date: "2026-02-23", diff: 210 }
  ],
  message: "The requested slot is not available. Here are alternatives:"
}
*/

export const getSuggestedSlots = async (date, serviceId, requestedTime) => {
    // Get slots for the same day
    const sameDayResult = await getAvailableSlots(date, serviceId);

    // Find nearby times (closest to what they wanted) - only from available slots
    const nearbySlots = sameDayResult.all_slots
        .filter((s) => s.available > 0) // Only available slots for suggestions
        .map((slot) => ({
            time: slot.time,
            date: date,
            diff: Math.abs(timeToMinutes(slot.time) - timeToMinutes(requestedTime)),
        }))
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 5); // Top 5 closest times

    // Also check next 3 days
    const nextDaySlots = [];
    for (let i = 1; i <= 3; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + i);
        const dateStr = nextDate.toISOString().split('T')[0];

        try {
            const result = await getAvailableSlots(dateStr, serviceId);
            if (result.all_slots.length > 0) {
                // Find slots near the requested time on that day (only available ones)
                const nearSlots = result.all_slots
                    .filter((s) => s.available > 0) // Only available slots
                    .map((slot) => ({
                        time: slot.time,
                        date: dateStr,
                        diff: Math.abs(timeToMinutes(slot.time) - timeToMinutes(requestedTime)),
                    }))
                    .sort((a, b) => a.diff - b.diff)
                    .slice(0, 3);

                nextDaySlots.push(...nearSlots);
            }
        } catch (e) {
            // Skip days that error
        }
    }

    return {
        same_day_alternatives: nearbySlots,
        next_days_alternatives: nextDaySlots,
        message: 'The requested slot is not available. Here are alternatives:',
    };
};

// ──────────────────────────────────────────────────
// END OF FILE
// ──────────────────────────────────────────────────
