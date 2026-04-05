import dotenv from 'dotenv';
import app from './app.js';
import { startScheduledTasks } from './utils/scheduled-tasks.js';
import testRoutes from './routes/test.routes.js';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.use('/api/v1/test', testRoutes);
}

const server = app.listen(PORT, () => {
    logger.info(`🦷 PrimeraDental API running on http://localhost:${PORT}`);
    logger.info(`📋 Health check: http://localhost:${PORT}/api/health`);
    startScheduledTasks(); // Start cron jobs (no-show detection)
});

// ── Graceful Shutdown ──
const shutdown = () => {
    logger.info('SIGTERM/SIGINT received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
