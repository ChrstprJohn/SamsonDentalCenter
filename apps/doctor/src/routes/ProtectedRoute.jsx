import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <LoadingSpinner message='Checking authorization...' />
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to='/login'
                state={{ from: location }}
                replace
            />
        );
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Access denied for role: ${user.role}`);
        return (
            <Navigate
                to='/login'
                state={{ 
                    error: 'Unauthorised access. This portal is restricted to Dentists and Admin.',
                    from: location 
                }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
