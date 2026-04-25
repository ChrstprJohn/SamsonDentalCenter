# Audit Log UX Improvement Plan

## Overview

It is completely normal for raw audit logs stored in the database to be highly technical (e.g.,
storing raw JSON `old_values` and `new_values`, and using database IDs instead of names). However,
exposing this raw data directly to administrators is a poor user experience.

This plan outlines how to translate the raw technical audit logs into a human-readable,
user-friendly interface.

## Phase 1: Action Translation (Humanizing the Event)

Instead of showing raw action constants (e.g., `UPDATE_DOCTOR_PROFILE`), the frontend should map
these to friendly sentences.

**Mapping Examples:**

- `CREATE_DOCTOR` → "Created a new doctor account"
- `UPDATE_DOCTOR_PROFILE` → "Updated doctor profile information"
- `UPDATE_GLOBAL_SCHEDULE` → "Modified global availability schedule"
- `CREATE_SCHEDULE_BLOCK` → "Added an emergency time block"

## Phase 2: Entity Resolution (Replacing IDs with Names)

Users do not know who "Resource ID: 812b-421a" is. We must display the actual name of the patient or
doctor.

**Backend Approach:** When fetching audit logs, the backend should perform `JOINS` (or use a view)
to embed the actual names of the actors (who did it) and resources (who it was done to).

- _Raw data:_ `actor_id: 123` acted on `resource_id: 456`.
- _UI output:_ "Admin Jane Doe updated Doctor Sarah Smith."

## Phase 3: Smart Diffing (The "What Changed" Summary)

Instead of dumping `{"is_active": false, "tier": "gold"}` as JSON blocks on the screen, parse the
`old_values` and `new_values` objects to generate human-readable bullet points.

**Logic:** Iterate over the keys in the `new_values` JSON. If the value differs from `old_values`,
generate a sentence.

- _Boolean changes:_ `is_active` changed from `true` to `false` → "Deactivated account"
- _String changes:_ `tier` changed from `silver` to `gold` → "Changed tier from Silver to Gold"
- _Array/Schedule changes:_ "Updated working hours for Monday"

## Phase 4: UI Presentation

Strictly adhering to clean, data-driven UI principles:

1. **Timeline View:** Display logs in a vertical timeline format (like GitHub's PR timeline or
   Linear's issue history).
2. **Expandable Details:** Keep the main view clean with the summary ("Admin updated Dr. Smith's
   profile"). Add an "Expand details" button that shows the specific fields changed (Phase 3).
3. **Raw Data Toggle (Optional):** Keep a "View Raw Output" button hidden inside the expanded view
   for developers to see the exact database JSON if debugging is needed.
4. **Filtering:** Allow the admin to filter by Actor (Who?), Action type, and Date context.
