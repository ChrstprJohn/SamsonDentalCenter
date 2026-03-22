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
    quickRegisterPatient, // NEW
    // User Management (Admin Only)
    getUsers,
    createUser,
    changeUserRole,
    deactivateUser,
    getSystemHealth,
    // Revenue & Payments
    recordPayment,
    getPaymentDetails,
    updatePayment,
    // Content / Promotions / Holidays
    getPromotions,
    createPromotion,
    getHolidays,
    createHoliday,
    // Feedback & Internal Comments
    getFeedback,
    getAppointmentComments,
    addAppointmentComment,
    // Schedule Requests
    getScheduleRequests,
    approveScheduleRequest,
    rejectScheduleRequest,
    // Reassignment
    reassignAppointment,
    getAvailableDentistsForReassignment,
} from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin, requireSupervisor } from '../middleware/admin.middleware.js'; // UPDATED

const router = Router();

// All supervisor routes require: logged in + supervisor/admin role
router.use(requireAuth, requireSupervisor);

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
router.get('/appointments/:id/comments', getAppointmentComments);
router.post('/appointments/:id/comments', addAppointmentComment);

// ── Walk-In & Patients ──
router.post('/walk-in', addWalkIn);
router.post('/walk-in/quick', quickRegisterPatient); // NEW: create patient profile without full auth signup
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
router.post('/payments', recordPayment);
router.get('/payments/:appointmentId', getPaymentDetails);
router.patch('/payments/:id', updatePayment);

// ── Promotions & Holidays ── (NEW)
router.get('/promotions', getPromotions);
router.post('/promotions', createPromotion);
router.get('/holidays', getHolidays);
router.post('/holidays', createHoliday);

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
router.get('/schedule-requests', getScheduleRequests);
router.patch('/schedule-requests/:id/approve', approveScheduleRequest);
router.patch('/schedule-requests/:id/reject', rejectScheduleRequest);

// ── Patient Feedback ── (NEW)
router.get('/feedback', getFeedback);

// ==========================================
// ADMIN-ONLY ROUTES (Require requireAdmin)
// ==========================================
router.get('/users', requireAdmin, getUsers);
router.post('/users', requireAdmin, createUser);
router.patch('/users/:id/role', requireAdmin, changeUserRole);
router.patch('/users/:id/deactivate', requireAdmin, deactivateUser);
router.get('/system/health', requireAdmin, getSystemHealth);

export default router;
