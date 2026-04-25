# Admin Audit Logs - MVP Implementation Plan

## 1. Database Context & Enhancements

Based on `FINAL-COMPLETE-SCHEMA.sql`, the `audit_log` table currently looks like this:

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Database Recommendation:** Because audit logs are almost always viewed in reverse-chronological
order and paginated, you should add an index on the `created_at` column to ensure the queries remain
fast as the table grows to millions of rows.

```sql
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
```

---

## 2. API Design (Backend)

We need a secure, read-only, paginated endpoint.

**Endpoint:** `GET /api/admin/audit-logs` **Route Protection:** Must be wrapped in an Admin-only
middleware.

**Query Parameters (Filters & Pagination):**

- `page` (default 1)
- `limit` (default 20, max 100)
- `actor_id` (optional, filter by specific user)
- `resource_type` (optional, filter by 'appointments', 'dentist_schedule', etc.)
- `action` (optional, filter by 'UPDATE', 'DELETE', 'CREATE', 'LOGIN')
- `date_from` / `date_to` (optional)

**Data Fetching Strategy (Supabase/PostgreSQL):** You must perform a JOIN on the `profiles` table to
resolve the `actor_id` into a human-readable name.

```javascript
// Example Supabase Query Structure
let query = supabase
    .from('audit_log')
    .select(
        `
    id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    created_at,
    profiles!actor_id ( id, full_name, role )
  `,
        { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to);
```

**Response Format:**

```json
{
    "data": [
        {
            "id": "uuid",
            "actor": { "id": "uuid", "full_name": "John Doe", "role": "secretary" },
            "action": "UPDATE",
            "resource_type": "appointments",
            "resource_id": "uuid",
            "created_at": "2026-04-26T10:00:00Z"
        }
    ],
    "metadata": {
        "total": 1500,
        "page": 1,
        "limit": 20,
        "totalPages": 75
    }
}
```

_(Note: Omit `old_values` and `new_values` strings from the initial table fetch to save bandwidth.
Fetch them dynamically when a user clicks "View Details" on a specific row)._

---

## 3. Frontend UI Architecture (React)

**Route:** `/admin/audit-logs`

### Components Required:

1. **AuditLogPage (Container):** Manages the state, fetches data, handles pagination.
2. **FilterBar:**
    - Date Range Picker.
    - Dropdown for `Action` types.
    - Search/Dropdown for `Actor`.
    - Dropdown for `Resource Type`.
3. **AuditDataTable:**
    - **Timestamp:** Formatted nicely (e.g., `Apr 26, 2026 - 10:00 AM`).
    - **Actor:** Name and role badge (e.g., "Jane Smith [Admin]").
    - **Action:** Color-coded badges (`CREATE`=Green, `UPDATE`=Blue, `DELETE`=Red).
    - **Resource:** `resource_type` combined with `resource_id`.
    - **Actions Column:** A "View Changes" button.
4. **PaginationFooter:** Simple Next/Prev and Page numbers.
5. **DiffViewerModal:**
    - When "View Changes" is clicked, open a Modal dialog.
    - Use a library like `react-json-view` or a custom component that visually highlights the
      differences between `old_values` and `new_values`.

---

## 4. Execution Steps (Checklist)

- [ ] **Step 1:** Create UI Skeletons
    - Add `/admin/audit-logs` to the React Router.
    - Add it to the Admin Sidebar Navigation.
    - Create the basic layout with an empty table and dummy data.
- [ ] **Step 2:** Create API Route
    - Build the backend endpoint with pagination, joining the profiles table.
    - Add admin authentication checks.
- [ ] **Step 3:** Connect & Render
    - Hook the UI table up to the real API.
    - Implement the `Filters` and `Pagination` behaviors triggering API refetches.
- [ ] **Step 4:** Build the Diff Modal
    - Fetch full JSON details on row click.
    - Render the before/after views.
