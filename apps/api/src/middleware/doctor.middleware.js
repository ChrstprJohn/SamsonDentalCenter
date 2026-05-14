import { supabaseAdmin } from '../config/supabase.js';

/**
 * Middleware: Check if the logged-in user is a dentist.
 * Attaches the dentist record to req.dentist (includes tier info).
 */
export const requireDentist = async (req, res, next) => {
    try {
        console.log(`[requireDentist] Checking access for user: ${req.user.id}, role: ${req.user.role}`);
        
        // 1. Role Check: Only dentists and admins allowed
        if (req.user.role !== 'dentist' && req.user.role !== 'admin') {
            console.log(`[requireDentist] Denied: Role '${req.user.role}' is not authorized.`);
            return res.status(403).json({ error: 'Access denied. Dentist or Admin role required.' });
        }

        // 2. Profile Check: Try to find clinician record
        const { data: dentist, error: dbError } = await supabaseAdmin
            .from('dentists')
            .select('*, profile:profiles(full_name, email)')
            .eq('profile_id', req.user.id)
            .eq('is_active', true)
            .single();

        if (dbError && dbError.code !== 'PGRST116') {
             console.error('[requireDentist] DB Error:', dbError);
        }

        if (!dentist) {
            // If admin, we allow bypass with a dummy context
            if (req.user.role === 'admin') {
                console.log(`[requireDentist] Admin bypass granted for user ${req.user.id}`);
                req.dentist = { id: null, profile: { full_name: 'Admin User' }, tier: 'ADMIN' };
                return next();
            }
            
            console.log(`[requireDentist] Denied: No active dentist record found for user ${req.user.id}`);
            return res.status(403).json({ error: 'Access denied. Dentist profile not found or inactive.' });
        }

        console.log(`[requireDentist] Access granted for dentist: ${dentist.profile?.full_name} (${dentist.id})`);
        req.dentist = dentist; // Attach dentist info (includes tier)
        next();
    } catch (err) {
        console.error('[requireDentist] Unexpected Error:', err);
        return res.status(403).json({ error: 'Access denied. Authorization failed.' });
    }
};
