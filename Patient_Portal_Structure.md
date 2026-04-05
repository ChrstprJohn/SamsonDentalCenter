# Patient Portal Structure and Backend Mapping

Based on the current backend implementation (routes and controllers), here is a proposed structure
for the Patient Portal (User Frontend), outlining the necessary pages, their content, and whether
the required endpoints are already supported by your backend APIs.

## Available Pages (Supported by Current Backend)

### 1. **Authentication Pages**

- **Login Page (`/login`)**
    - **Content:** Email/Phone and password input form, "Forgot Password" link, and social login
      buttons (if applicable).
    - **Backend Status:** ✅ Supported. Addressed by `auth.routes.js` and `auth.controller.js`.
- **Registration/Sign-Up Page (`/signup`)**
    - **Content:** Form for new patient onboarding (Name, Email, Phone, Password).
    - **Backend Status:** ✅ Supported. Addressed by `auth.routes.js`.
- **Password Reset / Forgot Password (`/forgot-password`)**
    - **Content:** Form to enter email to receive a password reset link.
    - **Backend Status:** ✅ Supported. Standard part of `auth` endpoints.

### 2. **Dashboard / Home (`/dashboard`)**

- **Content:**
    - Summary of upcoming appointments.
    - Quick links to "Book New Appointment", "My Profile", etc.
    - Recent notifications.
- **Backend Status:** ✅ Supported. Can aggregate data from `appointments.routes.js` and
  `notifications.routes.js`.

### 3. **Appointments Management (`/appointments`)**

- **My Appointments List**
    - **Content:** List of upcoming and past appointments with statuses (Pending, Confirmed,
      Completed, Cancelled).
    - **Backend Status:** ✅ Supported (`appointments.routes.js`).
- **Appointment Booking Flow (`/book`)**
    - **Step 1: Select Service**
        - **Backend Status:** ✅ Supported (`services.routes.js`).
    - **Step 2: Select Date & Time (Slots)**
        - **Backend Status:** ✅ Supported. You have robust slot management (`slots.routes.js`,
          `smart-slots.routes.js`).
    - **Step 3: Confirm Details**
        - **Backend Status:** ✅ Supported (`appointments.routes.js` create appointment).
- **Reschedule/Cancel Appointment**
    - **Content:** Options to pick a new slot or cancel an existing appointment.
    - **Backend Status:** ✅ Supported (`appointments.routes.js`).

### 4. **Waitlist Management (`/waitlist`)**

- **Content:** Option to join a waitlist for earlier appointment slots if the desired time is fully
  booked. Shows current waitlist status.
- **Backend Status:** ✅ Supported (`waitlist.routes.js`).

### 5. **Notifications (`/notifications`)**

- **Content:** Inbox or list showing reminders for upcoming appointments, confirmation messages, or
  system alerts.
- **Backend Status:** ✅ Supported (`notifications.routes.js`).

---

## Pages That May Need Backend Additions (Not Explicitly Implemented Yet)

### 1. **User Profile & Settings (`/profile`)**

- **Content:**
    - View and edit personal information (Name, Contact info, Address).
    - Change password.
    - Communication preferences (Email/SMS opt-in).
- **Backend Status:** ⚠️ Partially Supported. While `auth` handles the basic user entity, a
  dedicated `user.routes.js` (for CRUD on user profile data) and `user.controller.js` might be
  missing or bundled within auth. You'll likely need routes like `GET /api/user/profile` and
  `PUT /api/user/profile`.

### 2. **Medical History / Records (`/records`)**

- **Content:**
    - Past treatment notes, uploaded documents (like X-Rays), or filled medical forms.
- **Backend Status:** ❌ Not Found. There are no explicit routes for medical records or chart notes
  in the current structure. You would need to create `records.routes.js` and models to store patient
  documents and history securely.

### 3. **Billing and Invoices (`/billing`)**

- **Content:**
    - View past invoices, payment status, and make online payments.
- **Backend Status:** ❌ Not Found. No `billing`, `payments`, or `invoices` routes/controllers are
  present. Integration with a payment gateway (like Stripe) and associated endpoints would be
  required.

### 4. **Messages / Chat to Clinic (`/messages`)**

- **Content:**
    - Secure messaging with the clinic staff or doctor for quick queries.
- **Backend Status:** ❌ Not Found. You have `notifications`, but if you want 2-way chat/messaging,
  a new system (possibly using web sockets or `messages.routes.js`) would be needed.

## Summary & Next Steps

For the immediate MVP of your Patient Portal, your backend is fully equipped to handle
**Authentication**, **Appointment Booking & Management**, **Smart Slots**, **Waitlists**, and
**Notifications**.

You can start building the Frontend UI for these components immediately in `apps/user`.

If you wish to expand to features like **Billing**, detailed **User Profiles**, or **Medical
Records**, you will need to expand the backend endpoints accordingly.
