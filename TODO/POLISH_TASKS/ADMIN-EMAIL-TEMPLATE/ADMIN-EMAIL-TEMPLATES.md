# Admin Email Template Management: Implementation Plan

This document outlines the detailed implementation of an in-app "Email Template Editor" inside the Admin Portal. This will allow the admin to select an existing email type (e.g., OTP string, Booking Confirmed), view the raw HTML/Markdown, inject dynamic variables (like `{{name}}`), and preview/save the template directly to the database instead of relying on hardcoded `.html` files in the server directory.

---

## 📋 1. The Goal & Scope
To transition away from static `fs.readFileSync` templates (like `guest-otp.html`, `booking-confirmed.html`) into dynamically loaded database-driven templates.
Admins will use a UI with a dropdown to select the template type, an IDE-like editor for HTML, a live preview pane, and an explicit list of available dynamic variables `{{...}}` for each type of email.

## 🗄️ 2. Database Schema Changes (Non-Destructive)

We need a dedicated table to store these templates, supporting versioning or at least overriding the defaults.

### 2.1 SQL Migration (`20260505_create_email_templates.sql`)
```sql
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'guest-otp', 'booking-confirmed'
    subject_line VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    available_variables JSONB NOT NULL DEFAULT '[]', -- Array of keys: ['name', 'date', 'time']
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Stubs based on current hardcoded files
INSERT INTO email_templates (template_key, subject_line, html_content, available_variables, description) VALUES
('guest-otp', 'Primera Dental - Your Verification Code', '<html>...</html>', '["name", "otpCode", "expiresIn"]', 'Sent to guests to verify their email before booking.'),
('booking-confirmed', 'Your Appointment is Confirmed', '<html>...</html>', '["name", "service", "date", "time", "location"]', 'Sent when the secretary approves a booking.'),
('booking-request-received', 'Booking Request Received', '<html>...</html>', '["name", "service", "date", "time"]', 'Sent instantly upon booking request.'),
('booking-cancelled', 'Appointment Cancelled', '<html>...</html>', '["name", "service", "date", "time", "reason"]', 'Sent when an appointment is cancelled.'),
('appointment-rescheduled', 'Appointment Rescheduled', '<html>...</html>', '["name", "service", "oldDate", "newDate", "newTime"]', 'Sent when an appointment time is moved.'),
('appointment-reminder', 'Reminder: Upcoming Appointment', '<html>...</html>', '["name", "service", "date", "time"]', 'Sent 24/48 hours before the appointment.'),
('waitlist-offer', 'A Slot Opened Up!', '<html>...</html>', '["name", "service", "date", "time", "claimLink", "expiresIn"]', 'Sent to waitlist users when a slot matches.'),
('account-setup-invite', 'Set up your Primera Dental Account', '<html>...</html>', '["name", "setupLink"]', 'Sent to guests converted into patients by the Admin.')
ON CONFLICT (template_key) DO NOTHING;
```

---

## ⚙️ 3. Backend Refactoring (`api/src/services/email-confirmation.service.js`)

The backend currently reads from the filesystem (`fs.readFileSync`). It needs to query the database, fallback to the file system if DB fails, and process the variables.

- [ ] **Create Template API**: `GET /api/v1/email-templates` and `PUT /api/v1/email-templates/:key` to fetch and update the layout and subject lines.
- [ ] **Refactor `getTemplate` Function**: 
  - Change `getTemplate` to be strictly asynchronous.
  - Query `SELECT html_content, subject_line FROM email_templates WHERE template_key = ?`.
  - Compile the `{{variable}}` tags exactly as it currently does.
- [ ] **Fallback Mechanism**: Maintain the strict fallback where if the DB is empty (or the query fails), it pulls from `fs.readFileSync(path.join(process.cwd(), '..', '..', 'EmailTemplates', templateName))`.

---

## 🖥️ 4. Admin Frontend Implementation (`ClinicRulesSettings.jsx` or New Tab)

We will build a dedicated "Email Templates" tab in the Settings UI or a standalone page under Communications.

### 4.1 Layout & State
- **Dropdown Selector**: A `<select>` or Listbox of all `template_key` options.
- **Context Panel (Dynamic Variables)**: A side panel showing the `available_variables` JSON array for the selected template. E.g., *"You can use `{{name}}`, `{{time}}`, `{{date}}` in this template."*
- **Split Screen Editor**:
  - **Left Side**: A `<textarea>` or basic code editor (like Monaco/textarea) holding the raw HTML content.
  - **Right Side (Preview)**: An `<iframe>` or `dangerouslySetInnerHTML` rendering the HTML in real-time. It will replace `{{name}}` with "John Doe" so the Admin sees exactly what it looks like.

### 4.2 Actions
- **Preview Replace Function**: When evaluating the preview, run a live Regex replace inserting dummy data onto the HTML so the admin isn't just looking at broken template tags.
- **Save**: Push the updated HTML and Subject Line to `PUT /api/v1/email-templates/:key`.
- **Reset to Default**: A button that clears the row or fetches the hardcoded `fs` file to restore the original layout if the Admin breaks the HTML.

### 4.3 Validation Guard
- Scan the HTML before saving to ensure the Admin hasn't deleted critical system variables maliciously or created broken structural `<html>` tags.