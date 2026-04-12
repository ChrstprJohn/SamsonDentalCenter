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
            const { user: loggedInUser } = await login(email, password);
            
            // Immediate role check for Doctor portal
            if (!['dentist', 'admin'].includes(loggedInUser.role)) {
                setError('Unauthorised: This portal is for Dentists and Administrators only.');
                setLoading(false);
                return;
            }

            const from = location.state?.from || '/';
            navigate(from);
        } catch (err) {
            setError(err.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <AuthLayout>
            <LoginContainer
                onSubmit={handleLogin}
                loading={loading}
                error={error}
                showSignUpLink={false}
                showGuestLink={false}
            />
        </AuthLayout>
    );
};

export default LoginPage;
