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
import Doctors from '../pages/admin/Doctors';
import Staff from '../pages/admin/Staff';
import Patients from '../pages/admin/Patients';
import Services from '../pages/admin/Services';
import Settings from '../pages/admin/Settings';
import AuditLogs from '../pages/admin/AuditLogs';
import AdminProfile from '../pages/admin/AdminProfile';

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
                    <Route path='doctors'>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path=':tab/:id?' element={<Doctors />} />
                    </Route>
                    <Route path='staff'>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path=':tab/:id?' element={<Staff />} />
                    </Route>
                    <Route path='patients'>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path=':tab/:id?' element={<Patients />} />
                    </Route>
                    <Route path='services' element={<Services />} />
                    <Route path='settings'>
                        <Route index element={<Navigate to="general" replace />} />
                        <Route path=':tab?' element={<Settings />} />
                    </Route>
                    <Route path='audit-logs' element={<AuditLogs />} />
                    <Route path='profile' element={<AdminProfile />} />
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




