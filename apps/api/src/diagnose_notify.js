
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function diagnose() {
    console.log('--- DIAGNOSING NOTIFICATIONS ---');
    
    // 1. Check last 5 notifications
    const { data: notifs, error: nErr } = await supabase
        .from('notifications')
        .select('id, user_id, type, title, message, sent_at, channel')
        .order('sent_at', { ascending: false })
        .limit(10);

    if (nErr) {
        console.error('Error fetching notifications:', nErr);
        return;
    }

    console.log(`Found ${notifs.length} recent notifications:`);
    for (const n of notifs) {
        console.log(`[${n.sent_at}] ID: ${n.id}`);
        console.log(`  Type: ${n.type} | Channel: ${n.channel} | To User: ${n.user_id}`);
        console.log(`  Title: ${n.title}`);
        console.log(`  Message preview: ${n.message.substring(0, 50)}...`);
        
        // 2. Check if this user exists in profiles
        const { data: profile } = await supabase.from('profiles').select('id, full_name, email, is_registered').eq('id', n.user_id).single();
        if (profile) {
            console.log(`  User: ${profile.full_name} (${profile.email || 'No email'}) | Registered: ${profile.is_registered}`);
        } else {
            console.log(`  User: NOT FOUND in profiles table!`);
        }
        console.log('---');
    }
}

diagnose();
