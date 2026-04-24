import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DoctorPortalLayout from '../layouts/DoctorPortalLayout';

// Route utils
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import SetPasswordPage from '../pages/auth/SetPasswordPage';

// Doctor pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import PlaceholderPage from '../pages/doctor/PlaceholderPage';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* ── Auth ── */}
                <Route path='/login' element={<LoginPage />} />
                <Route path='/set-password' element={<SetPasswordPage />} />

                {/* ── Doctor Portal (Sidebar Layout) ── */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute allowedRoles={['dentist', 'admin']}>
                            <DoctorPortalLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DoctorDashboard />} />
                    <Route path='appointments' element={<PlaceholderPage title="Appointments" />} />
                    <Route path='patients' element={<PlaceholderPage title="My Patients" />} />
                    <Route path='schedule' element={<PlaceholderPage title="Schedule" />} />
                    <Route path='notifications' element={<PlaceholderPage title="Notifications" />} />
                    <Route path='profile' element={<PlaceholderPage title="Profile" />} />
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
