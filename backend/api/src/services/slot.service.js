import { supabaseAdmin } from '../config/supabase.js';
import { CLINIC_CONFIG } from '../utils/constants.js';

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

export const getAvailableSlots = async (date, serviceId, filterSessionId = null) => {
    // ✅ NEW: Check if date is today (same-day booking prevention)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate.getTime() === today.getTime()) {
        // Same day booking not allowed
        return {
            all_slots: [],
            date,
            service: 'N/A',
            total_available: 0,
            total_full: 0,
            message: 'Same-day bookings are not allowed. Please select a future date.',
        };
    }

    // ── 1. Get the service to know its duration ──
    const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

    if (serviceError || !service) {
        throw { status: 404, message: 'Service not found.' };
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
        return {
            all_slots: [],
            date,
            service: service.name,
            total_available: 0,
            total_full: 0,
            message: 'Clinic is closed on this day.',
        };
    }

    // ── 3. Get all active dentists who work on that day ──
    const { data: dentists } = await supabaseAdmin
        .from('dentists')
        .select('id, profile_id')
        .eq('is_active', true);

    if (!dentists || dentists.length === 0) {
        return {
            all_slots: [],
            date,
            service: service.name,
            total_available: 0,
            total_full: 0,
            message: 'No dentists available.',
        };
    }

    const dentistIds = dentists.map((d) => d.id);

    // Get each dentist's schedule for that day
    const { data: dentistSchedules } = await supabaseAdmin
        .from('dentist_schedule')
        .select('*')
        .in('dentist_id', dentistIds)
        .eq('day_of_week', dayOfWeek)
        .eq('is_working', true);

    if (!dentistSchedules || dentistSchedules.length === 0) {
        return {
            all_slots: [],
            date,
            service: service.name,
            total_available: 0,
            total_full: 0,
            message: 'No dentists working on this day.',
        };
    }

    // ── 4. Check dentist availability blocks (leave, sick, etc.) ──
    const { data: blocks } = await supabaseAdmin
        .from('dentist_availability_blocks')
        .select('dentist_id')
        .eq('block_date', date);

    const blockedDentistIds = (blocks || []).map((b) => b.dentist_id);

    // Filter out blocked dentists from schedules
    const activeSchedules = dentistSchedules.filter(
        (s) => !blockedDentistIds.includes(s.dentist_id),
    );

    if (activeSchedules.length === 0) {
        return {
            all_slots: [],
            date,
            service: service.name,
            total_available: 0,
            total_full: 0,
            message: 'No dentists available on this day (blocked/on leave).',
        };
    }

    // ── 5. Get existing appointments on that date (not cancelled) ──
    // ✅ NOTE: Waitlist entries are in a separate table (waitlist), not appointments.
    // So we don't need to filter for WAITLISTED status — appointments only include
    // PENDING (awaiting approval) or CONFIRMED (secured slots).
    const { data: existingAppointments } = await supabaseAdmin
        .from('appointments')
        .select('dentist_id, start_time, end_time')
        .eq('appointment_date', date)
        .not('status', 'in', '("CANCELLED","LATE_CANCEL")');

    // ── 5b. Get active slot holds on that date (RACE CONDITION FIX) ──
    // Holds represent temporary reservations that should be treated like booked slots
    const now = new Date();
    let holdQuery = supabaseAdmin
        .from('slot_holds')
        .select('start_time, user_session_id')
        .eq('service_id', serviceId)
        .eq('appointment_date', date)
        .eq('status', 'active')
        .gt('expires_at', now.toISOString()); // Only non-expired holds

    if (filterSessionId) {
        holdQuery = holdQuery.neq('user_session_id', filterSessionId);
    }
    const { data: activeHolds } = await holdQuery;

    // Combine holds and appointments into a single "occupied" list
    // We'll use this to check availability
    const occupiedSlots = [
        ...(existingAppointments || []).map((a) => ({
            type: 'appointment',
            start_time: a.start_time,
            end_time: a.end_time,
            dentist_id: a.dentist_id,
        })),
        ...(activeHolds || []).map((h) => ({
            type: 'hold',
            start_time: h.start_time,
            end_time: addMinutes(h.start_time, durationMinutes),
            dentist_id: null, // Holds don't apply to specific dentists yet
        })),
    ];

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
        const startTime = schedule.start_time;
        const endTime = schedule.end_time;

        // Generate all possible slots for this dentist
        const possibleSlots = generateTimeSlots(startTime, endTime, durationMinutes);

        // Filter out slots that conflict with existing appointments AND active holds
        const dentistOccupied = occupiedSlots.filter(
            (occupied) => occupied.dentist_id === null || occupied.dentist_id === dentistId,
        );

        const freeSlots = possibleSlots.filter((slot) => {
            const slotEnd = addMinutes(slot, durationMinutes);
            // Check if this slot overlaps with any existing appointment or active hold
            return !dentistOccupied.some((occupied) =>
                timesOverlap(slot, slotEnd, occupied.start_time, occupied.end_time),
            );
        });

        // Increment availability count for this dentist's free slots
        freeSlots.forEach((slot) => {
            if (allSlots.has(slot)) {
                allSlots.get(slot).available += 1;
            }
        });
    }

    // ── 8. Sort and build response with all slots ──
    const sortedSlots = Array.from(allSlots.values()).sort((a, b) => a.time.localeCompare(b.time));

    const totalAvailable = sortedSlots.filter((s) => s.available > 0).length;
    const totalFull = sortedSlots.filter((s) => s.available === 0).length;

    return {
        all_slots: sortedSlots,
        date,
        service: service.name,
        duration_minutes: durationMinutes,
        total_available: totalAvailable,
        total_full: totalFull,
    };
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
// HELPER FUNCTIONS (used only in this file)
// ──────────────────────────────────────────────────

/**
 * Generate time slots between start and end with given interval.
 * Example: generateTimeSlots('08:00', '12:00', 30)
 *   → ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
 */
function generateTimeSlots(startTime, endTime, intervalMinutes) {
    const slots = [];
    let currentMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime) - intervalMinutes; // Last slot must END before closing

    while (currentMinutes <= endMinutes) {
        slots.push(minutesToTime(currentMinutes));
        currentMinutes += intervalMinutes;
    }

    return slots;
}

/**
 * Check if two time ranges overlap.
 * Example: timesOverlap('09:00', '09:30', '09:00', '09:30') → true (exact same time)
 * Example: timesOverlap('09:00', '09:30', '09:30', '10:00') → false (back to back is OK)
 */
function timesOverlap(start1, end1, start2, end2) {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return s1 < e2 && s2 < e1;
}

/**
 * Convert "HH:MM" or "HH:MM:SS" string to total minutes since midnight.
 * Example: timeToMinutes('09:30') → 570
 */
function timeToMinutes(timeStr) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

/**
 * Convert minutes since midnight to "HH:MM" string.
 * Example: minutesToTime(570) → '09:30'
 */
function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, '0');
    const mins = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
}

/**
 * Add minutes to a time string.
 * Example: addMinutes('09:00', 30) → '09:30'
 */
function addMinutes(timeStr, minutes) {
    return minutesToTime(timeToMinutes(timeStr) + minutes);
}
