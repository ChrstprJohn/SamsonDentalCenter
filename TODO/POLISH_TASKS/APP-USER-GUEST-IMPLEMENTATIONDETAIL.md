# Detailed Implementation Guide: Guest Booking Polish & Abuse Prevention

This document translates the architectural plan from `APP-USER-GUESTBOOKING.md` into actionable,
file-by-file developer steps tailored to your current codebase.

## Stage 1: UI Polish (Visuals)

### 1. Hide Global Footer (`apps/user/src/pages/GuestBooking.jsx` or similar)

- Locate the main wrapper or top-level component for the guest booking route.
- If the `<Footer />` is located in your `PublicLayout.jsx`, update the layout to accept a
  `hideFooter` prop or check `useLocation().pathname` to optionally render the Footer.

### 2. Add Patient Note Field (`apps/user/src/components/guest-booking/InfoStep.jsx`)

- Locate the bottom of the form before the navigation buttons inside `InfoStep.jsx`.
- Insert a textarea for the note:

```jsx
// ...existing imports...
import { Textarea } from '@/components/ui/textarea'; // or your existing input library

// Inside the render function:
<div className='space-y-2 mt-4'>
    <Label htmlFor='patient_note'>Note for the clinic (Optional)</Label>
    <Textarea
        id='patient_note'
        value={formData.patient_note || ''}
        onChange={(e) => updateField('patient_note', e.target.value)}
        placeholder='Any special requests or details we should know?'
    />
</div>;
```

### 3. Cleanup Success Screen (`apps/user/src/components/guest-booking/GuestBookingSuccess.jsx`)

- **Remove** the block of UI prompting the user to "Upgrade to User / Create Account".
- **Remove** the `Doctor`, `Request ID`, and `Reference ID` fields from the appointment summary
  list. Keep only: Service Name, Date, Start Time, End Time.
- **Extract** the "Return to Home" button out of the central white card so it sits below it at the
  page level.

---

## Stage 2: Frontend State & Timer Migration

### 1. Update State Hook (`apps/user/src/hooks/useGuestBooking.js`)

- Update the default `initialFormData` object to include `patient_note: ''`.
- Ensure the `guest_booking_state` is continuously persisted to `localStorage` (from your
  `USER-OTP-IMPROVEMENT.md` plan).

### 2. Relocate the Timer Visual (`DateTimeStep.jsx` -> `GuestBookingWizard.jsx`)

- Open `DateTimeStep.jsx` and **delete** the progress bar/timer visual at the bottom.
- Open `GuestBookingWizard.jsx` (which orchestrates the steps and mounts the `StepIndicator`).
- Pass the hold timer state to the `StepIndicator`:

```jsx
<StepIndicator
    currentStep={step}
    timeRemaining={slotHold?.timeRemaining}
    activeHold={slotHold?.activeHold}
/>
```

- Update `StepIndicator.jsx` to parse `timeRemaining` (format it as `MM:SS`) and render it in the
  top right corner. Ensure that on mobile devices, labels like "Step 3/5" are condensed to
  accommodate the timer without wrapping aggressively.

---

## Stage 3: Backend API Validation

### 1. New Validator Service (`apps/api/src/services/appointment-validation.service.js`)

Create a new isolated service file performing read-only queries against Supabase:

- **Overlap Guard**: Check if an appointment exists where
  `patient_email = ? AND appointment_date = ?` and the start/end times overlap with the requested
  duration.
- **Volume Cap**:
  `SELECT count(*) FROM appointments WHERE patient_email = ? AND status IN ('pending', 'confirmed')`
  -> Throw error if `count >= 3`.
- **Service Lock**: Check if an appointment exists where
  `patient_email = ? AND service_id = ? AND appointment_date = ?`.

### 2. New Route (`apps/api/src/routes/appointments.routes.js`)

- Write a simple schema for the validation (expecting
  `email, date, start_time, duration, service_id`).
- Mount a new route:

```javascript
router.post('/guest-validate', validate(guestValidateSchema), guestValidateController);
```

---

## Stage 4: Integration Bridge

### 1. Intercept Confirmation (`apps/user/src/components/guest-booking/ConfirmStep.jsx`)

- Modify the "Confirm Booking" `onClick` handler.
- Before firing the OTP process, call the new validation endpoint:

```javascript
const handleConfirm = async () => {
    try {
        // 1. Run Pre-validation
        await API.post('/api/v1/appointments/guest-validate', {
            email: formData.email,
            date: formData.date,
            start_time: formData.time,
            service_id: formData.service_id,
            duration: selectedService.duration,
        });

        // 2. If valid, proceed to original OTP logic
        await sendOTP();
    } catch (error) {
        // 3. Display error (e.g. "Volume limit reached") in a red banner
        setValidationError(error.response?.data?.message || 'Booking limit reached.');
    }
};
```

- Render a red `Alert` banner at the top of Step 4 if `validationError` is true.

### 2. Final Payload Injection

- Update the final submission call in `useGuestBooking.js` (or wherever `book-guest` is hit) to
  ensure `patient_note: formData.patient_note` is sent to the final endpoint and saved.
