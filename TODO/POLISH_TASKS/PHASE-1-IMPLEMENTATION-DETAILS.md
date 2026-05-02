# PHASE 1: CORE FOUNDATION & CLINIC SETTINGS — IMPLEMENTATION PLAN

## 🎯 Objectives

- Secure the Admin App entry point.
- Standardize the UI/UX shell (Skeletons, Error States, Modals).
- Implement the "Clinic Settings" engine to drive the User App logic (hours, booking rules,
  block-outs).

---

## 🏗️ 1. Database Layer (Supabase)

### 1.1 `clinic_settings` Table Enhancements

We need to ensure the `clinic_settings` table matches the planned features.

- **Verification:** Check `FINAL-COMPLETE-SCHEMA.sql` (already exists).
- **Modification needed:** Add columns for booking horizon, lead times, contact info, and legal
  texts.
- **SQL Action (Migration):**
    ```sql
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS booking_lead_time_hours INTEGER DEFAULT 24;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS booking_max_horizon_days INTEGER DEFAULT 60;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS slot_duration_minutes INTEGER DEFAULT 30;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS waitlist_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS phone_primary TEXT;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS email_official TEXT;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS physical_address TEXT;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS hero_banner_text TEXT;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS hero_banner_enabled BOOLEAN DEFAULT FALSE;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS sms_notifications_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS privacy_policy_text TEXT;
    ALTER TABLE clinic_settings ADD COLUMN IF NOT EXISTS terms_of_service_text TEXT;
    ```

### 1.2 `clinic_holidays` & `clinic_schedule` Tables

- **clinic_holidays:** Ensure it has `record_date` (or `start_date`/`end_date`), `reason`, and a
  boolean for `is_closed`. (Migration will add these if missing).
- **clinic_schedule (LUNCH BREAKS):** Adding lunch breaks here prevents the system from accidentally
  booking patients while the clinic is on break.
- **SQL Action (Migration):**
    ```sql
    ALTER TABLE clinic_schedule ADD COLUMN IF NOT EXISTS lunch_start_time TIME;
    ALTER TABLE clinic_schedule ADD COLUMN IF NOT EXISTS lunch_end_time TIME;
    ```

---

## ⚡ 2. Backend Layer (apps/api)

### 2.1 Route & Controller Setup

- **New Domain:** `settings.routes.js`, `settings.controller.js`, `settings.service.js`.
- **Endpoints:**
    - `GET /api/v1/settings` (Public - for User App).
    - `PATCH /api/v1/settings` (Admin Only - for Admin App).
    - `GET /api/v1/settings/holidays` (Public).
    - `POST /api/v1/settings/holidays` (Admin).
    - `DELETE /api/v1/settings/holidays/:id` (Admin).

### 2.2 Security Middleware

- Implement `requireAdmin` check on all `PATCH/POST/DELETE` settings routes.
- **Zod Schemas:** Create `settings.schema.js` to validate all configuration inputs (e.g., ensuring
  `open_time` < `close_time`).

---

## 🎨 3. Frontend Layer (apps/admin)

### 3.1 Auth Gate Polish

- **Location:** `src/pages/LoginPage.jsx` & `src/routes/ProtectedRoute.jsx`.
- **Task:** Redirect any non-admin (e.g., patient role) trying to access `/admin/*` back to their
  respective portal or an "Unauthorized" page.
- **UI:** Enhance the Login error alerts using the standardized `Alert` component.

### 3.2 Global UI Components (The Shell)

- **Skeletons:** Create `DoctorListSkeleton`, `AppointmentTableSkeleton`, and `DashboardSkeleton` in
  `src/components/ui/Skeletons.jsx`.
- **Error States:** Create a global `ErrorBoundary` and a `PageError` component (handling 404, 500,
  and Network errors).
- **Modal Logic:** Standardize `ConfirmationModal` in `src/components/common/`. It must accept
  `title`, `message`, `onConfirm`, and `variant` (danger/warning/info).

### 3.3 Clinic Settings Module (New)

- **Location:** `src/pages/settings/SettingsPage.jsx`.
- **Inner Tabs:**
    - **Operations:** Form for Hours, Lead Time, and Slot duration.
    - **Website:** Form for Contact details, Banner text, and Social links.
    - **Notifications:** Toggles for SMS/Email gateways.
    - **Legal:** Simple markdown/text editor for Privacy/Terms.
- **Hook:** Create `useSettings.js` to handle fetching and optimistic updates.

---

## ⚠️ Safety & Best Practices

1.  **Optimistic Updates:** In the Settings UI, show a success toast immediately but revert if the
    API fails.
2.  **Audit Logs:** Every change to `clinic_settings` must trigger a row in `audit_log` (e.g.,
    "Admin updated clinic hours").
3.  **User App Impact:** Once Phase 1 is done, the User App's `Calendar` must fetch the
    `booking_lead_time_hours` and `clinic_holidays` from the API instead of using constants.
4.  **No Hardcoded Secrets:** Verify that the `resend` API key and SMS gateway credentials are moved
    to the backend `.env` during this phase.

---

## ✅ Next Steps

1. Approve this Phase 1 Plan.
2. Execute SQL Migrations for `clinic_settings`.
3. Scaffold Backend Settings API.
4. Build the Admin Settings UI.
