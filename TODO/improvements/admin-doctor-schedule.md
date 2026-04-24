# Admin Doctor Schedule - Improvement Opportunities

## 1. Recurring Break Times (Lunch Breaks) - ✅ DONE

**Current State:** The `WeeklyRoutine` allows setting daily availability boundaries.
**Improvement:** Expanded the Weekly Routine model (`Edit Weekly Sched` modal) to allow standard
daily "Break" or "Lunch" intervals utilizing the database's native `break_start_time` and
`break_end_time` columns. **What was done:**

- Restructured the Edit Weekly Sched modal to display the break time inputs prominently before the
  daily schedule rows.
- Fixed UI clipping issues on time input fields.
- Replaced "closed" terminology with more user-friendly "Not Working" toggle states.
- Successfully wired the UI payload to the backend.

## 2. Handling Overlaps when Blocking (The "Displaced" Workflow) - ✅ DONE

**Current State:** The `BlockTimeModal` originally disabled blocking slots that already had existing
appointments.

**Improvement:** Implemented a "Patient-Centric Emergency Blocking" workflow without requiring new
database statuses:

- **Blocking Access:** Allowed BOTH Admins and Secretaries to block time periods that currently have
  active appointments.
- **Warning Prompt:** When saving a block that overlaps with bookings, prompt the user: _"Warning:
  This will displace X appointments. Continue?"_
- **The 'Displaced' Strategy (No New Status):** Overlapping appointments are updated to
  `status = 'CANCELLED'` with `cancellation_reason = 'SYSTEM_DISPLACED'`. This ensures it
  automatically drops off active queues and doesn't break patient app filters.
- **Secretary Action Board:** Built a dedicated "Displaced Appointments" queue/table in the
  Secretary app fetching `status='CANCELLED'` and `cancellation_reason='SYSTEM_DISPLACED'`.
  Secretaries use this to manually call patients for human intervention and rescheduling.

## 2.5 Extending "Displaced" Workflow to Full-Day Blocks

**Current State:** The "Displaced" logic works perfectly for specific time blocking (in
`BlockTimeModal`), but full-day date blocking (in `WeeklyRoutine`) still does not trigger the
displacement workflow.

**Improvement:** Extend the prompt and API logic to the exact same workflow when a full day is
blocked natively via the calendar date picker.

- **Action 1 (UI - `WeeklyRoutine.jsx`):** When the Admin/Secretary selects a date to block and
  clicks "Save", trigger a preemptive API check:
  `GET /api/appointments?dentist_id=X&date=Y&status=CONFIRMED,PENDING,WAITLISTED`.
- **Action 2 (UI Prompt):** If the array returns length > 0, halt the save and show the exact same
  warning modal: _"Warning: This full day block will displace X active appointments. Continue?"_
- **Action 3 (Backend - Date Bounds):** When the user confirms, fire the block creation endpoint.
  The backend must be smart enough to recognize a full-day block (`start_time=NULL`,
  `end_time=NULL`) and run the
  `UPDATE appointments SET status='CANCELLED', cancellation_reason='SYSTEM_DISPLACED'` query against
  _all_ active appointments for that specific `block_date` and `dentist_id`, instead of just
  checking a time range.

## 2.6 Handling Weekly Routine Changes (The Permanent "Displaced" Edge Case)

**Current State:** When the `WeeklyRoutine` (base schedule) is updated, it updates globally for all past and future dates because the database relies on the `day_of_week` logic in the `dentist_schedule` table. If an admin changes Monday from 8am-5pm to a "Not Working" day entirely, the system currently ignores existing future appointments booked on that day.

**Improvement Recommendation (The Cut-Off Approach):**
Changing the base weekly schedule shouldn't be something an Admin does lightly. You do not need to convert your database to handle "month-by-month schedules" (that creates massive complexity). Instead, implement a **"Soft Cut-off" / Review system**:

- **Action 1 (Backend Integrity Check):** When the Admin hits "Save Weekly Routine", the API runs a check: *Are there any active appointments in the future that violate the NEW schedule rules (e.g., someone booked on a Monday, but Monday is now marked "Not Working", or someone is booked at 4pm when the new end time is 3pm)?*
- **Action 2 (UI Warning Trigger):** If violations are found, return a `409 Conflict` with a list of affected appointments.
- **Action 3 (Review Modal):** The frontend displays: *"Based on your new weekly schedule, there are 12 upcoming appointments that now fall outside the doctor's working hours."* Provide a button: `[ Displace All 12 Appointments & Save ]`.
- **Action 4 (Execution):** If confirmed, save the new `dentist_schedule` rule AND update those 12 specific legacy appointments to `status = 'CANCELLED'`, with `cancellation_reason = 'SYSTEM_DISPLACED'`, feeding them into the Secretary Action Board.

**Why this is the best path:** It maintains the simplicity of a global weekly routine while guaranteeing data integrity for upcoming disrupted patients! 

## 3. Timeline Navigation Enhancements

**Current State:** The `WeeklyTimeline` view allows basic navigation (prev/next). **Improvement:**
Add a "Jump to Date" mini-calendar or date-picker to efficiently navigate weeks traversing far into
the future without excessive clicking.

## 4. Multi-Location / Timezone Scaling (Future-proofing)

**Current State:** Time handling relies heavily on string interpolation (`08:00`) which implicitly
assumes a single local timezone for the server and client. **Improvement:** Store and map
availability using UTC, or associate timezone IDs with Clinic or Doctor profiles if the application
scales to serve multi-regional clinics.
