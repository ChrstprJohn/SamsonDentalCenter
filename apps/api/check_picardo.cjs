
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
    const { data: profiles, error: pErr } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, primary_profile_id, is_registered, email')
        .ilike('full_name', '%Picardo%');

    if (pErr) {
        console.error(pErr);
        return;
    }

    console.log('--- PICARDO PROFILES ---');
    profiles.forEach(p => {
        console.log(`- ${p.full_name} (${p.id})`);
        console.log(`  Registered: ${p.is_registered} | Primary: ${p.primary_profile_id} | Email: ${p.email}`);
    });

    console.log('\n--- LATEST 5 NOTIFICATIONS ---');
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('id, user_id, type, title, sent_at')
        .order('sent_at', { ascending: false })
        .limit(5);

    for (const n of data) {
        console.log(`[${n.sent_at}] ${n.type} to ${n.user_id}`);
    }
}

check();
