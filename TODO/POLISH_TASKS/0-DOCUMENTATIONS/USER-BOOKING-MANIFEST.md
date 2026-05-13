# User Booking Manifest: Flow & Rules

The User Booking flow is for registered account holders. It prioritizes family management and cross-profile appointment tracking.

## 1. The Workflow
1. **Service Selection**: Choose treatment.
2. **Schedule**: Select Dentist, Date, and Time (Triggers **Slot Hold**).
3. **Details (Other Info)**:
    - **Self**: Auto-fills from profile.
    - **Dependent**: Choose from dropdown; auto-fills sex, birthday, etc.
    - **New Member**: Input fields for adding a new dependent to the account.
4. **Review**: Summary + **Sequential Validation** trigger.
5. **Success**: Appointment is created (Status depends on service settings).

---

## 2. Validation & Business Rules
### The "Family Hub" Constraints:
- **Max Dependents**: An account is capped at **10 profiles** (Primary + 9 Dependents).
- **Profile Linking**: New members added during booking are automatically persisted to the `patient_profiles` table upon successful appointment confirmation.

### Anti-Abuse Logic (The "3-3-3" Rule):
- **Individual Quota**: Each profile (Self or Dependent) is limited to **3 active appointments**.
- **Cross-Profile Check**: The primary user can book for a dependent even if the primary's quota is full (Quotas are per-profile, not per-account).
- **Time Overlaps**: Prevents a single profile from being in two places at once.
- **Service Duplication**: Prevents booking the same service on the same day for the same profile.

---

## 3. The Review Step "Interception" (Lazy Validation)
This is the most critical UX feature. Validation errors are **NOT** shown until the user clicks **"Confirm Appointment"**.

### Response Mapping:
| Scenario | Headline | Action CTA |
| :--- | :--- | :--- |
| **Overlap Found** | Time Slot Unavailable | **Change Time** (Step 1) |
| **Service Repeated** | Duplicate Service | **Change Service** (Step 0) |
| **Limit Hit** | Booking Limit Reached | **View Dashboard** |
| **New Profile Limit**| Family Profile Limit | **View Dashboard** |

---

## 4. Technical States & Edge Cases
- **Session Locking**: During the `handleFinalSubmit`, the UI enters a `isEntryLocked` state for **500ms** to prevent double-clicks.
- **Auto-Scroll**: If a verification error is returned, the page automatically performs a "Double Jump" scroll (Immediate auto-scroll + Smooth finish) to bring the Red Banner into view.
- **Data Persistence**: If the user edits a field, the previous `slot_hold` is maintained *unless* they change the Service or Date/Time.
- **Status Mapping**:
    - Standard Services: Created as `APPROVED` or `PENDING` based on clinic configuration.
    - Specialized Services: Always created as `PENDING_APPROVAL`.
