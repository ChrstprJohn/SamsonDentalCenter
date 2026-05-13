# Core Booking Engine Architecture

This document defines the foundational logic shared between the **Guest** and **User** booking systems in PrimeraDental.

## 1. Slot Hold Mechanism (The "Anti-Sniping" Engine)
To prevent race conditions where two users book the same slot, the system employs a **Server-Side Hold** strategy.

### The Lifecycle of a Hold:
- **Trigger**: Occurs immediately upon clicking a time slot in the `DateTimeStep`.
- **Duration**: Defaults to **15 minutes** (Configurable in `clinic_settings`).
- **Scope**: Locks the combination of `[Service] + [Date] + [Time] + [Dentist]`.
- **Concurrency**: Only ONE active hold is allowed per session. If a user clicks a new slot, the previous hold is automatically released.
- **Expiration**: If the timer hits zero, the slot is released back to the public pool. The frontend will block the "Continue" action and force a refresh.

### Technical States:
- **Happy Path**: Slot is available -> Backend creates a `slot_holds` entry -> Frontend displays success toast + countdown.
- **Bad Path (SLOT_TAKEN)**: Another user already holds or has booked the slot -> Backend returns `409 Conflict` -> Frontend triggers a `refetchSlots()` and shows a "Someone else just grabbed this slot" toast.

---

## 2. Physician Selection & Logic
### Filter Rules:
- **Any Available Dentist**: The default mode. Backend optimizes for the first available slot regardless of physician.
- **Specialized Tier**: If the service is marked as `specialized`, the system filters the dentist dropdown to show only "Medical Specialists."
- **Clinical Tier**: Standard services show "Clinical Dentists."
- **Refresh Logic**: Changing the doctor filter triggers an immediate re-fetch of the calendar availability status and the time slots.

---

## 3. Date & Availability Matrix
- **Booking Lead Time**: Users cannot book within **X days** (default 1) of today to prevent emergency "walk-in" confusion.
- **Booking Horizon**: Users can only see slots up to **90 days** in the future.
- **Clinic Schedule**: Dates are automatically blocked if the clinic is marked as `Closed` in the weekly schedule or if a `Holiday` is registered in the database.
- **Working Days**: A doctor's individual schedule can further restrict date availability.

---

## 4. Sequential "Lazy" Validation
Unlike traditional forms that validate on every step, our premium flows use **Lazy Validation** for anti-abuse:
1. **Steps 1-3**: Collect data (Service, Time, Patient Info). No backend checks for quotas here to keep UX fast.
2. **Step 4 (Review)**: The user sees a summary. No errors are shown initially.
3. **The "Confirm" Click**: Triggers the `verify-preflight` API call.
4. **The Interception**: If the user violates a rule (Quota, Overlap, Duplicate), the submission is **blocked**, and the **Premium Error Banner** appears.
