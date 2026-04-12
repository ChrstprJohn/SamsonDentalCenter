import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminPortalLayout from '../layouts/AdminPortalLayout';

// Route utils
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import PlaceholderPage from '../pages/admin/PlaceholderPage';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Ã¢â€ â‚¬Ã¢â€ â‚¬ Auth Ã¢â€ â‚¬Ã¢â€ â‚¬ */}
                <Route
                    path='/login'
                    element={<LoginPage />}
                />

                {/* Ã¢â€ â‚¬Ã¢â€ â‚¬ Admin Portal (Sidebar Layout) Ã¢â€ â‚¬Ã¢â€ â‚¬ */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminPortalLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path='appointments' element={<PlaceholderPage title="Appointments" />} />
                    <Route path='admins' element={<PlaceholderPage title="My Admins" />} />
                    <Route path='schedule' element={<PlaceholderPage title="Schedule" />} />
                    <Route path='notifications' element={<PlaceholderPage title="Notifications" />} />
                    <Route path='profile' element={<PlaceholderPage title="Profile" />} />
                </Route>

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Catch-all Ã¢â€â‚¬Ã¢â€â‚¬ */}
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




