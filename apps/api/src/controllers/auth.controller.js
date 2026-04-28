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
        const { email, password, first_name, last_name, middle_name, suffix, phone } = req.body;

        // ── Validate input ──
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                error: 'Email, password, first name, and last name are required.',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters.',
            });
        }

        // Concat for legacy/metadata support
        const full_name = `${last_name}, ${first_name} ${middle_name || ''} ${suffix || ''}`.replace(/\s+/g, ' ').trim();

        // ── Create user via public client ──
        const { data, error } = await supabasePublic.auth.signUp({
            email,
            password,
            options: {
                data: { 
                    full_name, 
                    first_name, 
                    last_name, 
                    middle_name, 
                    suffix, 
                    role: 'patient' 
                },
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
                first_name,
                last_name,
                middle_name,
                suffix
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
                first_name: profile?.first_name,
                last_name: profile?.last_name,
                middle_name: profile?.middle_name,
                suffix: profile?.suffix,
                role: profile?.role,
                phone: profile?.phone,
                avatar_url: profile?.avatar_url,
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
        const user = {
            id: req.user.id,
            email: req.user.email,
            full_name: req.user.full_name,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            middle_name: req.user.middle_name,
            suffix: req.user.suffix,
            phone: req.user.phone,
            role: req.user.role,
            avatar_url: req.user.avatar_url,
            date_of_birth: req.user.date_of_birth,
        };

        return res.json({ user });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/auth/me
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { full_name, first_name, last_name, middle_name, suffix, phone, avatar_url, date_of_birth } = req.body;

        const updates = {};
        if (first_name !== undefined) updates.first_name = first_name;
        if (last_name !== undefined) updates.last_name = last_name;
        if (middle_name !== undefined) updates.middle_name = middle_name;
        if (suffix !== undefined) updates.suffix = suffix;

        // Auto-generate full_name if name parts changed
        if (updates.first_name !== undefined || updates.last_name !== undefined || updates.middle_name !== undefined || updates.suffix !== undefined) {
            const current = req.user;
            const fn = updates.first_name !== undefined ? updates.first_name : current.first_name;
            const ln = updates.last_name !== undefined ? updates.last_name : current.last_name;
            const mn = updates.middle_name !== undefined ? updates.middle_name : current.middle_name;
            const sx = updates.suffix !== undefined ? updates.suffix : current.suffix;
            updates.full_name = `${ln || ''}, ${fn || ''} ${mn || ''} ${sx || ''}`.replace(/\s+/g, ' ').trim();
        } else if (full_name !== undefined) {
            updates.full_name = full_name;
        }

        if (phone !== undefined) updates.phone = phone;
        if (avatar_url !== undefined) updates.avatar_url = avatar_url;
        if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth;
        updates.updated_at = new Date().toISOString();

        if (Object.keys(updates).length <= 1) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        const { data, error } = await supabaseAdmin
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
 * POST /api/auth/set-password
 * Called by the doctor portal after clicking the invitation email link.
 * Body: { access_token, refresh_token, password }
 */
export const setPassword = async (req, res, next) => {
    try {
        const { access_token, refresh_token, password } = req.body;

        if (!access_token || !refresh_token || !password) {
            return res.status(400).json({ error: 'access_token, refresh_token, and password are required.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });
        }

        // 1. Set the session from the invitation tokens
        const { data: sessionData, error: sessionErr } = await supabasePublic.auth.setSession({
            access_token,
            refresh_token,
        });

        if (sessionErr || !sessionData?.user) {
            return res.status(401).json({ error: 'Invalid or expired invitation link.' });
        }

        // 2. Update the user's password via admin
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
            sessionData.user.id,
            { password }
        );

        if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
        }

        // 3. Get the profile to return
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', sessionData.user.id)
            .single();

        // 4. Sign in with new password to get a fresh session/token
        const { data: loginData, error: loginErr } = await supabasePublic.auth.signInWithPassword({
            email: sessionData.user.email,
            password,
        });

        if (loginErr) {
            return res.status(500).json({ error: 'Password set but login failed. Please log in manually.' });
        }

        res.json({
            message: 'Password set successfully.',
            token: loginData.session.access_token,
            user: {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                first_name: profile.first_name,
                last_name: profile.last_name,
                middle_name: profile.middle_name,
                suffix: profile.suffix,
                role: profile.role,
                phone: profile.phone,
                avatar_url: profile.avatar_url,
            },
        });
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
