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

## 2. Handling Overlaps when Blocking (The "Displaced" Workflow)

**Current State:** The `BlockTimeModal` disables blocking slots that already have existing
appointments.

**Improvement:** Implement a "Patient-Centric Emergency Blocking" workflow:

- **Blocking Access:** Allow BOTH Admins and Secretaries to block time periods that currently have
  active appointments.
- **Warning Prompt:** When saving a block that overlaps with bookings, prompt the user: _"Warning:
  This will displace X appointments. Continue?"_
- **The 'Displaced' Status:** Instead of auto-canceling or auto-emailing (which risks patients
  missing the message), overlapping appointments are updated to a new status: `displaced`.
- **Secretary Action Board:** The Secretary app receives a dedicated "Displaced Appointments"
  queue/table. Secretaries will use this list to physically call patients for human intervention and
  rescheduling.

## 3. Timeline Navigation Enhancements

**Current State:** The `WeeklyTimeline` view allows basic navigation (prev/next). **Improvement:**
Add a "Jump to Date" mini-calendar or date-picker to efficiently navigate weeks traversing far into
the future without excessive clicking.

## 4. Multi-Location / Timezone Scaling (Future-proofing)

**Current State:** Time handling relies heavily on string interpolation (`08:00`) which implicitly
assumes a single local timezone for the server and client. **Improvement:** Store and map
availability using UTC, or associate timezone IDs with Clinic or Doctor profiles if the application
scales to serve multi-regional clinics.
