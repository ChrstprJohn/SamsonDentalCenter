import { NavLink, useNavigate } from 'react-router-dom';

const MobileMenu = ({ links, user, onClose }) => {
    const navigate = useNavigate();

    const handleNav = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <div className='md:hidden border-t border-slate-100 bg-white'>
            <div className='px-4 py-3 space-y-1'>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm font-medium ${
                                isActive
                                    ? 'bg-sky-50 text-sky-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
                <hr className='my-2 border-slate-100' />
                <button
                    onClick={() => handleNav('/book')}
                    className='w-full bg-sky-500 text-white text-sm font-semibold
                               py-2.5 rounded-lg hover:bg-sky-600 transition-colors'
                >
                    Book Now
                </button>
                {user ? (
                    <button
                        onClick={() => handleNav('/patient')}
                        className='w-full text-sm font-medium text-slate-600
                                   border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50'
                    >
                        Dashboard
                    </button>
                ) : (
                    <button
                        onClick={() => handleNav('/login')}
                        className='w-full text-sm font-medium text-slate-600
                                   border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50'
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default MobileMenu;
