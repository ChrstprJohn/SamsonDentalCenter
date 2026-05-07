const { createClient } = require('@supabase/supabase-client');
const fs = require('fs');
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

async function syncTemplate() {
    const templateKey = 'booking-confirmed';
    const filePath = path.join(__dirname, '..', 'EmailTemplates', 'booking-confirmed.html');
    
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }
    
    const htmlContent = fs.readFileSync(filePath, 'utf-8');

    console.log(`Syncing ${templateKey} from ${filePath}...`);

    const { data, error } = await supabaseAdmin
        .from('email_templates')
        .update({ html_content: htmlContent })
        .eq('template_key', templateKey)
        .select();

    if (error) {
        console.error('Error syncing template:', error);
    } else {
        console.log('Template synced successfully!', data);
    }
}

syncTemplate();
