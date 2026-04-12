import { Router } from 'express';
import {
    // Appointment Management
    getAllAppointments,
    getTodayAppointments,
    markAsNoShow,
    markAsComplete,
    adminCancel,
    addWalkIn,
    // Approval Workflow (Two-Tier)
    getPending,
    approve,
    reject,
    // Content Management
    getSettings,
    updateSettings,
    listAnnouncements,
    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    // Schedule Management
    getDentists,
    viewDentistSchedule,
    updateDentistSchedule,
    blockDentistAvailability,
    viewDentistBlocks,
    removeDentistBlock,
    openEmergencySlot,
    // Patient Management
    getPatients,
    viewPatientHistory,
    toggleRestriction,
    quickRegisterPatientHandler, // NEW
    // User Management (Admin Only)
    getUsersHandler,
    createUserHandler,
    changeUserRoleHandler,
    deactivateUserHandler,
    getSystemHealthHandler,
    // Revenue & Payments
    recordPaymentHandler,
    getPaymentDetailsHandler,
    updatePaymentHandler,
    // Content / Promotions / Holidays
    getPromotionsHandler,
    createPromotionHandler,
    getHolidaysHandler,
    createHolidayHandler,
    // Feedback & Internal Comments
    getFeedbackHandler,
    getAppointmentCommentsHandler,
    addAppointmentCommentHandler,
    // Schedule Requests
    getScheduleRequestsHandler,
    approveScheduleRequestHandler,
    rejectScheduleRequestHandler,
    // Reassignment
    reassignAppointment,
    getAvailableDentistsForReassignment,
} from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin, requireAdminOrSecretary } from '../middleware/admin.middleware.js'; // UPDATED

const router = Router();

// All staff routes require: logged in + secretary/admin role
router.use(requireAuth, requireAdminOrSecretary);

// ── Appointments ──
router.get('/appointments', getAllAppointments);
router.get('/appointments/today', getTodayAppointments);
router.get('/appointments/pending', getPending); // NEW: Specialized requests
router.patch('/appointments/:id/approve', approve); // NEW: Approve specialized
router.patch('/appointments/:id/reject', reject); // NEW: Reject specialized
router.patch('/appointments/:id/noshow', markAsNoShow);
router.patch('/appointments/:id/complete', markAsComplete);
router.patch('/appointments/:id/cancel', adminCancel);
router.patch('/appointments/:id/reassign', reassignAppointment); // NEW

// ── Internal Comments ── (NEW)
router.get('/appointments/:id/comments', getAppointmentCommentsHandler);
router.post('/appointments/:id/comments', addAppointmentCommentHandler);

// ── Walk-In & Patients ──
router.post('/walk-in', addWalkIn);
router.post('/walk-in/quick', quickRegisterPatientHandler); // NEW: create patient profile without full auth signup
router.get('/patients', getPatients);
router.get('/patients/:id/history', viewPatientHistory);
router.patch('/patients/:id/restriction', toggleRestriction);

// ── Content Management ──
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);
router.get('/announcements', listAnnouncements);
router.post('/announcements', addAnnouncement);
router.patch('/announcements/:id', editAnnouncement);
router.delete('/announcements/:id', removeAnnouncement);

// ── Revenue & Payments ── (NEW)
router.post('/payments', recordPaymentHandler);
router.get('/payments/:appointmentId', getPaymentDetailsHandler);
router.patch('/payments/:id', updatePaymentHandler);

// ── Promotions & Holidays ── (NEW)
router.get('/promotions', getPromotionsHandler);
router.post('/promotions', createPromotionHandler);
router.get('/holidays', getHolidaysHandler);
router.post('/holidays', createHolidayHandler);

// ── Schedule Management ──
router.get('/dentists', getDentists);
router.get('/dentists/available', getAvailableDentistsForReassignment); // NEW
router.get('/dentists/:id/schedule', viewDentistSchedule);
router.put('/dentists/:id/schedule', updateDentistSchedule);
router.post('/dentists/:id/block', blockDentistAvailability);
router.get('/dentists/:id/blocks', viewDentistBlocks);
router.delete('/dentists/:id/block/:blockId', removeDentistBlock);
router.post('/emergency-slot', openEmergencySlot);

// ── Doctor Schedule Requests ── (NEW)
router.get('/schedule-requests', getScheduleRequestsHandler);
router.patch('/schedule-requests/:id/approve', approveScheduleRequestHandler);
router.patch('/schedule-requests/:id/reject', rejectScheduleRequestHandler);

// ── Patient Feedback ── (NEW)
router.get('/feedback', getFeedbackHandler);

// ==========================================
// ADMIN-ONLY ROUTES (Require requireAdmin)
// ==========================================
router.get('/users', requireAdmin, getUsersHandler);
router.post('/users', requireAdmin, createUserHandler);
router.patch('/users/:id/role', requireAdmin, changeUserRoleHandler);
router.patch('/users/:id/deactivate', requireAdmin, deactivateUserHandler);
router.get('/system/health', requireAdmin, getSystemHealthHandler);

export default router;
