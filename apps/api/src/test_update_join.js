/**
 * Tests if Supabase .update().select() with joins works correctly.
 * If patient join returns null on update, that's the bug.
 */
import { supabaseAdmin } from './config/supabase.js';

const appointmentId = process.argv[2];
if (!appointmentId) {
    console.error('Usage: node src/test_update_join.js <appointmentId>');
    process.exit(1);
}

async function test() {
    console.log('\n[TEST] Simulating the update().select() join used in approveAppointment...\n');

    // This is EXACTLY what appointment-admin.service.js does after the .update()
    const { data: updated, error } = await supabaseAdmin
        .from('appointments')
        .update({ updated_at: new Date().toISOString() }) // harmless touch
        .eq('id', appointmentId)
        .select(`
            *,
            patient:profiles!patient_id(id, full_name, email, phone, primary_profile_id, is_registered),
            service:services(name, price),
            dentist:dentists(id, profile:profiles(full_name))
        `)
        .single();

    if (error) {
        console.error('❌ Update/Select Error:', error.message);
        return;
    }

    console.log('patient_id on row:', updated.patient_id);
    console.log('patient join result:', JSON.stringify(updated.patient, null, 2));
    console.log('service join result:', JSON.stringify(updated.service, null, 2));
    console.log('dentist join result:', JSON.stringify(updated.dentist, null, 2));

    const isDependent = updated.patient?.primary_profile_id && !updated.patient?.is_registered;
    const notifyUserId = isDependent ? updated.patient.primary_profile_id : updated.patient_id;
    let recipientEmail = updated.patient?.email || updated.guest_email;

    if (!recipientEmail && isDependent) {
        const { data: primary } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('id', updated.patient.primary_profile_id)
            .single();
        recipientEmail = primary?.email;
        console.log('\n[FALLBACK] Fetched primary email:', recipientEmail);
    }

    console.log('\n=== FINAL VALUES THAT WOULD BE USED ===');
    console.log('isDependent:', isDependent);
    console.log('notifyUserId:', notifyUserId);
    console.log('recipientEmail:', recipientEmail || '❌ NULL — notifications will be skipped!');
}

test().catch(console.error);
