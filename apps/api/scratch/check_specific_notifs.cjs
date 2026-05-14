
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
    console.log('--- SEARCHING FOR APPROVAL/REJECTION NOTIFICATIONS ---');
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .in('type', ['APPROVAL', 'REJECTION'])
        .order('sent_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${data.length} notifications.`);
    for (const n of data) {
        console.log(`[${n.sent_at}] ${n.type} -> ${n.user_id}`);
        console.log(`Title: ${n.title}`);
        console.log('---');
    }
}

check();
