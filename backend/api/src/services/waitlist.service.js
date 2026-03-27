import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { WAITLIST_STATUS, APPOINTMENT_STATUS, CLINIC_CONFIG } from '../utils/constants.js';

/**
 * Add a patient to the waitlist.
 *
 * @param {string} patientId - Patient UUID
 * @param {string} serviceId - Service UUID
 * @param {string} date - Preferred date 'YYYY-MM-DD'
 * @param {string} time - Preferred time 'HH:MM' (optional)
 * @param {number} priority - 0 = normal, 1 = urgent
 */
export const joinWaitlist = async (patientId, serviceId, date, time = null, priority = 0) => {
    // ── 1. Check if already on waitlist for this date + service + time ──
    // FIX: Include preferred_time in the duplicate check.
    // Without this, a patient waiting for 09:00 would be blocked from also waiting for 10:00.
    let query = supabaseAdmin
        .from('waitlist')
        .select('id')
        .eq('patient_id', patientId)
        .eq('service_id', serviceId)
        .eq('preferred_date', date)
        .eq('status', WAITLIST_STATUS.WAITING);

    // If a specific time was provided, check for that exact time.
    // If no time (null), check for other null-time entries (any-time waitlist).
    if (time) {
        query = query.eq('preferred_time', time);
    } else {
        query = query.is('preferred_time', null);
    }

    const { data: existing } = await query.single();

    if (existing) {
        throw {
            status: 400,
            message: 'You are already on the waitlist for this date, service, and time.',
        };
    }

    // ── 2. Add to waitlist ──
    const { data, error } = await supabaseAdmin
        .from('waitlist')
        .insert({
            patient_id: patientId,
            service_id: serviceId,
            preferred_date: date,
            preferred_time: time,
            priority,
            status: WAITLIST_STATUS.WAITING,
        })
        .select(
            `
      *,
      service:services(name)
    `,
        )
        .single();

    if (error) throw { status: 500, message: error.message };

    // ── 3. Calculate queue position ──
    const { count } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('preferred_date', date)
        .eq('service_id', serviceId)
        .eq('status', WAITLIST_STATUS.WAITING);

    return {
        success: true,
        message: 'Added to waitlist',
        waitlist_entry: {
            id: data.id,
            service_id: data.service_id,
            service_name: data.service?.name,
            preferred_date: data.preferred_date,
            preferred_time: data.preferred_time,
            position: count,
            status: data.status,
            joined_at: data.created_at,
        },
    };
};

/**
 * Get a patient's waitlist entries.
 */
export const getMyWaitlist = async (patientId) => {
    const { data, error } = await supabaseAdmin
        .from('waitlist')
        .select(
            `
      *,
      service:services(name)
    `,
        )
        .eq('patient_id', patientId)
        .in('status', [WAITLIST_STATUS.WAITING, WAITLIST_STATUS.NOTIFIED])
        .order('preferred_date')
        .order('created_at');

    if (error) throw { status: 500, message: error.message };

    // Calculate position for each entry (based on priority and created_at)
    const positionMap = {};
    let position = 1;
    data.forEach((entry) => {
        const key = `${entry.preferred_date}-${entry.service_id}-${entry.preferred_time || 'any'}`;
        if (!positionMap[key]) {
            positionMap[key] = position++;
        }
    });

    return data.map((entry) => {
        const key = `${entry.preferred_date}-${entry.service_id}-${entry.preferred_time || 'any'}`;
        const displayStatus =
            entry.status === WAITLIST_STATUS.NOTIFIED ? 'OFFER_PENDING' : entry.status;

        return {
            id: entry.id,
            service_id: entry.service_id,
            service_name: entry.service?.name,
            preferred_date: entry.preferred_date,
            preferred_time: entry.preferred_time,
            position: positionMap[key],
            status: displayStatus,
            offer_expires_at: entry.expires_at,
            joined_at: entry.created_at,
        };
    });
};

/**
 * Cancel a waitlist entry.
 */
export const cancelWaitlistEntry = async (waitlistId, patientId) => {
    const { data, error } = await supabaseAdmin
        .from('waitlist')
        .update({
            status: WAITLIST_STATUS.CANCELLED,
            updated_at: new Date().toISOString(),
        })
        .eq('id', waitlistId)
        .eq('patient_id', patientId)
        .eq('status', WAITLIST_STATUS.WAITING)
        .select()
        .single();

    if (error || !data) {
        throw { status: 404, message: 'Waitlist entry not found or cannot be cancelled.' };
    }

    return { message: 'Removed from waitlist.', entry: data };
};

/**
 * When a slot opens up (e.g., cancellation), notify the first person in line.
 *
 * Called by: Module 08 cancel controller, or recursively when an offer expires.
 *
 * @param {object} freedSlot - { date, start_time, end_time, service_id }
 */
