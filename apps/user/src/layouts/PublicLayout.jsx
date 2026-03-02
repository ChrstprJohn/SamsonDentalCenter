import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import ChatBot from '../components/public/ChatBot';

const PublicLayout = () => {
    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar />

            <main className='flex-grow'>
                <Outlet />
            </main>

            <Footer />
            <ChatBot />
        </div>
    );
};

export default PublicLayout;
