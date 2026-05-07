# Detailed Implementation Plan: Admin Appointment Approval system [FINAL]

This document expands on the initial concept, providing a step-by-step, non-breaking integration
plan. It adheres to the `gemini.md` guidelines for layered architecture, proper naming, and UI laws.

## 1. Database Layer (Supabase SQL) [DONE]

_Goal: Extend the schema to handle rejection metadata without breaking the existing `appointments`
structure._

### 1.1 `appointments` Table Modifications

We need to capture _why_ an appointment was rejected without mixing it up with user cancellations.

- **Migration File**: `BLUEPRINT/BACKEND/MIGRATIONS/xx_add_rejection_reason.sql`
- **SQL**:
    ```sql
    ALTER TABLE appointments ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    ```
- **Ensuring status integrity**: The `status` column already handles `'PENDING'`, `'CONFIRMED'`,
  `'REJECTED'`, `'CANCELLED'`. We will ensure the database constraints allow `rejection_reason` to
  be populated when `status = 'REJECTED'`.

### 1.2 `email_templates` Seed

- Ensure two new templates are injected into `FINAL-COMPLETE-SCHEMA.sql` and the live DB:
    - `appointment-approved`
    - `appointment-rejected` (must accept `{{rejectionReason}}` as a variable).

---

## 2. Backend Layer (`apps/api`) [DONE]

_Goal: Create robust, secure endpoints for the Admin to fetch detailed context and perform
approve/reject actions safely within transactions._

### 2.1 Route Definitions (`src/routes/appointment-admin.routes.js`)

If `appointment.routes.js` is getting too large, we create a specific admin route file, mounted
under `/api/v1/admin/appointments`.

- `GET /:id/detail` (Fetches aggregated approval context)
- `POST /:id/approve`
- `POST /:id/reject`
- **Middleware**: All routes protected by `requireAuth` + `requireAdmin` (or secretary, depending on
  clinic rules).

### 2.2 Zod Schemas (`src/schemas/appointment-admin.schema.js`)

```javascript
export const rejectAppointmentSchema = z.object({
    body: z.object({
        reason: z.string().min(5).max(500, 'Reason is too long').trim(),
    }),
});
```

### 2.3 Controller Layer (`src/controllers/appointment-admin.controller.js`)

Kept extremely thin. Extracts `req.params.id` and `req.body.reason`, passes to the service layer,
and returns standardized JSON responses.

### 2.4 Service Layer (`src/services/appointment-admin.service.js`)

This is where the heavy lifting occurs.

**A. `getAggregatedApprovalDetails(appointmentId)`**

- Fetches the base appointment.
- Joins the `profiles` table to get the requester's full name, email, phone, and avatar.
- Sub-query 1: Fetches all past `appointments` for this `patient_id` to calculate metrics (e.g.,
  Total bookings, No-Shows).
- Sub-query 2: Conflict Check. Scans `appointments` table for the same `dentist_id`,
  `appointment_date`, and overlapping `start_time`/`end_time` to identify double-booking risks.

**B. `approveAppointment(appointmentId, adminId)`**

1. **Validation**: Check if `status === 'PENDING'`. (Optimistic lock).
2. **Transaction**: Update `status = 'CONFIRMED'`.
3. **Audit**: Insert into `audit_log` (`action: 'APPROVE_APPOINTMENT'`, `actor: adminId`).
4. **Notification**: Insert into `notifications` (In-App) and trigger `appointment-approved` email
   via EmailWorker.

**C. `rejectAppointment(appointmentId, reason, adminId)`**

1. **Validation**: Check if `status === 'PENDING'`.
2. **Transaction**: Update `status = 'REJECTED'`, `rejection_reason = reason`.
3. **Audit**: Insert into `audit_log` (`action: 'REJECT_APPOINTMENT'`, reason in metadata).
4. **Notification**: Trigger `appointment-rejected` email with the reason, and create an in-app
   notification.

---

## 3. Frontend Layer (`apps/admin`) [DONE]

