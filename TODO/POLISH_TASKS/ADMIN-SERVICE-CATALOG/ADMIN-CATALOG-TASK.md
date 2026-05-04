# Admin Service Catalog & Management Plan

This document outlines the required tasks to fully implement, polish, and secure the Admin Service
Catalog. Currently, the catalog has basic frontend viewing and mock data but lacks backend
integration, image upload management, and safe deletion protocols.

## 📋 Target Checklist

### 1. Catalog Frontend Polish & Adjustments

- [ ] **Create/Edit Flow**: Ensure the `ServiceModal.jsx` correctly binds to creating new services
      and updating existing ones. Add validation so an admin cannot submit an empty service name or
      0 duration.
- [ ] **Empty States & Loading**: Enhance the UI in `Services.jsx` for when no services match the
      search or when loading data from the backend.
- [ ] **Alerts & Toast Notifications**: Add success/error toasts when creating, editing, or deleting
      a service (e.g., "Service Saved", "Failed to delete: Appointments exist").

### 2. Image Management (Uploads)

- [ ] **Supabase Storage Bucket**: Set up a Supabase Storage bucket (e.g., `service_images`) to hold
      catalog photos.
- [ ] **Image Upload UI**: Update `ServiceModal.jsx` to replace the generic "Image URL" text input
      with a drag-and-drop or file select input.
- [ ] **Image API Route**: Create a backend or frontend-to-Supabase direct upload connection to
      return the public URL and save it to the service record.

### 3. Backend Integration

- [ ] **Context Overhaul**: Remove `MOCK_SERVICES` from `ServicesContext.jsx` and hook up standard
      CRUD operations hitting the Express API or Supabase.
- [ ] **API Routes**: Ensure `GET /services`, `POST /services`, `PUT /services/:id`, and
      `DELETE /services/:id` exist and validate appropriately.

### 4. Visibility vs. Full Archive & Displacement Protocol (Critical)

- [ ] **Visibility Toggle (Non-Disruptive)**: Add a simple true/false toggle for "Website
      Visibility" (`is_visible`). Hiding a service simply removes it from the public User/Guest
      booking catalog. It **does not** displace or affect any existing pending or approved
      appointments.
- [ ] **Dependency Check on Full Archive**: If the Admin attempts to fully 'Delete' or 'Stash' a
      service, the system must query the `appointments` table for any active
      (_Future/Pending/Approved_) appointments.
- [ ] **Displacement Conflict Modal**: If active appointments are attached to the service being
      stashed, trigger a displacement modal (identical to the Holiday/Block Time methodology). List
      all affected appointments.
- [ ] **Resolution Options (Force Save)**: Inside the conflict modal, allow the admin to either
      "Force Save/Archive" (stashes the service anyway without crashing the system) or "Cancel" to
      manually handle the patients first.
- [ ] **Safe Archive (Soft Delete)**: When successfully triggered, execute a soft delete (e.g.,
      `archived_at = NOW()`) instead of a hard SQL `DELETE`. This guarantees past user history and
      invoices are never broken.
