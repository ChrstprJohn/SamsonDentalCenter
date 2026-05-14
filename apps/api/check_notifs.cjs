
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
    console.log('--- LATEST 5 NOTIFICATIONS ---');
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('id, user_id, type, title, message, sent_at')
        .order('sent_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error(error);
        return;
    }

    for (const n of data) {
        console.log(`[${n.sent_at}] ${n.type} -> ${n.user_id}`);
        console.log(`Title: ${n.title}`);
        console.log(`Message: ${n.message.substring(0, 100)}...`);
        
        // Check if user exists
        const { data: p } = await supabaseAdmin.from('profiles').select('full_name, role').eq('id', n.user_id).single();
        console.log(`Recipient: ${p ? p.full_name : 'NOT FOUND'} (${p ? p.role : 'N/A'})`);
        console.log('---');
    }
}

check();
