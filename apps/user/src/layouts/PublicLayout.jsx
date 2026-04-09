import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import ChatBot from '../components/public/ChatBot';

const PublicLayout = () => {
    const location = useLocation();
    const isBookPage = location.pathname === '/book';

    return (
        <div className='font-sans antialiased text-slate-800'>
            {!isBookPage && <Navbar />}
            <main>
                <Outlet />
            </main>
            {!isBookPage && <ChatBot />}
            <Footer />
        </div>
    );
};

export default PublicLayout;
