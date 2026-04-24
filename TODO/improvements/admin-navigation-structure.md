# Admin Portal - Navigation & Structure Architecture

_Implementation Note:_ For all items listed below that do not currently exist, the immediate goal is
to **build the skeleton**. This means updating the Sidebar navigation with user-friendly names and
linking them to bare **Placeholder Pages** (e.g., just returning
`<div>Patients Area - Coming Soon</div>`). The actual logic will be filled in later.

---

## 1. 📊 Dashboard

- **Type:** Main Sidebar Link
- **Route:** `/admin/dashboard`
- **What it is:** A standalone page.
- **Contents:** High-level metrics (Today's revenue, new patients, displaced appointments needing
  attention, system alerts).
- **Status:** Existing (Keep as is)

---

## 2. 👨‍⚕️ Doctors

- **Type:** Main Sidebar Link (List Page) -> Leads to Detail Page with Sub-tabs
- **Route:** `/admin/doctors` -> `/admin/doctors/:id`
- **What it is:** The main page is a table/grid of doctors. Clicking a doctor opens their Detail
  Page containing **Sub-Tabs**.
- **Sub-Tabs within Doctor Detail:**
    1. **Profile:** Basic info, specialization, bio.
    2. **Schedule:** Global Weekly Routine & Exceptions (Time/Date Blocks).
    3. **History:** Past appointments handled by this doctor.
    4. **Security / Account (Suggestion):** dedicated sub-tab for password resets, disabling
       account, or changing roles for this specific doctor.
- **Status:** Mostly Existing. Just need to add the "Security/Account" sub-tab as a placeholder.

---

## 3. 👩‍💼 Staff & Reception _(Tentative)_

- **Type:** Main Sidebar Link -> Leads to Detail Page with Sub-tabs
- **Route:** `/admin/staff` -> `/admin/staff/:id`
- **What it is:** The directory for Secretaries, Admins, and non-medical staff.
- **Sub-Tabs within Staff Detail:**
    1. **Profile:** Basic info, contact details.
    2. **Activity Log:** A list of what they've been doing (e.g., "Booked 5 appointments today",
       "Cancelled Appointment #1234").
    3. **Security / Access:** Reset password, activate/deactivate account.
- **Status:** Skeleton needed. Add to sidebar and make placeholders.

---

## 4. 🫂 Patients & Users _(Tentative)_

- **Type:** Main Sidebar Link -> Leads to Detail Page with Sub-tabs
- **Route:** `/admin/patients` -> `/admin/patients/:id`
- **What it is:** A global directory for all registered patients and guests.
- **Sub-Tabs within Patient Detail:**
    1. **Profile Details:** Contact info, demographic data.
    2. **Upcoming Appointments:** Their schedule.
    3. **History & Records:** Past appointments, no-show counts, cancellation counts.
    4. **Restrictions Management:** A place to manually lift or enforce booking restrictions if they
       have too many No-Shows.
- **Status:** Skeleton needed. Add to sidebar and make placeholders.

---

## 5. 🦷 Services Catalog _(Tentative)_

- **Type:** Main Sidebar Link
- **Route:** `/admin/services`
- **What it is:** A standalone page containing a data table / list.
- **Contents:**
    - Add/Edit/Delete services (e.g., "Teeth Cleaning", "Root Canal").
    - Update costs and durations.
    - Tier Management: Mark services as `general` (auto-approve) or `specialized` (requires
      approval).
- **Status:** Skeleton needed. Add to sidebar and make a placeholder.

---

## 6. ⚙️ Clinic Settings _(Tentative)_

- **Type:** Main Sidebar Link -> Opens a Page with Internal Sub-tabs (Vertical or Horizontal)
- **Route:** `/admin/settings`
- **Sub-Tabs within Settings:**
    1. **General Details:** Update Clinic Name, Address, Contact details (powers the patient-facing
       website).
    2. **Global Rules:** Start/End hours for the clinic itself, default deposit requirements.
    3. **Clinic Holidays:** Add dates where the entire clinic is completely closed (e.g., Christmas,
       New Years).
    4. **System Health:** View database connection health, email service limits, etc.
- **Status:** Skeleton needed. Add to sidebar and make placeholders.

---

## 7. 🛡️ System Audit Logs _(Tentative)_

- **Type:** Main Sidebar Link
- **Route:** `/admin/audit-logs`
- **What it is:** A standalone page containing a massive, filterable data-table.
- **Contents:** A master timeline showing _everything_ that happens in the system (e.g., "Admin X
  changed Clinic settings", "Secretary Y displaced 5 appointments"). Crucial for fixing human errors
  and security.
- **Status:** Skeleton needed. Add to sidebar and make a placeholder.

---

## Why this Structure Works well:

1. **Contextual Account Management:** By putting password resets inside the `Profile -> Security`
   sub-tab for Doctors, Staff, and Patients, you don't need a massive, confusing "Account
   Management" page. You just go to the person you want to manage.
2. **Clear Domains:** Services, Settings, and Staff are cleanly separated.
3. **Database Alignment:** This structure perfectly matches your `FINAL-COMPLETE-SCHEMA.sql`
   (Services, Profiles, Audit Logs, Settings).

**What do you think of this layout?** It accommodates all your ideas while keeping the sidebar clean
and intuitive.
