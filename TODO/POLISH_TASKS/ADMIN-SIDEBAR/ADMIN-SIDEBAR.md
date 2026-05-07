# Admin Portal - Sidebar Navigation Architecture

This document defines the structured, SaaS-style navigation layout for the Admin Portal. It aims to
eliminate overlapping links, prioritize actionable queues, and use professional, minimalist
labeling.

## The Architecture

### 1. Overview

- **Dashboard** (`/`) _High-level system metrics, revenue, today's snapshots, and quick alerts._

### 2. Global Appointments

_This section handles the flow of time and patient scheduling. Grouped by priority of action._

- **Approvals Inbox** (`/registry/pending`) _Actionable queue: Requests needing manual Yes/No
  approval._
- **Rescheduling Queue** (`/registry/displaced`) _Actionable queue: Patients displaced by system
  rules (holidays, doctor blocks) needing re-accommodation._
- **Global Schedule** (`/registry/upcoming`) _Source of truth: The master calendar of all upcoming
  confirmed appointments._
- **Today's Attendance** (`/registry/today`) _Fast operational view: Used solely for rapid
  check-ins, no-shows, and tracking today's progress._

### 3. Clinic Management

_The core databases and operational resources of the clinic. Clean, authoritative naming._

- **Patient Database** (`/patients`) _Global registry of all users and their clinical histories._
- **Doctor Profiles** (`/doctors`) _Management of dentist schedules, tier access, and biographical
  data._
- **Staff Management** (`/staff`) _Directory of receptionists and secondary admins. (Includes access
  control)._
- **Services Catalog** (`/services`) _Management of procedures, pricing, durations, and tier
  requirements._

### 4. System & Logs

_Configuration, audits, and health monitoring._

- **Message Logs** (`/message-activity`) _Read-only ledger of SMS and Email dispatches (delivery
  tracking)._
- **Audit Trail** (`/audit-logs`) _Immutable ledger of critical system changes by staff._
- **Clinic Configuration** (`/settings`) _Global rules: Operating hours, holidays, automated
  notifications, and web assets._

### 5. Identity

_Self-service for the currently authenticated admin._

- **Admin Account** (`/profile`) _Personal profile, security, and password resets._

---

## Implementation Notes (`AdminSidebar.jsx`)

When implementing this in `AdminSidebar.jsx`, the `navigationGroups` array should reflect:

```javascript
const navigationGroups = [
    {
        title: 'Overview',
        items: [{ icon: <HomeIcon />, name: 'Dashboard', path: '/' }],
    },
    {
        title: 'Global Appointments',
        items: [
            { icon: <PendingIcon />, name: 'Approvals Inbox', path: '/registry/pending' },
            { icon: <DisplacedIcon />, name: 'Rescheduling Queue', path: '/registry/displaced' },
            { icon: <GridIcon />, name: 'Global Schedule', path: '/registry/upcoming' },
            { icon: <TodayIcon />, name: "Today's Attendance", path: '/registry/today' },
        ],
    },
    {
        title: 'Clinic Management',
        items: [
            { icon: <PatientsIcon />, name: 'Patient Database', path: '/patients' },
            { icon: <UserCircleIcon />, name: 'Doctor Profiles', path: '/doctors' },
            { icon: <StaffIcon />, name: 'Staff Management', path: '/staff' },
            { icon: <ServicesIcon />, name: 'Services Catalog', path: '/services' },
        ],
    },
    {
        title: 'System & Logs',
        items: [
            { icon: <MailIcon />, name: 'Message Logs', path: '/message-activity' },
            { icon: <AuditIcon />, name: 'Audit Trail', path: '/audit-logs' },
            { icon: <SettingsIcon />, name: 'Clinic Configuration', path: '/settings' },
        ],
    },
    {
        title: 'Identity',
        items: [{ icon: <UserIcon />, name: 'Admin Account', path: '/profile' }],
    },
];
```
