import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { CLINIC_CONFIG } from '../utils/constants.js';

/**
 * Get all patient profiles (dependents) for a specific account holder.
 */
export const getPatientProfiles = async (profileId) => {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, middle_name, suffix, date_of_birth, relationship_to_primary, full_name, sex')
        .eq('primary_profile_id', profileId)
        .order('first_name', { ascending: true });

    if (error) throw new AppError(error.message, 500);
    
    // Map relationship_to_primary back to relationship for frontend compatibility
    return (data || []).map(p => ({
        ...p,
        relationship: p.relationship_to_primary
    }));
};

/**
 * Get a single patient profile by ID with ownership check.
 */
export const getPatientProfileById = async (id, profileId) => {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, middle_name, suffix, date_of_birth, relationship_to_primary, full_name, sex')
        .eq('id', id)
        .eq('primary_profile_id', profileId)
        .single();

    if (error || !data) throw new AppError('Patient profile not found.', 404);
    
    return {
        ...data,
        relationship: data.relationship_to_primary
    };
};

/**
 * Create a new patient profile (Stub profile linked to primary).
 */
export const createPatientProfile = async (profileId, profileData) => {
    const { first_name, last_name, middle_name, suffix, date_of_birth, relationship, sex } = profileData;

    if (!first_name || !last_name || !date_of_birth || !relationship) {
        throw new AppError('First name, last name, DOB, and relationship are required.', 400);
    }

    // Enforce dependent limit
    const { count, error: countError } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('primary_profile_id', profileId);

    if (countError) throw new AppError('Failed to validate dependent limit.', 500);
    
    if ((count || 0) >= CLINIC_CONFIG.MAX_DEPENDENTS_PER_USER) {
        throw new AppError(`You've reached the maximum limit of ${CLINIC_CONFIG.MAX_DEPENDENTS_PER_USER} family members.`, 403);
    }

    const full_name = `${first_name} ${last_name}`.trim();

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert({
            primary_profile_id: profileId,
            first_name,
            last_name,
            middle_name,
            suffix,
            full_name,
            date_of_birth,
            sex,
            relationship_to_primary: relationship,
            role: 'patient',
            is_registered: false // It's a stub profile
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            throw new AppError('A profile with this name and DOB already exists.', 409);
        }
        throw new AppError(error.message, 500);
    }

    return {
        ...data,
        relationship: data.relationship_to_primary
    };
};

/**
 * Update an existing patient profile.
 */
export const updatePatientProfile = async (id, profileId, profileData) => {
    const { relationship, ...otherData } = profileData;
    
    const updates = {
        ...otherData,
        updated_at: new Date().toISOString()
    };
    
    if (relationship) {
        updates.relationship_to_primary = relationship;
    }

    // Update full_name if first_name or last_name changes
    if (updates.first_name || updates.last_name) {
        const { data: current } = await supabaseAdmin
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', id)
            .single();
            
        const first = updates.first_name || current?.first_name || '';
        const last = updates.last_name || current?.last_name || '';
        updates.full_name = `${first} ${last}`.trim();
    }

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .eq('primary_profile_id', profileId)
        .select()
        .single();

    if (error) throw new AppError(error.message, 500);
    
    return {
        ...data,
        relationship: data.relationship_to_primary
    };
};

/**
 * Delete a patient profile.
 */
export const deletePatientProfile = async (id, profileId) => {
    const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id)
        .eq('primary_profile_id', profileId);

    if (error) throw new AppError(error.message, 500);
    return { success: true };
};