_Goal: Build an intuitive, high-context UI respecting Jakob's and Miller's Laws. Avoid breaking the
existing data tables._

### 3.1 Custom Hooks (`src/hooks/useAdminApprovals.js`)

- `useApprovalDetails(id)`: Wraps `utils/api.js` to fetch the aggregated endpoint. Handles
  loading/error states.
- `useApproveAppointment()`: Exposes a mutation (`onSuccess` invalidates queries).
- `useRejectAppointment()`: Exposes a mutation accepting `{ id, reason }`.

### 3.2 Component: `ApprovalDetailViewer.jsx`

Located in `src/components/admin/appointments/`. A highly polished, two-column (on desktop) layout
designed specifically for the Secretary/Admin to make fast, informed decisions.

**Visual Hierarchy & Layout (Top to Bottom):**

1. **Page Header & Breadcrumbs**:
    - Navigation: `Appointments / Pending Approvals / Request #1234`
    - Title: **"Review Appointment Request"**
    - Status Badge: Floating chip in the top right (e.g., `🟡 PENDING`).

2. **Conflict Alert System (Top Banner)**:
    - _If no conflict_: A subtle green banner: "✅ Clear to book. No schedule overlaps detected."
    - _If conflict_: A prominent red/yellow alert box spanning full width: "⚠️ **Schedule
      Conflict:** Dr. Smith already has an approved appointment from 10:00 AM - 11:00 AM."

3. **Main Content Area (Two-Column Grid `md:grid-cols-3 gap-6`)**:

    **Left/Main Column (span-2): The Request Details**
    - **Service Details Card**:
        - Icon representing the service.
        - Large typography for Time and Date (e.g., **Thursday, Oct 12th @ 10:00 AM**).
        - Selected Service & Tier (e.g., "General Cleaning - Standard Tier").
    - **Patient Notes / Chief Complaint Card**:
        - A distinct grey or subtly tinted box containing the exact raw notes typed by the patient
          (e.g., "My lower left tooth has been hurting since yesterday.")

    **Right Column (span-1): Patient Context & History**
    - **Requester Profile Card**:
        - Large Avatar.
        - Full Name & Contact Info (Quick-copy icons for Phone/Email).
        - **Reliability Score/Metrics (Crucial)**:
            - Total Completed: `🟢 5`
            - Total Cancelled: `🟡 1`
            - Total No-Shows: `🔴 0`
    - **Dependents/Sub-profiles (If applicable)**: Mentions if the appointment is booked for a
      child/dependent.

4. **Bottom Sticky Action Footer**:
    - Remains persistently at the bottom of the viewport so the user doesn't have to scroll down to
      act.
    - **Left side**: Secondary action (e.g., "Cancel / Go Back")
    - **Right side**:
        - `Reject Request` (Red Outline or Destructive button).
        - `Approve Appointment` (Solid Primary/Brand Color button).

**Expected Visual Result:** The Secretary will open the page and their eyes will immediately map to
the **Conflict Banner** (top). Then they will glance at the **Patient Reliability Score** (right).
Assuming both are clear, they will quickly review the **Date/Time** (left) and hit **Approve**
(sticky bottom right). This complies with Hick's Law (reducing cognitive load) and Miller's Law
(grouping info into distinct cards).

### 3.3 Component: `ActionFooter.jsx`

- Sticky footer at the bottom of the Detail Viewer.
- **Button: Approve** (Primary/Green). Prompts a quick "Are you sure?" confirmation.
- **Button: Reject** (Destructive/Red). Opens the Reject Modal.

### 3.4 Component: `RejectModal.jsx`

Uses standard `useModal()` pattern.

- Title: "Reject Appointment Context"
- UI element: Radio group for common reasons:
    - "Scheduling Conflict"
    - "Provider Unavailable"
    - "Invalid Information"
    - "Other (Custom typing)"
- If "Other" is selected, conditionally render a `<textarea autofocus>` for `customReason`.
- Submit button triggers `useRejectAppointment` hook.

---

## 4. Safety & Non-Breaking Measures

