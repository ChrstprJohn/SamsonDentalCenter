import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import RegisterContainer from '../../components/auth/Register/RegisterContainer';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async ({
        firstName,
        middleName,
        lastName,
        suffix,
        email,
        phone,
        password,
    }) => {
        setError(null);
        setLoading(true);
        try {
            const fullName = [firstName, middleName, lastName, suffix].filter(Boolean).join(' ');
            await register(email, password, fullName, phone);
            navigate('/patient');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <AuthLayout>
            <RegisterContainer
                onSubmit={handleRegister}
                loading={loading}
                error={error}
            />
        </AuthLayout>
    );
};

export default RegisterPage;
