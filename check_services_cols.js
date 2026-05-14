import { supabaseAdmin } from './apps/api/src/config/supabase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, './apps/api/.env') });

async function checkServicesTable() {
    const { data, error } = await supabaseAdmin
        .from('services')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching services:', error.message);
    } else if (data && data.length > 0) {
        console.log('Columns in services table:', Object.keys(data[0]));
    } else {
        console.log('Services table is empty, cannot determine columns via select *.');
    }
}

checkServicesTable();
