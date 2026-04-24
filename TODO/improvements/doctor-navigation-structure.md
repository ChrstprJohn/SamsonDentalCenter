# Doctor Portal - Navigation & Structure Architecture

The Doctor Portal should be clean, focused entirely on clinical operations (patient care, schedules,
and clinical notes). Here is a highly user-friendly navigation plan that is **100% compatible** with
your current `FINAL-COMPLETE-SCHEMA.sql`.

---

## 1. 📅 My Schedule (Dashboard)

- **Type:** Main Sidebar Link (Default Landing Page)
- **Route:** `/doctor/schedule`
- **What it is:** A daily/weekly calendar view of their assigned appointments.
- **Workflow / Actions:**
    - View today's patients.
    - **Start Treatment:** Click an appointment to change status from `CONFIRMED` to `IN_PROGRESS`
      (already supported by your DB constraint!).

## 2. 📝 Clinical Workspace (The Post-Appointment Flow)

- **Type:** Internal Flow (Opened when clicking an active appointment)
- **Route:** `/doctor/appointments/:id`
- **What it is:** This is where the doctor operates while the patient is in the chair.
- **Plausible Schema Workflow (Treatment -> Invoice -> Secretary):**
    1. **Treatment Notes:** Doctor fills out `diagnosis`, `treatment_performed`, and
       `medications_prescribed` (Saves to `treatment_notes` table).
    2. **Follow-ups:** Doctor can flag if a follow-up is needed and propose a date (Saves to
       `follow_ups` table).
    3. **"Invoicing" / Handoff to Secretary:**
        - _How your DB supports this:_ Your DB has a `payment_records` table with a `status` of
          `pending`. The doctor can click "Generate Bill", input the final amount/services
          performed, which creates a `pending` row in `payment_records`.
        - The doctor changes the appointment status to `COMPLETED`.
        - The Secretary (in their app) sees the `COMPLETED` appointment and the `pending` payment
          record, and handles the actual cash/card charging.

## 3. 🫂 My Patients (Patient History)

- **Type:** Main Sidebar Link
- **Route:** `/doctor/patients`
- **What it is:** A directory of patients _that this specific doctor has treated_.
- **Features:**
    - Search patients.
    - View full dental history, past `treatment_notes`, and past x-rays/files.
    - _Schema Note:_ Fully supported. You can query the `treatment_notes` or `appointments` table
      grouped by `patient_id` where `dentist_id = [current_doctor]`.

## 4. 🏖️ Leave Requests (Schedule Blocking)

- **Type:** Main Sidebar Link
- **Route:** `/doctor/requests`
- **What it is:** Doctors usually cannot directly "block" the official clinic calendar (to prevent
  them from accidentally deleting patients). Instead, they _request_ time off.
- **How your DB handles this natively:** Your schema has a specific table for this:
  `doctor_schedule_requests`!
    - Doctor submits: date, start_time, end_time, and reason.
    - Status defaults to `pending`.
    - The Admin/Secretary sees this in _their_ portal, clicks "Approve", and the admin system
      automatically converts it into a real `dentist_availability_blocks` row.

## 5. ⚙️ My Profile

- **Type:** Main Sidebar Link
- **Route:** `/doctor/profile`
- **What it is:** Doctors managing their own public-facing branding.
- **Features (All fully supported in `dentists` and `profiles` tables):**
    - Update `bio` (displays on the main website).
    - Update `photo_url` (avatar/headshot).
    - View their assigned `tier` (General vs Specialized).
    - View their mapped specific skillset (`dentist_services` table).

---

## Schema Plausibility Check

### ✅ Fully Supported (Out of the box)

- **Changing Appointment Status to IN_PROGRESS:** Supported via check constraint migration.
- **Treatment Notes & Follow-ups:** Supported natively via `treatment_notes` and `follow_ups`
  tables.
- **Requesting Time Off:** Supported perfectly by the `doctor_schedule_requests` table.
- **Profile/Bio Management:** Supported in `dentists` table.

### ⚠️ Minor Adjustment / Strategy Needed (Invoicing)

- **The specific "Doctor creates invoice -> Secretary charges" concept:** Your actual database does
  not have an "Invoices" table or an "appointment_services" junction table (which would allow a
  doctor to add 3 different services to 1 appointment).
    - **The Solution:** Use the `payment_records` table. The doctor creates the `payment_record` and
      sets `status = 'pending'`, `amount = X`. The secretary picks up that pending record, clicks
      'paid', and selects the `payment_method` (cash/card/gcash). This works perfectly without
      changing your database schema!
