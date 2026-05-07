const { createClient } = require('@supabase/supabase-client');
const path = require('path');
const dotenv = require('dotenv');

// Load env from apps/api/.env
const envPath = path.join(__dirname, '..', 'apps', 'api', '.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_KEY not found in env');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function removeOldTemplate() {
    const templateKey = 'booking-approved';
    
    console.log(`Removing deprecated template: ${templateKey}...`);

    const { data, error } = await supabaseAdmin
        .from('email_templates')
        .delete()
        .eq('template_key', templateKey)
        .select();

    if (error) {
        console.error('Error removing template:', error);
    } else {
        console.log('Template removed successfully!', data);
    }
}

removeOldTemplate();