1. **Database**: Adding `rejection_reason` is purely additive. Existing queries (`SELECT *` or
   specific `SELECT`s) on `appointments` will ignore this new column unless explicitly requested.
2. **API Routes**: By namespacing the new endpoints under `/admin/appointments`, we ensure the
   user-facing booking API (`/appointments`) remains 100% unaffected.
3. **Frontend Isolation**: The Admin web-app is technically separated from the User web-app in the
   Turborepo. Modifying Admin layouts does not leak visual changes into the Patient portal.
4. **State Transitions**: Enforce `WHERE status = 'PENDING'` strictly in the SQL update query within
   the service layer. This ensures if a user cancels their pending request _right before_ the admin
   clicks approve, the admin's action safely fails with a "Request no longer pending" error,
   preventing data corruption.

---

## 5. Expected Outcome & End-to-End Flow

When this implementation is fully finished, the system will behave as follows:

1. **Discovery:** An Admin navigates to the appointments dashboard and clicks on any appointment
   marked with a `PENDING` badge.
2. **Context Delivery:** The `ApprovalDetailViewer` appears, immediately providing:
    - The patient's requested time and notes.
    - The patient's historical reliability (e.g., 5 completed, 1 no-show).
    - An automated conflict check (e.g., "Clear to book" or "Conflict: Dr. Smith is already
      booked").
3. **Action Execution:**
    - **If Approved:** A quick confirmation commits the change. The UI immediately updates the badge
      to `APPROVED`. In the background, the DB is updated, an audit log is created, and the user
      receives a "Booking Confirmed" email + in-app notification.
    - **If Rejected:** A modal prompts the Admin for a reason. The Admin picks from a dropdown or
      types a custom message. Upon submission, the UI badge changes to `REJECTED`, the slot frees
      up, and the user receives a polite "Booking Rejected" email stating the exact reason, plus an
      in-app notification.
4. **Resilience:** If the patient cancelled their own request seconds before the Admin clicked, the
   UI will safely reject the Admin's action, ensuring state consistency.

---

## 6. Files Affected / Created Registry

This is exactly what will be created or modified across the monorepo:

### Database (Migrations)

- `BLUEPRINT/BACKEND/MIGRATIONS/xx_add_rejection_reason.sql` (New)
- `BLUEPRINT/BACKEND/FINAL-COMPLETE-SCHEMA.sql` (Modified to include new column & email templates)

### Backend (`apps/api/`)

- `src/routes/appointment-admin.routes.js` (New/Modified)
- `src/controllers/appointment-admin.controller.js` (New)
- `src/services/appointment-admin.service.js` (New)
- `src/schemas/appointment-admin.schema.js` (New)

### Frontend Admin (`apps/admin/`)

- `src/hooks/useAdminApprovals.js` (New)
- `src/components/admin/appointments/ApprovalDetailViewer.jsx` (New)
- `src/components/admin/appointments/ActionFooter.jsx` (New)
- `src/components/admin/appointments/RejectModal.jsx` (New)
- Existing Appointments list/table component (Modified to route to the new detail view) [DONE]

---

## 7. Manual Verification Guide

### Quick Health Check
- [ ] **Endpoint Integrity**: Test `GET /api/v1/admin/appointments-approval/:id/detail` using Postman/Curl. Ensure it returns `patientMetrics` and `conflicts`.
- [ ] **Data Sync**: Open the Admin portal. Click a pending appointment. Verify the `ApprovalDetailViewer` appears instead of the old static view.

### Scenario: High-Risk Rejection
1. Find an appointment for a patient with past "No-Shows".
2. Observe the **Attendance DNA** card showing the red stats.
3. Click **Reject**. Select **Scheduling Conflict**.
4. Submit and verify the user is notified and the registry list refreshes instantly.

### Scenario: Conflict Override
1. Intentionally create a conflict (two bookings at 10 AM).
2. Open the second request.
3. Observe the **Conflict Alert** banner appearing.
4. Click **Approve** (if clinic policy allows overrides).
5. Verify both are confirmed in the Global Registry.

