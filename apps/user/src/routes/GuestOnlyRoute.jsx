import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * GuestOnlyRoute — inverse of ProtectedRoute.
 * If the user IS logged in, redirect them to /patient/book instead.
 * If not logged in, render the page normally.
 */
const GuestOnlyRoute = ({ children, redirectTo = '/patient/book' }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <LoadingSpinner message='Checking authentication...' />
            </div>
        );
    }

    if (user) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default GuestOnlyRoute;
