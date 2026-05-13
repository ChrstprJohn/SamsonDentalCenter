# User Portal - Pending Tasks & Polish

This document tracks the final refinements for the User Portal, specifically focusing on appointment management, navigational logic, and high-fidelity UI parity.

## ✅ Appointment Management (Completed)

- [x] **Conditional Action Visibility**
    - [x] **Pending Requests**: Restricted actions to "Cancel Request" only.
    - [x] **Approved Appointments**: Enabled both "Cancel Appointment" and "Reschedule".
    - [x] **History/Terminal States**: Implemented read-only view with no action buttons.
- [x] **Responsive Cancellation Workflow**
    - [x] **High-Fidelity Modal**: Refactored to use the mobile-native `isBottomSheet` pattern.
    - [x] **Reason Selection**: Implemented a mandatory dropdown for common reasons.
    - [x] **Custom Input**: Added "Other" logic to reveal a custom text area.
    - [x] **UX Safety**: Added clear warning headers and specialized iconography.
- [x] **Navigational Logic**
    - [x] **Dynamic Breadcrumbs**: Updated the detail page to link back to 'My Requests' for pending items and 'My Appointments' for approved ones.
    - [x] **List Consistency**: Updated the Appointment Table to reflect the "Cancel" priority for pending requests.

## 🕒 Remaining Polish (To Be Evaluated)

- [ ] **Appointment Detail Page Refinement**
    - [ ] Review data density and padding in the detail view sections (Overview, Status, Notes).
    - [ ] Ensure full parity with the "Symmetrical Registry" design language.
- [ ] **Cross-Device Verification**
    - [ ] Verify bottom-sheet behavior on extra-small mobile screens.
    - [ ] Check dark mode contrast for the new cancellation modal.
- [ ] **Notification Parity**
    - [ ] Ensure that clicking cancellation notifications correctly routes to the new detail page logic.
