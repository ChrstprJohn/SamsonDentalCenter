import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import ChatBot from '../components/public/ChatBot';
import { useTheme } from '../context/ThemeContext';

const PublicLayout = () => {
    const location = useLocation();
    const isBookPage = location.pathname === '/book';
    const { setIsDarkModeAllowed } = useTheme();

    // Force Light Mode for all public pages
    useEffect(() => {
        setIsDarkModeAllowed(false);
    }, [setIsDarkModeAllowed]);

    return (
        <div className='font-sans antialiased text-slate-800'>
            {!isBookPage && <Navbar />}
            <main>
                <Outlet />
            </main>
            {!isBookPage && <ChatBot />}
            {!isBookPage && <Footer />}
        </div>
    );
};

export default PublicLayout;
