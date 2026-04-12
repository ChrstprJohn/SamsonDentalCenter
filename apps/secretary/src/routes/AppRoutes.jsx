import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import SecretaryPortalLayout from '../layouts/SecretaryPortalLayout';

// Route utils
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';

// Secretary pages
import SecretaryDashboard from '../pages/secretary/SecretaryDashboard';
import PlaceholderPage from '../pages/secretary/PlaceholderPage';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* ── Auth ── */}
                <Route
                    path='/login'
                    element={<LoginPage />}
                />

                {/* ── Secretary Portal (Sidebar Layout) ── */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute allowedRoles={['secretary', 'dentist', 'admin']}>
                            <SecretaryPortalLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<SecretaryDashboard />} />
                    <Route path='appointments' element={<PlaceholderPage title="Appointments" />} />
                    <Route path='patients' element={<PlaceholderPage title="Patients" />} />
                    <Route path='schedule' element={<PlaceholderPage title="Schedule" />} />
                    <Route path='inventory' element={<PlaceholderPage title="Inventory" />} />
                    <Route path='billing' element={<PlaceholderPage title="Billing" />} />
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
