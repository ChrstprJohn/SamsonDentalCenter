import dotenv from 'dotenv';
import { supabaseAdmin } from './config/supabase.js';

dotenv.config({ path: 'd:/webApp/PrimeraDental/backend/api/.env' });

async function queryDentists() {
    console.log('🔍 Fetching all dentists...');
    const { data, error } = await supabaseAdmin
        .from('dentists')
        .select(`
            id,
            specialization,
            tier,
            is_active,
            profile:profiles!dentists_profile_id_fkey(
                full_name,
                email
            )
        `);

    if (error) {
        console.error('❌ Error fetching dentists:', error.message);
        return;
    }

    if (data.length === 0) {
        console.log('ℹ️ No dentists found in the database.');
        return;
    }

    console.table(data.map(d => ({
        ID: d.id,
        Name: d.profile?.full_name || 'N/A',
        Email: d.profile?.email || 'N/A',
        Specialization: d.specialization,
        Tier: d.tier,
        Active: d.is_active
    })));
}

queryDentists();
