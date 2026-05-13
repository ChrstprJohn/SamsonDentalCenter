# User Portal: Appointment & Request Management Refactor

This document outlines the architectural plan and implementation status for modernizing the patient appointment experience, focusing on decoupled request handling and automated date-based lifecycle management.

## 🎯 Primary Objectives

1.  **Decoupled Workflows**: Separate "Requests" (pending/rejected) from "Appointments" (confirmed schedule) and "History" (past records).
2.  **Automated Aging**: Implement strict date-time filtering to ensure "Upcoming" only shows future commitments, automatically moving past visits to "History."
3.  **UI Parity**: Maintain total visual consistency between the main appointment dashboard, requests, and history portals.
4.  **Family-Wide Control**: Enable primary account holders to manage schedules and requests for all dependents from a single interface.

---

## 🛠️ Implementation Checklist

### Phase 1: Decoupling & Navigation
- [x] **New Route Architecture**: Registered `/patient/requests` and `/patient/history` as dedicated landing pages.
- [x] **Sidebar Evolution**: Extracted "My Requests" and "Appointment History" into standalone navigation items with distinct icons.
- [x] **Workflow Relocation**: Moved the "New Appointment" button to the Requests portal to consolidate the booking entry point.

### Phase 2: Temporal Lifecycle Management
- [x] **Precision Filtering**: Implemented `isOutdated` logic in `useAppointments` hook using exact `date` + `start_time` comparison.
- [x] **Upcoming Tab Enforcement**: Confirmed schedule now strictly displays approved future visits.
- [x] **Advanced Timeframes**: Added "Today", "This Week", and "This Month" filters to upcoming appointments.
- [x] **Native Date Picker**: Integrated a specific day filter for precise schedule lookups.

### Phase 3: Family & Dependent Support
- [x] **Family Member Filter**: Integrated `useDependents` to provide a "Person Filter" dropdown across all management pages.
- [x] **Status Dropdowns**: Replaced pill-chips with professional dropdowns for status management (Me vs. Dependents).
- [x] **Unified State**: Ensured status counts correctly reflect the selected family member.

### Phase 4: UI/UX & Dark Mode Hardening
- [x] **Dark Mode Visibility**: Fixed dropdown and input contrast issues; added `dark:bg-white/5` and themed options.
- [x] **Visible Borders**: Strengthened container and input borders for better structure (`border-gray-200`).
- [x] **Mobile Ergonomics**: Implemented horizontal scrolling for filters on mobile to prevent layout stacking.
- [x] **Toolbar Refinement**: Removed redundant internal dividers for a cleaner, unified action area.

---

## 📋 Final Summary of Work

We have transformed the appointment section into three specialized, high-fidelity modules:
- **Upcoming Schedule**: Focused strictly on future approved visits with granular timeframe controls.
- **Booking Requests**: The entry point for all new bookings, featuring both desktop and mobile "New Appointment" actions.
- **Clinical History**: A dedicated archive for all past, cancelled, and no-show records.

This refactor significantly improves the portal's scalability and clarity, providing a true "Command Center" experience for the patient and their family.