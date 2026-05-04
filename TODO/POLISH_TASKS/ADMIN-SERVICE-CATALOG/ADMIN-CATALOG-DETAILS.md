# Admin Service Catalog: Detailed Implementation Plan

This document breaks down the tasks from `ADMIN-CATALOG-TASK.md` into step-by-step developer
actions. It covers the Database, Backend (Express API), and Admin Frontend required to support
dynamic service creation, image management, safe archiving (soft deletes), and appointment
dependency checks.

_Note: As requested, this prepares the backend architecture and Admin UI completely. The User/Guest
frontend adjustments to consume these visibility flags will be wired later._

---

## 🗄️ Stage 1: Database & Storage Setup (Non-Destructive)

We need to add columns for soft-deletion and visibility to the `services` table, and create an image
bucket.

### 1.1 SQL Migration (`20260505_update_services_schema.sql`)

Ensure the `services` table supports our new rules without breaking existing data:

```sql
-- 1. Add Soft Delete and Visibility Flags
ALTER TABLE services
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true, -- Allows hiding a service without archiving it
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true, -- Soft delete flag (false = archived)
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- 2. Ensure image_url exists
ALTER TABLE services
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Filtered Index for User App later (performance)
CREATE INDEX IF NOT EXISTS idx_services_active_visible ON services(is_active, is_visible);
```

### 1.2 Supabase Storage Bucket (Admin Setup)

Run this SQL (or execute via Supabase Dashboard) to set up the `service_images` bucket:

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('service_images', 'service_images', true)
ON CONFLICT DO NOTHING;

-- RLS Policy: Anyone can read (for public website)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'service_images' );

-- RLS Policy: Only authenticated Admins can insert/delete (handled via API or Admin client)
CREATE POLICY "Admin Uploads"
ON storage.objects FOR ALL
USING ( bucket_id = 'service_images' );
```

---

## ⚙️ Stage 2: Backend Architecture (Express API)

Create and update exactly what is needed for the CRUD lifecycle and the Displacement Guard.

### 2.1 Zod Schemas (`src/schemas/service.schema.js`)

Create extreme input safety for the Catalog CRUD routes.

```javascript
import { z } from 'zod';

export const serviceSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(100),
        description: z.string().max(500).optional(),
        duration: z
            .string()
            .regex(/^\d+[A-Za-z]+$/, 'Custom duration string format (e.g. 45m, 1h)'),
        cost: z.number().min(0).or(z.string()), // Flexible for formatting
        tier: z.enum(['general', 'specialized']),
        image_url: z.string().url().optional().nullish(),
        is_visible: z.boolean().default(true),
    }),
});
```

### 2.2 API Service Layer (`src/services/service.service.js`)

Build the four core administrative operations:

1. **`getAllServices(isAdmin = true)`**: Fetch all services. If `isAdmin`, ignore
   `is_active`/`is_visible` filters so the Admin sees everything (archived vs visible).
2. **`upsertService(data)`**: Create or update dynamically.
3. **`checkServiceDependencies(serviceId)`**:
    - **Query:**
      `SELECT id, patient_id, appointment_date FROM appointments WHERE service_id = ? AND status IN ('PENDING', 'APPROVED') AND appointment_date >= CURRENT_DATE`
    - **Return:** Array of affected appointments.
4. **`softDeleteService(serviceId)`**:
    - **Action:** `UPDATE services SET is_active = false, archived_at = NOW() WHERE id = ?`. This
      never runs a hard SQL `DELETE`.

### 2.3 API Routes & Controllers (`src/routes/service.routes.js`)

Map the services to Admin-protected routes:

- `GET /api/v1/services`
- `POST /api/v1/services`
- `PUT /api/v1/services/:id`
- `GET /api/v1/services/:id/dependencies` (New: Endpoint to feed the displacement modal)
- `DELETE /api/v1/services/:id` (Performs the soft delete)

---

## 🖥️ Stage 3: Admin Context Integration

Refactor the frontend Context to use the live API.

### 3.1 Overhaul `ServicesContext.jsx`

- **Remove `MOCK_SERVICES` entirely.**
- Implement states: `services`, `loading`, `error`.
- On mount, `fetchServices()` from `/api/v1/services`.
- Create helper methods exposing the API to the UI:
    - `addService(data)`
    - `updateService(id, data)`
    - `archiveService(id)` - calls `DELETE` route
    - `checkDependencies(id)` - calls dependency route to pause UI before actual deletion.

---

## 🎨 Stage 4: Admin Frontend Component Polish

Upgrade the existing generic components to support the new features.

### 4.1 Update `ServiceModal.jsx` (Create, Edit, Visibility & Images)

- **Visibility Toggle:** Add a Switch/Toggle at the bottom: "Visible on Public Website". Binds to
  `is_visible`.
- **Validation Blocks:** Do not allow the `Save` button to be clicked if `name` is empty or
  `duration` is missing.
- **Image Uploader UI (Dual Mode):**
    - Provide a toggle or tab allowing the admin to choose between **"Upload Custom Image"** and
      **"Provide Image Link (URL)"**.
    - **If Link:** Retain the generic text input for pasting an external URL.
    - **If Upload:** Replace the text input with a drag-and-drop or file selection container.
    - **File Size Validation:** Add frontend security checks before uploading. Enforce a **Minimum
      File Size** (e.g., 10KB to prevent 1px dummy images or corrupted files) and a **Maximum File
      Size** (e.g., 2MB or 5MB to save bandwidth/storage). Show an instant error toast if it fails
      these checks.
    - On file drop, use the Supabase JS Client (`supabase.storage.from('service_images').upload()`)
      to directly upload it.
    - Return the Public URL and attach it to the `image_url` state before executing the backend
      save.

### 4.2 Handling Archiving & Dependencies (`ServiceDetailView.jsx` & Displacement Modal)

- **Delete Button Safety:** Clicking `Archive/Stash Service` triggers `.checkDependencies(id)`.
- **Displacement Conflict Modal:**
    - _Scenario A: 0 Dependencies._ Run `archiveService()` immediately. Success toast.
    - _Scenario B: 1+ Dependencies._ Block immediate deletion. Open `<DisplacementModal />`.
        - Modal lists `[Patient Name] - [Appt Date] - [Status]`.
        - Modal Text: _"Stashing this service affects X upcoming appointments. Would you like to
          Force Stash anyway? It will not delete the appointments, but the service will no longer be
          visible."_
        - Buttons: **"Cancel"** or **"Force Stash & Archive"**.
        - If Force Stash clicked -> Execute `archiveService()`, show Success toast, update UI.

### 4.3 Add Toast Notifications (Global)

Wrap all Context CRUD actions in toast alerts:

- `toast.success("Service successfully created")`
- `toast.success("Service stashed securely")`
- `toast.error("Failed to upload image")`

---

## ✅ Summary / Outcome

By executing this plan:

1. The database supports hiding services without destroying history.
2. The Admin can seamlessly upload photos from their computer safely to Supabase.
3. The Admin is protected from accidentally hiding a service that patients are currently booked
   into, with a conscious "Force Save" override available.
4. The User Frontend remains unaffected until we decide to filter using `is_visible = true` in
   phase 2.
