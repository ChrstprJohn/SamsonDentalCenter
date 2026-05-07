# Admin Approval Page Implementation Plan

## 1. Overview

This plan details the implementation of a comprehensive Appointment Approval system for the Admin
portal. It includes detailed appointment views with applicant profiles, request details, history,
conflict checking, and a robust approve/reject workflow with automated notifications and audit
logging.

## 2. Polished Features [POLISHED]

The system has been enhanced with high-fidelity UI/UX improvements:
- **Fixed Layout**: Sticky header and action footer with a smooth-scrolling content area.
- **Review Timeline**: Visual progression of the appointment lifecycle (Requested → In Review → Finalized).
- **Contextual Tabs**: 
    - **Overview**: Core profile and service details with real-time conflict scanning.
    - **Patient DNA**: Comprehensive reliability metrics and attendance history.
    - **Doctor Schedule**: Dynamic visual roster of the doctor's day (8 AM - 5 PM) including breaks and existing bookings.
- **Interactive Modals**: Polished Approve and Reject modals with predefined reasons and custom notes.
- **Operational Intelligence**: Real-time detection of other appointments for the same patient on the same day.

### 2.1 Appointments Table Updates

Existing `appointments` table already supports status changes, but we need to ensure rejection
reasons can be stored.

- [x] Add column (if not exists): `rejection_reason` (TEXT, nullable).
- [x] Verify `approval_status` enum/column exists to support 'PENDING', 'APPROVED', 'REJECTED'.

### 2.2 Notifications Table (In-App)

- [x] Ensure `notifications` table has robust categorization for 'APPOINTMENT_UPDATE' or
  'APPOINTMENT_REJECTED'.

### 2.3 Email Templates

- [x] Add/update required email templates in `email_templates` table:
    - `booking-confirmed` (previously `appointment-approved`)
    - `booking-rejected` (previously `appointment-rejected`)

## 3. Backend Implementation

### 3.1 Services (`appointment-approval.service.js` or similar)

- [x] **Approve Action**:
    - [x] Update `appointments` table status to 'CONFIRMED' / 'APPROVED'.
    - [x] Log to `audit_log` with details of the approval.
    - [x] Send 'booking-confirmed' email via email worker/service.
    - [x] Create in-app notification.
- [x] **Reject Action**:
    - [x] Accept `rejectionReason` payload (enum or custom text).
    - [x] Update `appointments` table status to 'REJECTED' / 'CANCELLED' with `rejection_reason`.
    - [x] Log to `audit_log`.
    - [x] Send 'booking-rejected' email.
    - [x] Create in-app notification.

### 3.2 Controllers & Routes

- [x] Create endpoints:
    - [x] `GET /api/v1/admin/appointments-approval/:id/detail` (Aggregation)
    - [x] `PATCH /api/v1/admin/appointments-approval/:id/approve`
    - [x] `PATCH /api/v1/admin/appointments-approval/:id/reject`
- [x] Zod Schemas:
    - [x] `rejectAppointmentSchema`: expects `reason` (string, max 500 chars).
- [x] Ensure endpoints are protected with `requireAdminOrSecretary` middleware.

### 3.3 Appointment Detail Aggregation (GET details)

- [x] Enhance existing or create new endpoint `GET /api/v1/admin/appointmwe have something to polish the cancel pop up the header and the fotter is fixed then the content part is will have a scroll y insdie if overflow, like how i do it, then on the approvedappointmentents-approval/:id/detail`
    - [x] Joins `profiles` to get full requester details.
    - [x] Sub-queries `appointments` to get user appointment history stats.
    - [x] Calculates/returns scheduling conflicts (checking against other `CONFIRMED` appointments).

## 4. Frontend Implementation

### 4.1 UI Components (`apps/admin/src/components/appointments/`)

