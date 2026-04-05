import { supabaseAdmin, supabasePublic } from '../config/supabase.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
};

/**
 * POST /api/auth/register
 *
 * Register a new patient account.
 * Body: { email, password, full_name, phone }
 *
 * Uses supabasePublic.auth.signUp() so Supabase sends the confirmation email automatically.
 * Make sure "Confirm email" is enabled in Supabase Dashboard → Authentication → Providers → Email.
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, full_name, phone } = req.body;

        // ── Validate input ──
        if (!email || !password || !full_name) {
            return res.status(400).json({
                error: 'Email, password, and full_name are required.',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters.',
            });
        }

        // ── Create user via public client ──
        // signUp() respects "Confirm email" in Supabase Dashboard and sends
        // the confirmation email automatically. admin.createUser() bypasses this.
        const { data, error } = await supabasePublic.auth.signUp({
            email,
            password,
            options: {
                data: { full_name, role: 'patient' },
            },
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // ── Update phone and preferred_time if provided ──
        // Use admin client here since the user may not be confirmed yet
        const profileUpdates = {};
        if (phone) profileUpdates.phone = phone;
        if (req.body.preferred_time) profileUpdates.preferred_time = req.body.preferred_time;

        if (Object.keys(profileUpdates).length > 0 && data.user?.id) {
            await supabaseAdmin.from('profiles').update(profileUpdates).eq('id', data.user.id);
        }

        // ── Return success ──
        res.status(201).json({
            message: 'Registration successful! Please check your email to confirm your account.',
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name,
            },
        });
    } catch (err) {
        next(err); // Pass to error handler
    }
};

/**
 * POST /api/auth/login
 *
 * Login with email and password.
 * Body: { email, password }
 * Returns: JWT token + user profile
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // ── Validate ──
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // ── Sign in via Supabase ──
        const { data, error } = await supabasePublic.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('SignIn error:', error);
            return res.status(401).json({ error: `Auth failed: ${error.message}` });
        }

        // ── Get profile ──
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            return res
                .status(500)
                .json({ error: `Failed to fetch profile: ${profileError.message}` });
        }

        // ── Set httpOnly cookies ──
        res.cookie('sb-access-token', data.session.access_token, COOKIE_OPTIONS);
        res.cookie('sb-refresh-token', data.session.refresh_token, COOKIE_OPTIONS);

        // ── Return token + profile ──
        res.json({
            message: 'Login successful!',
            token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: profile?.full_name,
                role: profile?.role,
                phone: profile?.phone,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        next(err);
    }
};

/**
 * GET /api/auth/me
 *
 * Get current logged-in user's profile.
 * Requires: Auth token in header
 */
export const getProfile = async (req, res, next) => {
    try {
        // req.user is set by requireAuth middleware
        res.json({
            user: {
                id: req.user.id,
                email: req.user.email,
                full_name: req.user.full_name,
                phone: req.user.phone,
                role: req.user.role,
                date_of_birth: req.user.date_of_birth,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/auth/me
 *
 * Update current user's profile.
 * Body: { full_name?, phone?, date_of_birth? }
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { full_name, phone, date_of_birth } = req.body;

        // Build update object (only include fields that were sent)
        const updates = {};
        if (full_name) updates.full_name = full_name;
        if (phone) updates.phone = phone;
        if (date_of_birth) updates.date_of_birth = date_of_birth;
        updates.updated_at = new Date().toISOString();

        if (Object.keys(updates).length <= 1) {
            // only updated_at
            return res.status(400).json({ error: 'No fields to update.' });
        }

        const { data, error } = await supabasePublic
            .from('profiles')
            .update(updates)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Profile updated!', user: data });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/logout
 *
 * Clear auth cookies.
 */
export const logout = async (req, res, next) => {
    try {
        res.clearCookie('sb-access-token', COOKIE_OPTIONS);
        res.clearCookie('sb-refresh-token', COOKIE_OPTIONS);
        res.json({ message: 'Logged out successfully.' });
    } catch (err) {
        next(err);
    }
};
