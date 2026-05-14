
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Mock the notification service dependencies or import it
import { sendApprovalNotice } from './services/notification.service.js';

async function test() {
    // Get a valid user ID (patient)
    const { data: profile } = await supabaseAdmin.from('profiles').select('id, full_name').eq('role', 'patient').limit(1).single();
    if (!profile) {
        console.error('No patient found to test with');
        return;
    }

    console.log(`Testing approval notice for user: ${profile.full_name} (${profile.id})`);

    try {
        const result = await sendApprovalNotice(profile.id, {
            date: '2026-06-01',
            start_time: '10:00:00',
            end_time: '11:00:00',
            service: 'General Checkup',
            patient_name: profile.full_name
        });

        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

test();
