# QA & Use Cases: User Booking Flow
> **NOTE:** Always use and update this file for any improvements or changes to the User Booking flow instead of creating a new one. This serves as the single source of truth for QA and gap analysis.

---

## 1. Flow Use Cases & Expected Outcomes

### Use Case 1: Standard Successful Booking (Self)
**Scenario:** A logged-in user wants to book a general service for themselves.
- **Action:** User selects a service, picks an available date/time, reviews details, and confirms booking.
- **Behind the Scenes:** 
  1. `DateTimeStep` triggers `holdSlot` (5-minute hold).
  2. Frontend sends `user_session_id` when submitting the booking.
  3. Backend `bookAppointment` excludes that `user_session_id`'s own hold so it doesn't block the booking.
  4. Backend assigns a dentist and confirms the booking.
  5. Hold is automatically cleaned up or expires.
- **Expected Outcome:** User sees the success screen. Appointment is created with status `CONFIRMED`.

### Use Case 2: Standard Successful Booking (For Someone Else)
**Scenario:** User books for a family member.
- **Action:** User toggles "Book for someone else", selects a service, picks an available time, enters "Other Info" (guest name), and confirms.
- **Expected Outcome:** Appointment is created with status `CONFIRMED`. The `booked_for_name` field is correctly saved in the database.

### Use Case 3: Booking a Specialized Service
**Scenario:** User tries to book a specialized service (like a dental implant consultation).
- **Action:** User selects specialized service and a date/time.
- **Expected Outcome:** Appointment is created with status `PENDING` and `approval_status: 'pending'`. A dentist is *not* immediately assigned until admin approves. User sees a success message indicating approval is required.

### Use Case 4: Concurrent Users Selecting the Same Time (Race Condition)
**Scenario:** Two users click the exact same time slot at the exact same moment.
- **Action:** Both frontends call `/slots/hold`.
- **Expected Outcome:** The database enforces a strict `status = 'active'` check. One user gets the hold (`success: true`). The second user's request fails with `HTTP 409 Conflict` (Slot just booked by someone else). The frontend catches this and shows a red warning banner ("This time slot was just booked by someone else").

### Use Case 5: Auto-Switching Holds
**Scenario:** User holds 9:00 AM, but then changes their mind and clicks 9:30 AM.
- **Action:** User clicks 9:30 AM while 9:00 AM is held.
- **Expected Outcome:** Backend automatically releases the hold for 9:00 AM and creates a new 5-minute hold for 9:30 AM. The UI visually updates to show the lock on 9:30 AM.

### Use Case 6: User Abandons Booking
**Scenario:** User holds a slot but leaves the page or closes the browser before finishing.
- **Action:** User clicks "Back" or closes the tab.
- **Expected Outcome:** The `useSlotHold` hook detects unmount and fires a silent `POST /slots/release-hold` request. If that network request fails or the browser dies, the cron job / `expires_at` check will still automatically invalidate the hold after 5 minutes.

### Use Case 7: Double Selection (Booking + Waitlist)
**Scenario:** User wants to book an available slot but also join the waitlist for a highly-preferred full slot on another day/time.
- **Action:** User clicks an available slot (holds it), then clicks a full slot (adds to waitlist), and submits.
- **Expected Outcome:** The frontend dispatches both `book-user` and `waitlist` requests using `Promise.allSettled`. If both succeed, the user sees a combined success message. If one fails, the user is informed (e.g., "Waitlist succeeded but booking failed").

---

## 2. Identified Gaps & Edge Cases (QA Findings)

Here are the functional gaps and edge cases discovered during QA of the User Booking flow. 

### GAP 1: Session ID and Self-Blocking Issue (Status: FIXED ✅)
- **Problem:** When the user clicks "Submit", the backend `getAvailableSlots` would see the user's *own* 5-minute hold and treat the slot as "Fully Booked", returning a 409 error incorrectly.
- **Fix Applied:** Modified `useUserBooking` to generate a `sessionId` (the same one `useSlotHold` uses) and include it in the `POST /book-user` payload. The backend `appointment.service.js` now passes this `sessionId` to `getAvailableSlots(..., userSessionId)`, which explicitly filters out the active hold belonging to the current session using `.neq('user_session_id', filterSessionId)`.

### GAP 2: Session ID Persistency During Deep Linking (Status: PENDING)
- **Problem:** The generated `guest_session_id` in localStorage is shared among ANY tabs open for the same domain. If the user opens two tabs and tries to book two different appointments parallelly, the latest hold could auto-switch and accidentally cancel the hold in the *other tab*.
- **Impact:** Minor but noticeable for power users.
- **Action Needed:** Consider using `sessionStorage` instead of `localStorage` for the Session ID, or generating a unique session ID *per browser tab instances/hooks* so each booking wizard is isolated.

### GAP 3: Waitlist Notification Conflicts with Holds (Status: PENDING/EDGE CASE)
- **Problem:** If a user cancels an appointment, `notifyWaitlist` immediately notifies the next user. However, if a *different* user holds that newly freed slot *immediately* before the waitlisted user tries to grab it, the waitlisted user might get a "Slot Taken" error.
- **Impact:** Very rare window of collision.
- **Action Needed:** Currently acceptable, but eventually, when notifying a waitlisted user, we could place an automatic 1-hour "soft hold" specifically for that waitlisted user to give them a guaranteed chance to book, rendering the slot truly invisible to public users.

### GAP 4: Expired Hold During Slow Form Filling (Status: PENDING)
- **Problem:** A user takes 6 minutes to fill out the "Other Info" or sit on the "Review" page. The 5-minute hold expires quietly in the background. The user clicks Submit.
- **Consequence:** The `bookAppointment` will run and check `getAvailableSlots`. If nobody else grabbed the slot in that 1 minute, the booking *will succeed regardless*. But if someone else grabbed it, it will fail with 409. 
- **Action Needed:** The frontend could automatically block submission OR show an alert ("Your reservation has expired. Please select a time again.") explicitly forcing them back to Step 2 to ensure data integrity.

### GAP 5: Double Clicking Submit button (Status: PENDING)
- **Problem:** `submitting` boolean is used, but what happens if the user spams the submit button during the 100ms before `setSubmitting(true)` registers via React state updates?
- **Consequence:** Duplicate appointments could be created if they hit it perfectly before the first one completes and locks the DB.
- **Action Needed:** Since we don't have a unique constraint protecting (patient + datetime), backend should strictly rely on table constraints or `FOR UPDATE` table locks if spamming bypasses the `getAvailableSlots` check.

### GAP 6: Time Zone Desync (Status: PENDING)
- **Problem:** The entire application uses `HH:MM` strings, assuming the server timezone and clinic timezone match strictly.
- **Impact:** If a tourist is booking from another timezone, their `Date` objects in JS might be a day ahead/behind compared to the clinic.
- **Action Needed:** Standardize all date-time logic using a specific timezone (e.g. `America/Los_Angeles`) on both frontend payloads and backend generation rules, perhaps using a library like `date-fns-tz`.