export const notifyWaitlist = async (freedSlot) => {
    const { date, start_time, service_id } = freedSlot;

    // ── 1. Find waitlisted patients for this date and service ──
    // Match patients who want this specific time OR any time (preferred_time is null)
    // Order by: priority DESC (urgent first), then created_at ASC (first come first served)
    const { data: waitlistEntries, error } = await supabaseAdmin
        .from('waitlist')
        .select('*')
        .eq('preferred_date', date)
        .eq('service_id', service_id)
        .eq('status', WAITLIST_STATUS.WAITING)
        .or(`preferred_time.eq.${start_time},preferred_time.is.null`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

    if (error || !waitlistEntries || waitlistEntries.length === 0) {
        return { notified: false, message: 'No one on waitlist for this slot.' };
    }

    // ── 1.5. 🔴 CHECK 3-HOUR NOTICE BUFFER ──
    // Don't notify waitlist if cancellation occurs less than 3 hours before appointment
    // This protects both patients (time to prepare) and clinic (prep time)
    const appointmentDateTime = new Date(`${date}T${start_time}`);
    const currentTime = new Date();
    const minutesUntilAppointment = Math.floor((appointmentDateTime - currentTime) / (1000 * 60));

    if (minutesUntilAppointment < CLINIC_CONFIG.WAITLIST_MIN_NOTICE_MINUTES) {
        console.log(
            `⏰ [WAITLIST] Insufficient notice for ${date} @ ${start_time}: ${minutesUntilAppointment}min < ${CLINIC_CONFIG.WAITLIST_MIN_NOTICE_MINUTES}min. NOT notifying waitlist.`,
        );
        return {
            notified: false,
            message: 'Cancellation too close to appointment time. Waitlist not notified.',
            minutesUntilAppointment,
            minimumRequired: CLINIC_CONFIG.WAITLIST_MIN_NOTICE_MINUTES,
            reason: 'insufficient_notice',
        };
    }

    // ── 2. Notify the first patient ──
    const firstInLine = waitlistEntries[0];

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + CLINIC_CONFIG.WAITLIST_TIMEOUT_MINUTES);

    const token = crypto.randomBytes(32).toString('hex');

    await supabaseAdmin
        .from('waitlist')
        .update({
            status: WAITLIST_STATUS.NOTIFIED,
            notified_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
            // Store the actual offered time so we know which slot to book on confirm
            preferred_time: start_time,
            claim_token: token,
            updated_at: new Date().toISOString(),
        })
        .eq('id', firstInLine.id);

    // ── 3. Create a notification record ──
    // (If Module 11 is built, this would also send email/SMS)
    await supabaseAdmin.from('notifications').insert({
        user_id: firstInLine.patient_id,
        type: 'WAITLIST',
        channel: 'in_app',
        title: 'A slot is available!',
        message: `A slot opened up on ${date} at ${start_time}. You have ${CLINIC_CONFIG.WAITLIST_TIMEOUT_MINUTES} minutes to confirm.`,
    });

    return {
        notified: true,
        patient_id: firstInLine.patient_id,
        waitlist_id: firstInLine.id,
        expires_at: expiresAt.toISOString(),
        message: `Notified patient. They have ${CLINIC_CONFIG.WAITLIST_TIMEOUT_MINUTES} min to confirm.`,
    };
};

/**
 * Patient confirms a waitlist offer (books the freed slot).
 *
 * Handles:
 * - Expired offers → cascade to next person
 * - Swap logic → if patient already has CONFIRMED OR PENDING for same date+service, auto-cancel old
 *   * CONFIRMED: Auto-cancel + cascade (frees a slot for waitlist)
 *   * PENDING: Auto-cancel + NO cascade (specialized service awaiting approval)
 * - Cleanup → remove remaining WAITING entries for same patient+date+service
 *
 * 🔴 FIX FOR SPECIALIZED SERVICES:
 * User can accept waitlist BEFORE receptionist approves their PENDING appointment.
 * This logic ensures no duplicate appointments are created.
 */
