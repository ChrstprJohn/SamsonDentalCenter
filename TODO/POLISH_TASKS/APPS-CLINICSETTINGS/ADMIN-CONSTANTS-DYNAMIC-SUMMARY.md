# Admin Dynamic Constants: Full Summary & QA Handover

This document provides a comprehensive overview of the newly implemented Dynamic Constants
infrastructure in the Admin UI. This allows for real-time administrative control over booking rules,
penalty thresholds, and security limits without requiring codebase deployments.

---

## 🏗️ 1. System Overview

The system is designed to seamlessly expose internal business variables inside a user-friendly UI
panel out of the box, with strict backend validation. Currently, the system is strictly
"Prepared"—meaning the variables save and persist, but have not yet been wired into the live
Patient/Guest Booking flows.

### Key Logic Flow:

1. **Database Layer**: Fields are persisted directly to the `clinic_settings` table.
2. **Backend Validation Layer**: Express API validates saving constraints via strict Zod boundaries.
3. **Frontend Hydration Layer**: React Settings UI cleanly formats and exposes these limits into 3
   distinct sections.

---

## 🛡️ 2. Admin UI Sections

The "Global Rules" tab is organized into three strictly categorized scannable sections:

### **Section 1: Patient Accountability**

_Focus on penalties and behavior tracking._

- **Cancellation Penalty Window**: Hours before an appointment where canceling counts as a "Late
  Cancel".
- **Cancellation Limit**: Number of late cancellations allowed before an account is restricted.
- **No-Show Limit**: Number of missed appointments allowed before restriction.
- **Restriction Duration**: How many days a restricted user is blocked from booking.

### **Section 2: Scheduling Guardrails**

_Focus on calendar protection and overload prevention._

- **Daily Booking Limit**: Max appointments a single user can hold on the same day.
- **Reschedule Limit**: How many times a single booking can be moved before it's locked.
- **Guest Limit**: Max active appointments allowed for non-registered email addresses.
- **Checkout Timer**: How many minutes a slot is held while a user is filling out a form.

### **Section 3: Security & Access**

_Focus on system integrity and abuse limits._

- **Login Attempt Limit**: Failed OTP attempts allowed before the email is temporarily locked.

---

## 💾 3. Resilience & Security

- **Zod Validation Safeguards**: The API physically prevents the Admin from passing negative
  numbers, excessive values, or strings into numerical constraints (e.g., setting the hold timer to
  500 minutes).
- **Graceful Fallbacks**: If the database payload is missing a value, React safely defaults to
  standard parameters visually inside `ClinicRulesSettings.jsx`.
- **Pre-Activation Safety**: Wiring has deliberately been skipped. Modifying these rules right now
  guarantees zero disruption to active patients booking in real-time.

---

## ✅ 4. QA Handover Checklist

### **A. Admin Functional Validation**

- [ ] **Data Persistence**: Navigate to Admin -> Settings -> Global Rules. Modify the
      `Guest Booking Limit` to `5`, save it, and hard refresh the browser. Verify `5` remains.
- [ ] **Validation Guard**: Try to bypass the UI constraints via typical React developer tools
      (e.g., attempt to save a Negative `-1` cancellation limit). Verify the Backend API responds
      with a Zod validation error.
- [ ] **Toggle/Input Integrity**: Ensure standard text cannot be pasted into these Number input
      fields.

### **B. Visual & UI Review**

- [ ] **Three-Tier Sectioning**: Verify the 3 headers ("Patient Accountability", "Scheduling
      Guardrails", "Security & Access") properly scale and pad appropriately on Mobile views.
- [ ] **Help Text**: Ensure every input is immediately preceded by the accurate sub-label explaining
      the exact behavior of the variable.

### **C. Future Integration Tracking**

- [ ] **Status Acknowledgment**: Confirm all developers are aware these rules are purely "staged"
      for Phase 2, and are currently disconnected from User/Guest booking API routers.
