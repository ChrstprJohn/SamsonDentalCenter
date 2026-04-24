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

## 2.5 Extending "Displaced" Workflow to Full-Day Blocks - ✅ DONE

**Current State:** The "Displaced" logic works perfectly for specific time blocking (in
`BlockTimeModal`), but full-day date blocking (in `WeeklyRoutine`) still does not trigger the
displacement workflow.

**Improvement:** Extended the API logic to execute the exact same displacement workflow natively via
the calendar date picker.

- **What was done:** The backend now recognizes a full-day block (`start_time=NULL`,
  `end_time=NULL`) and successfully runs the
  `UPDATE appointments SET status='CANCELLED', cancellation_reason='SYSTEM_DISPLACED'` query against
  all active appointments for that specific `block_date` and `dentist_id`.

## 2.6 Handling Weekly Routine Changes (The Permanent "Displaced" Edge Case) - ✅ DONE

**Current State:** When the `WeeklyRoutine` (base schedule) is updated, it updates globally for all
past and future dates because the database relies on the `day_of_week` logic in the
`dentist_schedule` table. If an admin changes Monday from 8am-5pm to a "Not Working" day entirely,
the system currently ignores existing future appointments booked on that day.

**Architecture Philosophy (Why Global is Good):** It is **NOT** a bad idea to have a global weekly
schedule. In fact, it is the industry standard for medical software.

- **Weekly Routine** is for _Permanent Contract Changes_ (e.g., "Dr. Smith no longer works Mondays
  forever", or "Dr. Smith now permanently starts at 10 AM instead of 8 AM").
- **Time/Date Blocks** are for _One-Time Exceptions_ (e.g., "Dr. Smith is coming in late on the 2nd
  Monday of April only"). You do not need month-by-month schedules; admins should use the Block tool
  for specific weeks.

**Alternative Consideration (The Rolling 90-Day Window Strategy):** The user noted that they
currently only allow bookings up to 90 days in advance. Given this business logic, an alternative to
"Global Lifetime Rules" is a "Month-by-Month" or "Rolling Window" schedule.

- **Pros of Month-by-Month:** If a doctor has highly erratic schedules that change fundamentally
  every single month (e.g., rotating residency shifts), storing schedules by month
  `(e.g., dentist_schedule table gets a 'month' and 'year' column)` prevents a change in January
  from destroying March's schedule.
- **Cons of Month-by-Month:** It requires high admin overhead. Admins _must_ remember to build
  February's schedule by the end of January, otherwise the calendar appears completely blocked off
  to patients. It also requires migrating the `dentist_schedule` table to lose its simple 7-row
  structure and become a complex time-series table.

**Verdict:** If your doctors have standard contracts (they work the same 5 days a week for years),
stick to the **Global Setup with Hard Cut-Off**. If your doctors are rotating contractors where
their base days change every 4 weeks, then a **Month-by-Month generation tool** is worth the heavy
lifting.

**Improvement Recommendation (The Hard Cut-Off Approach for Permanent Changes):** When an admin
makes a permanent global change in the Weekly Routine, the system should execute a "Hard Cut-Off".
Since the doctor is permanently changing their hours or days, any existing appointments that fall
outside the new parameters are invalid and must be displaced.

**What was done:** Implemented the **Hard Cut-Off** execution across the Weekly Routine updates:

- When the Admin hits "Save Weekly Routine", the API saves the new global `dentist_schedule` rules
  and immediately queries all future `CONFIRMED`, `PENDING`, or `WAITLISTED` appointments for that
  doctor.
- Any appointment that violates the new rules (e.g., falls on a newly marked "Not Working" day, or
  falls outside the new start/end times) is automatically displaced (`status = 'CANCELLED'`,
  `cancellation_reason = 'SYSTEM_DISPLACED'`).
- **Conclusion:** Hard cut-off successfully implemented across all 3 vectors: Time Blocks, Date
  Blocks, and Global Weekly Schedule changes. All overlapping appointments are instantly sent to the
  displaced queue for human handling.

## 3. Timeline Navigation Enhancements

**Current State:** The `WeeklyTimeline` view allows basic navigation (prev/next). **Improvement:**
Add a "Jump to Date" mini-calendar or date-picker to efficiently navigate weeks traversing far into
the future without excessive clicking.

## 4. Multi-Location / Timezone Scaling (Future-proofing)

**Current State:** Time handling relies heavily on string interpolation (`08:00`) which implicitly
assumes a single local timezone for the server and client. **Improvement:** Store and map
availability using UTC, or associate timezone IDs with Clinic or Doctor profiles if the application
scales to serve multi-regional clinics.
