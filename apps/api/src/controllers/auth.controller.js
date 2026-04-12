import { supabaseAdmin, supabasePublic } from '../config/supabase.js';
import { humanizeError } from '../utils/errorMapper.js';

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
        const { data, error } = await supabasePublic.auth.signUp({
            email,
            password,
            options: {
                data: { full_name, role: 'patient' },
            },
        });

        if (error) {
            return next(error);
        }

        // ── Update phone and preferred_time if provided ──
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
        next(err);
    }
};

/**
 * POST /api/auth/login
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
            return next(error);
        }

        // ── Get profile ──
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            return next(profileError);
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
 */
export const getProfile = async (req, res, next) => {
    try {
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
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { full_name, phone, date_of_birth } = req.body;

        const updates = {};
        if (full_name) updates.full_name = full_name;
        if (phone) updates.phone = phone;
        if (date_of_birth) updates.date_of_birth = date_of_birth;
        updates.updated_at = new Date().toISOString();

        if (Object.keys(updates).length <= 1) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        const { data, error } = await supabasePublic
            .from('profiles')
            .update(updates)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) {
            return next(error);
        }

        res.json({ message: 'Profile updated!', user: data });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/logout
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
