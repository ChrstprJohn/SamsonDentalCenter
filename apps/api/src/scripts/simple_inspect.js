import { supabaseAdmin } from '../config/supabase.js';

async function inspect() {
    try {
        const { data, error, status } = await supabaseAdmin
            .from('audit_log')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error(`Error (${status}):`, error.message);
            console.error('Details:', error.details);
            console.error('Hint:', error.hint);
        } else {
            console.log('Successfully fetched from audit_log.');
            if (data.length > 0) {
                console.log('Available columns:', Object.keys(data[0]));
            } else {
                console.log('Table is empty, trying to infer from an insert attempt...');
                // Try a dry-run insert or just check if select('*') worked (it did if no error)
                console.log('Since select(*) worked without error, the columns in code SHOULD exist if they are in the select string. Wait, I used select("*").');
            }
        }
    } catch (err) {
        console.error('Crash:', err);
    }
}

inspect();
