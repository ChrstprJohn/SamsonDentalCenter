import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import {
    WAITLIST_STATUS,
    APPOINTMENT_STATUS,
    CLINIC_CONFIG,
    APPOINTMENT_SOURCE,
} from '../utils/constants.js';
import { AppError } from '../utils/errors.js';

/**
 * Add a patient to the waitlist.
 *
 * @param {string} patientId - Patient UUID
 * @param {string} serviceId - Service UUID
 * @param {string} date - Preferred date 'YYYY-MM-DD'
 * @param {string} time - Preferred time 'HH:MM' (optional)
 * @param {number} priority - 0 = normal, 1 = urgent
 */
export const joinWaitlist = async (patientId, serviceId, date, time = null, priority = 0, booked_for_name = null, preferred_dentist_id = null, backup_appointment_id = null) => {
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

    const { data: existing } = await query.maybeSingle();

    if (existing) {
        throw new AppError('You are already on the waitlist for this date, service, and time.', 400);
    }

    // ── 2. Add to waitlist ──
    const { data, error } = await supabaseAdmin
        .from('waitlist')
        .insert({
            patient_id: patientId,
            service_id: serviceId,
            preferred_date: date,
            preferred_time: time,
            preferred_dentist_id,
            backup_appointment_id,
            priority,
            status: WAITLIST_STATUS.WAITING,
            booked_for_name: booked_for_name || null,
        })
        .select(
            `
      *,
      service:services(name)
    `,
        )
        .single();

    if (error) throw new AppError(error.message, 500);

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

    if (error) throw new AppError(error.message, 500);

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
        throw new AppError('Waitlist entry not found or cannot be cancelled.', 404);
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
    const { date, start_time, service_id, dentist_id } = freedSlot;

    // ── 0. Normalize time format (HH:MM) to avoid database mismatch (HH:MM:SS) ──
    const normalizedTime = start_time?.substring(0, 5);

    // ── 1. Find waitlisted patients for this date, service, and (optionally) doctor ──
    console.log(`🔍 [WAITLIST] Searching for waitlisted patients for date: ${date}, time: ${normalizedTime}, service: ${service_id}, dentist: ${dentist_id || 'any'}`);

    let query = supabaseAdmin
        .from('waitlist')
        .select('*')
        .eq('preferred_date', date)
        .eq('service_id', service_id)
        .eq('status', WAITLIST_STATUS.WAITING)
        .or(`preferred_time.eq.${normalizedTime},preferred_time.is.null`);

    if (dentist_id) {
        query = query.or(`preferred_dentist_id.eq.${dentist_id},preferred_dentist_id.is.null`);
    } else {
        query = query.is('preferred_dentist_id', null);
    }

    const { data: waitlistEntries, error } = await query
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('❌ [WAITLIST] Search query error:', error);
    }

    console.log(`📋 [WAITLIST] Found ${waitlistEntries?.length || 0} matching entries.`);

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

    const { data: updated, error: updateError } = await supabaseAdmin
        .from('waitlist')
        .update({
            status: WAITLIST_STATUS.NOTIFIED,
            notified_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
            preferred_time: start_time,
            claim_token: token,
            updated_at: new Date().toISOString(),
        })
        .eq('id', firstInLine.id)
        .select()
        .single();

    if (updateError) {
        console.error('❌ [WAITLIST] Failed to update waitlist entry:', updateError);
        return { notified: false, message: 'Database error during notification.' };
    }

    console.log(`✅ [WAITLIST] Notified patient ${firstInLine.patient_id} for ${date} @ ${start_time}`);

    // ── 3. Create a notification record ──
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
    const { data: entry, error: fetchErr } = await supabaseAdmin
        .from('waitlist')
        .select('*, service:services(name)')
        .eq('id', waitlistId)
        .eq('patient_id', patientId)
        .eq('status', WAITLIST_STATUS.NOTIFIED)
        .single();

    if (fetchErr || !entry) {
        throw new AppError('Waitlist offer not found or already expired.', 404);
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

        throw new AppError('This offer has expired. The slot has been offered to the next person in line.', 410);
    }

    // ── 3. SWAP LOGIC: Check if this waitlist was bundled with a backup appointment ──
    let existingAppointment = null;
    
    if (entry.backup_appointment_id) {
        const { data } = await supabaseAdmin
            .from('appointments')
            .select('id, start_time, appointment_date, status')
            .eq('id', entry.backup_appointment_id)
            .in('status', [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.PENDING])
            .maybeSingle();
            
        existingAppointment = data;
    }

    // ── 4. ATTEMPT BOOKING FIRST (Atomicity check) ──
    const { bookAppointment, cancelAppointment } = await import('./appointment.service.js');

    // Normalize time to HH:MM (avoid database HH:MM:SS mismatch)
    const normalizedTime = entry.preferred_time?.substring(0, 5);

    console.log(`🎟️ [WAITLIST] Attempting to book slot for waitlist claim: ${entry.preferred_date} @ ${normalizedTime}`);

    const bookingResult = await bookAppointment(
        patientId,
        entry.service_id,
        entry.preferred_date,
        normalizedTime,
        true, // sendEmail
        entry.booked_for_name || null, // Pass the recorded name
        APPOINTMENT_SOURCE.WAITLIST, // ✅ NEW: Set source as WAITLIST
    );

    if (!bookingResult.booked) {
        console.warn(`❌ [WAITLIST] Booking failed during claim: ${bookingResult.message}`);
        throw new AppError(`Could not secure slot: ${bookingResult.message}. It may have been taken by someone else just now.`, 409);
    }

    // ── 5. SUCCESS: Handle Swap (Cancel old appointment) ──
    if (existingAppointment) {
        await cancelAppointment(
            existingAppointment.id,
            patientId,
            'Auto-cancelled: patient confirmed a waitlist offer for a different time',
        );

        console.log(`🔄 [WAITLIST] Swap complete: ${existingAppointment.start_time} → ${entry.preferred_time}`);
    }

    // ── 6. Mark waitlist entry as confirmed and CLAIMED ──
    await supabaseAdmin
        .from('waitlist')
        .update({
            status: WAITLIST_STATUS.CONFIRMED,
            is_claimed: true, // ✅ NEW: Track claim status
            claimed_appointment_id: bookingResult.appointment?.id, // ✅ NEW: Link the appointment
            updated_at: new Date().toISOString(),
        })
        .eq('id', waitlistId);

    // ── 7. CLEANUP: Remove other WAITING entries for same patient + date + service ──
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
        booked: true,
        appointment: bookingResult.appointment,
        message: existingAppointment
            ? 'Waitlist confirmed! Old appointment was auto-cancelled (swapped).'
            : 'Waitlist offer confirmed and appointment booked! ✨',
        swapped: !!existingAppointment,
        swapped_from: existingAppointment?.start_time || null,
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
        throw new AppError('Waitlist offer not found or expired.', 404);
    }

    // Check if expired
    if (new Date() > new Date(data.expires_at)) {
        throw new AppError('This claim window has expired.', 410);
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
        throw new AppError('Invalid or expired claim token.', 404);
    }

    // 2. Delegate to the main confirm service (reusing all swap/cleanup logic)
    return await confirmWaitlistOffer(entry.id, entry.patient_id);
};
