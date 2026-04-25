import { supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/v1/admin/audit-logs
 * Fetch paginated audit logs with filters.
 */
export const getAuditLogs = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            actor_id, 
            resource_type, 
            action, 
            date_from, 
            date_to 
        } = req.query;

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;

        // Base query: Using the view for pre-resolved names and roles
        let query = supabaseAdmin
            .from('audit_log_view')
            .select(`
                id,
                action,
                resource_type,
                resource_id,
                created_at,
                actor_id,
                actor_name,
                actor_role,
                resource_name
            `, { count: 'exact' });

        // Apply filters
        if (actor_id) query = query.eq('actor_id', actor_id);
        if (resource_type) query = query.eq('resource_type', resource_type);
        if (action) query = query.eq('action', action);
        if (date_from) query = query.gte('created_at', date_from);
        if (date_to) query = query.lte('created_at', date_to);

        // Sort and Page
        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.json({
            data,
            metadata: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/v1/admin/audit-logs/:id
 * Fetch full JSON detail (including old/new values) for a specific log entry.
 */
export const getAuditLogDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('audit_log')
            .select('old_values, new_values')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ data });
    } catch (err) {
        next(err);
    }
};
