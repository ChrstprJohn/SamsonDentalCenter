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
            await login(email, password);
            const from = location.state?.from || '/patient/book';
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
            />
        </AuthLayout>
    );
};

export default LoginPage;
