
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkNotifications() {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Recent Notifications:');
    data.forEach(n => {
        console.log(`- [${n.type}] To ${n.user_id}: ${n.title}`);
        console.log(`  Message: ${n.message}`);
    });
}

checkNotifications();
