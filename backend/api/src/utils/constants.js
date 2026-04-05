// Appointment status values — use these everywhere instead of typing strings
// ✅ NOTE: Waitlist entries are stored in the WAITLIST table, not as appointments.
// Appointments only exist when a slot is secured (PENDING or CONFIRMED).
export const APPOINTMENT_STATUS = {
    PENDING: 'PENDING', // Awaiting approval (e.g., specialized service)
    CONFIRMED: 'CONFIRMED', // Approved and ready
    IN_PROGRESS: 'IN_PROGRESS', // 🪑 Patient seated, treatment in progress
    LATE_CANCEL: 'LATE_CANCEL', // Cancelled less than 24h before appointment
    CANCELLED: 'CANCELLED', // Cancelled with ≥24h notice
    COMPLETED: 'COMPLETED', // Treatment done (dentist marks this)
    NO_SHOW: 'NO_SHOW', // Patient didn't show up
};

// Waitlist status values
export const WAITLIST_STATUS = {
    WAITING: 'WAITING',
    NOTIFIED: 'NOTIFIED',
    CONFIRMED: 'CONFIRMED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};

// Appointment source tracking
export const APPOINTMENT_SOURCE = {
    WALK_IN: 'WALK_IN',
    GUEST_BOOKING: 'GUEST_BOOKING',
    USER_BOOKING: 'USER_BOOKING',
    WAITLIST: 'WAITLIST',
};

// User roles
export const USER_ROLES = {
    PATIENT: 'patient',
    DENTIST: 'dentist',
    SUPERVISOR: 'supervisor', // Renamed from 'admin' for clarity
    ADMIN: 'admin', // Keep for backward compat (treated same as supervisor)
};

// ── NEW: Service tier classification ──
export const SERVICE_TIER = {
    GENERAL: 'general',
    SPECIALIZED: 'specialized',
};

// ── NEW: Dentist tier (which services they handle) ──
export const DENTIST_TIER = {
    GENERAL: 'general',
    SPECIALIZED: 'specialized',
    BOTH: 'both',
};

// ── NEW: Approval status for specialized services ──
export const APPROVAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

// Clinic configuration
export const CLINIC_CONFIG = {
    OPENING_HOUR: 8, // 8:00 AM
    CLOSING_HOUR: 17, // 5:00 PM
    SLOT_DURATION_MINUTES: 30, // Each appointment slot is 30 minutes
    WAITLIST_TIMEOUT_MINUTES: 25, // 25 min to confirm waitlist offer
    WAITLIST_MIN_NOTICE_MINUTES: 0, // 🔴 0 = Immediate offers for testing (any cancellation triggers offer)
    CANCEL_NOTICE_HOURS: 24, // <24h = LATE_CANCEL
    NO_SHOW_GRACE_MINUTES: 15, // Wait 15 min past appointment time before marking no-show
    NO_SHOW_RESTRICT_THRESHOLD: 3, // 3+ no-shows → restrict patient booking
    NO_SHOW_RESTRICT_ADVANCE_DAYS: 3, // Restricted patients can only book 3 days ahead
    CANCEL_RESTRICT_THRESHOLD: 3, // 3+ cancellations → restrict patient booking
    REMINDER_HOURS: [48, 24], // Send reminders 48h and 24h before
    CONFIRM_REMINDER_HOURS: 48, // 48h reminder asks patient to confirm
    EMERGENCY_BUFFER_SLOTS: 1, // Reserve 1 slot per day for emergencies
    OVERBOOK_LOW_RISK_PERCENT: 10, // Allow 10% overbooking on low no-show risk hours
    GUEST_CONFIRM_EXPIRY_MINUTES: 15, // Guest must confirm via email within 15 minutes
    MAX_ADVANCE_BOOKING_MONTHS: 3, // Online booking up to 3 months ahead
    NO_SAME_DAY_ONLINE: true, // ❌ No same-day booking for online
};