- [x] **AppointmentDetailViewer**:
    - [x] Mirrored design from User Booking "My Appointment Detail".
    - [x] Sections:
        - [x] **Requester Profile**: Avatar, Patient details, contact info.
        - [x] **Request Detail**: Date, time, service chosen, notes.
        - [x] **Attendance DNA**: Real-time stats (No shows, completed).
        - [x] **Conflict Checker**: Dynamic UI indicating if the requested slot overlaps.

### 4.2 Action Workflow UI

- [x] **Action Buttons**: Sticky footer with "Approve" (Green) and "Reject" (Red).
- [x] **Reject Modal**:
    - [x] Pop-up dialogue.
    - [x] Radio buttons for Common Reasons.
    - [x] Option "Other (Custom)", revealing an auto-focused `<textarea>`.
- [x] **Status Indicators**: Real-time conflict/clear badges in footer.

### 4.3 State Management & Hooks

- [x] `useAdminApprovals()`:
    - [x] Fetch specialized approval context.
    - [x] Implement caching/invalidation (`refreshKey`) when items are acted upon.
    - [x] Expose `approveAppointment` and `rejectAppointment` mutations.

## 5. Audit Logging

- Every approve/reject action explicitly writes to the `audit_log` table:
    - Actor: Admin ID
    - Target: Appointment ID
    - Action: 'APPROVE_APPOINTMENT' / 'REJECT_APPOINTMENT'
    - Metadata: Reason, previous status.

## 6. Suggestions / "Things You Might Have Missed"

1. **Optimistic Locking**: Ensure two admins cannot approve/reject the same appointment
   simultaneously. Use versioning or check status strictly during update
   (`WHERE id = X AND status = 'PENDING'`).
2. **Alternative Time Suggestions**: Instead of a hard reject, provide a way for the Admin to
   "Propose New Time" which sends an email to the user with a special link.
3. **Ghosting/No-Show Metrics**: Show the user's No-Show rate heavily highlighted in the Requester
   Profile section to warn the admin before approving.
4. **Rate Limiting Notifications**: If rejecting multiple times in a row, queue emails carefully to
   avoid spam filters.

## 7. Expected Outcome

The Admin will have a highly responsive, single-page or cleanly modalized workflow to clear the
queue of pending appointments. The UI will surface critical context (user history, schedule
conflicts) to ensure safe decisions. Actions will be fully audited, with patients receiving
immediate, clear multi-channel communication (email + in-app) depending on the outcome, elevating
the clinic's perceived professionalism and responsiveness.

## 8. Manual Verification Tests

### Test Case 1: Approval Workflow
1.  **Requirement**: Log in as Admin/Secretary.
2.  **Action**: Navigate to "Approvals Inbox" and select a pending request.
3.  **Expectation**: `ApprovalDetailViewer` loads with dynamic patient metrics (Completed vs No-Show) and shows "Clear to book" if no conflicts exist.
4.  **Action**: Click "Approve Appointment".
5.  **Expectation**: 
    - Appointment disappears from the pending list.
    - Status changes to `CONFIRMED`.
    - Patient receives "Appointment Approved" email.
    - Audit log entry created.

### Test Case 2: Rejection with Custom Reason
1.  **Requirement**: Identify a pending appointment.
2.  **Action**: Click "Reject" in the detail viewer.
3.  **Expectation**: `RejectModal` appears with common reasons.
4.  **Action**: Select "Other (Custom)" and type "Provider is attending a seminar". Click "Confirm Rejection".
5.  **Expectation**:
    - Appointment disappears from the pending list.
    - Status changes to `CANCELLED` with `approval_status = 'rejected'`.
    - `rejection_reason` stores the custom text.
    - Patient receives email containing the custom reason.

### Test Case 3: Conflict Detection (Dynamic)
1.  **Requirement**: Create two pending requests for the same dentist at the same time (or one confirmed, one pending).
2.  **Action**: Open the pending request.
3.  **Expectation**: 
    - Bottom footer shows yellow "Conflicts Detected" warning.
    - Conflict Card in the right sidebar lists the overlapping appointment details.
    - Admin can still approve if they choose to override (or reject).

