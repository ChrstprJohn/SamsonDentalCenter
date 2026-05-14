
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkPending() {
    console.log('--- Checking all appointments with approval_status = pending ---');
    const { data, error } = await supabase
        .from('appointments')
        .select('id, status, approval_status, patient_confirmed, appointment_date, start_time, service_id, patient_id, guest_name')
        .eq('approval_status', 'pending');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total found: ${data.length}`);
    data.forEach(appt => {
        console.log(`ID: ${appt.id} | Status: ${appt.status} | Confirmed: ${appt.patient_confirmed} | Date: ${appt.appointment_date} | Patient: ${appt.patient_id || appt.guest_name}`);
    });

    console.log('\n--- Checking filter: status=PENDING (New logic) ---');
    const filtered = data.filter(a => a.status === 'PENDING');
    console.log(`Filtered count: ${filtered.length}`);
    
    const missing = data.filter(a => a.status !== 'PENDING');
    if (missing.length > 0) {
        console.log('\n--- Missing from Secretary Portal (due to filters) ---');
        missing.forEach(appt => {
            console.log(`ID: ${appt.id} | Status: ${appt.status} | Confirmed: ${appt.patient_confirmed} | Reason: ${appt.status !== 'PENDING' ? 'Status not PENDING' : 'Not confirmed'}`);
        });
    }
}

checkPending();
