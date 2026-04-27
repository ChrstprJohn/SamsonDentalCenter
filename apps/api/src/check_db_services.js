import { createClient } from '@supabase/supabase-client';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkServices() {
    const { data, error } = await supabase.from('services').select('id, name');
    if (error) {
        console.error('Error fetching services:', error);
    } else {
        console.log('Services in database:', data);
    }
}

checkServices();
