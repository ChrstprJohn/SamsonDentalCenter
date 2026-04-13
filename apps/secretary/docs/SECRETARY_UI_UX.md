# Secretary Portal — UX & Layout Strategy Per Page

## 1. Dashboard (`/`)

**Layout:** Single-column scrollable with a 4-card stat row at top, followed by stacked content sections.

**UX:**
- Stat cards use large typography for the number, small label below, and a subtle color accent matching the metric type.
- "Upcoming Next" timeline uses vertical connector lines with time labels on the left and details on the right.
- "Alerts" section uses left-border-colored list items (amber = warning, red = urgent) with action links.
- Dentist availability bars are horizontal stacked-bar charts (filled = booked, empty = open, red = blocked).
- **No interactive actions on this page** — it's a read-only briefing. All interaction flows through to other pages via clickable links.

---

## 2. Front Desk (`/front-desk`)

**Layout:** Full-height, 3-column Kanban board taking 100% remaining screen width.

**Card Design:**
- Compact cards. `start_time – end_time` prominently at top-left.
- Thick left border indicates status: Green (Confirmed), Amber (Late), Red (Action Required), Blue (In Progress).
- Patient name, service, and dentist as secondary info.
- Primary action button bottom-right, overflow menu (⋯) bottom-left.

**UX:**
- "Action Required" sticky banner sits **inside** the Incoming column at top, not across the whole screen.
- Drag-and-drop between columns OR one-click primary action buttons.
- Sub-header with dentist filter pills for multi-dentist clinics.
- Column headers display item counts as badges.
- Empty columns show friendly messages ("All patients seen!").

---

## 3. Calendar (`/calendar`)

**Layout:** Full-screen grid (Google Calendar style) with sub-header toolbar.

**UX:**
- Ghost blocks (pending specialized) use hatched pattern at 50% opacity to distinguish from solid confirmed blocks.
- Dentist filters as pill toggles in the sub-header alongside the Day/Week view toggle.
- "Block Time" as a prominent button next to dentist filters (not a FAB).
- Clicking an empty slot opens the Booking Desk pre-filled with that date/time/dentist.
- Drag-and-drop reschedule with validation feedback (green toast = valid, red shake = conflict).

---

## 4. Approvals (`/approvals`)

**Layout:** Split-pane / Master-Detail. Left pane 30% width, right pane 70%.

**UX:**
- Left pane list items are selectable with visual active state.
- Right pane focuses heavily on the requested dentist's mini-timeline for the specific day — embedded inline, no navigation needed.
- Approve = large green button. Reject = red button that transforms into a dropdown requiring `rejection_reason`.
- Stale requests (> 24h) get a red dot indicator in the left pane list.
- Empty state: "All caught up! No pending approvals 🎉"

---

## 5. Booking Desk (`/booking`)

**Layout:** Centered, constrained-width form (max-width: 720px).

**UX:**
- Prominent toggle at top: "Existing Patient" (search bar) vs "Walk-In" (manual input fields).
- Step-by-step vertical flow: Patient → Service → Date/Time → Dentist → Notes → Submit.
- Locked slot indicator (🔒) with force-override click for in-person patients.
- "Auto-Approved by Staff" green badge flashes next to submit when specialized service is selected.
- Post-submission: success toast with "Book Another" or "View on Calendar" options.

---

## 6. Patients (`/patients`)

**Layout:** Standard data table with search bar at top.

**UX:**
- Table rows grouped with subtle alternating backgrounds for readability.
- Restrictred patients have a red badge on their row.
- Search is instant-filter (client-side for loaded data, debounced for API).
- "View" button on each row opens the Universal Patient Drawer (right-side).
- Filter bar below search: "Restricted Only", "Has Follow-Up", date range picker.

---

## Shared Components

### Universal Patient Drawer
- Right-side panel, ~400px wide, overlay on current page.
- Consistent across all pages — same content/layout regardless of trigger source.
- Close via X button, clicking outside, or pressing Escape.
- Scrollable internal content with sticky header (patient name).

### Waitlist Modal
- Full-screen modal (mobile) or centered modal (desktop, max-width: 600px).
- Only triggered programmatically during cancellation flow.
- Rows are actionable with "Notify" buttons and live countdown timers.

### 5-Second Undo Toast
- Fixed bottom-center position.
- Progress bar animates from full to empty over 5 seconds.
- Prominent "Undo" button. Clicking it cancels the pending API call.
- Toast auto-dismisses after API fires.