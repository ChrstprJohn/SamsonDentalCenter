# SamsonDental — Production-Grade Codebase Review & Improvement Checklist

## 1. 🔴 Critical — Security Hardening

- [x] **1.1 Add `helmet` for HTTP Security Headers**
  - **File**: `app.js`
  - **Problem**: No HTTP security headers (CSP, X-Frame-Options, HSTS, etc.) are set. Browsers will use defaults, leaving the app open to clickjacking, MIME sniffing, and XSS.
  - **Instructions**: 
    1. Install `helmet` (`npm install helmet`). 
    2. In `app.js`, add `import helmet from 'helmet';` at the top. 
    3. Add `app.use(helmet());` **before** `app.use(express.json())`. 
    4. For Supabase image domains, configure CSP: `app.use(helmet({ contentSecurityPolicy: { directives: { ...helmet.contentSecurityPolicy.getDefaultDirectives(), 'img-src': ["'self'", 'https://*.supabase.co'] } } }))`.

- [x] **1.2 Add `express.json()` Size Limit**
  - **File**: `app.js`
  - **Problem**: No body size limit. An attacker can send a multi-GB JSON payload and crash the server (DoS).
  - **Instructions**: Change `app.use(express.json())` to `app.use(express.json({ limit: '1mb' }))`. This is safe — no dental appointment payload should exceed 1MB.

- [x] **1.3 Stop Using `SELECT *` in Auth Middleware**
  - **File**: `auth.middleware.js`
  - **Problem**: `auth.middleware.js` does `SELECT *` on the profiles table, then spreads the entire row onto `req.user`. This leaks sensitive fields like `no_show_count`, `is_booking_restricted`, `restriction_reason`, and `deposit_required` to every downstream controller — even ones that don't need them.
  - **Instructions**: 
    1. Replace `.select('*')` with `.select('id, email, full_name, phone, role')` — only the fields needed for request context. 
    2. If specific controllers need `no_show_count` or `is_booking_restricted`, those controllers should fetch them explicitly from the service layer. 
    3. Do **not** spread the entire profile object (`...profile`) — construct `req.user` explicitly with named fields.

- [x] **1.4 Enable the `optionalAuth` Middleware (Currently Commented Out)**
  - **File**: `auth.middleware.js`
  - **Problem**: The `optionalAuth` middleware is fully implemented but commented out in `auth.middleware.js`. Guest endpoints like `POST /book-guest` and `POST /slots/hold` have **zero auth** — not even optional identification.
  - **Instructions**: 
    1. Uncomment the `optionalAuth` function. 
    2. Apply the same `SELECT` fix from 1.3 (only select needed fields). 
    3. Apply `optionalAuth` to the `POST /slots/hold` and `POST /slots/release-hold` routes in `appointments.routes.js`, so if a logged-in user holds a slot, you know who.

- [x] **1.5 Validate & Sanitize All Inputs with Zod Schemas in Routes**
  - **Files**: All route files (`appointments.routes.js`, `admin.routes.js`, etc.)
  - **Problem**: Zod is installed and a `validate()` middleware exists but it's **never used** in any route file. All input validation is manual inline checks in controllers.
  - **Instructions**: 
    1. Create a new `backend/api/src/schemas/` directory. 
    2. For each route group, create a schema file (e.g., `appointment.schema.js`). 
    3. Define Zod schemas for `body`, `params`, and `query` of each endpoint. 
    4. In the route file, add the `validate(schema)` middleware **before** the controller. 
    5. Remove the manual inline validation from the controller.

- [x] **1.6 Secure the Slot Hold Endpoints**
  - **File**: `appointments.routes.js`
  - **Problem**: `POST /slots/hold` and `POST /slots/release-hold` are completely public with no rate limiting, no auth, and no session verification.
  - **Instructions**: 
    1. Add a dedicated rate limiter for hold endpoints (e.g., max 10 holds per IP per 15 minutes). 
    2. Add `optionalAuth` middleware so authenticated users are tracked. 
    3. Add server-side validation that `user_session_id` is a valid UUID format. 
    4. Consider limiting to max 1 active hold per session to prevent bulk slot locking.

- [x] **1.7 Prevent Information Leakage in Error Responses**
  - **Files**: `error.middleware.js`, all services
  - **Problem**: Many controllers throw raw objects where `error.message` may contain Supabase internal details.
  - **Instructions**: 
    1. Create an `AppError` class in `utils/errors.js`. 
    2. Replace all `throw { status, message }` patterns across services with `throw new AppError(message, status)`. 
    3. In the error handler, check `if (err instanceof AppError)` for safe user-facing errors; for all other errors, return a generic `"Internal server error"`.

- [x] **1.8 Harden CORS Configuration for Production**
  - **File**: `app.js`
  - **Problem**: CORS origin list is hardcoded with `localhost` URLs.
  - **Instructions**: 
    1. Move the CORS origin to an environment variable: `ALLOWED_ORIGINS=https://primeradental.com,https://admin.primeradental.com`. 
    2. Parse it and use only the env var origins in production.

