# Admin Doctors - Audit Implementation Plan

This document outlines where and how the `audit_log` tracking should be integrated into the existing
Doctor management flow. Since the frontend UI and React hooks (`useDoctors.js`) are already
implemented, the changes must be applied strictly in the **Backend Node.js API Controllers** (e.g.,
`apps/api/controllers/admin/dentistController.js`).

---

## The Concept

The Audit Log requires an `insert` command to be run immediately after a successful database update
in your API route functions. It looks something like this:

```javascript
await supabase.from('audit_log').insert({
    actor_id: req.user.id, // The Admin doing the action
    action: 'UPDATE_DOCTOR_PROFILE', // What they did
    resource_type: 'dentists', // What table was affected
    resource_id: dentistId, // The ID of the affected row
    old_values: previousData, // Object holding the original row
    new_values: updatedData, // Object holding the new row
});
```

---

## Where to Add the Triggers in the Backend

Based on the frontend actions available in `apps/admin/src/hooks/useDoctors.js`, here are the exact
API endpoints and the corresponding Audit events that need to be recorded.

### 1. Onboarding a New Doctor

- **Endpoint Route:** `POST /api/admin/dentists`
- **What to Log:**
    - `action`: `'CREATE_DOCTOR'`
    - `resource_type`: `'dentists'`
    - `resource_id`: `newDentist.id`
    - `old_values`: `null`
    - `new_values`: `{ first_name, last_name, email, specialization, tier }`
- **Why:** Tracks when an admin creates a new clinician account.

### 2. Updating Doctor Profile / Contact / Active Status

- **Endpoint Route:** `PATCH /api/admin/dentists/:id/profile`
- **What to Log:**
    - `action`: `'UPDATE_DOCTOR_PROFILE'`
    - `resource_type`: `'dentists'`
    - `resource_id`: `:id`
    - `old_values`: `currentProfileData`
    - `new_values`: `req.body`
- **Why:** Crucial for tracking when an admin deactivates a doctor (`is_active = false`), or changes
  their tier.

### 3. Assigning Services to a Doctor

- **Endpoint Route:** `PATCH /api/admin/dentists/:id/services`
- **What to Log:**
    - `action`: `'UPDATE_DOCTOR_SERVICES'`
    - `resource_type`: `'dentist_services'`
    - `resource_id`: `:id` _(the dentist ID)_
    - `old_values`: `{ service_ids: [old_array] }`
    - `new_values`: `{ service_ids: [new_array] }`
- **Why:** Tracks when permissions to perform specific procedures are granted or revoked.

### 4. Updating the Global Weekly Schedule

- **Endpoint Route:** `POST /api/admin/dentists/:id/schedule/bulk`
- **What to Log:**
    - `action`: `'UPDATE_GLOBAL_SCHEDULE'`
    - `resource_type`: `'dentist_schedule'`
    - `resource_id`: `:id` _(the dentist ID)_
    - `old_values`: `existingWeeklySchedule`
    - `new_values`: `req.body.schedules`
- **Why:** Extremely important. Changing a global schedule often forces the displacement of future
  appointments.

### 5. Adding an Emergency Time/Date Block

- **Endpoint Route:** `POST /api/admin/dentists/:id/block`
- **What to Log:**
    - `action`: `'CREATE_SCHEDULE_BLOCK'`
    - `resource_type`: `'dentist_availability_blocks'`
    - `resource_id`: `newBlock.id`
    - `old_values`: `null`
    - `new_values`: `req.body` _(includes the date, time, and reason)_
- **Why:** Tracks when an admin manually shuts down availability for a doctor, leading to sudden
  clinic unavailability or displaced patients.

### 6. Removing an Emergency Time/Date Block

- **Endpoint Route:** `DELETE /api/admin/dentists/:id/block/:blockId`
- **What to Log:**
    - `action`: `'DELETE_SCHEDULE_BLOCK'`
    - `resource_type`: `'dentist_availability_blocks'`
    - `resource_id`: `:blockId`
    - `old_values`: `deletedBlockStatus`
    - `new_values`: `null`
- **Why:** Tracks when a previously blocked time is reopened manually.

---

## Action Plan

For the Audit module to fully function and start displaying realistic data:

1. Open the backend files handling the `dentist` routes.
2. In each corresponding function, quickly read the existing data (`old_values`) before modifying
   it.
3. Perform the update.
4. Insert the new log into the `audit_log` table.
