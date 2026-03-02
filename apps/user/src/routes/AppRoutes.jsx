import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';

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

import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import InquiriesPage from '../pages/public/InquiriesPage';
import ContactPage from '../pages/public/ContactPage';

// ── Placeholder components for pages not yet built ──
const Placeholder = ({ title }) => (
    <div className='flex items-center justify-center min-h-[60vh]'>
        <h1 className='text-2xl font-bold text-slate-900'>{title}</h1>
    </div>
);

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
                    {/* Uncomment as built (Modules 04A–04E):
                    <Route path='/' element={<HomePage />} />
                    <Route path='/about' element={<AboutPage />} />
                    <Route path='/services' element={<ServicesPage />} />
                    <Route path='/inquiries' element={<InquiriesPage />} />
                    <Route path='/contact' element={<ContactPage />} />
                    */}

                    {/* Guest Booking — inside PublicLayout (Module 05):
                    <Route path='/book' element={<GuestBookingPage />} />
                    */}
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
