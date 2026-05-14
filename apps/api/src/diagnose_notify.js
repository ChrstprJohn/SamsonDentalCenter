/**
 * Diagnostic script — traces the exact notification path for a given appointment.
 * Run from: apps/api directory
 * Usage: node src/diagnose_notify.js <appointmentId>
 */
import { supabaseAdmin } from './config/supabase.js';

const appointmentId = process.argv[2];

if (!appointmentId) {
    console.error('Usage: node src/diagnose_notify.js <appointmentId>');
    process.exit(1);
}

async function diagnose() {
    console.log('='.repeat(60));
    console.log('NOTIFICATION DIAGNOSTIC TRACE');
    console.log('Appointment ID:', appointmentId);
    console.log('='.repeat(60));

    // 1. Raw appointment record
    const { data: raw, error: rawErr } = await supabaseAdmin
        .from('appointments')
        .select('id, status, approval_status, patient_id, guest_email, guest_name, booked_by_user_id')
        .eq('id', appointmentId)
        .single();

    if (rawErr || !raw) {
        console.error('❌ Appointment not found:', rawErr?.message);
        return;
    }

    console.log('\n[1] RAW APPOINTMENT:');
    console.table([raw]);

    // 2. Patient profile
    if (raw.patient_id) {
        const { data: patient } = await supabaseAdmin
            .from('profiles')
            .select('id, email, full_name, is_registered, primary_profile_id, role')
            .eq('id', raw.patient_id)
            .single();

        console.log('\n[2] PATIENT PROFILE:');
        console.table([patient]);

        const isDependent = patient?.primary_profile_id && !patient?.is_registered;
        console.log('\n[3] IS DEPENDENT?', isDependent);
        const notifyUserId = isDependent ? patient.primary_profile_id : raw.patient_id;
        console.log('[3] NOTIFY USER ID:', notifyUserId);

        let recipientEmail = patient?.email;
        if (!recipientEmail && isDependent) {
            const { data: primary } = await supabaseAdmin
                .from('profiles')
                .select('id, email, full_name, is_registered')
                .eq('id', patient.primary_profile_id)
                .single();
            console.log('\n[4] PRIMARY ACCOUNT HOLDER (fetched):');
            console.table([primary]);
            recipientEmail = primary?.email;
        }

        console.log('\n[5] FINAL NOTIFICATION TARGET:');
        console.log('   → In-App User ID:', notifyUserId);
        console.log('   → Email:', recipientEmail || '❌ NULL — no email found!');

        // 6. Check most recent notifications for notifyUserId
        const { data: recentNotifs } = await supabaseAdmin
            .from('notifications')
            .select('id, type, title, sent_at, is_read')
            .eq('user_id', notifyUserId)
            .order('sent_at', { ascending: false })
            .limit(3);

        console.log('\n[6] RECENT NOTIFICATIONS FOR TARGET USER:');
        if (recentNotifs?.length) {
            console.table(recentNotifs);
        } else {
            console.log('   → ❌ No notifications found for this user');
        }

    } else {
        console.log('\n[2] GUEST BOOKING');
        console.log('   → Guest Email:', raw.guest_email || '❌ NULL');
        console.log('   → Guest Name:', raw.guest_name || '❌ NULL');
    }

    console.log('\n' + '='.repeat(60));
}

diagnose().catch(console.error);
