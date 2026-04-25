import { supabaseAdmin } from '../config/supabase.js';

async function inspectTable() {
    console.log('Inspecting audit_log table columns...');
    try {
        const { data, error } = await supabaseAdmin
            .from('audit_log')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error fetching from audit_log:', error.message);
        } else {
            if (data.length > 0) {
                console.log('Sample data keys:', Object.keys(data[0]));
            } else {
                console.log('Table is empty. Checking columns via RPC...');
                const { data: cols, error: colError } = await supabaseAdmin.rpc('exec_sql', {
                    sql_query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'audit_log';"
                });
                if (colError) {
                    console.error('RPC Error:', colError.message);
                } else {
                    console.log('Columns found:', cols);
                }
            }
        }
    } catch (err) {
        console.error('Inspection failed:', err);
    }
}

inspectTable();
