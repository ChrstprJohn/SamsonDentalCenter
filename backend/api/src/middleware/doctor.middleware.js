import { supabaseAdmin } from '../config/supabase.js';

/**
 * Middleware: Check if the logged-in user is a dentist.
 * Attaches the dentist record to req.dentist (includes tier info).
 */
export const requireDentist = async (req, res, next) => {
    try {
        // req.user is set by requireAuth middleware
        const { data: dentist } = await supabaseAdmin
            .from('dentists')
            .select('*, profile:profiles(full_name, email)')
            .eq('profile_id', req.user.id)
            .eq('is_active', true)
            .single();

        if (!dentist) {
            return res.status(403).json({ error: 'Access denied. Dentist role required.' });
        }

        req.dentist = dentist; // Attach dentist info (includes tier)
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Access denied. Dentist role required.' });
    }
};
