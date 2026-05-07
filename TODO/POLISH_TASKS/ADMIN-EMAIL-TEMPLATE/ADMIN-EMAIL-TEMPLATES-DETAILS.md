# Admin Email Template Management: Detailed Implementation Plan

This document outlines the end-to-end plan for integrating a Database-Driven Email Template Editor
with Live Preview into the existing SaaS architecture.

## 1. Sidebar Navigation Integration

To maintain the architectural cleanliness established in `ADMIN-SIDEBAR.md`, we will add the new
feature under `System & Logs`.

**Update in `AdminSidebar.jsx` (under `navigationGroups`):**

```javascript
// ...existing code...
    {
        title: 'System & Logs',
        items: [
            { icon: <MailIcon />, name: 'Message Logs', path: '/message-activity' },
            { icon: <TemplateIcon />, name: 'Email Templates', path: '/email-templates' }, // NEW ITEM
            { icon: <AuditIcon />, name: 'Audit Trail', path: '/audit-logs' },
            { icon: <SettingsIcon />, name: 'Clinic Configuration', path: '/settings' },
        ],
    },
// ...existing code...
```

## 2. Database Schema (Schema Updates)

We need a table to store the templates. We will execute the following SQL migration.

```sql
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key VARCHAR(100) UNIQUE NOT NULL, -- The internal reference (e.g., 'guest-otp')
    name VARCHAR(255) NOT NULL, -- Human-readable name (e.g., 'Guest OTP Verification')
    subject_line VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'General', -- Grouping (Authentication, Booking, etc.)
    required_variables JSONB NOT NULL DEFAULT '[]', -- Array of required keys that MUST be present to save
    optional_variables JSONB NOT NULL DEFAULT '[]', -- Array of optional keys
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) -- Track who last modified it
);

-- Note: We define 'Global Variables' implicitly in the app logic (e.g., {{clinicName}}, {{supportEmail}}),
-- while 'Unique Variables' are defined per template in 'required_variables' and 'optional_variables'.
--
-- STATUS: DEPLOYED in FINAL-COMPLETE-SCHEMA.sql
```

## 3. Backend Implementation (Node.js/Express)

### 3.1. API Endpoints (`apps/api/src/routes/email-templates.routes.js`) [DONE]

- `GET /api/v1/email-templates`: Fetch all templates.
- `GET /api/v1/email-templates/:key`: Fetch specific template + metadata.
- `PUT /api/v1/email-templates/:key`: Update content/subject with validation.
- `POST /api/v1/email-templates/:key/restore`: Reset to factory default.

### 3.2. Service Refactoring [DONE]

- [x] **Retrieve:** DB-first lookup.
- [x] **Fallback:** Local FS reading if DB is empty.
- [x] **Global Injection:** {{clinicName}} automatically available.
- [x] **Parsing:** Precise replacement of `{{var}}` tags.

## 4. Frontend Implementation (React/Tailwind)

### 4.1. Routing

Add the new route in the Admin's `App.jsx` or router configuration:
`<Route path="/email-templates" element={<EmailTemplatesPage />} />`

### 4.2. UI Architecture (`apps/admin/src/pages/EmailTemplates/`)

- **`EmailTemplatesPage.jsx`**: [DONE] The main container for the template management suite.
- **`TemplateSelector.jsx`**: [DONE] Integrated as a dropdown selector within the header.
- **`TemplateEditorPane.jsx`**: [DONE] Source code editor with live preview toggle.
- **`VariablePanel.jsx`**: [DONE] Redesigned VariableHelper with tooltips and click-to-copy.
- **`LivePreviewPane.jsx`**: [DONE] Sandboxed iframe preview with real-time demo data mapping.

## 5. Security & Safety Flow

1.  **Variable Guard:** When hitting the `PUT` endpoint to save, the backend parses the
    `html_content` and ensures all instances listed in the DB's `required_variables` JSON array
    exist. If `{{otpCode}}` is deleted by mistake, the backend responds with a `400 Bad Request` and
    an error message.
2.  **Versioning/Audit:** Any update to a template logs an entry in the existing `audit_log` table
    (e.g., "Actor X modified Template Y").
3.  **Graceful Degradation:** If the SQL query fails during an actual patient operation, the system
    inherently falls back to reading the hardcoded `fs.readFileSync` file.

---

## 6. Recommended Template Lifecycle (Positive vs. Negative Flows)

To ensure the patient is always informed about _what happens next_, we will structure templates
around a "Positive/Negative" decision tree. We are also upgrading the time formatting from just a
`startTime` to a full `timeRange` (`{{startTime}} - {{endTime}}`).

### 6.1 Expanded Global & Unique Variables

- **Time Range Variables:** We will supply both `{{startTime}}` and `{{endTime}}` to the parser so
  templates can format them as: `2:00 PM - 3:00 PM`. **This is mandatory for all appointment-related
  templates.**
- **Doctor Variable (Optional):** We will include `{{doctor}}` as an optional variable for templates
  where the provider needs to be specified (e.g., after approval).
