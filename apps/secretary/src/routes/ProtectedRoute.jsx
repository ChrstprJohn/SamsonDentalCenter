import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <LoadingSpinner message='Checking authentication...' />
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to='/login'
                replace
            />
        );
    }

    // Role check
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to='/login'
                state={{ error: 'Unauthorized: Access denied for your role.' }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
