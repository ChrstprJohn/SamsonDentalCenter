import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PatientPortalLayout from '../layouts/PatientPortalLayout';

// Route utils
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Email link pages (Module 06A)
import ConfirmAppointmentPage from '../pages/guest/ConfirmAppointmentPage';
import AppointmentConfirmedPage from '../pages/guest/AppointmentConfirmedPage';
import AppointmentErrorPage from '../pages/guest/AppointmentErrorPage';
import AppointmentAlreadyConfirmedPage from '../pages/guest/AppointmentAlreadyConfirmedPage';
import CancelAppointmentPage from '../pages/guest/CancelAppointmentPage';
import AppointmentCancelledPage from '../pages/guest/AppointmentCancelledPage';
import RescheduleAppointmentPage from '../pages/guest/RescheduleAppointmentPage';
import AppointmentRescheduledPage from '../pages/guest/AppointmentRescheduledPage';
import WaitlistClaimPage from '../pages/guest/WaitlistClaimPage';

// Public website pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import InquiriesPage from '../pages/public/InquiriesPage';
import ContactPage from '../pages/public/ContactPage';

// Guest booking (Module 05)
import GuestBookingPage from '../pages/guest/GuestBookingPage';

// Patient pages
import PatientDashboard from '../pages/patient/PatientDashboard';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* ── Public Website ── */}
                <Route element={<PublicLayout />}>
                    <Route
                        path='/'
                        element={<HomePage />}
                    />
                    <Route
                        path='/about'
                        element={<AboutPage />}
                    />
                    <Route
                        path='/services'
                        element={<ServicesPage />}
                    />
                    <Route
                        path='/services/:id'
                        element={<ServiceDetailPage />}
                    />
                    <Route
                        path='/inquiries'
                        element={<InquiriesPage />}
                    />
                    <Route
                        path='/contact'
                        element={<ContactPage />}
                    />

                    {/* Guest Booking — inside PublicLayout (Module 05) */}
                    <Route
                        path='/book'
                        element={<GuestBookingPage />}
                    />
                </Route>

                {/* ── Auth ── */}
                <Route
                    path='/login'
                    element={<LoginPage />}
                />
                <Route
                    path='/register'
                    element={<RegisterPage />}
                />

                {/* ── Email Link Pages (Standalone) ── */}
                <Route
                    path='/email/confirm'
                    element={<ConfirmAppointmentPage />}
                />
                <Route
                    path='/email/confirmed'
                    element={<AppointmentConfirmedPage />}
                />
                <Route
                    path='/email/error'
                    element={<AppointmentErrorPage />}
                />
                <Route
                    path='/email/already-confirmed'
                    element={<AppointmentAlreadyConfirmedPage />}
                />
                <Route
                    path='/email/cancel'
                    element={<CancelAppointmentPage />}
                />
                <Route
                    path='/email/cancelled'
                    element={<AppointmentCancelledPage />}
                />
                <Route
                    path='/email/reschedule'
                    element={<RescheduleAppointmentPage />}
                />
                <Route
                    path='/email/rescheduled'
                    element={<AppointmentRescheduledPage />}
                />
                <Route
                    path='/email/waitlist-claim'
                    element={<WaitlistClaimPage />}
                />

                {/* ── Patient Portal (Sidebar Layout) ── */}
                <Route
                    path='/patient'
                    element={
                        <ProtectedRoute>
                            <PatientPortalLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<PatientDashboard />} />
                    <Route path='appointments' element={<PatientDashboard />} />
                    <Route path='profile' element={<div className="text-gray-500 text-center py-12">Profile page coming soon...</div>} />
                </Route>

                {/* ── Catch-all ── */}
                <Route
                    path='*'
                    element={
                        <Navigate
                            to='/'
                            replace
                        />
                    }
                />
            </Routes>
        </>
    );
};

export default AppRoutes;
