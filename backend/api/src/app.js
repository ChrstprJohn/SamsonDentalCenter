import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware.js';

// ── Route imports ──
import authRoutes from './routes/auth.routes.js';
import servicesRoutes from './routes/services.routes.js';
import slotsRoutes from './routes/slots.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import waitlistRoutes from './routes/waitlist.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import adminRoutes from './routes/admin.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import smartSlotsRoutes from './routes/smart-slots.routes.js';

const app = express();

// ── Global Middleware ──
app.use(express.json());
app.use(morgan('dev')); // Request logging
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5173',
        ],
        credentials: true,
    }),
);

// ── Rate Limiting ──
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window per IP
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Stricter: 10 auth attempts per 15 min
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

// ── Health Check (unversioned — infra endpoint) ──
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'PrimeraDental API is running',
        version: 'v1',
        timestamp: new Date().toISOString(),
    });
});

// ═══════════════════════════════════════════════
// API v1 Routes
// ═══════════════════════════════════════════════
const v1Router = Router();

// Apply rate limiting to auth routes
v1Router.use('/auth/login', authLimiter);
v1Router.use('/auth/register', authLimiter);

// Register all v1 routes
v1Router.use('/auth', authRoutes);
v1Router.use('/services', servicesRoutes);
v1Router.use('/slots', slotsRoutes);
v1Router.use('/slots/smart', smartSlotsRoutes);
v1Router.use('/appointments', appointmentsRoutes);
v1Router.use('/waitlist', waitlistRoutes);
v1Router.use('/notifications', notificationsRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/admin/analytics', analyticsRoutes);
v1Router.use('/doctor', doctorRoutes);

// Mount v1 router under /api/v1
app.use('/api/v1', apiLimiter, v1Router);

// ── Error handler
app.use(errorHandler);

export default app;
