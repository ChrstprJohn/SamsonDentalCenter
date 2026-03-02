import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import LoginContainer from '../../components/auth/Login/LoginContainer';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate('/patient');
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