- [x] **1.9 Secure Token Storage on Frontend**
  - **File**: `AuthContext.jsx`
  - **Problem**: Auth tokens are stored in `localStorage` which is vulnerable to XSS attacks.
  - **Instructions**: 
    1. Switch to `httpOnly` cookies set by the backend on login. 
    2. Add CSRF protection with a double-submit cookie pattern. 
    3. Update the frontend `api.js` to send `credentials: 'include'` with all requests instead of manually attaching the `Authorization` header.

## 2. 🟠 High — Database & Schema

- [x] **2.1 Add Missing Composite Indexes for Query Performance**
  - **File**: `FINAL-COMPLETE-SCHEMA.sql`
  - **Problem**: Queries frequently run on combinations like `patient_id + status + appointment_date` but no composite indexes exist.
  - **Instructions**: Add composite indexes: 
    1. `CREATE INDEX idx_appointments_patient_status_date ON appointments(patient_id, status, appointment_date);` 
    2. `CREATE INDEX idx_appointments_dentist_date_status ON appointments(dentist_id, appointment_date, status);` 
    3. `CREATE INDEX idx_waitlist_date_service_status ON waitlist(preferred_date, service_id, status);`

- [x] **2.2 Add `updated_at` Auto-Update Trigger**
  - **File**: Schema SQL
  - **Problem**: `updated_at` is only updated manually in application code.
  - **Instructions**: 
    1. Create a reusable trigger function: `CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;`. 
    2. Apply it to all tables with `updated_at`. 
    3. Remove manual date updates in backend code.

- [x] **2.3 Fix the `slot_holds` RLS Policy Bug**
  - **File**: `FINAL-COMPLETE-SCHEMA.sql`
  - **Problem**: "Users can view own holds" policy has a bug `USING (user_session_id = user_session_id)` making it always true.
  - **Instructions**: Remove the policy (since it uses `supabaseAdmin`) OR use `current_setting('app.session_id')` for comparison.

- [x] **2.4 Add `ON DELETE` Behavior to Payment Records**
  - **File**: Schema SQL
  - **Problem**: `payment_records.appointment_id` has no `ON DELETE` clause.
  - **Instructions**: Change to `appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL`. Do similarly for `patient_id`.

- [x] **2.5 Add `CHECK` Constraints for Data Integrity**
  - **File**: Schema SQL
  - **Problem**: Several business rules are enforced only in application code, not at the DB level.
  - **Instructions**: Add constraints: 
    1. reversed time ranges. 
    2. durations > 0.
    3. prices >= 0.
    4. payment amounts > 0.
    5. clinic hour order.

- [x] **2.6 Normalize `guest_email` Storage**
  - **File**: `appointment.service.js`
  - **Problem**: Mixed casing treats emails differently.
  - **Instructions**: Normalize emails to `lowercase` and `trim` before saving and querying. Add a DB level check `CHECK (guest_email = lower(guest_email))`.

## 3. 🟡 Backend Architecture

- [x] **3.1 Eliminate Duplicated Helper Functions**
  - **Files**: `appointment.service.js`, `appointments.controller.js`, `slot.service.js`
  - **Problem**: `addMinutesToTime()` and other time utilities are duplicated across files.
  - **Instructions**: Move them to a centralized `utils/time.js` and import everywhere.

- [x] **3.2 Move Direct Supabase Calls Out of Controllers**
  - **File**: `appointments.controller.js`
  - **Problem**: Guest controller endpoints make direct DB calls instead of using the service layer.
  - **Instructions**: Move DB mutations in guest cancel/reschedule from the controller to new service tier functions.

- [x] **3.3 Remove Dynamic `import()` Calls in Controllers**
  - **File**: `appointments.controller.js`
  - **Problem**: Dynamic imports add latency and bypass tree-shaking.
  - **Instructions**: Move `await import(...)` to static `import` at the top of the file.

- [x] **3.4 Replace Raw Object Throws with AppError Class**
  - **Files**: All service files
  - **Problem**: Throwing raw objects without stack traces means `instanceof Error` checks fail.
  - **Instructions**: Complete Item 1.7's `AppError` setup and apply across services.

- [x] **3.5 Fix the Test Routes Registration Order**
  - **File**: `server.js`
  - **Problem**: Test routes registered after `app.listen()` and outside `/api/v1` prefix.
  - **Instructions**: Register test routes before `app.listen()` safely and add version prefix.

