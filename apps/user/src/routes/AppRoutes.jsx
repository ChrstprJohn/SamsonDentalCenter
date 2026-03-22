import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PatientLayout from '../layouts/PatientLayout';

// Route utils
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Auth pages (existing ✅)
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Email link pages (existing ✅ — moved into pages/guest/)
import ConfirmAppointmentPage from '../pages/guest/ConfirmAppointmentPage';
import AppointmentConfirmedPage from '../pages/guest/AppointmentConfirmedPage';
import AppointmentErrorPage from '../pages/guest/AppointmentErrorPage';
import AppointmentAlreadyConfirmedPage from '../pages/guest/AppointmentAlreadyConfirmedPage';

// Public website pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import InquiriesPage from '../pages/public/InquiriesPage';
import ContactPage from '../pages/public/ContactPage';

// Guest booking (Module 05)
import GuestBookingPage from '../pages/guest/GuestBookingPage';

import UserBookingPage from '../pages/patient/UserBookingPage';
import WaitlistManagementPage from '../pages/patient/WaitlistManagementPage';

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

                <Route element={<PatientLayout />}>
                    <Route
                        path='/dashboard/book'
                        element={<UserBookingPage />}
                    />
                    <Route
                        path='/dashboard/waitlist'
                        element={
                            <ProtectedRoute>
                                <WaitlistManagementPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Module 06:
                <Route path='/email/cancel' element={<CancelAppointmentPage />} />
                <Route path='/email/cancelled' element={<AppointmentCancelledPage />} />
                <Route path='/email/reschedule' element={<RescheduleAppointmentPage />} />
                <Route path='/email/rescheduled' element={<AppointmentRescheduledPage />} />
                */}

                {/* ── Patient Portal (Module 07–10):
                <Route element={<ProtectedRoute><PatientLayout /></ProtectedRoute>}>
                    <Route path='/patient' element={<DashboardPage />} />
                <Route path='/patient/booking' element={<BookingPage />} />
                    <Route path='/patient/appointments' element={<AppointmentsPage />} />
                    <Route path='/patient/appointments/:id' element={<AppointmentDetailPage />} />
                    <Route path='/patient/waitlist' element={<WaitlistPage />} />
                    <Route path='/patient/notifications' element={<NotificationsPage />} />
                </Route>
                */}

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
