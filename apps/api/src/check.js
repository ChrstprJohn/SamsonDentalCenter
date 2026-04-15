import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'd:/webApp/PrimeraDental/apps/api/.env' });

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkAppointments() {
    const { data, error } = await supabaseAdmin
        .from('appointments')
        .select('id, appointment_date, status, approval_status, service_tier, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (error) {
        console.error("Error:", error);
        return;
    }
    
    console.log("Recent appointments:");
    console.table(data);
}

checkAppointments();
