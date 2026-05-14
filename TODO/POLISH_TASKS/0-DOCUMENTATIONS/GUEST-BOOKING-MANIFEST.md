# Guest Booking Manifest: Flow & Rules

The Guest Booking flow is designed for frictionless access while maintaining strict identity verification via OTP and email-based tracking.

## 1. The Workflow
1. **Service Selection**: Choose treatment (Specialized services trigger a "Login Required" alert).
2. **Schedule**: Select Dentist, Date, and Time (Triggers **Slot Hold**).
3. **Details (Info)**: Guest provides Name, DOB, Sex, Email, and Phone.
4. **Review**: Summary of selection.
5. **OTP Verification**: Final step where a 6-digit code is sent to the provided email.
6. **Success**: Appointment is created in `PENDING` state.

---

## 2. Validation & Business Rules
### Step-Level Validation (Frontend):
- **Details Step**: 
    - Names: No numbers/special characters.
    - Phone: Strictly 11-digit Philippine format (`09XX XXXX XXXX`).
    - DOB: Must be in the past.
    - Terms: Mandatory checkbox.

### Anti-Abuse Rules (Backend Interception):
Guests are subject to the same strict limits as users, but tracked via **Email + Name + Birthday** (The "Identity Hash"):
- **Time Overlap**: A guest cannot book two different treatments that occur at the same time.
- **Duplicate Service**: A guest cannot book the same service twice on the same day.
- **Quota Limit**: Maximum **3 active appointments** per identity.

---

## 3. Error States & Handling
| Error Code | UI Behavior | Resolution Path |
| :--- | :--- | :--- |
| **SLOT_TAKEN** | Toast Alert | "Refresh" button appears; user picks a new time. |
| **VALIDATION_ERROR** | Red Banner in Review | "Change Time" or "Change Service" CTA button. |
| **OTP_EXPIRED** | Inline Error in OTP Modal | "Resend Code" becomes active after 60s. |
| **DUPLICATE_ID** | Red Banner in Review | Directs user to "Login" if they already have a full account. |

---

## 4. Post-Submission Logic
- **Identity Stubbing**: If the guest doesn't exist, the system creates a "Ghost Profile" (Stub) linked to the email.
- **Appointment Status**: All guest bookings start as `PENDING_APPROVAL`.
- **Email Notifications**:
    - **Trigger 1**: OTP Code (Immediate).
    - **Trigger 2**: "Request Received" (After OTP success).
    - **Trigger 3**: "Approved" or "Declined" (After Secretary action).
