# User Sign-UP & Registration Polish

We are refactoring the registration flow into a 3-step process with custom OTP verification and enhanced personal details (Sex, Date of Birth).

## Implementation Plan

### 1. Database Updates
- Update `profiles` trigger to capture `sex` and `date_of_birth`.
- Create `registration_requests` table for pending accounts.

### 2. Backend Enhancements
- New `registration.service.js` to handle OTP generation and verification.
- Manually create Supabase Auth users after OTP success to bypass default email confirmation.

### 3. Frontend Reconstruction
- **Step 1: Personal Details** (Name, Sex, DOB)
- **Step 2: Contact & Password** (Email, Phone, Password)
- **Step 3: OTP Verification** (6-digit code)

---

> [!NOTE]
> See the detailed [implementation_plan.md](file:///C:/Users/Administrator/.gemini/antigravity/brain/660024a8-0dd3-437f-8771-3d286ebe549e/implementation_plan.md) for technical specifics.