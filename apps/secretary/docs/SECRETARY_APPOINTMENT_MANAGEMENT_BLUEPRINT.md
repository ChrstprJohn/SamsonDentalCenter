# Secretary/Front Desk Portal — Complete UI/UX Blueprint

## Navigation Structure (6 Sidebar Items)

1. **Dashboard** `/` — Morning command center with KPIs
2. **Front Desk** `/front-desk` — Today's real-time Kanban board
3. **Calendar** `/calendar` — Weekly/daily visual scheduler
4. **Approvals** `/approvals` — Specialized request queue (badge count)
5. **Booking Desk** `/booking` — Walk-in / manual booking form
6. **Patients** `/patients` — Patient directory & history lookup

> **Waitlist** is NOT a sidebar page. It appears as a contextual modal during cancellation flows.

---

## Global Layout

### Left Sidebar
Collapsible sidebar with 6 nav items above + logo at top.

### Top Header
- Global Search (Name/Phone)
- Date context display
- Notification Bell
- + New Booking button (shortcut to Booking Desk)

### Universal Right-Side Drawer
Opens clicking any appointment or patient anywhere in the app.

**Contents:**
- Patient Header (avatar, name, phone, email)
- Status Badges (`is_booking_restricted`, `no_show_count`, `cancellation_count`)
- Current Appointment Metadata
- Past 3 visits (mini-list)
- Latest treatment notes (read-only)

**Quick Actions:** Check-In, Complete, Cancel, Mark No-Show, Add Internal Comment.

> ⚠️ **No "Reschedule" in the drawer.** Rescheduling requires visual conflict context and belongs on the Calendar via drag-and-drop.

---

## Page 1: Dashboard (`/`)

The secretary's morning briefing. Read-only glanceable screen.

### Row 1 — Today's Snapshot (4 stat cards)
| Card | Source |
|---|---|
| Total Appointments | `appointments WHERE date = TODAY` |
| Checked In | `status = 'IN_PROGRESS' AND date = TODAY` |
| Pending Approvals | `approval_status = 'pending'` |
| No-Shows Today | `status = 'NO_SHOW' AND date = TODAY` |

### Row 2 — Upcoming Next
Vertical mini-timeline of **next 5 appointments** by `start_time`. Each shows time, patient, service, dentist, status pill. Click → Patient Drawer.

### Row 3 — Alerts & Action Items
- Unconfirmed appointments (`patient_confirmed = false`)
- Currently late patients (between `start_time` and `end_time`)
- Stale pending approvals (> 24h old)
- Waitlist entries expiring soon

### Row 4 — Dentist Availability
Horizontal bar per dentist showing today's schedule: filled, open, blocked.

---

## Page 2: Front Desk (`/front-desk`)

Primary working screen. Open all day. Real-time Kanban for TODAY.

### Layout: 3-Column Kanban Board

| Incoming | In Clinic | Done |
|---|---|---|
| PENDING + CONFIRMED | IN_PROGRESS | COMPLETED + NO_SHOW |

### Card State Transitions (Clock-Driven)

**State 1: Normal** (now < start_time)
- Green left border. Primary button: `Check In`.

**State 2: Late** (start_time ≤ now < end_time)
- Amber border + `-Xm late` countdown. Primary: `Check In (Shortened)`.
- Confirm modal: "Patient is late. Treatment ends strictly at [end_time]."
- Auto-appends `appointment_comments` noting late arrival.
- Overflow menu: Mark No-Show option.

**State 3: Action Required** (now ≥ end_time, never checked in)
- Red border. Promoted to sticky banner at top of Incoming column.
- Primary: `Process No-Show` with 5-second undo.

### Key UX
- Sub-header: Dentist filter pills
- Click card → Patient Drawer
- Column headers with count badges
- 5-Second Undo Toast for destructive actions
- Auto-refresh every 30s

---

## Page 3: Calendar (`/calendar`)

Visual scheduling command center for rescheduling and conflict resolution.

### Toolbar
- View toggle: Day / Week (default: Week)
- Dentist filter pills (show/hide dentist columns)
- ⊕ Block Time button → creates `dentist_availability_block`
- Date picker

### Block Types
| Type | Visual |
|---|---|
| Confirmed appointment | Solid color (dentist-coded) |
| Pending specialized | Striped/hatched, 50% opacity |
| Blocked time | Solid gray/red |
| Open slot | Empty (click to pre-fill Booking Desk) |

### Drag & Drop Reschedule
1. Validate against `dentist_schedule`, `clinic_holidays`, `dentist_availability_blocks`
2. Valid → confirmation toast
3. Invalid → red shake + reason tooltip

---

## Page 4: Approvals (`/approvals`)

Split-pane view for clearing specialized request queue.

### Left Pane (30%) — Request List
- Sorted by `created_at` (oldest first)
- Each: Patient name, service, requested date, age indicator
- Color: amber (< 24h), red (> 24h stale)
- Count mirrors sidebar badge

### Right Pane (70%) — Context View
1. Patient header + contact info
2. Penalty history: `no_show_count`, `cancellation_count`, `is_booking_restricted`
3. Mini-timeline: Requested dentist's day with ghost block for this request
4. **Approve** (green) → sets CONFIRMED
5. **Reject** (red → expands) → requires `rejection_reason`

---

## Page 5: Booking Desk (`/booking`)

Speed-optimized form. Target: under 30 seconds. Centered layout (max-width: 720px).

### Toggle: `Existing Patient` | `Walk-In / Guest`

**Existing Patient:** Patient search → Service → Date/Time → Dentist → Notes
**Walk-In:** Guest name/phone/email → same steps

### Special Behaviors
- **Slot Hold Override:** 🔒 locked slots can be force-overridden for in-person patients
- **Auto-Approve Badge:** Specialized service → "Auto-Approved by Staff" badge → inserts as CONFIRMED directly
- **Walk-In Flag:** `is_walk_in = true` auto-set

---

## Page 6: Patients (`/patients`)

Searchable patient directory.

### Table: Name, Phone, Email, No-Shows, Cancellations, Restricted?, Last Visit, [View]

### Search & Filters
- Global search: name or phone
- Filters: Restricted only, Has pending follow-up, Date range

### Click "View" → Patient Drawer
Full detail: contact, penalties, restriction status, last 5 appointments, treatment notes, follow-ups.

---

## Shared UX Patterns

### 5-Second Undo Toast
Cancel/No-Show → toast with progress bar + Undo button. API fires only after 5s.

### Waitlist Contextual Modal
Triggered on cancellation:
- **Gap < 3 hours** → silent cancel
- **Gap ≥ 3 hours** → modal shows waitlist entries for that slot, with "Notify" action (25-min claim token countdown)

### Color Vocabulary
| Color | Meaning |
|---|---|
| 🟢 Green | Confirmed / Completed / Approve |
| 🟠 Amber | Late / Needs Attention |
| 🔴 Red | No-Show / Action Required / Blocked |
| 🔵 Blue | In Progress (checked in) |
| 🦓 Striped | Pending Specialized Request |
| ⬜ Gray | Done / Muted |
