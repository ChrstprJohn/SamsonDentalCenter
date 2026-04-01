import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

const PublicLayout = () => {
    const location = useLocation();
    const isBookPage = location.pathname === '/book';

    return (
        <div className='font-sans antialiased text-slate-800'>
            {!isBookPage && <Navbar />}
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
