/**
 * Find appointments that belong to dependent (non-registered) patients.
 * Prints FULL appointment IDs.
 */
import { supabaseAdmin } from './config/supabase.js';

async function find() {
    const { data, error } = await supabaseAdmin
        .from('appointments')
        .select(`
            id, status, approval_status, patient_id, guest_email,
            patient:profiles!patient_id(id, email, is_registered, primary_profile_id, full_name)
        `)
        .not('patient_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) { console.error(error); return; }

    console.log('\nRECENT APPOINTMENTS & PATIENT STATUS:\n');
    for (const a of data) {
        const p = a.patient;
        const isDependent = p?.primary_profile_id && !p?.is_registered;
        console.log(`  FULL_ID: ${a.id}`);
        console.log(`  Status: ${a.status} | Patient: ${p?.full_name} | Registered: ${p?.is_registered} | Dependent: ${isDependent} | Email: ${p?.email || 'NULL'}`);
        console.log(`  PrimaryID: ${p?.primary_profile_id || 'none'}`);
        console.log('');
    }
}

find().catch(console.error);
