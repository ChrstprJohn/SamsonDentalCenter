# ADMIN APP IMPLEMENTATION PLAN (Ordered by Dependency & Safety)

This plan is structured to build the foundation first, avoiding circular dependencies or breaking
existing data.

## PHASE 1: The Core Foundation (Safe to do first)

_These tasks do not affect major UI logic or existing bookings. They lay the groundwork._

1. **Authentication & Security**
    - Lock down Admin-only routing.
    - Refine the Auth styling and error messages.
2. **Global UI/UX Standards**
    - Build the reusable skeletons for loading states.
    - Standardize the error pages (404, 500, empty states).
    - Implement the Session Timeout warning securely.
3. **Clinic Settings (Database/Config First)**
    - Build the backend models/API for the new "Clinic Settings".
    - Implement the Settings UI (Operating Hours, Lead Time, Block-out Dates).
    - _Why first? Your booking front-end and doctor schedules will need to read these settings
      later._

## PHASE 2: The Services Catalog

_Must be done before Doctors because Doctors must be assigned to Services._

1. **Service Catalog List UI** (Grid/Table).
2. **Create / Edit Service View** (Including Image upload).
3. **Service Visibility Toggle** (Soft off functionality).
4. **Data Connections:** Ensure all edits trigger the standard Global Action Alerts/Toasts.

## PHASE 3: Doctors Management (Heavy Logic)

_Relies on Auth, Skeletons, and Services._

1. **Doctor List UI & Basic Profile** (Horizontal layout).
2. **Onboarding & Auth Flow**
    - The "Add Doctor" form.
    - The email invite -> PRC verification -> Password creation logic.
3. **Doctor Profile Tabs Structure** (Contact vs. Identity).
4. **Doctor Toggles (Crucial logic)**
    - Implement "Soft Off" vs "Hard Off".
    - **Important:** Build the logic here that tags appointments as "Displaced" _before_ moving to
      Phase 4.
5. **Doctor Schedule Integrations** (Combining calendar views).

## PHASE 4: Global Appointments & Core Workflows

_Relies on Doctors and Services existing correctly to be viewed._

1. **Global Sidebar Setup** (Creating the routes).
2. **Unified Action Modal**
    - Build ONE component for Approve/Reject/Cancel/Reschedule.
3. **Global Pending (Inbox) View** - Hook up the Unified Modal here.
4. **Global Attendance (Today's Clinic) View** - Hook up Check-In/No-Show logic.
5. **Global Calendar View** - Add robust filtering by the Doctors/Services created in previous
   phases.

## PHASE 5: The Patients & Data Cleanup

_This defines how you handle complex identity merges. Saving this for last prevents you from
accidentally wiping out appointment histories while building Phase 4._

1. **Dependent Logic:** Enforcing shared emails and "Dependent" structures over new accounts.
2. **Account Claiming:** The "Reserved Profile" to "Active User" DOB check flow.
3. **The Merge Tool** (The most dangerous task - do this very carefully).
    - UI for detecting duplicates.
    - Logic for migrating history safely.
4. **Inner Patient Tabs:** Polish the UI for Patient -> Upcoming/Attendance/History.

## PHASE 6: Polish & Wrap-up

1. **Global Audit Logs:** Now that all systems are built, ensure they are actively pushing logs.
2. **Dashboard Metrics:** Your business stats will now accurately reflect the updated DB.
3. **Legal / Templates:** Connect the editable Clinic Settings (emails/SMS/legal) to the Live User
   App.
4. **Final QA Check:** Ensure ALL destructive actions have the proper warning pop-ups.

---

## FUTURE IMPROVEMENTS & SYNC (POST-PHASE 1 EXTENSION)

> [!IMPORTANT]
> The following items are identified as critical polish tasks to be addressed after the core Phase 1 Extension is verified.

- **High-Fidelity Action Alerts**: Implement a unified, premium alert system (Toasts/Modals) for all critical actions:
    - Success feedback for Saving/Updating settings.
    - Warning/Confirmation modals for Deleting or Removing items (e.g., Holidays, Schedule shifts).
    - Error notifications with retry logic.
- **Cross-App Configuration Sync**: While the Clinic Settings (Contact, Website, Notifications, Legal) are now persisted in the database, they must be incrementally hooked up to all parts of the ecosystem:
    - **Patient Portal**: Use `about_text`, `privacy_policy_text`, and `terms_of_service_text` on the respective public pages.
    - **Email/SMS Templates**: Use `email_official` and `phone_primary` as the sender identity and contact fallback.
    - **SEO & Meta**: Use the `clinic_name` and `hero_banner_text` for dynamic meta tag generation.
