# Waitlist Removal Plan - User Portal

This plan outlines the steps to remove all waitlist-related features from the user portal without modifying the backend or database schema.

## User Review Required

> [!IMPORTANT]
> The waitlist feature is being completely hidden from the patient's view. Any existing waitlist entries in the database will remain but will not be visible or manageable by the user through the portal.

## Proposed Changes

### Navigation & Routing

#### [MODIFY] [PatientSidebar.jsx](file:///d:/webApp/PrimeraDental/apps/user/src/components/patient/PatientSidebar.jsx)
- Remove `WaitlistIcon` SVG definition.
- Remove `Waitlist` entry from the `navItems` array to hide it from the sidebar.

#### [MODIFY] [AppRoutes.jsx](file:///d:/webApp/PrimeraDental/apps/user/src/routes/AppRoutes.jsx)
- Remove imports for `WaitlistPage` and `WaitlistClaimPage`.
- Remove the `/patient/waitlist` route.
- Remove the `/email/waitlist-claim` route (used for email actions).

---

### Dashboard

#### [MODIFY] [PatientDashboard.jsx](file:///d:/webApp/PrimeraDental/apps/user/src/pages/patient/PatientDashboard.jsx)
- Remove `useWaitlist` hook usage.
- Remove `WaitlistOfferCard` and `ClaimSlotModal` imports and components.
- Clean up state variables and handlers related to waitlist offers and claiming.

#### [MODIFY] [DashboardStats.jsx](file:///d:/webApp/PrimeraDental/apps/user/src/components/patient/dashboard/DashboardStats.jsx)
- Remove the "Waitlist" stat card.
- Remove logic that calculates `waitlistCount`.
- Adjust mobile pagination dots to account for the reduced number of cards.

---

### Notifications

#### [MODIFY] [NotificationsPage.jsx](file:///d:/webApp/PrimeraDental/apps/user/src/pages/patient/NotificationsPage.jsx)
- Remove the `waitlist` filter logic in the client-side filtering section.

#### [MODIFY] [NotificationInbox.jsx](file:///d:/webApp/PrimeraDental/apps/user/src/components/patient/notification/NotificationInbox.jsx)
- Remove the "Waitlist" category from the `CATEGORIES` array.
- Remove the `waitlist` case from the `getCount` helper function.

---

### UI Components Cleanup (Optional/Deferred)
The following components can be safely ignored as they are no longer reachable via navigation, but could be deleted for a cleaner codebase:
- `apps/user/src/pages/patient/WaitlistPage.jsx`
- `apps/user/src/pages/guest/WaitlistClaimPage.jsx`
- `apps/user/src/components/patient/waitlist/*`
- `apps/user/src/components/patient/waitlist_details/*`
- `apps/user/src/components/user-booking/JoinWaitlistModal.jsx`
- `apps/user/src/components/user-booking/WaitlistOnlyWarningModal.jsx`
- `apps/user/src/components/user-booking/WaitlistCard.jsx`

## Verification Plan

### Manual Verification
- **Sidebar**: Verify "Waitlist" menu item is gone.
- **Dashboard**: Verify "Waitlist" stat card is gone and no errors occur when fetching dashboard data.
- **Notifications**: Verify "Waitlist" tab is gone from the notification inbox.
- **Direct Access**: Attempting to navigate to `/patient/waitlist` should trigger the catch-all redirect (usually to home/dashboard).
- **Booking**: Verify that the booking flow functions normally and does not show waitlist-related UI.