- [x] **3.6 Add Structured Logging**
  - **Files**: All backend files
  - **Problem**: Uses `console.log` which haz`s no levels or JSON formatting for production.
  - **Instructions**: Implement `pino` logger to replace standard console logging and attach correlation UUID to track requests.

- [x] **3.7 Add Graceful Shutdown Handling**
  - **File**: `server.js`
  - **Problem**: SIGTERM abruptly kills mid-flight requests.
  - **Instructions**: Implement `SIGTERM` and `SIGINT` catch handlers to close the DB connection pooling strings or server loop safely.

- [x] **3.8 Add Request Timeout Middleware**
  - **File**: `app.js`
  - **Problem**: No timeout safeguard against deep `findNextAvailableDate` loops hanging the server.
  - **Instructions**: Setup `req.setTimeout(30000);` globally or early-exit timeout inside the service itself.

## 4. 🟢 Frontend Architecture

- [ ] **4.1 Add an API Interceptor for Automatic Token Injection**
  - **File**: `api.js`
  - **Instructions**: Read token from `localStorage` inside `api.js` directly and add 401 response checks rather than mapping it through every hook.

- [ ] **4.2 Add a `services/` API Layer Between Hooks and `api.js`**
  - **File**: New `services/` directory
  - **Instructions**: Standardize routes behind function calls like `bookAppointment(data)` so UI changes easily cascade.

- [ ] **4.3 Eliminate Dead Code**
  - **File**: `App.jsx`
  - **Instructions**: Remove commented test code lines.

- [ ] **4.4 Wrap `AuthProvider` at the App Root**
  - **File**: `App.jsx`
  - **Instructions**: Set `<AuthProvider>` around `<BrowserRouter>` to allow global access.

- [ ] **4.5 Add Error Boundaries**
  - **File**: `ErrorBoundary.jsx`
  - **Instructions**: Add `<ErrorBoundary>` fallback components so throws don't show white screens.

- [ ] **4.6 Implement Lazy Loading for Route Pages**
  - **File**: `AppRoutes.jsx`
  - **Instructions**: Add `React.lazy` to all views except the home/landing page.

- [ ] **4.7 Add SEO Meta Tags**
  - **File**: Each page component
  - **Instructions**: Include `react-helmet-async` for HTML Head SEO elements.

- [ ] **4.8 Complete the Admin and Doctor Apps**
  - **Files**: `apps/admin/src/`, `apps/doctor/src/`
  - **Instructions**: Replace skeleton boilerplate with real dashboard and schedule views using the `user/src/api.js` connection pattern.

## 5. ⚡ Performance Optimization

- [ ] **5.1 Cache Static Data (Services, Clinic Schedule, Settings)**
  - **Files**: `slot.service.js`
  - **Instructions**: Setup simple Map caches with TTL validities for data that rarely updates.

- [ ] **5.2 Optimize `findNextAvailableDate`**
  - **File**: `slot.service.js`
  - **Instructions**: Refactor DB loop queries so they batch 90 days of blocked slots/availability context before looping to evaluate them.

- [ ] **5.3 Optimize Scheduled Tasks**
  - **File**: `scheduled-tasks.js`
  - **Instructions**: Change the singular patient profile fetches into large `await supabaseAdmin.from(...).in(...)` lookups.

- [ ] **5.4 Database Connection Pooling Awareness**
  - **File**: `supabase.js`
  - **Instructions**: Attach connection limits via connection strings specifically tailored for Supabase's `pgbouncer` configurations.

## 6. 📦 Scalability & DevOps

- [ ] **6.1 Add Environment Variable Validation on Startup**
  - **File**: `config/env.js`
  - **Instructions**: Use Zod schema on `.env` strings upon initial node start to abort execution if critical IDs are missing.

- [ ] **6.2 Set Up a Monorepo Package Manager**
  - **Files**: Project root
  - **Instructions**: Add `pnpm-workspace.yaml` rather than keeping individual `npm` and `pnpm` usage.

- [ ] **6.3 Add Health Check Depth**
  - **File**: `app.js`
  - **Instructions**: Check DB pulse and ping timers rather than just a 200 HTTP code.

- [ ] **6.4 Set Up CI/CD Pipeline Config**
  - **File**: `.github/workflows/ci.yml`
  - **Instructions**: Prepare `.yaml` for testing steps.

- [ ] **6.5 Add a `.env.example` File**
  - **File**: `.env.example`
  - **Instructions**: Prepare placeholder reference sheet for git tree.

## 7. 📁 Folder Structure Improvements

- [ ] **7.1 Extract Scheduled Tasks into Individual Job Files**
  - **File**: `scheduled-tasks.js` -> `jobs/`
  - **Instructions**: Separate reminder logic from Ghost Sweeps into individual CRON modules inside a `jobs` folder.

- [ ] **7.2 Move Email Templates Into the Backend**
  - **File**: `EmailTemplates/` -> `backend/api/src/templates/email/`
  - **Instructions**: Protect the templating code locally closer to the `services` doing the sending.

## 8. 🧪 Testing Strategy

- [ ] **8.1 Add a Testing Framework**
  - **File**: `package.json`
  - **Instructions**: Bind `vitest` into dev dependency scripts.

- [ ] **8.2 Add End-to-End Tests for Critical Booking Flows**
  - **Instructions**: Use Playwright scripts simulating UI touches for guest limits & admin validations.
