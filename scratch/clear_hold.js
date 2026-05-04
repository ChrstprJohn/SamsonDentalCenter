import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../apps/api/.env') });

import { supabaseAdmin } from '../apps/api/src/config/supabase.js';

async function clearOrphanedHold() {
    console.log('Searching for hold on 2026-05-21 at 08:00...');
    
    const { data, error } = await supabaseAdmin
        .from('slot_holds')
        .update({ status: 'released', updated_at: new Date().toISOString() })
        .eq('appointment_date', '2026-05-21')
        .eq('start_time', '08:00:00')
        .eq('status', 'active');

    if (error) {
        console.error('Error clearing hold:', error);
    } else {
        console.log('Successfully cleared holds:', data);
    }
}

clearOrphanedHold();
