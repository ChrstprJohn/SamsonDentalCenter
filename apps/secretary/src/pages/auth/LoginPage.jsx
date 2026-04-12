import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import LoginContainer from '../../components/auth/Login/LoginContainer';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const data = await login(email, password);
            
            // Immediate role check
            const allowedRoles = ['secretary', 'dentist', 'admin'];
            if (!allowedRoles.includes(data.user.role)) {
                setError('Unauthorized: You do not have access to this portal.');
                // Optional: logout if you don't want them to stay logged in as a patient on this domain
                return;
            }

            const from = location.state?.from || '/';
            navigate(from);
        } catch (err) {
            setError(err.message || 'Login failed');
        }
        setLoading(false);
    };

    // Show error from ProtectedRoute if present
    const authError = location.state?.error;

    return (
        <AuthLayout>
            <LoginContainer
                onSubmit={handleLogin}
                loading={loading}
                error={error || authError}
                showSignUpLink={false}
                showGuestLink={false}
            />
        </AuthLayout>
    );
};

export default LoginPage;