export const confirmWaitlistOffer = async (waitlistId, patientId) => {
    // ── 1. Get the waitlist entry ──
    const { data: entry, error } = await supabaseAdmin
        .from('waitlist')
        .select('*')
        .eq('id', waitlistId)
        .eq('patient_id', patientId)
        .eq('status', WAITLIST_STATUS.NOTIFIED)
        .single();

    if (error || !entry) {
        throw { status: 404, message: 'Waitlist offer not found or already expired.' };
    }

    // ── 2. Check if the offer has expired ──
    if (new Date() > new Date(entry.expires_at)) {
        // Mark as expired
        await supabaseAdmin
            .from('waitlist')
            .update({ status: WAITLIST_STATUS.EXPIRED, updated_at: new Date().toISOString() })
            .eq('id', waitlistId);

        // ── CASCADE: Notify the next person in line ──
        // This is the key fix — expired offers don't just die, they pass to the next person.
        await notifyWaitlist({
            date: entry.preferred_date,
            start_time: entry.preferred_time,
            service_id: entry.service_id,
        });

        throw {
            status: 410,
            message:
                'This offer has expired. The slot has been offered to the next person in line.',
        };
    }

    // ── 3. SWAP LOGIC: Check if patient already has CONFIRMED or PENDING for same date + service ──
    // 🔴 CRITICAL FIX: Check BOTH statuses to handle specialized services
    //
    // Scenario 1 (General Service): Patient has CONFIRMED appointment
    //   → Auto-cancel + free slot + cascade to waitlist
    //
    // Scenario 2 (Specialized Service): Patient has PENDING appointment (awaiting approval)
    //   → User accepts waitlist BEFORE receptionist approves
    //   → Auto-cancel the PENDING (it's not live yet, no cascade needed)
    //   → Proceed with new waitlist appointment
    //
    // Example: Patient has Cleaning at 09:00 on March 2 (status: PENDING/CONFIRMED).
    //          Waitlist offer is Cleaning at 10:00 on March 2.
    //          Auto-cancel the 09:00, which frees it (if CONFIRMED, cascade via notifyWaitlist).
    const { data: existingAppointment } = await supabaseAdmin
        .from('appointments')
        .select('id, start_time, status')
        .eq('patient_id', patientId)
        .eq('service_id', entry.service_id)
        .eq('appointment_date', entry.preferred_date)
        .in('status', [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.PENDING])
        .single();

    if (existingAppointment) {
        const { cancelAppointment } = await import('./appointment.service.js');
        const cancelResult = await cancelAppointment(
            existingAppointment.id,
            patientId,
            'Auto-cancelled: patient confirmed a waitlist offer for a different time',
        );

        // ── Only cascade if the cancelled appointment was CONFIRMED ──
        // PENDING appointments are not yet live, so no cascade needed
        if (existingAppointment.status === APPOINTMENT_STATUS.CONFIRMED) {
            // The freed slot from the old appointment should cascade to waitlist
            await notifyWaitlist(cancelResult.freed_slot);
            console.log(
                `🔄 Swap (CONFIRMED): Patient ${patientId} swapped ${existingAppointment.start_time} → ${entry.preferred_time} on ${entry.preferred_date}`,
            );
        } else {
            // PENDING appointment was cancelled, no cascade needed
            console.log(
                `🔄 Auto-Cancel (PENDING): Patient ${patientId}'s pending request was auto-cancelled. Waitlist offer now proceeding.`,
            );
        }
    }

    // ── 4. Mark waitlist entry as confirmed ──
    await supabaseAdmin
        .from('waitlist')
        .update({ status: WAITLIST_STATUS.CONFIRMED, updated_at: new Date().toISOString() })
        .eq('id', waitlistId);

    // ── 5. CLEANUP: Remove other WAITING entries for same patient + date + service ──
    // If the patient had multiple waitlist entries (e.g., waiting for 09:00 AND 10:00),
    // cancel the remaining ones since they got a slot.
    await supabaseAdmin
        .from('waitlist')
        .update({ status: WAITLIST_STATUS.CANCELLED, updated_at: new Date().toISOString() })
        .eq('patient_id', patientId)
        .eq('service_id', entry.service_id)
        .eq('preferred_date', entry.preferred_date)
        .eq('status', WAITLIST_STATUS.WAITING)
        .neq('id', waitlistId);

    return {
        confirmed: true,
        message: existingAppointment
            ? 'Waitlist confirmed! Old appointment was auto-cancelled (swapped).'
            : 'Waitlist offer confirmed! Now proceeding to book your appointment.',
        swapped: !!existingAppointment,
        swapped_from: existingAppointment?.start_time || null,
        service_id: entry.service_id,
        date: entry.preferred_date,
        time: entry.preferred_time,
        patient_id: entry.patient_id, // Added for public confirm logic
    };
};

/**
 * Public: Get waitlist offer details using a claim token.
 */
export const getWaitlistByToken = async (token) => {
    const { data, error } = await supabaseAdmin
        .from('waitlist')
        .select(
            `
            *,
            service:services(name)
        `,
        )
        .eq('claim_token', token)
        .eq('status', WAITLIST_STATUS.NOTIFIED)
        .single();

    if (error || !data) {
        throw { status: 404, message: 'Waitlist offer not found or expired.' };
    }

    // Check if expired
    if (new Date() > new Date(data.expires_at)) {
        throw { status: 410, message: 'This claim window has expired.' };
    }

    return {
        offer: {
            id: data.id,
            service: data.service?.name,
            date: data.preferred_date,
            displayTime: data.preferred_time,
        },
    };
};

/**
 * Public: Confirm waitlist offer using a claim token.
 */
export const confirmWaitlistByToken = async (token) => {
    // 1. Find the entry by token
    const { data: entry, error } = await supabaseAdmin
        .from('waitlist')
        .select('id, patient_id')
        .eq('claim_token', token)
        .eq('status', WAITLIST_STATUS.NOTIFIED)
        .single();

    if (error || !entry) {
        throw { status: 404, message: 'Invalid or expired claim token.' };
    }

    // 2. Delegate to the main confirm service (reusing all swap/cleanup logic)
    return await confirmWaitlistOffer(entry.id, entry.patient_id);
};