- **Reason/Context Variables:** Introducing `{{reason}}` for rejections/cancellations.
- **Action/Next Steps Variables:** Implicit text inside templates guiding the user.
- **Interactive Action Links:** Introducing `{{manageUrl}}`, `{{cancelUrl}}`, and
  `{{rescheduleUrl}}` to allow patients to take direct action from their emails.

### 6.2 The Complete Template Catalog

**A. Authentication**

- **`guest-otp`**: Sent during initial booking.
    - _Tone:_ Secure.
    - _Next Step Info:_ "Enter this code to submit your request."

**B. The Booking Lifecycle**

- **`booking-request-received` (Neutral)**: Sent immediately upon patient confirming the OTP.
    - _Tone:_ Acknowledgment.
    - _Next Step Info:_ "Our staff is reviewing your request. You will receive an approval or
      rejection notice shortly."
- **`booking-approved` (Positive Outcome)**: Sent when Admin/Secretary clicks "Approve" (Renamed
  from Confirmed). Applies to **both General and Specialized** requests.
    - _Time Context:_ `{{date}} from {{startTime}} to {{endTime}}`
    - _Variables Included:_ `{{manageUrl}}`, optional `{{doctor}}`.
    - _Next Step Info:_ "Please arrive 10 minutes early. If you need to modify your booking, click
      the button below."
- **`booking-rejected` (Negative Outcome)**: Sent if Admin/Secretary declines the booking. Applies
  to **both General and Specialized** requests.
    - _Variables included:_ `{{reason}}`
    - _Next Step Info:_ "Unfortunately, we cannot accommodate this request because: {{reason}}.
      Please view our live calendar to select a different time."

**C. Timeline Changes**

- **`appointment-rescheduled` (Neutral/Clinic Action)**: Admin moves the appointment.
    - _Variables included:_ `{{oldDate}}`, `{{newDate}}`, `{{newStartTime}} - {{newEndTime}}`,
      `{{manageUrl}}`.
    - _Next Step Info:_ "If this new time does not work for you, please click below to reschedule."
- **`appointment-cancelled` (Negative/Patient Action)**: Patient or Clinic cancels.
    - _Variables included:_ `{{date}}`, `{{startTime}} - {{endTime}}`.
    - _Next Step Info:_ "Your slot has been released. Book a new session anytime!"

**D. Pre & Post Visit (Retention)**

- **`appointment-reminder-48h` (Positive / Early Warning)**: Sent 2 days prior to allow graceful
  rescheduling without penalization.
    - _Variables included:_ `{{manageUrl}}`, `{{cancelUrl}}`, `{{rescheduleUrl}}`.
    - _Next Step Info:_ Includes a large, prominent button: "Manage Appointment" (to cancel or
      reschedule). "Please let us know now if you cannot make it."
- **`appointment-reminder-24h` (Positive / Final Reminder)**: Sent 1 day prior.
    - _Variables included:_ `{{manageUrl}}`, `{{cancelUrl}}`.
    - _Next Step Info:_ Includes an action button. "Your appointment is tomorrow. Cancellations
      under 24 hours may incur a penalty."
- **`missed-appointment` (Negative/No-Show)**: Sent automatically if marked as No-Show.
    - _Tone:_ Polite but firm.
    - _Next Step Info:_ "We missed you today. Repeated no-shows may limit your ability to book
      online."
- **`post-visit-feedback` (Positive/Growth)**: Sent 2 hours after a successful service.
    - _Next Step Info:_ "How was your visit? Leave a quick review linking to our Google page."

---

## 7. The Default Master Skeleton (Brand Identity)

All seed templates in the database will share a single, responsive master layout. This prevents
emails from looking mismatched.

### Design Philosophy

- **Responsive Framework:** A `<div style="max-width: 600px; margin: 0 auto;">` shell that works on
  both mobile and desktop clients.
- **Formal & Minimalist:** White cards on a soft off-white/rose background (`#fef2f2`).
- **Brand Colors:** The primary branding uses "Samson Red" (`#be123c`) sparingly. The red is used
  _only_ for the header block (`<div style="background: #be123c;">`) holding the clinic name,
  primary action buttons, and critical text (like OTPs).
- **Typography:** Web-safe `sans-serif` (Inter/Roboto fallback) with high-contrast text (`#1e293b`
  for headings, `#475569` for body text) ensuring maximum readability.

### Action Buttons

Links such as `{{rescheduleUrl}}` and `{{cancelUrl}}` will be wrapped in bold, easily-tappable CTA
(Call to Action) buttons.

```html
<!-- Example CTA Button Structure for Reminders -->
<div style="margin: 32px 0; text-align: center;">
    <a
        href="{{manageUrl}}"
        style="background-color: #be123c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;"
        >Manage or Reschedule</a
    >

    <p style="margin-top: 16px; font-size: 14px;">
        <a
            href="{{cancelUrl}}"
            style="color: #64748b; text-decoration: underline;"
            >Cancel Appointment</a
        >
    </p>
</div>
```

This ensures patients receive a visually striking, professional email that intuitively drives them
to manage their own schedules, thus lowering receptionist call volume.
